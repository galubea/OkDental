use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
pub struct Doctor {
    pub id: i64,
    #[serde(rename = "nombreCompleto")]
    pub nombre_completo: String,
    pub email: String,
    pub especialidad: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginCredentials {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterDoctorInput {
    pub nombre_completo: String,
    pub email: String,
    pub password: String,
    pub especialidad: Option<String>,
}