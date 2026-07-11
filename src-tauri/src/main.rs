mod db;
mod auth {
    pub mod commands;
    pub mod models;
}
mod pacientes {
    pub mod commands;
    pub mod models;
}

use db::{init_db, DbConnection};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let conn = init_db(&app.handle());
            app.manage(DbConnection(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth::commands::login,
            auth::commands::registrar_doctor,
            auth::commands::sesion_activa,
            auth::commands::cerrar_sesion,
            pacientes::commands::crear_paciente,
            pacientes::commands::listar_pacientes,
            pacientes::commands::obtener_paciente_por_id,
            pacientes::commands::actualizar_paciente,
        ])
        .run(tauri::generate_context!())
        .expect("error al iniciar la aplicación");
}