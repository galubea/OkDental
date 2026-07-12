use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Avance {
    pub id: String,
    pub fecha: String,
    pub texto: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DienteData {
    pub numero: String,
    pub ausente: bool,
    pub superficies: HashMap<String, String>,
    pub observacion: String,
    pub avances: Vec<Avance>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OdontogramaResumen {
    pub id: String,
    pub titulo: String,
    pub fecha: String,
    pub actualizado_en: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OdontogramaCompleto {
    pub id: String,
    pub titulo: String,
    pub fecha: String,
    pub adulto: HashMap<String, DienteData>,
    pub infantil: HashMap<String, DienteData>,
    pub observacion_general: String,
}

#[derive(Debug, Deserialize)]
pub struct NuevoOdontogramaInput {
    pub titulo: String,
    pub fecha: String,
}