import type { CitaAgendaVista } from "../../types/agenda";
import { DOCTORES } from "../../utils/agendaMock";

interface Props {
  citasHoy: CitaAgendaVista[];
  onSeleccionar: (cita: CitaAgendaVista) => void;
}

const ETIQUETA_ESTADO: Record<CitaAgendaVista["estado"], string> = {
  programada: "Programada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

function colorDoctor(doctorId: string | null): string {
  const doctor = DOCTORES.find((d) => d.id === doctorId);
  const color = doctor?.color;
  return color != null ? color : "#94a3b8";
}

export function PanelHoy({ citasHoy, onSeleccionar }: Props) {
  const hoyTexto = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  const capitalizado = hoyTexto.charAt(0).toUpperCase() + hoyTexto.slice(1);

  return (
    <div className="ag-panel-hoy">
      <span className="ag-panel-hoy-label">Hoy</span>
      <h3 className="ag-panel-hoy-fecha">{capitalizado}</h3>
      <p className="ag-panel-hoy-conteo">{citasHoy.length} {citasHoy.length === 1 ? "cita" : "citas"}</p>

      {citasHoy.length === 0 ? (
        <p className="ag-panel-hoy-vacio">No hay citas para hoy.</p>
      ) : (
        <div className="ag-panel-hoy-lista">
          {citasHoy.map((c) => (
            <div key={c.id} className="ag-panel-hoy-item" onClick={() => onSeleccionar(c)}>
              <div className="ag-panel-hoy-item-franja" style={{ background: colorDoctor(c.doctorId) }} />
              <div className="ag-panel-hoy-item-body">
                <div className="ag-panel-hoy-item-top">
                  <span className="ag-panel-hoy-item-hora">{c.horaInicio}</span>
                  <span className={`cit-badge cit-badge-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
                </div>
                <span className="ag-panel-hoy-item-paciente">{c.pacienteNombre}</span>
                <span className="ag-panel-hoy-item-motivo">{c.motivo}</span>
                <div className="ag-panel-hoy-item-footer">
                  <span className="ag-panel-hoy-item-doctor">
                    <span className="ag-lista-item-doctor-dot" style={{ background: colorDoctor(c.doctorId) }} />
                    {c.duracionMin} min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}