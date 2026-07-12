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

        CREATE TABLE IF NOT EXISTS paciente (
            id                    INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre                TEXT NOT NULL,
            apellido              TEXT NOT NULL,
            ci                    TEXT NOT NULL UNIQUE,
            edad                  INTEGER,
            fecha_nacimiento      TEXT,
            genero                TEXT,
            telefono              TEXT,
            email                 TEXT,
            direccion             TEXT,
            ocupacion             TEXT,
            fecha_registro        TEXT NOT NULL DEFAULT (datetime('now')),
            fecha_ultima_visita   TEXT
        );

        CREATE TABLE IF NOT EXISTS historia_clinica (
            paciente_id        INTEGER PRIMARY KEY,
            motivo_consulta    TEXT NOT NULL DEFAULT '',
            ant_familiares      TEXT NOT NULL DEFAULT '',
            ant_personales      TEXT NOT NULL DEFAULT '',
            renal               TEXT NOT NULL DEFAULT '',
            coagulacion         TEXT NOT NULL DEFAULT '',
            anamnesis            TEXT NOT NULL DEFAULT '{}',
            covid                TEXT NOT NULL DEFAULT '{}',
            dosis_covid          TEXT NOT NULL DEFAULT '',
            extraoral_atm        TEXT NOT NULL DEFAULT '',
            extraoral_labios     TEXT NOT NULL DEFAULT '',
            extraoral_ganglios   TEXT NOT NULL DEFAULT '',
            respirador           TEXT NOT NULL DEFAULT '',
            intraoral            TEXT NOT NULL DEFAULT '{}',
            ultima_visita        TEXT NOT NULL DEFAULT '',
            habitos              TEXT NOT NULL DEFAULT '',
            habitos_otros        TEXT NOT NULL DEFAULT '',
            protesis             TEXT NOT NULL DEFAULT '',
            cepillo              TEXT NOT NULL DEFAULT '',
            hilo                 TEXT NOT NULL DEFAULT '',
            enjuague             TEXT NOT NULL DEFAULT '',
            sangrado             TEXT NOT NULL DEFAULT '',
            frecuencia           TEXT NOT NULL DEFAULT '',
            higiene_dental       TEXT NOT NULL DEFAULT '',
            problema_anterior    TEXT NOT NULL DEFAULT '',
            observaciones        TEXT NOT NULL DEFAULT '',

            FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS registro_clinico (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id  INTEGER NOT NULL,
            fecha        TEXT NOT NULL,
            titulo       TEXT NOT NULL,
            descripcion  TEXT NOT NULL DEFAULT '',
            creado_en    TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS cita (
            id            TEXT PRIMARY KEY,
            paciente_id   INTEGER NOT NULL,
            doctor_id     INTEGER NOT NULL,
            fecha         TEXT NOT NULL,
            hora          TEXT NOT NULL,
            duracion_min  INTEGER NOT NULL DEFAULT 30,
            motivo        TEXT NOT NULL DEFAULT '',
            estado        TEXT NOT NULL DEFAULT 'programada',
            notas         TEXT NOT NULL DEFAULT '',
            creado_en     TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES doctor(id)
        );

        CREATE TABLE IF NOT EXISTS tratamiento (
            id               TEXT PRIMARY KEY,
            cita_id          TEXT NOT NULL,
            nombre           TEXT NOT NULL,
    diente           TEXT,
    cantidad         INTEGER NOT NULL,
    precio_unitario  REAL NOT NULL,
    FOREIGN KEY (cita_id) REFERENCES cita(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pago (
    id       TEXT PRIMARY KEY,
    cita_id  TEXT NOT NULL,
    fecha    TEXT NOT NULL,
    metodo   TEXT NOT NULL,
    nota     TEXT,
    monto    REAL NOT NULL,
    FOREIGN KEY (cita_id) REFERENCES cita(id) ON DELETE CASCADE
);
        ",
    )
    .expect("no se pudo inicializar el esquema");

    conn
}