use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tratamiento {
    pub id: String,
    pub nombre: String,
    pub diente: Option<String>,
    pub cantidad: i64,
    pub precio_unitario: f64,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Pago {
    pub id: String,
    pub fecha: String,
    pub metodo: String,
    pub nota: Option<String>,
    pub monto: f64,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Cita {
    pub id: String,
    pub paciente_id: i64,
    pub fecha: String,
    pub hora: String,
    pub duracion_min: i64,
    pub doctor_id: i64,
    pub doctor_nombre: String,
    pub motivo: String,
    pub estado: String,
    pub total: f64,
    pub pagado: f64,
    pub tratamientos: Vec<Tratamiento>,
    pub pagos: Vec<Pago>,
    pub notas: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevaCitaInput {
    pub fecha: String,
    pub hora: String,
    pub motivo: String,
    pub doctor_id: i64,
    pub duracion_min: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevoTratamientoInput {
    pub nombre: String,
    pub diente: Option<String>,
    pub cantidad: i64,
    pub precio_unitario: f64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NuevoPagoInput {
    pub fecha: String,
    pub metodo: String,
    pub nota: Option<String>,
    pub monto: f64,
}