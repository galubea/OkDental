use rusqlite::{params, Connection};
use tauri::State;
use uuid::Uuid;

use crate::db::DbConnection;
use super::models::{Cita, NuevaCitaInput, NuevoPagoInput, NuevoTratamientoInput, Pago, Tratamiento};

fn construir_cita(conn: &Connection, cita_id: &str) -> Result<Cita, String> {
    let (paciente_id, fecha, hora, duracion_min, doctor_id, doctor_nombre, motivo, estado, notas) = conn
        .query_row(
            "SELECT c.paciente_id, c.fecha, c.hora, c.duracion_min, c.doctor_id, d.nombre_completo, c.motivo, c.estado, c.notas
             FROM cita c JOIN doctor d ON d.id = c.doctor_id
             WHERE c.id = ?1",
            params![cita_id],
            |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                    row.get::<_, i64>(3)?,
                    row.get::<_, i64>(4)?,
                    row.get::<_, String>(5)?,
                    row.get::<_, String>(6)?,
                    row.get::<_, String>(7)?,
                    row.get::<_, String>(8)?,
                ))
            },
        )
        .map_err(|_| "No se encontró la cita.".to_string())?;

    let mut stmt_t = conn
        .prepare("SELECT id, nombre, diente, cantidad, precio_unitario FROM tratamiento WHERE cita_id = ?1 ORDER BY rowid")
        .map_err(|e| e.to_string())?;
    let tratamientos: Vec<Tratamiento> = stmt_t
        .query_map(params![cita_id], |row| {
            Ok(Tratamiento {
                id: row.get(0)?,
                nombre: row.get(1)?,
                diente: row.get(2)?,
                cantidad: row.get(3)?,
                precio_unitario: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let mut stmt_p = conn
        .prepare("SELECT id, fecha, metodo, nota, monto FROM pago WHERE cita_id = ?1 ORDER BY rowid")
        .map_err(|e| e.to_string())?;
    let pagos: Vec<Pago> = stmt_p
        .query_map(params![cita_id], |row| {
            Ok(Pago {
                id: row.get(0)?,
                fecha: row.get(1)?,
                metodo: row.get(2)?,
                nota: row.get(3)?,
                monto: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let total: f64 = tratamientos.iter().map(|t| t.cantidad as f64 * t.precio_unitario).sum();
    let pagado: f64 = pagos.iter().map(|p| p.monto).sum();

    Ok(Cita {
        id: cita_id.to_string(),
        paciente_id,
        fecha,
        hora,
        duracion_min,
        doctor_id,
        doctor_nombre,
        motivo,
        estado,
        total,
        pagado,
        tratamientos,
        pagos,
        notas,
    })
}

/// Verifica que la cita pertenezca al paciente indicado (evita mezclar datos entre pacientes)
fn verificar_pertenencia(conn: &Connection, cita_id: &str, paciente_id: i64) -> Result<(), String> {
    let existe: Option<i64> = conn
        .query_row(
            "SELECT 1 FROM cita WHERE id = ?1 AND paciente_id = ?2",
            params![cita_id, paciente_id],
            |row| row.get(0),
        )
        .optional_or_none();
    if existe.is_none() {
        return Err("La cita no pertenece a este paciente.".into());
    }
    Ok(())
}

// pequeño helper para no importar OptionalExtension en todos lados
trait OptionalOrNone<T> {
    fn optional_or_none(self) -> Option<T>;
}
impl<T> OptionalOrNone<T> for Result<T, rusqlite::Error> {
    fn optional_or_none(self) -> Option<T> {
        match self {
            Ok(v) => Some(v),
            Err(rusqlite::Error::QueryReturnedNoRows) => None,
            Err(_) => None,
        }
    }
}

#[tauri::command]
pub fn obtener_citas(paciente_id: i64, db: State<DbConnection>) -> Result<Vec<Cita>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id FROM cita WHERE paciente_id = ?1 ORDER BY fecha DESC, hora DESC")
        .map_err(|e| e.to_string())?;

    let ids: Vec<String> = stmt
        .query_map(params![paciente_id], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    ids.iter().map(|id| construir_cita(&conn, id)).collect()
}

#[tauri::command]
pub fn crear_cita(paciente_id: i64, input: NuevaCitaInput, db: State<DbConnection>) -> Result<Cita, String> {
    if input.fecha.trim().is_empty() || input.hora.trim().is_empty() {
        return Err("Fecha y hora son obligatorias.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let duracion = input.duracion_min.unwrap_or(30);

    conn.execute(
        "INSERT INTO cita (id, paciente_id, doctor_id, fecha, hora, duracion_min, motivo, estado, notas)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'programada', '')",
        params![
            id,
            paciente_id,
            input.doctor_id,
            input.fecha.trim(),
            input.hora.trim(),
            duracion,
            input.motivo.trim()
        ],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &id)
}

#[tauri::command]
pub fn agregar_tratamiento(
    paciente_id: i64,
    cita_id: String,
    input: NuevoTratamientoInput,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    if input.nombre.trim().is_empty() || input.cantidad < 1 {
        return Err("El tratamiento y la cantidad son obligatorios.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    let id = Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO tratamiento (id, cita_id, nombre, diente, cantidad, precio_unitario)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            id,
            cita_id,
            input.nombre.trim(),
            input.diente.as_deref().map(|s| s.trim()),
            input.cantidad,
            input.precio_unitario
        ],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn eliminar_tratamiento(
    paciente_id: i64,
    cita_id: String,
    tratamiento_id: String,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "DELETE FROM tratamiento WHERE id = ?1 AND cita_id = ?2",
        params![tratamiento_id, cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn actualizar_notas(
    paciente_id: i64,
    cita_id: String,
    notas: String,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "UPDATE cita SET notas = ?1 WHERE id = ?2",
        params![notas, cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn agregar_pago(
    paciente_id: i64,
    cita_id: String,
    input: NuevoPagoInput,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    if input.monto <= 0.0 {
        return Err("El monto debe ser mayor a cero.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    // Validar que no se pague de más
    let actual = construir_cita(&conn, &cita_id)?;
    let saldo_pendiente = actual.total - actual.pagado;
    if input.monto > saldo_pendiente + 0.01 {
        return Err(format!(
            "El monto excede el saldo pendiente (${:.2}).",
            saldo_pendiente
        ));
    }

    let id = Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO pago (id, cita_id, fecha, metodo, nota, monto) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            id,
            cita_id,
            input.fecha.trim(),
            input.metodo,
            input.nota.as_deref().map(|s| s.trim()),
            input.monto
        ],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn eliminar_pago(
    paciente_id: i64,
    cita_id: String,
    pago_id: String,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "DELETE FROM pago WHERE id = ?1 AND cita_id = ?2",
        params![pago_id, cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn reprogramar_cita(
    paciente_id: i64,
    cita_id: String,
    fecha: String,
    hora: String,
    db: State<DbConnection>,
) -> Result<Cita, String> {
    if fecha.trim().is_empty() || hora.trim().is_empty() {
        return Err("Fecha y hora son obligatorias.".into());
    }

    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "UPDATE cita SET fecha = ?1, hora = ?2, estado = 'programada' WHERE id = ?3",
        params![fecha.trim(), hora.trim(), cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn cancelar_cita(paciente_id: i64, cita_id: String, db: State<DbConnection>) -> Result<Cita, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "UPDATE cita SET estado = 'cancelada' WHERE id = ?1",
        params![cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn marcar_atendida(paciente_id: i64, cita_id: String, db: State<DbConnection>) -> Result<Cita, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    verificar_pertenencia(&conn, &cita_id, paciente_id)?;

    conn.execute(
        "UPDATE cita SET estado = 'atendida' WHERE id = ?1",
        params![cita_id],
    )
    .map_err(|e| e.to_string())?;

    construir_cita(&conn, &cita_id)
}

#[tauri::command]
pub fn obtener_todas_las_citas(db: State<DbConnection>) -> Result<Vec<Cita>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id FROM cita ORDER BY fecha DESC, hora DESC")
        .map_err(|e| e.to_string())?;

    let ids: Vec<String> = stmt
        .query_map([], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    ids.iter().map(|id| construir_cita(&conn, id)).collect()
}