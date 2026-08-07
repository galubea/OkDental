use rand::Rng;
use rusqlite::{params, OptionalExtension, Row};
use tauri::{command, State};

use crate::auth::commands::hash_password;
use crate::db::DbConnection;
use super::models::{CrearUsuarioInput, RegenerarPasswordResultado, Usuario, UsuarioFormValues, UsernameSugerido};

const COLUMNAS_USUARIO: &str =
    "id, nombre, apellido, nombre_completo, email, username, telefono, ci, especialidad, sucursal, rol, activo, debe_cambiar_password, creado_en, ultimo_acceso";

fn generar_password_temporal() -> String {
    const CARACTERES: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..10)
        .map(|_| CARACTERES[rng.gen_range(0..CARACTERES.len())] as char)
        .collect()
}

fn normalizar(texto: &str) -> String {
    texto
        .to_lowercase()
        .chars()
        .map(|c| match c {
            'á' | 'à' | 'ä' | 'â' => 'a',
            'é' | 'è' | 'ë' | 'ê' => 'e',
            'í' | 'ì' | 'ï' | 'î' => 'i',
            'ó' | 'ò' | 'ö' | 'ô' => 'o',
            'ú' | 'ù' | 'ü' | 'û' => 'u',
            'ñ' => 'n',
            other => other,
        })
        .filter(|c| c.is_ascii_alphanumeric())
        .collect()
}

fn generar_username_base(nombre: &str, apellido: &str) -> String {
    let n = normalizar(nombre);
    let a = normalizar(apellido);
    let inicial = n.chars().next().unwrap_or('u');
    format!("{inicial}{a}")
}

fn siguiente_username_disponible(conn: &rusqlite::Connection, base: &str) -> Result<String, String> {
    let mut candidato = base.to_string();
    let mut contador = 1;
    loop {
        let existe: Option<i64> = conn
            .query_row("SELECT id FROM doctor WHERE username = ?1", params![candidato], |row| row.get(0))
            .optional()
            .map_err(|e| e.to_string())?;
        if existe.is_none() {
            return Ok(candidato);
        }
        contador += 1;
        candidato = format!("{base}{contador}");
    }
}

fn fila_a_usuario(row: &Row) -> rusqlite::Result<Usuario> {
    Ok(Usuario {
        id: row.get(0)?,
        nombre: row.get(1)?,
        apellido: row.get(2)?,
        nombre_completo: row.get(3)?,
        email: row.get(4)?,
        username: row.get(5)?,
        telefono: row.get(6)?,
        ci: row.get(7)?,
        especialidad: row.get(8)?,
        sucursal: row.get(9)?,
        rol: row.get(10)?,
        activo: row.get::<_, i64>(11)? != 0,
        debe_cambiar_password: row.get::<_, i64>(12)? != 0,
        creado_en: row.get(13)?,
        ultimo_acceso: row.get(14)?,
    })
}

// invoke("listar_usuarios")
#[command]
pub fn listar_usuarios(db: State<DbConnection>) -> Result<Vec<Usuario>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(&format!("SELECT {COLUMNAS_USUARIO} FROM doctor ORDER BY nombre_completo"))
        .map_err(|e| e.to_string())?;

    let usuarios = stmt
        .query_map([], fila_a_usuario)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(usuarios)
}

// invoke("sugerir_username", { nombre, apellido })
#[command]
pub fn sugerir_username(db: State<DbConnection>, nombre: String, apellido: String) -> Result<UsernameSugerido, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let base = generar_username_base(&nombre, &apellido);
    if base.is_empty() {
        return Err("No se pudo generar un usuario con esos datos.".into());
    }
    let username = siguiente_username_disponible(&conn, &base)?;
    Ok(UsernameSugerido { username })
}

// invoke("crear_usuario", { input: { nombre, apellido, email, username, telefono, ci, especialidad, sucursal, rol, passwordTemporal, activo, debeCambiarPassword } })
#[command]
pub fn crear_usuario(db: State<DbConnection>, input: CrearUsuarioInput) -> Result<Usuario, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();
    let username = input.username.trim().to_lowercase();

    let existe_email: Option<i64> = conn
        .query_row("SELECT id FROM doctor WHERE email = ?1", params![email], |row| row.get(0))
        .optional()
        .map_err(|e| e.to_string())?;
    if existe_email.is_some() {
        return Err("Ya existe una cuenta con ese correo.".into());
    }

    let existe_username: Option<i64> = conn
        .query_row("SELECT id FROM doctor WHERE username = ?1", params![username], |row| row.get(0))
        .optional()
        .map_err(|e| e.to_string())?;
    if existe_username.is_some() {
        return Err("Ese nombre de usuario ya está en uso, genera uno nuevo.".into());
    }

    let hash = hash_password(&input.password_temporal)?;
    let nombre_completo = format!("{} {}", input.nombre.trim(), input.apellido.trim());

    conn.execute(
        "INSERT INTO doctor (nombre, apellido, nombre_completo, email, username, password_hash, telefono, ci, especialidad, sucursal, rol, activo, debe_cambiar_password)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            input.nombre,
            input.apellido,
            nombre_completo,
            email,
            username,
            hash,
            input.telefono,
            input.ci,
            input.especialidad,
            input.sucursal,
            input.rol,
            input.activo as i64,
            input.debe_cambiar_password as i64,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    conn.query_row(
        &format!("SELECT {COLUMNAS_USUARIO} FROM doctor WHERE id = ?1"),
        params![id],
        fila_a_usuario,
    )
    .map_err(|e| e.to_string())
}

// invoke("actualizar_usuario", { id, input: { nombre, apellido, email, telefono, ci, especialidad, sucursal, rol } })
#[command]
pub fn actualizar_usuario(db: State<DbConnection>, id: i64, input: UsuarioFormValues) -> Result<Usuario, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();
    let nombre_completo = format!("{} {}", input.nombre.trim(), input.apellido.trim());

    let filas = conn
        .execute(
            "UPDATE doctor SET nombre = ?1, apellido = ?2, nombre_completo = ?3, email = ?4, telefono = ?5, ci = ?6, especialidad = ?7, sucursal = ?8, rol = ?9 WHERE id = ?10",
            params![
                input.nombre, input.apellido, nombre_completo, email,
                input.telefono, input.ci, input.especialidad, input.sucursal, input.rol, id
            ],
        )
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró la cuenta a editar.".into());
    }

    conn.query_row(
        &format!("SELECT {COLUMNAS_USUARIO} FROM doctor WHERE id = ?1"),
        params![id],
        fila_a_usuario,
    )
    .map_err(|e| e.to_string())
}

// invoke("cambiar_estado_usuario", { id, activo })
#[command]
pub fn cambiar_estado_usuario(db: State<DbConnection>, id: i64, activo: bool) -> Result<Usuario, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let filas = conn
        .execute("UPDATE doctor SET activo = ?1 WHERE id = ?2", params![activo as i64, id])
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró la cuenta.".into());
    }

    conn.query_row(
        &format!("SELECT {COLUMNAS_USUARIO} FROM doctor WHERE id = ?1"),
        params![id],
        fila_a_usuario,
    )
    .map_err(|e| e.to_string())
}

// invoke("regenerar_password_usuario", { id })
#[command]
pub fn regenerar_password_usuario(db: State<DbConnection>, id: i64) -> Result<RegenerarPasswordResultado, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let password_temporal = generar_password_temporal();
    let hash = hash_password(&password_temporal)?;

    let filas = conn
        .execute(
            "UPDATE doctor SET password_hash = ?1, debe_cambiar_password = 1 WHERE id = ?2",
            params![hash, id],
        )
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró la cuenta.".into());
    }

    Ok(RegenerarPasswordResultado { password_temporal })
}