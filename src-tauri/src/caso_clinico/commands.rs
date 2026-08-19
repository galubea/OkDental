use rusqlite::{params, Connection};
use tauri::State;

use crate::db::DbConnection;
use super::models::*;

fn generar_id(prefijo: &str) -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("{prefijo}_{nanos}")
}

fn calcular_progreso(pasos: &[PasoTratamiento]) -> i64 {
    if pasos.is_empty() {
        return 0;
    }
    let completados = pasos.iter().filter(|p| p.completado).count();
    ((completados as f64 / pasos.len() as f64) * 100.0).round() as i64
}

fn obtener_pasos(conn: &Connection, caso_id: &str) -> rusqlite::Result<Vec<PasoTratamiento>> {
    let mut stmt = conn.prepare(
        "SELECT id, catalogo_trat_id, descripcion, diente, precio, completado
         FROM caso_plan_paso WHERE caso_id = ?1 ORDER BY orden ASC, creado_en ASC",
    )?;
    let filas = stmt.query_map(params![caso_id], |row| {
        Ok(PasoTratamiento {
            id: row.get(0)?,
            catalogo_trat_id: row.get(1)?,
            descripcion: row.get(2)?,
            diente: row.get(3)?,
            precio: row.get(4)?,
            completado: row.get::<_, i64>(5)? != 0,
        })
    })?;
    filas.collect()
}

fn obtener_evolucion(conn: &Connection, caso_id: &str) -> rusqlite::Result<Vec<EntradaEvolucion>> {
    let mut stmt = conn.prepare(
        "SELECT id, fecha, titulo, descripcion FROM caso_evolucion
         WHERE caso_id = ?1 ORDER BY fecha DESC, creado_en DESC",
    )?;
    let filas = stmt.query_map(params![caso_id], |row| {
        Ok(EntradaEvolucion {
            id: row.get(0)?,
            fecha: row.get(1)?,
            titulo: row.get(2)?,
            descripcion: row.get(3)?,
        })
    })?;
    filas.collect()
}

fn obtener_observaciones(conn: &Connection, caso_id: &str) -> rusqlite::Result<Vec<EntradaObservacion>> {
    let mut stmt = conn.prepare(
        "SELECT id, fecha, texto FROM caso_observacion
         WHERE caso_id = ?1 ORDER BY fecha DESC, creado_en DESC",
    )?;
    let filas = stmt.query_map(params![caso_id], |row| {
        Ok(EntradaObservacion {
            id: row.get(0)?,
            fecha: row.get(1)?,
            texto: row.get(2)?,
        })
    })?;
    filas.collect()
}

fn obtener_evidencias(conn: &Connection, caso_id: &str) -> rusqlite::Result<Vec<Evidencia>> {
    let mut stmt = conn.prepare(
        "SELECT id, ruta, etiqueta, fecha FROM caso_evidencia
         WHERE caso_id = ?1 ORDER BY fecha DESC",
    )?;
    let filas = stmt.query_map(params![caso_id], |row| {
        Ok(Evidencia {
            id: row.get(0)?,
            url: row.get(1)?,
            etiqueta: row.get(2)?,
            fecha: row.get(3)?,
        })
    })?;
    filas.collect()
}

fn obtener_citas_paciente(conn: &Connection, paciente_id: i64) -> rusqlite::Result<Vec<CitaResumen>> {
    let mut stmt = conn.prepare(
        "SELECT c.id, c.fecha, c.hora, c.estado, c.motivo,
                COALESCE(d.nombre_completo, 'Sin asignar') AS doctor_nombre,
                COALESCE((SELECT SUM(t.precio_unitario * t.cantidad) FROM tratamiento t WHERE t.cita_id = c.id), 0) AS total,
                COALESCE((SELECT SUM(p.monto) FROM pago p WHERE p.cita_id = c.id), 0) AS pagado
         FROM cita c
         LEFT JOIN doctor d ON d.id = c.doctor_id
         WHERE c.paciente_id = ?1
         ORDER BY c.fecha DESC, c.hora DESC",
    )?;
    let filas = stmt.query_map(params![paciente_id], |row| {
        Ok(CitaResumen {
            id: row.get(0)?,
            fecha: row.get(1)?,
            hora: row.get(2)?,
            estado: row.get(3)?,
            motivo: row.get(4)?,
            doctor_nombre: row.get(5)?,
            total: row.get(6)?,
            pagado: row.get(7)?,
        })
    })?;
    filas.collect()
}

fn obtener_caso_completo(conn: &Connection, caso_id: &str) -> rusqlite::Result<CasoClinico> {
    let (paciente_id, doctor_id, doctor_nombre, titulo, descripcion, especialidad, estado, severidad, diagnostico, piezas_json, fecha_objetivo, fecha_creacion) = conn.query_row(
        "SELECT cc.paciente_id, cc.doctor_id, COALESCE(d.nombre_completo, 'Sin asignar'),
                cc.titulo, cc.descripcion, cc.especialidad, cc.estado, cc.severidad,
                cc.diagnostico, cc.piezas, cc.fecha_objetivo, cc.creado_en
         FROM caso_clinico cc
         LEFT JOIN doctor d ON d.id = cc.doctor_id
         WHERE cc.id = ?1",
        params![caso_id],
        |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, Option<i64>>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, String>(4)?,
                row.get::<_, String>(5)?,
                row.get::<_, String>(6)?,
                row.get::<_, String>(7)?,
                row.get::<_, String>(8)?,
                row.get::<_, String>(9)?,
                row.get::<_, Option<String>>(10)?,
                row.get::<_, String>(11)?,
            ))
        },
    )?;

    let piezas: Vec<i64> = serde_json::from_str(&piezas_json).unwrap_or_default();
    let pasos = obtener_pasos(conn, caso_id)?;
    let progreso = calcular_progreso(&pasos);

    Ok(CasoClinico {
        id: caso_id.to_string(),
        paciente_id,
        doctor_id,
        doctor_nombre,
        titulo,
        descripcion,
        especialidad,
        estado,
        severidad,
        diagnostico,
        piezas,
        progreso,
        fecha_objetivo,
        fecha_creacion,
        plan_tratamiento: pasos,
        evolucion: obtener_evolucion(conn, caso_id)?,
        observaciones: obtener_observaciones(conn, caso_id)?,
        evidencias: obtener_evidencias(conn, caso_id)?,
        citas: obtener_citas_paciente(conn, paciente_id)?,
    })
}

#[tauri::command]
pub fn listar_casos_clinicos(
    paciente_id: i64,
    db: State<DbConnection>,
) -> Result<Vec<CasoClinico>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id FROM caso_clinico WHERE paciente_id = ?1 ORDER BY creado_en DESC")
        .map_err(|e| e.to_string())?;
    let ids: Vec<String> = stmt
        .query_map(params![paciente_id], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<_, _>>()
        .map_err(|e| e.to_string())?;

    ids.iter()
        .map(|id| obtener_caso_completo(&conn, id).map_err(|e| e.to_string()))
        .collect()
}

#[tauri::command]
pub fn crear_caso_clinico(
    paciente_id: i64,
    input: NuevoCasoInput,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = generar_id("caso");
    conn.execute(
        "INSERT INTO caso_clinico (id, paciente_id, doctor_id, titulo, descripcion, especialidad, estado, severidad, diagnostico, piezas)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'activo', ?7, '', '[]')",
        params![
            id,
            paciente_id,
            input.doctor_id,
            input.titulo,
            input.descripcion,
            if input.especialidad.trim().is_empty() { "Odontología General".to_string() } else { input.especialidad },
            input.severidad,
        ],
    )
    .map_err(|e| e.to_string())?;

    obtener_caso_completo(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn actualizar_estado_caso(
    caso_id: String,
    estado: String,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE caso_clinico SET estado = ?1 WHERE id = ?2",
        params![estado, caso_id],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn actualizar_diagnostico_caso(
    caso_id: String,
    input: ActualizarDiagnosticoInput,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let piezas_json = serde_json::to_string(&input.piezas).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE caso_clinico SET diagnostico = ?1, piezas = ?2 WHERE id = ?3",
        params![input.diagnostico, piezas_json, caso_id],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn agregar_paso_plan_caso(
    caso_id: String,
    input: NuevoPasoInput,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = generar_id("paso");
    let orden: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM caso_plan_paso WHERE caso_id = ?1",
            params![caso_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO caso_plan_paso (id, caso_id, catalogo_trat_id, descripcion, diente, precio, orden)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id, caso_id, input.catalogo_trat_id, input.descripcion, input.diente, input.precio, orden],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn toggle_paso_plan_caso(
    caso_id: String,
    paso_id: String,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE caso_plan_paso SET completado = 1 - completado WHERE id = ?1 AND caso_id = ?2",
        params![paso_id, caso_id],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn eliminar_paso_plan_caso(
    caso_id: String,
    paso_id: String,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM caso_plan_paso WHERE id = ?1 AND caso_id = ?2",
        params![paso_id, caso_id],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn agregar_evolucion_caso(
    caso_id: String,
    input: NuevaEvolucionInput,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = generar_id("evo");
    conn.execute(
        "INSERT INTO caso_evolucion (id, caso_id, fecha, titulo, descripcion) VALUES (?1, ?2, date('now'), ?3, ?4)",
        params![id, caso_id, input.titulo, input.descripcion],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn agregar_observacion_caso(
    caso_id: String,
    input: NuevaObservacionInput,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = generar_id("obs");
    conn.execute(
        "INSERT INTO caso_observacion (id, caso_id, fecha, texto) VALUES (?1, ?2, date('now'), ?3)",
        params![id, caso_id, input.texto],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn agregar_evidencia_caso(
    caso_id: String,
    ruta: String,
    etiqueta: String,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = generar_id("ev");
    conn.execute(
        "INSERT INTO caso_evidencia (id, caso_id, ruta, etiqueta, fecha) VALUES (?1, ?2, ?3, ?4, date('now'))",
        params![id, caso_id, ruta, etiqueta],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn eliminar_evidencia_caso(
    caso_id: String,
    evidencia_id: String,
    db: State<DbConnection>,
) -> Result<CasoClinico, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM caso_evidencia WHERE id = ?1 AND caso_id = ?2",
        params![evidencia_id, caso_id],
    )
    .map_err(|e| e.to_string())?;
    obtener_caso_completo(&conn, &caso_id).map_err(|e| e.to_string())
}
