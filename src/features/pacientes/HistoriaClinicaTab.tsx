import { Pencil, X, Save } from "lucide-react";
import { useHistoriaClinica } from "./hooks/useHistoriaClinica";
import { CampoFila, RadioGroup, CheckboxGroup } from "./components";
import "./styles/historiaClinica.css";

const ANTECEDENTES_PERSONALES = [
  "Anemia", "Cardiopatías", "Chagas",
  "Enf. Gástrica", "Hepatitis", "Tuberculosis",
  "Asma", "Diabetes", "VIH",
  "Epilepsia", "Hipertensión", "Ninguno",
];
const PREGUNTAS_ANAMNESIS: { key: string; pregunta: string }[] = [
  { key: "enfermedad", pregunta: "¿Padece alguna enfermedad actualmente?" },
  { key: "tratamiento", pregunta: "¿Ha estado en tratamiento médico en el último mes?" },
  { key: "medicamento", pregunta: "¿Toma algún medicamento?" },
  { key: "alergia", pregunta: "¿Tiene alguna alergia?" },
  { key: "consultas", pregunta: "¿Ha acudido a consultas dentales en los últimos 6 meses?" },
  { key: "hemorragia", pregunta: "¿Tuvo hemorragia tras una extracción dental?" },
  { key: "mal_habito", pregunta: "¿Padece algún mal hábito con la boca o dientes?" },
];

const PREGUNTAS_COVID: { key: string; pregunta: string }[] = [
  { key: "sintomas", pregunta: "¿Ha tenido síntomas de COVID-19?" },
  { key: "contacto", pregunta: "¿Ha tenido contacto con paciente COVID-19?" },
  { key: "vacuna", pregunta: "¿Se aplicó la vacuna contra COVID-19?" },
];

const CAMPOS_INTRAORALES: [string, string][] = [
  ["lengua", "Lengua"],
  ["paladar", "Paladar"],
  ["piso", "Piso de Boca"],
  ["mucosa", "Mucosa Yugal"],
  ["encias", "Encías"],
  ["tartaro", "Tártaro"],
  ["placa", "Placa Bacteriana"],
  ["denticion", "Dentición"],
  ["oclusion", "Oclusión"],
];

const HABITOS_OPCIONES = ["Fuma", "Bebe"];
interface Props {
  pacienteId: number;
}

export default function HistoriaClinicaTab({ pacienteId }: Props) {
  const {
    datos, cargando, guardando, editando, mensaje,
    entrarEdicion, cancelarEdicion, guardar, actualizarCampo,
  } = useHistoriaClinica(pacienteId);

  if (cargando || !datos) {
    return <p className="hc-estado">Cargando historia clínica...</p>;
  }

  const antPersonalesArr = datos.ant_personales
    ? datos.ant_personales.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="hc-card">
      <h2 className="hc-titulo">Historia Clínica</h2>

      {/* ---------- Motivo de consulta ---------- */}
      <p className="hc-section-title">Motivo de consulta</p>
      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Motivo de consulta",
            valor: datos.motivo_consulta,
            editor: (
              <textarea
                placeholder="Razón principal de la visita…"
                value={datos.motivo_consulta}
                onChange={(e) => actualizarCampo("motivo_consulta", e.target.value)}
              />
            ),
          },
        ]}
      />

      <hr className="hc-divider" />

      {/* ---------- Antecedentes Patológicos ---------- */}
      <p className="hc-section-title">Antecedentes Patológicos</p>

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Antecedentes Familiares",
            valor: datos.ant_familiares,
            editor: (
              <textarea
                placeholder="Ej: Padre diabético, madre hipertensa…"
                value={datos.ant_familiares}
                onChange={(e) => actualizarCampo("ant_familiares", e.target.value)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Antecedentes Personales",
            valor: antPersonalesArr.join(", "),
            editor: (
              <CheckboxGroup
                opciones={ANTECEDENTES_PERSONALES}
                seleccion={antPersonalesArr}
                onChange={(sel) => actualizarCampo("ant_personales", sel.join(", "))}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Problemas Renales",
            valor: datos.renal,
            editor: (
              <RadioGroup
                name="renal"
                opciones={["Sí", "No"]}
                valor={datos.renal}
                onChange={(v) => actualizarCampo("renal", v)}
              />
            ),
          },
          {
            label: "Problemas de Coagulación",
            valor: datos.coagulacion,
            editor: (
              <RadioGroup
                name="coagulacion"
                opciones={["Sí", "No"]}
                valor={datos.coagulacion}
                onChange={(v) => actualizarCampo("coagulacion", v)}
              />
            ),
          },
        ]}
      />
    <hr className="hc-divider" />

      {/* ---------- Anamnesis ---------- */}
      <p className="hc-section-title">Anamnesis</p>

      {PREGUNTAS_ANAMNESIS.map(({ key, pregunta }) => {
        const resp = datos.anamnesis[key] ?? { sn: "", det: "" };
        return (
          <CampoFila
            key={key}
            editando={editando}
            columnas={[
              {
                label: pregunta,
                valor: resp.sn,
                stretch: 3,
                editor: (
                  <RadioGroup
                    name={`anamnesis-${key}`}
                    opciones={["Sí", "No"]}
                    valor={resp.sn}
                    onChange={(v) =>
                      actualizarCampo("anamnesis", {
                        ...datos.anamnesis,
                        [key]: { ...resp, sn: v },
                      })
                    }
                  />
                ),
              },
              {
                label: "Detalle",
                valor: resp.det,
                stretch: 2,
                editor: (
                  <input
                    type="text"
                    placeholder="Detalle…"
                    value={resp.det}
                    onChange={(e) =>
                      actualizarCampo("anamnesis", {
                        ...datos.anamnesis,
                        [key]: { ...resp, det: e.target.value },
                      })
                    }
                  />
                ),
              },
            ]}
          />
        );
      })}

      <hr className="hc-divider" />

      {/* ---------- COVID-19 ---------- */}
      <p className="hc-section-title">COVID-19</p>

      {PREGUNTAS_COVID.map(({ key, pregunta }) => {
        const resp = datos.covid[key] ?? { sn: "", det: "" };
        return (
          <CampoFila
            key={key}
            editando={editando}
            columnas={[
              {
                label: pregunta,
                valor: resp.sn,
                stretch: 3,
                editor: (
                  <RadioGroup
                    name={`covid-${key}`}
                    opciones={["Sí", "No"]}
                    valor={resp.sn}
                    onChange={(v) =>
                      actualizarCampo("covid", { ...datos.covid, [key]: { ...resp, sn: v } })
                    }
                  />
                ),
              },
              {
                label: "Detalle",
                valor: resp.det,
                stretch: 2,
                editor: (
                  <input
                    type="text"
                    placeholder="Especifique…"
                    value={resp.det}
                    onChange={(e) =>
                      actualizarCampo("covid", {
                        ...datos.covid,
                        [key]: { ...resp, det: e.target.value },
                      })
                    }
                  />
                ),
              },
            ]}
          />
        );
      })}

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Dosis de vacuna COVID",
            valor: datos.dosis_covid,
            editor: (
              <input
                type="text"
                placeholder="Ej: 2 dosis Pfizer + refuerzo…"
                value={datos.dosis_covid}
                onChange={(e) => actualizarCampo("dosis_covid", e.target.value)}
              />
            ),
          },
        ]}
      />

      <hr className="hc-divider" />

      {/* ---------- Examen Clínico ---------- */}
      <p className="hc-section-title">Examen Clínico</p>

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "A.T.M.",
            valor: datos.extraoral_atm,
            editor: (
              <input
                type="text"
                value={datos.extraoral_atm}
                onChange={(e) => actualizarCampo("extraoral_atm", e.target.value)}
              />
            ),
          },
          {
            label: "Labios",
            valor: datos.extraoral_labios,
            editor: (
              <input
                type="text"
                value={datos.extraoral_labios}
                onChange={(e) => actualizarCampo("extraoral_labios", e.target.value)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Ganglios Linfáticos",
            valor: datos.extraoral_ganglios,
            editor: (
              <input
                type="text"
                value={datos.extraoral_ganglios}
                onChange={(e) => actualizarCampo("extraoral_ganglios", e.target.value)}
              />
            ),
          },
          {
            label: "Respirador",
            valor: datos.respirador,
            editor: (
              <RadioGroup
                name="respirador"
                opciones={["Nasal", "Bucal", "Buconasal"]}
                valor={datos.respirador}
                onChange={(v) => actualizarCampo("respirador", v)}
              />
            ),
          },
        ]}
      />

      {Array.from({ length: Math.ceil(CAMPOS_INTRAORALES.length / 2) }).map((_, i) => {
        const par = CAMPOS_INTRAORALES.slice(i * 2, i * 2 + 2);
        return (
          <CampoFila
            key={i}
            editando={editando}
            columnas={par.map(([key, label]) => ({
              label,
              valor: datos.intraoral[key] ?? "",
              editor: (
                <input
                  type="text"
                  value={datos.intraoral[key] ?? ""}
                  onChange={(e) =>
                    actualizarCampo("intraoral", { ...datos.intraoral, [key]: e.target.value })
                  }
                />
              ),
            }))}
          />
        );
      })}

      <hr className="hc-divider" />

      {/* ---------- Antecedentes Bucodentales e Higiene ---------- */}
      <p className="hc-section-title">Antecedentes Bucodentales e Higiene</p>

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Última visita al odontólogo",
            valor: datos.ultima_visita,
            editor: (
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                value={datos.ultima_visita}
                onChange={(e) => actualizarCampo("ultima_visita", e.target.value)}
              />
            ),
          },
          {
            label: "Utiliza Prótesis Dental",
            valor: datos.protesis,
            editor: (
              <RadioGroup
                name="protesis"
                opciones={["Sí", "No"]}
                valor={datos.protesis}
                onChange={(v) => actualizarCampo("protesis", v)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Hábitos",
            valor: datos.habitos,
            editor: (
              <CheckboxGroup
                opciones={HABITOS_OPCIONES}
                seleccion={datos.habitos ? datos.habitos.split(",").map((s) => s.trim()) : []}
                onChange={(sel) => actualizarCampo("habitos", sel.join(", "))}
              />
            ),
          },
          {
            label: "Otros hábitos",
            valor: datos.habitos_otros,
            editor: (
              <input
                type="text"
                placeholder="Otros hábitos…"
                value={datos.habitos_otros}
                onChange={(e) => actualizarCampo("habitos_otros", e.target.value)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Usa Cepillo Dental",
            valor: datos.cepillo,
            editor: (
              <RadioGroup
                name="cepillo"
                opciones={["Sí", "No"]}
                valor={datos.cepillo}
                onChange={(v) => actualizarCampo("cepillo", v)}
              />
            ),
          },
          {
            label: "Utiliza Hilo Dental",
            valor: datos.hilo,
            editor: (
              <RadioGroup
                name="hilo"
                opciones={["Sí", "No"]}
                valor={datos.hilo}
                onChange={(v) => actualizarCampo("hilo", v)}
              />
            ),
          },
          {
            label: "Utiliza Enjuague Bucal",
            valor: datos.enjuague,
            editor: (
              <RadioGroup
                name="enjuague"
                opciones={["Sí", "No"]}
                valor={datos.enjuague}
                onChange={(v) => actualizarCampo("enjuague", v)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Frecuencia de cepillado",
            valor: datos.frecuencia,
            editor: (
              <input
                type="text"
                placeholder="Ej: 3 veces al día"
                value={datos.frecuencia}
                onChange={(e) => actualizarCampo("frecuencia", e.target.value)}
              />
            ),
          },
          {
            label: "Sangrado de encías al cepillar",
            valor: datos.sangrado,
            editor: (
              <RadioGroup
                name="sangrado"
                opciones={["Sí", "No"]}
                valor={datos.sangrado}
                onChange={(v) => actualizarCampo("sangrado", v)}
              />
            ),
          },
          {
            label: "Higiene Dental",
            valor: datos.higiene_dental,
            editor: (
              <RadioGroup
                name="higiene_dental"
                opciones={["Buena", "Regular", "Mala"]}
                valor={datos.higiene_dental}
                onChange={(v) => actualizarCampo("higiene_dental", v)}
              />
            ),
          },
        ]}
      />

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Problemas en tratamiento dental anterior",
            valor: datos.problema_anterior,
            editor: (
              <textarea
                placeholder="Problema grave en tratamiento dental anterior…"
                value={datos.problema_anterior}
                onChange={(e) => actualizarCampo("problema_anterior", e.target.value)}
              />
            ),
          },
        ]}
      />

      <hr className="hc-divider" />

      {/* ---------- Observaciones ---------- */}
      <p className="hc-section-title">Observaciones</p>

      <CampoFila
        editando={editando}
        columnas={[
          {
            label: "Observaciones generales",
            valor: datos.observaciones,
            editor: (
              <textarea
                placeholder="Notas clínicas, medicamentos, indicaciones…"
                value={datos.observaciones}
                onChange={(e) => actualizarCampo("observaciones", e.target.value)}
              />
            ),
          },
        ]}
      />
      
      <div className="hc-footer">
        {mensaje && <span className={`hc-mensaje hc-mensaje-${mensaje.tipo}`}>{mensaje.texto}</span>}
        <div className="hc-footer-botones">
          {editando ? (
            <>
              <button className="od-btn-secondary" onClick={cancelarEdicion} disabled={guardando}>
                <X size={15} strokeWidth={2} />
                Cancelar
              </button>
              <button className="od-btn-primary" onClick={guardar} disabled={guardando}>
                <Save size={15} strokeWidth={2} />
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </>
          ) : (
            <button className="od-btn-primary" onClick={entrarEdicion}>
              <Pencil size={15} strokeWidth={2} />
              Editar historia clínica
            </button>
          )}
        </div>
      </div>
    </div>
  );
}