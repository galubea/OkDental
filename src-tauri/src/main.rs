mod db;
mod auth {
    pub mod commands;
    pub mod models;
}
mod pacientes {
    pub mod commands;
    pub mod models;
}
mod historia_clinica {
    pub mod commands;
    pub mod models;
}
mod registro_clinico {
    pub mod commands;
    pub mod models;
}
mod citas {
    pub mod commands;
    pub mod models;
}
mod odontograma {
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
            historia_clinica::commands::obtener_historia_clinica,
            historia_clinica::commands::guardar_historia_clinica,
            registro_clinico::commands::listar_registros_clinicos,
            registro_clinico::commands::crear_registro_clinico,
            registro_clinico::commands::actualizar_registro_clinico,
            registro_clinico::commands::eliminar_registro_clinico,
            citas::commands::obtener_citas,
            citas::commands::crear_cita,
            citas::commands::agregar_tratamiento,
            citas::commands::eliminar_tratamiento,
            citas::commands::actualizar_notas,
            citas::commands::agregar_pago,
            citas::commands::eliminar_pago,
            citas::commands::reprogramar_cita,
            citas::commands::cancelar_cita,
            citas::commands::marcar_atendida,
            auth::commands::listar_doctores,
            citas::commands::obtener_todas_las_citas,
            odontograma::commands::listar_odontogramas,
            odontograma::commands::obtener_odontograma,
            odontograma::commands::crear_odontograma,
            odontograma::commands::guardar_odontograma,
            odontograma::commands::guardar_observacion_general,
            odontograma::commands::eliminar_odontograma,
        ])
        .run(tauri::generate_context!())
        .expect("error al iniciar la aplicación");
}