import { Pencil, X, Save, ClipboardList, Users, Syringe, Stethoscope, Sparkles,
  Pill, ShieldAlert, MessageCircleWarning, Droplets, Smile, AlertTriangle, Settings2,
  Radar, ThermometerSun, HeartPulse } from "lucide-react";
import { useHistoriaClinica } from "./hooks/useHistoriaClinica";
import { useToast } from "./hooks/useToast";
import { CampoFila, RadioGroup, CheckboxGroup } from "./components";
import { Seccion } from "./components/historiaClinica/Seccion";
import { TablaPreguntas } from "./components/historiaClinica/TablaPreguntas";
import { Toast, type ToastTipo } from "./components/common/Toast";
import "./styles/historiaClinica.css";

const ANTECEDENTES_PERSONALES = [
  "Anemia", "Cardiopatías", "Chagas",
  "Enf. Gástrica", "Hepatitis", "Tuberculosis",
  "Asma", "Diabetes", "VIH",
  "Epilepsia", "Hipertensión", "Ninguno",
];

const PREGUNTAS_ANAMNESIS = [
  { key: "enfermedad", pregunta: "¿Padece alguna enfermedad actualmente?", icon: HeartPulse },
  { key: "tratamiento", pregunta: "¿Ha estado en tratamiento médico en el último mes?", icon: Pill },
  { key: "medicamento", pregunta: "¿Toma algún medicamento?", icon: Syringe },
  { key: "alergia", pregunta: "¿Tiene alguna alergia?", icon: AlertTriangle },
  { key: "consultas", pregunta: "¿Ha acudido a consultas dentales en los últimos 6 meses?", icon: Smile },
  { key: "hemorragia", pregunta: "¿Tuvo hemorragia tras una extracción dental?", icon: Droplets },
  { key: "mal_habito", pregunta: "¿Padece algún mal hábito con la boca o dientes?", icon: Settings2 },
];

const PREGUNTAS_COVID = [
  { key: "sintomas", pregunta: "¿Ha tenido síntomas de COVID-19?", icon: ThermometerSun },
  { key: "contacto", pregunta: "¿Ha tenido contacto con paciente COVID-19?", icon: Radar },
  { key: "vacuna", pregunta: "¿Se aplicó la vacuna contra COVID-19?", icon: ShieldAlert },
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

const TITULOS_TOAST: Record<ToastTipo, string> = {
  exito: "Guardado",
  error: "Error al guardar",
  info: "Información",
  atencion: "Atención",
  recordatorio: "Recordatorio",
};

interface Props {
  pacienteId: number;
}

export default function HistoriaClinicaTab({ pacienteId }: Props) {
  const {
    datos, cargando, guardando, editando,
    entrarEdicion, cancelarEdicion, guardar, actualizarCampo,
  } = useHistoriaClinica(pacienteId);

  const { toast, mostrarToast, cerrarToast } = useToast();

  if (cargando || !datos) {
    return <p className="hc-estado">Cargando historia clínica...</p>;
  }

  const antPersonalesArr = datos.ant_personales
    ? datos.ant_personales.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const habitosArr = datos.habitos ? datos.habitos.split(",").map((s) => s.trim()) : [];

  async function handleGuardar() {
    try {
      await guardar();
      mostrarToast("La historia clínica se actualizó correctamente.", "exito");
    } catch {
      mostrarToast("No se pudieron guardar los cambios. Intentá de nuevo.", "error");
    }
  }

  return (
    <div>
      <div className="hc-wrapper">
      <div className="hc-header">
        <div className="hc-header-icono">
          <ClipboardList size={22} strokeWidth={2} />
        </div>
        <div className="hc-header-texto">
          <h2>Historia Clínica</h2>
          <p>Resumen de la información médica y odontológica del paciente.</p>
        </div>
      </div>

      {/* ---------- 1. Motivo de consulta ---------- */}
      <Seccion numero={1} titulo="Motivo de Consulta" subtitulo="Razón principal de la visita." icon={MessageCircleWarning} color="azul">
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
      </Seccion>

      {/* ---------- 2. Antecedentes Patológicos ---------- */}
      <Seccion numero={2} titulo="Antecedentes Patológicos" subtitulo="Información relevante del historial médico." icon={Users} color="morado">
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
              valor: antPersonalesArr.length ? antPersonalesArr.join(", ") : "Sin antecedentes",
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
                <RadioGroup name="renal" opciones={["Sí", "No"]} valor={datos.renal} onChange={(v) => actualizarCampo("renal", v)} />
              ),
            },
            {
              label: "Problemas de Coagulación",
              valor: datos.coagulacion,
              editor: (
                <RadioGroup name="coagulacion" opciones={["Sí", "No"]} valor={datos.coagulacion} onChange={(v) => actualizarCampo("coagulacion", v)} />
              ),
            },
          ]}
        />
      </Seccion>

      {/* ---------- 3. Anamnesis ---------- */}
      <Seccion numero={3} titulo="Anamnesis" subtitulo="Evaluación de la condición general del paciente." icon={ClipboardList} color="verde">
        <TablaPreguntas
          preguntas={PREGUNTAS_ANAMNESIS}
          respuestas={datos.anamnesis}
          editando={editando}
          onChange={(key, resp) => actualizarCampo("anamnesis", { ...datos.anamnesis, [key]: resp })}
        />
      </Seccion>

      {/* ---------- 4. COVID-19 ---------- */}
      <Seccion numero={4} titulo="COVID-19" subtitulo="Antecedentes relacionados con COVID-19." icon={ShieldAlert} color="naranja">
        <TablaPreguntas
          preguntas={PREGUNTAS_COVID}
          respuestas={datos.covid}
          editando={editando}
          onChange={(key, resp) => actualizarCampo("covid", { ...datos.covid, [key]: resp })}
        />
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
      </Seccion>

      {/* ---------- 5. Examen Clínico ---------- */}
      <Seccion numero={5} titulo="Examen Clínico" subtitulo="Hallazgos extraorales e intraorales." icon={Stethoscope} color="rosado">
        <CampoFila
          editando={editando}
          columnas={[
            {
              label: "A.T.M.",
              valor: datos.extraoral_atm,
              editor: <input type="text" value={datos.extraoral_atm} onChange={(e) => actualizarCampo("extraoral_atm", e.target.value)} />,
            },
            {
              label: "Labios",
              valor: datos.extraoral_labios,
              editor: <input type="text" value={datos.extraoral_labios} onChange={(e) => actualizarCampo("extraoral_labios", e.target.value)} />,
            },
          ]}
        />
        <CampoFila
          editando={editando}
          columnas={[
            {
              label: "Ganglios Linfáticos",
              valor: datos.extraoral_ganglios,
              editor: <input type="text" value={datos.extraoral_ganglios} onChange={(e) => actualizarCampo("extraoral_ganglios", e.target.value)} />,
            },
            {
              label: "Respirador",
              valor: datos.respirador,
              editor: (
                <RadioGroup name="respirador" opciones={["Nasal", "Bucal", "Buconasal"]} valor={datos.respirador} onChange={(v) => actualizarCampo("respirador", v)} />
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
                    onChange={(e) => actualizarCampo("intraoral", { ...datos.intraoral, [key]: e.target.value })}
                  />
                ),
              }))}
            />
          );
        })}
      </Seccion>

      {/* ---------- 6. Antecedentes Bucodentales e Higiene ---------- */}
      <Seccion numero={6} titulo="Antecedentes Bucodentales e Higiene" subtitulo="Hábitos de higiene y cuidado dental." icon={Sparkles} color="azul">
        <CampoFila
          editando={editando}
          columnas={[
            {
              label: "Última visita al odontólogo",
              valor: datos.ultima_visita,
              editor: (
                <input type="text" placeholder="DD/MM/AAAA" value={datos.ultima_visita} onChange={(e) => actualizarCampo("ultima_visita", e.target.value)} />
              ),
            },
            {
              label: "Utiliza Prótesis Dental",
              valor: datos.protesis,
              editor: <RadioGroup name="protesis" opciones={["Sí", "No"]} valor={datos.protesis} onChange={(v) => actualizarCampo("protesis", v)} />,
            },
          ]}
        />
        <CampoFila
          editando={editando}
          columnas={[
            {
              label: "Hábitos",
              valor: habitosArr.length ? habitosArr.join(", ") : "Ninguno",
              editor: <CheckboxGroup opciones={HABITOS_OPCIONES} seleccion={habitosArr} onChange={(sel) => actualizarCampo("habitos", sel.join(", "))} />,
            },
            {
              label: "Otros hábitos",
              valor: datos.habitos_otros,
              editor: (
                <input type="text" placeholder="Otros hábitos…" value={datos.habitos_otros} onChange={(e) => actualizarCampo("habitos_otros", e.target.value)} />
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
              editor: <RadioGroup name="cepillo" opciones={["Sí", "No"]} valor={datos.cepillo} onChange={(v) => actualizarCampo("cepillo", v)} />,
            },
            {
              label: "Utiliza Hilo Dental",
              valor: datos.hilo,
              editor: <RadioGroup name="hilo" opciones={["Sí", "No"]} valor={datos.hilo} onChange={(v) => actualizarCampo("hilo", v)} />,
            },
            {
              label: "Utiliza Enjuague Bucal",
              valor: datos.enjuague,
              editor: <RadioGroup name="enjuague" opciones={["Sí", "No"]} valor={datos.enjuague} onChange={(v) => actualizarCampo("enjuague", v)} />,
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
                <input type="text" placeholder="Ej: 3 veces al día" value={datos.frecuencia} onChange={(e) => actualizarCampo("frecuencia", e.target.value)} />
              ),
            },
            {
              label: "Sangrado de encías al cepillar",
              valor: datos.sangrado,
              editor: <RadioGroup name="sangrado" opciones={["Sí", "No"]} valor={datos.sangrado} onChange={(v) => actualizarCampo("sangrado", v)} />,
            },
            {
              label: "Higiene Dental",
              valor: datos.higiene_dental,
              editor: (
                <RadioGroup name="higiene_dental" opciones={["Buena", "Regular", "Mala"]} valor={datos.higiene_dental} onChange={(v) => actualizarCampo("higiene_dental", v)} />
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
      </Seccion>

      {/* ---------- 7. Observaciones ---------- */}
      <Seccion numero={7} titulo="Observaciones" subtitulo="Notas clínicas adicionales." icon={ClipboardList} color="morado">
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
      </Seccion>

      <div className="hc-footer">
        <div className="hc-footer-botones">
          {editando ? (
            <>
              <button className="od-btn-secondary" onClick={cancelarEdicion} disabled={guardando}>
                <X size={15} strokeWidth={2} />
                Cancelar
              </button>
              <button className="od-btn-primary" onClick={handleGuardar} disabled={guardando}>
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

      {toast && (
        <Toast
          key={toast.key}
          titulo={TITULOS_TOAST[toast.tipo]}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={cerrarToast}
        />
      )}
    </div>
  );
}