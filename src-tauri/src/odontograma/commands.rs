use rusqlite::{params, Connection};
use tauri::State;
use uuid::Uuid;
use std::collections::HashMap;

use crate::db::DbConnection;
use super::models::{Avance, DienteData, NuevoOdontogramaInput, OdontogramaCompleto, OdontogramaResumen};

fn numeros_adulto() -> Vec<&'static str> {
    vec![
        "18", "17", "16", "15", "14", "13", "12", "11",
        "21", "22", "23", "24", "25", "26", "27", "28",
        "48", "47", "46", "45", "44", "43", "42", "41",
        "31", "32", "33", "34", "35", "36", "37", "38",
    ]
}

fn numeros_infantil() -> Vec<&'static str> {
    vec![
        "55", "54", "53", "52", "51",
        "61", "62", "63", "64", "65",
        "85", "84", "83", "82", "81",
        "71", "72", "73", "74", "75",
    ]
}

fn cargar_dientes(conn: &Connection, odontograma_id: &str, modo: &str) -> Result<HashMap<String, DienteData>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, numero, ausente, superficie_vestibular, superficie_lingual,
                    superficie_mesial, superficie_distal, superficie_oclusal, observacion
             FROM diente WHERE odontograma_id = ?1 AND modo = ?2",
        )
        .map_err(|e| e.to_string())?;

    let filas: Vec<(String, String, bool, String, String, String, String, String, String)> = stmt
        .query_map(params![odontograma_id, modo], |row| {
            Ok((
                row.get(0)?, row.get(1)?, row.get::<_, i64>(2)? != 0,
                row.get(3)?, row.get(4)?, row.get(5)?, row.get(6)?, row.get(7)?, row.get(8)?,
            ))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let mut resultado = HashMap::new();

    for (diente_id, numero, ausente, vest, ling, mes, dist, ocl, observacion) in filas {
        let mut stmt_a = conn
            .prepare("SELECT id, fecha, texto FROM avance WHERE diente_id = ?1 ORDER BY fecha ASC, rowid ASC")
            .map_err(|e| e.to_string())?;

        let avances: Vec<Avance> = stmt_a
            .query_map(params![diente_id], |row| {
                Ok(Avance { id: row.get(0)?, fecha: row.get(1)?, texto: row.get(2)? })
            })
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;

        let mut superficies = HashMap::new();
        superficies.insert("vestibular".to_string(), vest);
        superficies.insert("lingual".to_string(), ling);
        superficies.insert("mesial".to_string(), mes);
        superficies.insert("distal".to_string(), dist);
        superficies.insert("oclusal".to_string(), ocl);

        resultado.insert(
            numero.clone(),
            DienteData { numero, ausente, superficies, observacion, avances },
        );
    }

    Ok(resultado)
}

#[tauri::command]
pub fn listar_odontogramas(paciente_id: i64, db: State<DbConnection>) -> Result<Vec<OdontogramaResumen>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, titulo, fecha, actualizado_en FROM odontograma
             WHERE paciente_id = ?1 ORDER BY fecha DESC, creado_en DESC",
        )
        .map_err(|e| e.to_string())?;

    let resultado: Vec<OdontogramaResumen> = stmt
        .query_map(params![paciente_id], |row| {
            Ok(OdontogramaResumen {
                id: row.get(0)?, titulo: row.get(1)?, fecha: row.get(2)?, actualizado_en: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(resultado)
}

#[tauri::command]
pub fn obtener_odontograma(odontograma_id: String, db: State<DbConnection>) -> Result<OdontogramaCompleto, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let (titulo, fecha, observacion_general) = conn
        .query_row(
            "SELECT titulo, fecha, observacion_general FROM odontograma WHERE id = ?1",
            params![odontograma_id],
            |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?, row.get::<_, String>(2)?)),
        )
        .map_err(|_| "No se encontró el odontograma.".to_string())?;

    let adulto = cargar_dientes(&conn, &odontograma_id, "adulto")?;
    let infantil = cargar_dientes(&conn, &odontograma_id, "infantil")?;

    Ok(OdontogramaCompleto { id: odontograma_id, titulo, fecha, adulto, infantil, observacion_general })
}

#[tauri::command]
pub fn crear_odontograma(
    paciente_id: i64,
    input: NuevoOdontogramaInput,
    db: State<DbConnection>,
) -> Result<OdontogramaCompleto, String> {
    if input.fecha.trim().is_empty() {
        return Err("La fecha es obligatoria.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let odontograma_id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO odontograma (id, paciente_id, titulo, fecha, observacion_general)
         VALUES (?1, ?2, ?3, ?4, '')",
        params![odontograma_id, paciente_id, input.titulo.trim(), input.fecha.trim()],
    )
    .map_err(|e| e.to_string())?;

    for numero in numeros_adulto() {
        conn.execute(
            "INSERT INTO diente (id, odontograma_id, modo, numero) VALUES (?1, ?2, 'adulto', ?3)",
            params![Uuid::new_v4().to_string(), odontograma_id, numero],
        )
        .map_err(|e| e.to_string())?;
    }

    for numero in numeros_infantil() {
        conn.execute(
            "INSERT INTO diente (id, odontograma_id, modo, numero) VALUES (?1, ?2, 'infantil', ?3)",
            params![Uuid::new_v4().to_string(), odontograma_id, numero],
        )
        .map_err(|e| e.to_string())?;
    }

    obtener_odontograma_interno(&conn, &odontograma_id, input.titulo.trim(), input.fecha.trim())
}

// Variante interna para reusar dentro de la misma conexión sin re-lockear
fn obtener_odontograma_interno(conn: &Connection, odontograma_id: &str, titulo: &str, fecha: &str) -> Result<OdontogramaCompleto, String> {
    let adulto = cargar_dientes(conn, odontograma_id, "adulto")?;
    let infantil = cargar_dientes(conn, odontograma_id, "infantil")?;
    Ok(OdontogramaCompleto {
        id: odontograma_id.to_string(),
        titulo: titulo.to_string(),
        fecha: fecha.to_string(),
        adulto,
        infantil,
        observacion_general: String::new(),
    })
}

#[tauri::command]
pub fn guardar_odontograma(
    odontograma_id: String,
    modo: String,
    dientes: HashMap<String, DienteData>,
    db: State<DbConnection>,
) -> Result<(), String> {
    if modo != "adulto" && modo != "infantil" {
        return Err("Modo inválido: debe ser 'adulto' o 'infantil'.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;

    for (numero, dato) in dientes {
        let vest = dato.superficies.get("vestibular").cloned().unwrap_or_else(|| "sano".into());
        let ling = dato.superficies.get("lingual").cloned().unwrap_or_else(|| "sano".into());
        let mes = dato.superficies.get("mesial").cloned().unwrap_or_else(|| "sano".into());
        let dist = dato.superficies.get("distal").cloned().unwrap_or_else(|| "sano".into());
        let ocl = dato.superficies.get("oclusal").cloned().unwrap_or_else(|| "sano".into());

        conn.execute(
            "UPDATE diente SET ausente = ?1, superficie_vestibular = ?2, superficie_lingual = ?3,
             superficie_mesial = ?4, superficie_distal = ?5, superficie_oclusal = ?6, observacion = ?7
             WHERE odontograma_id = ?8 AND modo = ?9 AND numero = ?10",
            params![dato.ausente as i64, vest, ling, mes, dist, ocl, dato.observacion, odontograma_id, modo, numero],
        )
        .map_err(|e| e.to_string())?;

        let diente_id: String = conn
            .query_row(
                "SELECT id FROM diente WHERE odontograma_id = ?1 AND modo = ?2 AND numero = ?3",
                params![odontograma_id, modo, numero],
                |row| row.get(0),
            )
            .map_err(|e| e.to_string())?;

        // Reemplaza avances: borra los actuales y reinserta los que vienen del frontend
        conn.execute("DELETE FROM avance WHERE diente_id = ?1", params![diente_id])
            .map_err(|e| e.to_string())?;

        for avance in &dato.avances {
            conn.execute(
                "INSERT INTO avance (id, diente_id, fecha, texto) VALUES (?1, ?2, ?3, ?4)",
                params![avance.id, diente_id, avance.fecha, avance.texto],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    conn.execute(
        "UPDATE odontograma SET actualizado_en = datetime('now') WHERE id = ?1",
        params![odontograma_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn guardar_observacion_general(
    odontograma_id: String,
    observacion: String,
    db: State<DbConnection>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let filas = conn
        .execute(
            "UPDATE odontograma SET observacion_general = ?1, actualizado_en = datetime('now') WHERE id = ?2",
            params![observacion, odontograma_id],
        )
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró el odontograma.".into());
    }
    Ok(())
}

#[tauri::command]
pub fn eliminar_odontograma(odontograma_id: String, db: State<DbConnection>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let filas = conn
        .execute("DELETE FROM odontograma WHERE id = ?1", params![odontograma_id])
        .map_err(|e| e.to_string())?;

    if filas == 0 {
        return Err("No se encontró el odontograma.".into());
    }
    Ok(())
}