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