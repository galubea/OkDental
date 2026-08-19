use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PasoTratamiento {
    pub id: String,
    pub catalogo_trat_id: Option<String>,
    pub descripcion: String,
    pub diente: Option<String>,
    pub precio: Option<f64>,
    pub completado: bool,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EntradaEvolucion {
    pub id: String,
    pub fecha: String,
    pub titulo: String,
    pub descripcion: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EntradaObservacion {
    pub id: String,
    pub fecha: String,
    pub texto: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Evidencia {
    pub id: String,
    pub url: String,
    pub etiqueta: String,
    pub fecha: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CitaResumen {
    pub id: String,
    pub fecha: String,
    pub hora: String,
    pub estado: String,
    pub motivo: String,
    pub doctor_nombre: String,
    pub total: f64,
    pub pagado: f64,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CasoClinico {
    pub id: String,
    pub paciente_id: i64,
    pub doctor_id: Option<i64>,
    pub doctor_nombre: String,
    pub titulo: String,
    pub descripcion: String,
    pub especialidad: String,
    pub estado: String,
    pub severidad: String,
    pub diagnostico: String,
    pub piezas: Vec<i64>,
    pub progreso: i64,
    pub fecha_objetivo: Option<String>,
    pub fecha_creacion: String,
    pub plan_tratamiento: Vec<PasoTratamiento>,
    pub evolucion: Vec<EntradaEvolucion>,
    pub observaciones: Vec<EntradaObservacion>,
    pub evidencias: Vec<Evidencia>,
    pub citas: Vec<CitaResumen>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevoCasoInput {
    pub titulo: String,
    pub descripcion: String,
    pub especialidad: String,
    pub doctor_id: Option<i64>,
    pub severidad: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActualizarDiagnosticoInput {
    pub diagnostico: String,
    pub piezas: Vec<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevoPasoInput {
    pub descripcion: String,
    pub diente: Option<String>,
    pub catalogo_trat_id: Option<String>,
    pub precio: Option<f64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevaEvolucionInput {
    pub titulo: String,
    pub descripcion: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevaObservacionInput {
    pub texto: String,
}
