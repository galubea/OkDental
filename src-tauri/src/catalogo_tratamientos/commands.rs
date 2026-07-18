use rusqlite::{params, Connection};
use tauri::State;
use uuid::Uuid;

use crate::db::DbConnection;
use super::models::{CategoriaTratamiento, Tratamiento, TratamientoPayload};

/// Saca un prefijo de 3 letras del nombre de la categoría.
/// "Operatoria" -> "OPE", "Cirugía" -> "CIR" (los acentos se filtran solos
/// porque solo tomamos caracteres ascii alfabéticos).
fn prefijo_de_categoria(nombre: &str) -> String {
    let limpio: String = nombre
        .chars()
        .filter(|c| c.is_ascii_alphabetic())
        .collect::<String>()
        .to_uppercase();

    let mut prefijo: String = limpio.chars().take(3).collect();
    while prefijo.len() < 3 {
        prefijo.push('X');
    }
    prefijo
}

/// Calcula el siguiente código disponible para una categoría.
/// Como todo el acceso a la DB pasa por el mismo Mutex<Connection>, esto
/// es seguro: nadie más puede insertar mientras tenemos el lock abierto,
/// así que no hay riesgo de que dos tratamientos terminen con el mismo código.
fn generar_codigo(conn: &Connection, categoria_id: &str, categoria_nombre: &str) -> rusqlite::Result<String> {
    let prefijo = prefijo_de_categoria(categoria_nombre);

    let mut stmt = conn.prepare("SELECT codigo FROM catalogo_tratamiento WHERE categoria_id = ?1")?;
    let codigos: Vec<String> = stmt
        .query_map(params![categoria_id], |row| row.get::<_, String>(0))?
        .filter_map(|r| r.ok())
        .collect();

    let siguiente = codigos
        .iter()
        .filter_map(|c| c.rsplit('-').next())
        .filter_map(|n| n.parse::<u32>().ok())
        .max()
        .unwrap_or(0)
        + 1;

    Ok(format!("{}-{:02}", prefijo, siguiente))
}

fn obtener_tratamiento_por_id(conn: &Connection, id: &str) -> rusqlite::Result<Tratamiento> {
    conn.query_row(
        "SELECT id, codigo, nombre, categoria_id, precio_base, descripcion,
                duracion_min, requiere_consentimiento, activo, creado_en, actualizado_en
         FROM catalogo_tratamiento WHERE id = ?1",
        params![id],
        |row| {
            Ok(Tratamiento {
                id: row.get(0)?,
                codigo: row.get(1)?,
                nombre: row.get(2)?,
                categoria_id: row.get(3)?,
                precio_base: row.get(4)?,
                descripcion: row.get(5)?,
                duracion_min: row.get(6)?,
                requiere_consentimiento: row.get::<_, i64>(7)? != 0,
                activo: row.get::<_, i64>(8)? != 0,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        },
    )
}

#[tauri::command]
pub fn catalogo_get_categorias(db: State<DbConnection>) -> Result<Vec<CategoriaTratamiento>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, nombre FROM categoria_tratamiento ORDER BY nombre ASC")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(CategoriaTratamiento {
                id: row.get(0)?,
                nombre: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut categorias = Vec::new();
    for r in rows {
        categorias.push(r.map_err(|e| e.to_string())?);
    }
    Ok(categorias)
}

#[tauri::command]
pub fn catalogo_get_tratamientos(db: State<DbConnection>) -> Result<Vec<Tratamiento>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, codigo, nombre, categoria_id, precio_base, descripcion,
                    duracion_min, requiere_consentimiento, activo, creado_en, actualizado_en
             FROM catalogo_tratamiento
             ORDER BY nombre ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Tratamiento {
                id: row.get(0)?,
                codigo: row.get(1)?,
                nombre: row.get(2)?,
                categoria_id: row.get(3)?,
                precio_base: row.get(4)?,
                descripcion: row.get(5)?,
                duracion_min: row.get(6)?,
                requiere_consentimiento: row.get::<_, i64>(7)? != 0,
                activo: row.get::<_, i64>(8)? != 0,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tratamientos = Vec::new();
    for r in rows {
        tratamientos.push(r.map_err(|e| e.to_string())?);
    }
    Ok(tratamientos)
}

#[tauri::command]
pub fn catalogo_crear_tratamiento(db: State<DbConnection>, payload: TratamientoPayload) -> Result<Tratamiento, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let categoria_nombre: String = conn
        .query_row(
            "SELECT nombre FROM categoria_tratamiento WHERE id = ?1",
            params![payload.categoria_id],
            |row| row.get(0),
        )
        .map_err(|_| "La categoría seleccionada no existe".to_string())?;

    let codigo = generar_codigo(&conn, &payload.categoria_id, &categoria_nombre)
        .map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO catalogo_tratamiento
            (id, codigo, nombre, categoria_id, precio_base, descripcion,
             duracion_min, requiere_consentimiento, activo)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1)",
        params![
            id,
            codigo,
            payload.nombre,
            payload.categoria_id,
            payload.precio_base,
            payload.descripcion.clone().unwrap_or_default(),
            payload.duracion_min,
            payload.requiere_consentimiento.unwrap_or(false) as i64,
        ],
    )
    .map_err(|e| e.to_string())?;

    obtener_tratamiento_por_id(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn catalogo_actualizar_tratamiento(
    db: State<DbConnection>,
    id: String,
    payload: TratamientoPayload,
) -> Result<Tratamiento, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    // El código NO se toca al editar, aunque cambie nombre/categoría/precio.
    conn.execute(
        "UPDATE catalogo_tratamiento SET
            nombre = ?1,
            categoria_id = ?2,
            precio_base = ?3,
            descripcion = ?4,
            duracion_min = ?5,
            requiere_consentimiento = ?6,
            actualizado_en = datetime('now')
         WHERE id = ?7",
        params![
            payload.nombre,
            payload.categoria_id,
            payload.precio_base,
            payload.descripcion.clone().unwrap_or_default(),
            payload.duracion_min,
            payload.requiere_consentimiento.unwrap_or(false) as i64,
            id,
        ],
    )
    .map_err(|e| e.to_string())?;

    obtener_tratamiento_por_id(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn catalogo_eliminar_tratamiento(db: State<DbConnection>, id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE catalogo_tratamiento SET activo = 0, actualizado_en = datetime('now') WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}