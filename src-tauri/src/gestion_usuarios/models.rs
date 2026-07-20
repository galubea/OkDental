use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Usuario {
    pub id: i64,
    pub nombre_completo: String,
    pub email: String,
    pub especialidad: Option<String>,
    pub rol: String,
    pub activo: bool,
    pub debe_cambiar_password: bool,
    pub creado_en: String,
    pub ultimo_acceso: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UsuarioInput {
    pub nombre_completo: String,
    pub email: String,
    pub especialidad: Option<String>,
    pub rol: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CrearUsuarioResultado {
    pub usuario: Usuario,
    pub password_temporal: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RegenerarPasswordResultado {
    pub password_temporal: String,
}