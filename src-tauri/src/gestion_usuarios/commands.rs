use rand::Rng;
use rusqlite::{params, OptionalExtension, Row};
use tauri::{command, State};

use crate::auth::commands::hash_password;
use crate::db::DbConnection;
use super::models::{CrearUsuarioResultado, RegenerarPasswordResultado, Usuario, UsuarioInput};

const COLUMNAS_USUARIO: &str =
    "id, nombre_completo, email, especialidad, rol, activo, debe_cambiar_password, creado_en, ultimo_acceso";

fn generar_password_temporal() -> String {
    const CARACTERES: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..10)
        .map(|_| CARACTERES[rng.gen_range(0..CARACTERES.len())] as char)
        .collect()
}

fn fila_a_usuario(row: &Row) -> rusqlite::Result<Usuario> {
    Ok(Usuario {
        id: row.get(0)?,
        nombre_completo: row.get(1)?,
        email: row.get(2)?,
        especialidad: row.get(3)?,
        rol: row.get(4)?,
        activo: row.get::<_, i64>(5)? != 0,
        debe_cambiar_password: row.get::<_, i64>(6)? != 0,
        creado_en: row.get(7)?,
        ultimo_acceso: row.get(8)?,
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

// invoke("crear_usuario", { input: { nombreCompleto, email, especialidad, rol } })
#[command]
pub fn crear_usuario(
    db: State<DbConnection>,
    input: UsuarioInput,
) -> Result<CrearUsuarioResultado, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();

    let existe: Option<i64> = conn
        .query_row("SELECT id FROM doctor WHERE email = ?1", params![email], |row| row.get(0))
        .optional()
        .map_err(|e| e.to_string())?;

    if existe.is_some() {
        return Err("Ya existe una cuenta con ese correo.".into());
    }

    let password_temporal = generar_password_temporal();
    let hash = hash_password(&password_temporal)?;

    conn.execute(
        "INSERT INTO doctor (nombre_completo, email, password_hash, especialidad, rol, activo, debe_cambiar_password)
         VALUES (?1, ?2, ?3, ?4, ?5, 1, 1)",
        params![input.nombre_completo, email, hash, input.especialidad, input.rol],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    let usuario = conn
        .query_row(
            &format!("SELECT {COLUMNAS_USUARIO} FROM doctor WHERE id = ?1"),
            params![id],
            fila_a_usuario,
        )
        .map_err(|e| e.to_string())?;

    Ok(CrearUsuarioResultado { usuario, password_temporal })
}

// invoke("actualizar_usuario", { id, input: { nombreCompleto, email, especialidad, rol } })
#[command]
pub fn actualizar_usuario(
    db: State<DbConnection>,
    id: i64,
    input: UsuarioInput,
) -> Result<Usuario, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();

    let filas = conn
        .execute(
            "UPDATE doctor SET nombre_completo = ?1, email = ?2, especialidad = ?3, rol = ?4 WHERE id = ?5",
            params![input.nombre_completo, email, input.especialidad, input.rol, id],
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
pub fn regenerar_password_usuario(
    db: State<DbConnection>,
    id: i64,
) -> Result<RegenerarPasswordResultado, String> {
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