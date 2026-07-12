use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{Duration, Utc};
use rand::rngs::OsRng;
use rusqlite::{params, OptionalExtension};
use tauri::{command, Manager, State};
use uuid::Uuid;
use serde::Serialize;

use crate::db::DbConnection;
use super::models::{Doctor, LoginCredentials, RegisterDoctorInput};

const DIAS_SESION: i64 = 30;

fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|e| e.to_string())
}

fn verificar_password(password: &str, hash: &str) -> Result<bool, String> {
    let parsed_hash = PasswordHash::new(hash).map_err(|e| e.to_string())?;
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}

// invoke("login", { input: { email, password } })
#[command]
pub fn login(
    app: tauri::AppHandle,
    db: State<DbConnection>,
    input: LoginCredentials,
) -> Result<Doctor, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();

    let resultado = conn
        .query_row(
            "SELECT id, nombre_completo, email, password_hash, especialidad FROM doctor WHERE email = ?1",
            params![email],
            |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                    row.get::<_, String>(3)?,
                    row.get::<_, Option<String>>(4)?,
                ))
            },
        )
        .optional()
        .map_err(|e| e.to_string())?;

    let (id, nombre_completo, email, password_hash, especialidad) =
        resultado.ok_or("Correo o contraseña incorrectos.")?;

    if !verificar_password(&input.password, &password_hash)? {
        return Err("Correo o contraseña incorrectos.".into());
    }

    let token = Uuid::new_v4().to_string();
    let expira_en = (Utc::now() + Duration::days(DIAS_SESION)).to_rfc3339();

    conn.execute(
        "INSERT INTO sesion (token, doctor_id, expira_en) VALUES (?1, ?2, ?3)",
        params![token, id, expira_en],
    )
    .map_err(|e| e.to_string())?;

    guardar_token(&app, &token)?;

    Ok(Doctor { id, nombre_completo, email, especialidad })
}

// invoke("registrar_doctor", { input: { nombre_completo, email, password, especialidad } })
#[command]
pub fn registrar_doctor(
    db: State<DbConnection>,
    input: RegisterDoctorInput,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let email = input.email.trim().to_lowercase();

    if input.password.len() < 8 {
        return Err("La contraseña debe tener al menos 8 caracteres.".into());
    }

    let existe: Option<i64> = conn
        .query_row(
            "SELECT id FROM doctor WHERE email = ?1",
            params![email],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;

    if existe.is_some() {
        return Err("Ya existe un doctor registrado con ese correo.".into());
    }

    let hash = hash_password(&input.password)?;

    conn.execute(
        "INSERT INTO doctor (nombre_completo, email, password_hash, especialidad) VALUES (?1, ?2, ?3, ?4)",
        params![input.nombre_completo, email, hash, input.especialidad],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// invoke("sesion_activa")
#[command]
pub fn sesion_activa(
    app: tauri::AppHandle,
    db: State<DbConnection>,
) -> Result<Option<Doctor>, String> {
    let token = match leer_token(&app)? {
        Some(t) => t,
        None => return Ok(None),
    };

    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let resultado = conn
        .query_row(
            "SELECT d.id, d.nombre_completo, d.email, d.especialidad, s.expira_en
             FROM sesion s JOIN doctor d ON d.id = s.doctor_id
             WHERE s.token = ?1",
            params![token],
            |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                    row.get::<_, Option<String>>(3)?,
                    row.get::<_, String>(4)?,
                ))
            },
        )
        .optional()
        .map_err(|e| e.to_string())?;

    let (id, nombre_completo, email, especialidad, expira_en) = match resultado {
        Some(r) => r,
        None => return Ok(None),
    };

    let expira: chrono::DateTime<Utc> =
        expira_en.parse().map_err(|e: chrono::ParseError| e.to_string())?;

    if expira < Utc::now() {
        conn.execute("DELETE FROM sesion WHERE token = ?1", params![token])
            .map_err(|e| e.to_string())?;
        borrar_token(&app)?;
        return Ok(None);
    }

    Ok(Some(Doctor { id, nombre_completo, email, especialidad }))
}

// invoke("cerrar_sesion")
#[command]
pub fn cerrar_sesion(app: tauri::AppHandle, db: State<DbConnection>) -> Result<(), String> {
    if let Some(token) = leer_token(&app)? {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        conn.execute("DELETE FROM sesion WHERE token = ?1", params![token])
            .map_err(|e| e.to_string())?;
    }
    borrar_token(&app)
}

// --- Token de sesión persistido en disco ---

fn ruta_token(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("session.token"))
}

fn guardar_token(app: &tauri::AppHandle, token: &str) -> Result<(), String> {
    std::fs::write(ruta_token(app)?, token).map_err(|e| e.to_string())
}

fn leer_token(app: &tauri::AppHandle) -> Result<Option<String>, String> {
    let ruta = ruta_token(app)?;
    if !ruta.exists() {
        return Ok(None);
    }
    std::fs::read_to_string(ruta).map(Some).map_err(|e| e.to_string())
}

fn borrar_token(app: &tauri::AppHandle) -> Result<(), String> {
    let ruta = ruta_token(app)?;
    if ruta.exists() {
        std::fs::remove_file(ruta).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DoctorResumen {
    pub id: i64,
    pub nombre_completo: String,
    pub especialidad: Option<String>,
}

#[tauri::command]
pub fn listar_doctores(db: tauri::State<crate::db::DbConnection>) -> Result<Vec<DoctorResumen>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, nombre_completo, especialidad FROM doctor ORDER BY nombre_completo")
        .map_err(|e| e.to_string())?;

    let doctores = stmt
        .query_map([], |row| {
            Ok(DoctorResumen {
                id: row.get(0)?,
                nombre_completo: row.get(1)?,
                especialidad: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(doctores)
}