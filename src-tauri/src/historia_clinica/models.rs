use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HistoriaClinica {
    pub paciente_id: i64,
    pub motivo_consulta: String,
    pub ant_familiares: String,
    pub ant_personales: String,
    pub renal: String,
    pub coagulacion: String,
    pub anamnesis: Value,
    pub covid: Value,
    pub dosis_covid: String,
    pub extraoral_atm: String,
    pub extraoral_labios: String,
    pub extraoral_ganglios: String,
    pub respirador: String,
    pub intraoral: Value,
    pub ultima_visita: String,
    pub habitos: String,
    pub habitos_otros: String,
    pub protesis: String,
    pub cepillo: String,
    pub hilo: String,
    pub enjuague: String,
    pub sangrado: String,
    pub frecuencia: String,
    pub higiene_dental: String,
    pub problema_anterior: String,
    pub observaciones: String,
}

impl HistoriaClinica {
    pub fn vacia(paciente_id: i64) -> Self {
        Self {
            paciente_id,
            motivo_consulta: String::new(),
            ant_familiares: String::new(),
            ant_personales: String::new(),
            renal: String::new(),
            coagulacion: String::new(),
            anamnesis: Value::Object(Default::default()),
            covid: Value::Object(Default::default()),
            dosis_covid: String::new(),
            extraoral_atm: String::new(),
            extraoral_labios: String::new(),
            extraoral_ganglios: String::new(),
            respirador: String::new(),
            intraoral: Value::Object(Default::default()),
            ultima_visita: String::new(),
            habitos: String::new(),
            habitos_otros: String::new(),
            protesis: String::new(),
            cepillo: String::new(),
            hilo: String::new(),
            enjuague: String::new(),
            sangrado: String::new(),
            frecuencia: String::new(),
            higiene_dental: String::new(),
            problema_anterior: String::new(),
            observaciones: String::new(),
        }
    }
}