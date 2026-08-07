use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Usuario {
    pub id: i64,
    pub nombre: Option<String>,
    pub apellido: Option<String>,
    pub nombre_completo: String,
    pub email: String,
    pub username: Option<String>,
    pub telefono: Option<String>,
    pub ci: Option<String>,
    pub especialidad: Option<String>,
    pub sucursal: Option<String>,
    pub rol: String,
    pub activo: bool,
    pub debe_cambiar_password: bool,
    pub creado_en: String,
    pub ultimo_acceso: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UsuarioFormValues {
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub telefono: Option<String>,
    pub ci: Option<String>,
    pub especialidad: Option<String>,
    pub sucursal: Option<String>,
    pub rol: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CrearUsuarioInput {
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub username: String,
    pub telefono: Option<String>,
    pub ci: Option<String>,
    pub especialidad: Option<String>,
    pub sucursal: Option<String>,
    pub rol: String,
    pub password_temporal: String,
    pub activo: bool,
    pub debe_cambiar_password: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RegenerarPasswordResultado {
    pub password_temporal: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UsernameSugerido {
    pub username: String,
}