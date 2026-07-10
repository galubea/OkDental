import { ChevronRight } from "lucide-react";
import type { CitaAgendaVista } from "../../types/agenda";
import { DOCTORES } from "../../utils/agendaMock";

interface Props {
  citas: CitaAgendaVista[];
  onSeleccionar: (cita: CitaAgendaVista) => void;
}

const ETIQUETA_ESTADO: Record<CitaAgendaVista["estado"], string> = {
  programada: "Programada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

function colorDoctor(doctorId: string | null): string {
  return DOCTORES.find((d) => d.id === doctorId)?.color ?? "#94a3b8";
}
function nombreDoctor(doctorId: string | null): string {
  return DOCTORES.find((d) => d.id === doctorId)?.nombre ?? "";
}

function formatearEncabezado(fecha: string): string {
  const hoy = new Date();
  const hoyISO = hoy.toISOString().slice(0, 10);
  const d = new Date(fecha + "T00:00:00");
  const texto = d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  const capitalizado = texto.charAt(0).toUpperCase() + texto.slice(1);
  return fecha === hoyISO ? `Hoy · ${capitalizado}` : capitalizado;
}

export function VistaLista({ citas, onSeleccionar }: Props) {
  const porFecha = new Map<string, CitaAgendaVista[]>();
  [...citas]
    .sort((a, b) => (a.fecha + a.horaInicio).localeCompare(b.fecha + b.horaInicio))
    .forEach((c) => {
      if (!porFecha.has(c.fecha)) porFecha.set(c.fecha, []);
      porFecha.get(c.fecha)!.push(c);
    });

  if (citas.length === 0) {
    return <p className="ag-vacio">No hay citas programadas para este rango.</p>;
  }

  return (
    <div className="ag-lista">
      {Array.from(porFecha.entries()).map(([fecha, citasDelDia]) => (
        <div key={fecha} className="ag-lista-grupo">
          <h3 className="ag-lista-encabezado">{formatearEncabezado(fecha)}</h3>
          {citasDelDia.map((c) => (
            <div key={c.id} className="ag-lista-item" onClick={() => onSeleccionar(c)}>
              <div className="ag-lista-item-hora">
                <span className="ag-lista-item-hora-texto">{c.horaInicio}</span>
                <span className="ag-lista-item-duracion">{c.duracionMin} min</span>
              </div>
              <div className="ag-lista-item-info">
                <span className="ag-lista-item-paciente">{c.pacienteNombre}</span>
                <span className="ag-lista-item-motivo">{c.motivo}</span>
              </div>
              <span className={`cit-badge cit-badge-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
              <div className="ag-lista-item-doctor">
                <span className="ag-lista-item-doctor-dot" style={{ background: colorDoctor(c.doctorId) }} />
                {nombreDoctor(c.doctorId)}
              </div>
              <ChevronRight size={18} strokeWidth={2} className="ag-lista-item-chevron" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}