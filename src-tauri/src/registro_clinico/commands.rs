use rusqlite::params;
use tauri::State;

use crate::db::DbConnection;
use super::models::{NuevoRegistroClinicoInput, RegistroClinico};

fn mapear_fila(row: &rusqlite::Row) -> rusqlite::Result<RegistroClinico> {
    Ok(RegistroClinico {
        id: row.get(0)?,
        paciente_id: row.get(1)?,
        fecha: row.get(2)?,
        titulo: row.get(3)?,
        descripcion: row.get(4)?,
        creado_en: row.get(5)?,
    })
}

#[tauri::command]
pub fn listar_registros_clinicos(
    paciente_id: i64,
    db: State<DbConnection>,
) -> Result<Vec<RegistroClinico>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, paciente_id, fecha, titulo, descripcion, creado_en
             FROM registro_clinico
             WHERE paciente_id = ?1
             ORDER BY fecha DESC, id DESC",
        )
        .map_err(|e| e.to_string())?;

    let registros = stmt
        .query_map(params![paciente_id], mapear_fila)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(registros)
}

#[tauri::command]
pub fn crear_registro_clinico(
    paciente_id: i64,
    input: NuevoRegistroClinicoInput,
    db: State<DbConnection>,
) -> Result<RegistroClinico, String> {
    if input.titulo.trim().is_empty() || input.fecha.trim().is_empty() {
        return Err("Fecha y título son obligatorios.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO registro_clinico (paciente_id, fecha, titulo, descripcion)
         VALUES (?1, ?2, ?3, ?4)",
        params![paciente_id, input.fecha.trim(), input.titulo.trim(), input.descripcion.trim()],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT id, paciente_id, fecha, titulo, descripcion, creado_en
         FROM registro_clinico WHERE id = ?1",
        params![id],
        mapear_fila,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn actualizar_registro_clinico(
    id: i64,
    input: NuevoRegistroClinicoInput,
    db: State<DbConnection>,
) -> Result<RegistroClinico, String> {
    if input.titulo.trim().is_empty() || input.fecha.trim().is_empty() {
        return Err("Fecha y título son obligatorios.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let filas = conn
        .execute(
            "UPDATE registro_clinico
             SET fecha = ?1, titulo = ?2, descripcion = ?3
             WHERE id = ?4",
            params![input.fecha.trim(), input.titulo.trim(), input.descripcion.trim(), id],
        )
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró el registro clínico.".into());
    }

    conn.query_row(
        "SELECT id, paciente_id, fecha, titulo, descripcion, creado_en
         FROM registro_clinico WHERE id = ?1",
        params![id],
        mapear_fila,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn eliminar_registro_clinico(id: i64, db: State<DbConnection>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let filas = conn
        .execute("DELETE FROM registro_clinico WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró el registro clínico.".into());
    }

    Ok(())
}