use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
pub struct Paciente {
    pub id: i64,
    pub nombre: String,
    pub apellido: String,
    pub ci: String,
    pub edad: Option<i64>,
    pub fecha_nacimiento: Option<String>,
    pub genero: Option<String>,
    pub telefono: Option<String>,
    pub email: Option<String>,
    pub direccion: Option<String>,
    pub ocupacion: Option<String>,
    pub fecha_registro: Option<String>,
    pub fecha_ultima_visita: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct NuevoPacienteInput {
    pub nombre: String,
    pub apellido: String,
    pub ci: String,
    pub email: Option<String>,
    pub telefono: Option<String>,
}

#[derive(Debug, Deserialize, Default)]
pub struct PacienteCambios {
    pub nombre: Option<String>,
    pub apellido: Option<String>,
    pub ci: Option<String>,
    pub edad: Option<i64>,
    pub fecha_nacimiento: Option<String>,
    pub genero: Option<String>,
    pub telefono: Option<String>,
    pub email: Option<String>,
    pub direccion: Option<String>,
    pub ocupacion: Option<String>,
}