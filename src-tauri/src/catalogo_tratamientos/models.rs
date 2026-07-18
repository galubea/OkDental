use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CategoriaTratamiento {
    pub id: String,
    pub nombre: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tratamiento {
    pub id: String,
    pub codigo: String,
    pub nombre: String,
    pub categoria_id: String,
    pub precio_base: f64,
    pub descripcion: Option<String>,
    pub duracion_min: Option<i64>,
    pub requiere_consentimiento: bool,
    pub activo: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TratamientoPayload {
    pub nombre: String,
    pub categoria_id: String,
    pub precio_base: f64,
    pub descripcion: Option<String>,
    pub duracion_min: Option<i64>,
    pub requiere_consentimiento: Option<bool>,
}