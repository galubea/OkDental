use rusqlite::{params, OptionalExtension};
use tauri::{command, State};

use crate::db::DbConnection;
use super::models::HistoriaClinica;

#[command]
pub fn obtener_historia_clinica(
    db: State<DbConnection>,
    paciente_id: i64,
) -> Result<HistoriaClinica, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let resultado = conn
        .query_row(
            "SELECT paciente_id, motivo_consulta, ant_familiares, ant_personales, renal,
                    coagulacion, anamnesis, covid, dosis_covid, extraoral_atm, extraoral_labios,
                    extraoral_ganglios, respirador, intraoral, ultima_visita, habitos,
                    habitos_otros, protesis, cepillo, hilo, enjuague, sangrado, frecuencia,
                    higiene_dental, problema_anterior, observaciones
             FROM historia_clinica WHERE paciente_id = ?1",
            params![paciente_id],
            |row| fila_a_historia(row),
        )
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(resultado.unwrap_or_else(|| HistoriaClinica::vacia(paciente_id)))
}

#[command]
pub fn guardar_historia_clinica(
    db: State<DbConnection>,
    paciente_id: i64,
    datos: HistoriaClinica,
) -> Result<HistoriaClinica, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let anamnesis_str = serde_json::to_string(&datos.anamnesis).map_err(|e| e.to_string())?;
    let covid_str = serde_json::to_string(&datos.covid).map_err(|e| e.to_string())?;
    let intraoral_str = serde_json::to_string(&datos.intraoral).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO historia_clinica (
            paciente_id, motivo_consulta, ant_familiares, ant_personales, renal, coagulacion,
            anamnesis, covid, dosis_covid, extraoral_atm, extraoral_labios, extraoral_ganglios,
            respirador, intraoral, ultima_visita, habitos, habitos_otros, protesis, cepillo,
            hilo, enjuague, sangrado, frecuencia, higiene_dental, problema_anterior, observaciones
         ) VALUES (
            ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18,
            ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26
         )
         ON CONFLICT(paciente_id) DO UPDATE SET
            motivo_consulta = excluded.motivo_consulta,
            ant_familiares = excluded.ant_familiares,
            ant_personales = excluded.ant_personales,
            renal = excluded.renal,
            coagulacion = excluded.coagulacion,
            anamnesis = excluded.anamnesis,
            covid = excluded.covid,
            dosis_covid = excluded.dosis_covid,
            extraoral_atm = excluded.extraoral_atm,
            extraoral_labios = excluded.extraoral_labios,
            extraoral_ganglios = excluded.extraoral_ganglios,
            respirador = excluded.respirador,
            intraoral = excluded.intraoral,
            ultima_visita = excluded.ultima_visita,
            habitos = excluded.habitos,
            habitos_otros = excluded.habitos_otros,
            protesis = excluded.protesis,
            cepillo = excluded.cepillo,
            hilo = excluded.hilo,
            enjuague = excluded.enjuague,
            sangrado = excluded.sangrado,
            frecuencia = excluded.frecuencia,
            higiene_dental = excluded.higiene_dental,
            problema_anterior = excluded.problema_anterior,
            observaciones = excluded.observaciones",
        params![
            paciente_id, datos.motivo_consulta, datos.ant_familiares, datos.ant_personales,
            datos.renal, datos.coagulacion, anamnesis_str, covid_str, datos.dosis_covid,
            datos.extraoral_atm, datos.extraoral_labios, datos.extraoral_ganglios,
            datos.respirador, intraoral_str, datos.ultima_visita, datos.habitos,
            datos.habitos_otros, datos.protesis, datos.cepillo, datos.hilo, datos.enjuague,
            datos.sangrado, datos.frecuencia, datos.higiene_dental, datos.problema_anterior,
            datos.observaciones
        ],
    )
    .map_err(|e| e.to_string())?;

    drop(conn);
    obtener_historia_clinica(db, paciente_id)
}

fn fila_a_historia(row: &rusqlite::Row) -> rusqlite::Result<HistoriaClinica> {
    let anamnesis_str: String = row.get(6)?;
    let covid_str: String = row.get(7)?;
    let intraoral_str: String = row.get(13)?;

    Ok(HistoriaClinica {
        paciente_id: row.get(0)?,
        motivo_consulta: row.get(1)?,
        ant_familiares: row.get(2)?,
        ant_personales: row.get(3)?,
        renal: row.get(4)?,
        coagulacion: row.get(5)?,
        anamnesis: serde_json::from_str(&anamnesis_str).unwrap_or_default(),
        covid: serde_json::from_str(&covid_str).unwrap_or_default(),
        dosis_covid: row.get(8)?,
        extraoral_atm: row.get(9)?,
        extraoral_labios: row.get(10)?,
        extraoral_ganglios: row.get(11)?,
        respirador: row.get(12)?,
        intraoral: serde_json::from_str(&intraoral_str).unwrap_or_default(),
        ultima_visita: row.get(14)?,
        habitos: row.get(15)?,
        habitos_otros: row.get(16)?,
        protesis: row.get(17)?,
        cepillo: row.get(18)?,
        hilo: row.get(19)?,
        enjuague: row.get(20)?,
        sangrado: row.get(21)?,
        frecuencia: row.get(22)?,
        higiene_dental: row.get(23)?,
        problema_anterior: row.get(24)?,
        observaciones: row.get(25)?,
    })
}