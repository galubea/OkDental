use rusqlite::{params, OptionalExtension};
use tauri::{command, State};

use crate::db::DbConnection;
use super::models::{NuevoPacienteInput, Paciente, PacienteCambios};

#[command]
pub fn crear_paciente(
    db: State<DbConnection>,
    input: NuevoPacienteInput,
) -> Result<Paciente, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let ci = input.ci.trim();
    if ci.is_empty() {
        return Err("La CI es obligatoria.".into());
    }

    let existe: Option<i64> = conn
        .query_row("SELECT id FROM paciente WHERE ci = ?1", params![ci], |r| r.get(0))
        .optional()
        .map_err(|e| e.to_string())?;

    if existe.is_some() {
        return Err("Ya existe un paciente registrado con esa CI.".into());
    }

    conn.execute(
        "INSERT INTO paciente (nombre, apellido, ci, email, telefono)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![input.nombre, input.apellido, ci, input.email, input.telefono],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(Paciente {
        id,
        nombre: input.nombre,
        apellido: input.apellido,
        ci: ci.to_string(),
        edad: None,
        fecha_nacimiento: None,
        genero: None,
        telefono: input.telefono,
        email: input.email,
        direccion: None,
        ocupacion: None,
        fecha_registro: None,
        fecha_ultima_visita: None,
    })
}

#[command]
pub fn listar_pacientes(
    db: State<DbConnection>,
    query: Option<String>,
) -> Result<Vec<Paciente>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let texto = query.unwrap_or_default().trim().to_lowercase();

    let mut stmt = conn
        .prepare(
            "SELECT id, nombre, apellido, ci, edad, fecha_nacimiento, genero,
                    telefono, email, direccion, ocupacion, fecha_registro, fecha_ultima_visita
             FROM paciente
             WHERE ?1 = ''
                OR lower(nombre) LIKE '%' || ?1 || '%'
                OR lower(apellido) LIKE '%' || ?1 || '%'
                OR lower(ci) LIKE '%' || ?1 || '%'
             ORDER BY apellido, nombre",
        )
        .map_err(|e| e.to_string())?;

    let filas = stmt
        .query_map(params![texto], |row| {
            Ok(Paciente {
                id: row.get(0)?,
                nombre: row.get(1)?,
                apellido: row.get(2)?,
                ci: row.get(3)?,
                edad: row.get(4)?,
                fecha_nacimiento: row.get(5)?,
                genero: row.get(6)?,
                telefono: row.get(7)?,
                email: row.get(8)?,
                direccion: row.get(9)?,
                ocupacion: row.get(10)?,
                fecha_registro: row.get(11)?,
                fecha_ultima_visita: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?;

    filas.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[command]
pub fn obtener_paciente_por_id(
    db: State<DbConnection>,
    id: i64,
) -> Result<Option<Paciente>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, nombre, apellido, ci, edad, fecha_nacimiento, genero,
                telefono, email, direccion, ocupacion, fecha_registro, fecha_ultima_visita
         FROM paciente WHERE id = ?1",
        params![id],
        |row| {
            Ok(Paciente {
                id: row.get(0)?,
                nombre: row.get(1)?,
                apellido: row.get(2)?,
                ci: row.get(3)?,
                edad: row.get(4)?,
                fecha_nacimiento: row.get(5)?,
                genero: row.get(6)?,
                telefono: row.get(7)?,
                email: row.get(8)?,
                direccion: row.get(9)?,
                ocupacion: row.get(10)?,
                fecha_registro: row.get(11)?,
                fecha_ultima_visita: row.get(12)?,
            })
        },
    )
    .optional()
    .map_err(|e| e.to_string())
}

#[command]
pub fn actualizar_paciente(
    db: State<DbConnection>,
    id: i64,
    cambios: PacienteCambios,
) -> Result<Paciente, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    // Trae el paciente actual para rellenar los campos no enviados
    let actual = conn
        .query_row(
            "SELECT nombre, apellido, ci, edad, fecha_nacimiento, genero,
                    telefono, email, direccion, ocupacion
             FROM paciente WHERE id = ?1",
            params![id],
            |row| {
                Ok((
                    row.get::<_, String>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                    row.get::<_, Option<i64>>(3)?,
                    row.get::<_, Option<String>>(4)?,
                    row.get::<_, Option<String>>(5)?,
                    row.get::<_, Option<String>>(6)?,
                    row.get::<_, Option<String>>(7)?,
                    row.get::<_, Option<String>>(8)?,
                    row.get::<_, Option<String>>(9)?,
                ))
            },
        )
        .optional()
        .map_err(|e| e.to_string())?
        .ok_or("Paciente no encontrado.")?;

    let (nombre, apellido, ci, edad, f_nac, genero, telefono, email, direccion, ocupacion) = actual;

    let nombre = cambios.nombre.unwrap_or(nombre);
    let apellido = cambios.apellido.unwrap_or(apellido);
    let ci = cambios.ci.unwrap_or(ci);
    let edad = cambios.edad.or(edad);
    let fecha_nacimiento = cambios.fecha_nacimiento.or(f_nac);
    let genero = cambios.genero.or(genero);
    let telefono = cambios.telefono.or(telefono);
    let email = cambios.email.or(email);
    let direccion = cambios.direccion.or(direccion);
    let ocupacion = cambios.ocupacion.or(ocupacion);

    conn.execute(
        "UPDATE paciente SET
            nombre = ?1, apellido = ?2, ci = ?3, edad = ?4, fecha_nacimiento = ?5,
            genero = ?6, telefono = ?7, email = ?8, direccion = ?9, ocupacion = ?10
         WHERE id = ?11",
        params![
            nombre, apellido, ci, edad, fecha_nacimiento,
            genero, telefono, email, direccion, ocupacion, id
        ],
    )
    .map_err(|e| e.to_string())?;

    drop(conn);

    obtener_paciente_por_id(db, id)?.ok_or("Paciente no encontrado tras actualizar.".into())
}