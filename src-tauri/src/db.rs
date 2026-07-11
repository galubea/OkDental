use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbConnection(pub Mutex<Connection>);

pub fn init_db(app: &AppHandle) -> Connection {
    let app_dir = app
        .path()
        .app_data_dir()
        .expect("no se pudo obtener el directorio de datos de la app");
    std::fs::create_dir_all(&app_dir).expect("no se pudo crear el directorio de datos");

    let db_path = app_dir.join("lumina_dental.db");
    let conn = Connection::open(db_path).expect("no se pudo abrir la base de datos");

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS doctor (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_completo  TEXT NOT NULL,
            email            TEXT NOT NULL UNIQUE,
            password_hash    TEXT NOT NULL,
            especialidad     TEXT,
            creado_en        TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS sesion (
            token       TEXT PRIMARY KEY,
            doctor_id   INTEGER NOT NULL,
            creado_en   TEXT NOT NULL DEFAULT (datetime('now')),
            expira_en   TEXT NOT NULL,
            FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE
        );
        ",
    )
    .expect("no se pudo inicializar el esquema");

    conn
}