import type { CitaAgendaVista } from "../../types/agenda";
import { DOCTORES } from "../../utils/agendaMock";

interface Props {
  fechaRef: Date;
  citas: CitaAgendaVista[];
  onSeleccionar: (cita: CitaAgendaVista) => void;
}

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function aISO(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

function colorDoctor(doctorId: string | null): string {
  return DOCTORES.find((d) => d.id === doctorId)?.color ?? "#94a3b8";
}

function generarGrid(fechaRef: Date): Date[] {
  const primerDiaMes = new Date(fechaRef.getFullYear(), fechaRef.getMonth(), 1);
  const diaSemanaPrimero = primerDiaMes.getDay();
  const offsetInicio = diaSemanaPrimero === 0 ? 6 : diaSemanaPrimero - 1;
  const inicioGrid = new Date(primerDiaMes);
  inicioGrid.setDate(inicioGrid.getDate() - offsetInicio);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicioGrid);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function VistaMes({ fechaRef, citas, onSeleccionar }: Props) {
  const dias = generarGrid(fechaRef);
  const mesActual = fechaRef.getMonth();
  const hoyISO = aISO(new Date());

  return (
    <div className="ag-mes">
      <div className="ag-mes-header">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="ag-mes-header-dia">{d}</div>
        ))}
      </div>
      <div className="ag-mes-grid">
        {dias.map((d) => {
          const iso = aISO(d);
          const esDelMes = d.getMonth() === mesActual;
          const esHoy = iso === hoyISO;
          const citasDelDia = citas
            .filter((c) => c.fecha === iso)
            .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
          const visibles = citasDelDia.slice(0, 3);
          const restantes = citasDelDia.length - visibles.length;

          return (
            <div key={iso} className={`ag-mes-celda ${esDelMes ? "" : "fuera-de-mes"}`}>
              <span className={`ag-mes-numero ${esHoy ? "hoy" : ""}`}>{d.getDate()}</span>
              <div className="ag-mes-eventos">
                {visibles.map((c) => (
                  <button
                    key={c.id}
                    className="ag-mes-chip"
                    onClick={() => onSeleccionar(c)}
                    title={`${c.pacienteNombre} · ${c.motivo}`}
                  >
                    <span className="ag-mes-chip-dot" style={{ background: colorDoctor(c.doctorId) }} />
                    <span className="ag-mes-chip-hora">{c.horaInicio}</span>
                    <span className="ag-mes-chip-nombre">{c.pacienteNombre}</span>
                  </button>
                ))}
                {restantes > 0 && <span className="ag-mes-mas">+{restantes} más</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}