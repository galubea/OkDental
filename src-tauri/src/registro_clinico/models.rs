use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RegistroClinico {
    pub id: i64,
    pub paciente_id: i64,
    pub fecha: String,
    pub titulo: String,
    pub descripcion: String,
    pub creado_en: String,
}

#[derive(Debug, Deserialize)]
pub struct NuevoRegistroClinicoInput {
    pub fecha: String,
    pub titulo: String,
    pub descripcion: String,
}