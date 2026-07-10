import { useEffect, useState } from "react";
import type { CitaAgendaVista } from "../../types/agenda";
import { DOCTORES } from "../../utils/doctoresMock";

interface Props {
  dias: Date[];
  citas: CitaAgendaVista[];
  onSeleccionar: (cita: CitaAgendaVista) => void;
  onCeldaClick: (fecha: string, hora: string) => void; 
}

const HORA_INICIO = 8;
const HORA_FIN = 19;
const PX_POR_HORA = 60;
const PX_POR_MIN = PX_POR_HORA / 60;

function aISO(fecha: Date) { return fecha.toISOString().slice(0, 10); }
function minutosDesdeInicio(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return (h - HORA_INICIO) * 60 + m;
}
function colorDoctor(doctorId: string | null): string {
  return DOCTORES.find((d) => d.id === doctorId)?.color ?? "#94a3b8";
}

function asignarCarriles(citas: CitaAgendaVista[]) {
  const ordenadas = [...citas].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  const carriles: { finMin: number }[] = [];
  const resultado: { cita: CitaAgendaVista; carril: number }[] = [];
  ordenadas.forEach((cita) => {
    const inicio = minutosDesdeInicio(cita.horaInicio);
    const fin = inicio + cita.duracionMin;
    let carrilIdx = carriles.findIndex((c) => c.finMin <= inicio);
    if (carrilIdx === -1) { carrilIdx = carriles.length; carriles.push({ finMin: fin }); }
    else carriles[carrilIdx].finMin = fin;
    resultado.push({ cita, carril: carrilIdx });
  });
  return { resultado, totalCarriles: carriles.length || 1 };
}

function useAhora() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  return ahora;
}

export function VistaSemana({ dias, citas, onSeleccionar, onCeldaClick }: Props) {
  const horas = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => HORA_INICIO + i);
  const hoyISO = aISO(new Date());
  const ahora = useAhora();
  const minutosAhora = (ahora.getHours() - HORA_INICIO) * 60 + ahora.getMinutes();
  const mostrarLineaAhora = minutosAhora >= 0 && minutosAhora <= (HORA_FIN - HORA_INICIO) * 60;

  function handleClickColumna(e: React.MouseEvent<HTMLDivElement>, iso: string) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const minutosTotales = offsetY / PX_POR_MIN;
    const minutosRedondeados = Math.round(minutosTotales / 30) * 30;
    const totalMin = HORA_INICIO * 60 + Math.max(0, minutosRedondeados);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    onCeldaClick(iso, `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }

  return (
    <div className="ag-semana-wrap">
      <div className="ag-semana">
        <div className="ag-semana-header">
          <div className="ag-semana-header-hueco" />
          {dias.map((d) => {
            const esHoy = aISO(d) === hoyISO;
            return (
              <div key={d.toISOString()} className={`ag-semana-dia-header ${esHoy ? "hoy" : ""}`}>
                <span className="ag-semana-dia-nombre">
                  {d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "").toUpperCase()}
                </span>
                <span className={`ag-semana-dia-numero ${esHoy ? "hoy" : ""}`}>{d.getDate()}</span>
              </div>
            );
          })}
        </div>

        <div className="ag-semana-body">
          <div className="ag-semana-horas">
            {horas.map((h) => (
              <div key={h} className="ag-semana-hora-label">
                {h % 12 === 0 ? 12 : h % 12} {h < 12 ? "a.m." : "p.m."}
              </div>
            ))}
          </div>

          {dias.map((d) => {
            const iso = aISO(d);
            const esHoy = iso === hoyISO;
            const citasDelDia = citas.filter((c) => c.fecha === iso);
            const { resultado, totalCarriles } = asignarCarriles(citasDelDia);

            return (
              <div
                key={iso}
                className={`ag-semana-col ${esHoy ? "hoy" : ""}`}
                style={{ height: (HORA_FIN - HORA_INICIO) * PX_POR_HORA }}
                onClick={(e) => handleClickColumna(e, iso)}
              >
                {esHoy && mostrarLineaAhora && (
                  <div className="ag-linea-ahora" style={{ top: minutosAhora * PX_POR_MIN }} />
                )}

                {resultado.map(({ cita, carril }) => {
                  const top = minutosDesdeInicio(cita.horaInicio) * PX_POR_MIN;
                  const height = Math.max(cita.duracionMin * PX_POR_MIN, 22);
                  const width = 100 / totalCarriles;
                  const left = carril * width;
                  const color = colorDoctor(cita.doctorId);
                  const compacto = height < 38;

                  return (
                    <button
                      key={cita.id}
                      className={`ag-evento ag-evento-${cita.estado} ${compacto ? "compacto" : ""}`}
                      style={{ top, height, width: `calc(${width}% - 3px)`, left: `${left}%`, background: color }}
                      onClick={(e) => { e.stopPropagation(); onSeleccionar(cita); }}
                      title={`${cita.pacienteNombre} · ${cita.motivo}`}
                    >
                      <span className="ag-evento-linea-principal">
                        <span className="ag-evento-paciente">{cita.pacienteNombre}</span>
                        {!compacto && <span className="ag-evento-motivo">· {cita.motivo}</span>}
                      </span>
                      {!compacto && (
                        <span className="ag-evento-hora">{cita.horaInicio} – {cita.duracionMin} min</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}