import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAgenda } from "./hooks/useAgenda";
import { FiltroDoctores } from "./components/agenda/FiltroDoctores";
import { VistaSemana } from "./components/agenda/VistaSemana";
import { VistaMes } from "./components/agenda/VistaMes";
import { VistaLista } from "./components/agenda/VistaLista";
import { PanelHoy } from "./components/agenda/PanelHoy";
import { ModalNuevaCitaAgenda } from "./components/agenda/ModalNuevaCitaAgenda";
import type { CitaAgendaVista, VistaAgenda } from "./types/agenda";
import { useState } from "react";
import "./styles/agenda.css";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatearRango(vista: VistaAgenda, fechaRef: Date, diasSemana: Date[]): string {
  if (vista === "mes") return `${MESES[fechaRef.getMonth()]} ${fechaRef.getFullYear()}`;
  if (vista === "semana") {
    const inicio = diasSemana[0], fin = diasSemana[6];
    const mismoMes = inicio.getMonth() === fin.getMonth();
    return mismoMes
      ? `${inicio.getDate()} - ${fin.getDate()} de ${MESES[inicio.getMonth()]}, ${inicio.getFullYear()}`
      : `${inicio.getDate()} ${MESES[inicio.getMonth()]} - ${fin.getDate()} ${MESES[fin.getMonth()]}, ${fin.getFullYear()}`;
  }
  return fechaRef.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

export default function AgendaTab() {
  const {
    citas, citasHoy, cargando, guardando,
    vista, setVista, fechaRef, diasSemana,
    doctorFiltro, setDoctorFiltro,
    irHoy, avanzar, retroceder, totalCitasSemana,
    modalNuevaCitaAbierto, prellenado, abrirModalNuevaCita, cerrarModalNuevaCita, agendar,
  } = useAgenda();

  const [citaActiva, setCitaActiva] = useState<CitaAgendaVista | null>(null);

  if (cargando) return <p className="hc-estado">Cargando agenda...</p>;

  return (
    <div className="ag-card">
      <div className="ag-header">
        <div className="ag-header-izquierda">
          <span className="ag-header-icono"><Calendar size={20} strokeWidth={2} /></span>
          <div>
            <h2 className="ag-titulo">Agenda</h2>
            <p className="ag-subtitulo">{totalCitasSemana} citas esta semana</p>
          </div>
        </div>

        <div className="ag-header-derecha">
          <div className="ag-vista-toggle">
            <button className={`ag-vista-btn ${vista === "semana" ? "activo" : ""}`} onClick={() => setVista("semana")}>Semana</button>
            <button className={`ag-vista-btn ${vista === "mes" ? "activo" : ""}`} onClick={() => setVista("mes")}>Mes</button>
            <button className={`ag-vista-btn ${vista === "lista" ? "activo" : ""}`} onClick={() => setVista("lista")}>Lista</button>
          </div>

          <div className="ag-nav-fecha">
            <button className="ag-nav-flecha" onClick={retroceder}><ChevronLeft size={17} strokeWidth={2} /></button>
            <button className="ag-nav-hoy" onClick={irHoy}>Hoy</button>
            <button className="ag-nav-flecha" onClick={avanzar}><ChevronRight size={17} strokeWidth={2} /></button>
          </div>

          <span className="ag-rango-texto">{formatearRango(vista, fechaRef, diasSemana)}</span>

          <button className="od-btn-primary" onClick={() => abrirModalNuevaCita()}>
            <Plus size={15} strokeWidth={2} />
            Nueva Cita
          </button>
        </div>
      </div>

      <FiltroDoctores doctorFiltro={doctorFiltro} onCambiar={setDoctorFiltro} />

      <div className={`ag-contenido ${vista !== "lista" ? "con-panel" : ""}`}>
        <div className="ag-vista-principal">
          {vista === "semana" && (
            <VistaSemana
              dias={diasSemana}
              citas={citas}
              onSeleccionar={setCitaActiva}
              onCeldaClick={(fecha, hora) => abrirModalNuevaCita({ fecha, hora })}
            />
          )}
          {vista === "mes" && <VistaMes fechaRef={fechaRef} citas={citas} onSeleccionar={setCitaActiva} />}
          {vista === "lista" && <VistaLista citas={citas} onSeleccionar={setCitaActiva} />}
        </div>

        {vista !== "lista" && <PanelHoy citasHoy={citasHoy} onSeleccionar={setCitaActiva} />}
      </div>

      {citaActiva && (
        <div className="odo-modal-overlay" onClick={() => setCitaActiva(null)}>
          <div className="ag-detalle-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3 className="cit-modal-titulo">{citaActiva.pacienteNombre}</h3>
            <p className="ag-detalle-motivo">{citaActiva.motivo}</p>
            <p className="ag-detalle-linea">{citaActiva.fecha} · {citaActiva.horaInicio} · {citaActiva.duracionMin} min</p>
            <div className="cit-modal-footer">
              <button className="cit-btn-secundario" onClick={() => setCitaActiva(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {modalNuevaCitaAbierto && (
        <ModalNuevaCitaAgenda
          prellenado={prellenado}
          guardando={guardando}
          onCancelar={cerrarModalNuevaCita}
          onAgendar={agendar}
        />
      )}
    </div>
  );
}