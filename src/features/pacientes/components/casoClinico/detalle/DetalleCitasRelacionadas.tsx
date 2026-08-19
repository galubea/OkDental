import { Calendar, Clock } from "lucide-react";
import type { CasoClinico } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
}

const ESTADO_LABEL_CITA: Record<string, string> = {
  programada: "Programada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

function formatFecha(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DetalleCitasRelacionadas({ caso }: Props) {
  const citas = caso.citas;

  return (
    <div>
      <p className="ccd-seccion-titulo" style={{ marginTop: 0 }}>
        Citas del paciente
      </p>
      {citas.length === 0 ? (
        <p style={{ color: "var(--od-subtext)", fontSize: 13.5 }}>
          Este paciente aún no tiene citas registradas.
        </p>
      ) : (
        <div className="ccd-timeline">
          {citas.map((cita, i) => {
            const saldo = cita.total - cita.pagado;
            return (
              <div className="ccd-timeline-item" key={cita.id}>
                <div className="ccd-timeline-punto-col">
                  <div className="ccd-timeline-punto ccd-timeline-punto--cita" />
                  {i < citas.length - 1 && <div className="ccd-timeline-linea" />}
                </div>
                <div className="ccd-timeline-contenido">
                  <span className="ccd-timeline-fecha" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={12} /> {formatFecha(cita.fecha)}
                    <Clock size={12} style={{ marginLeft: 8 }} /> {cita.hora}
                  </span>
                  <p className="ccd-timeline-titulo">{cita.motivo || "Consulta"}</p>
                  <p className="ccd-timeline-texto">
                    {ESTADO_LABEL_CITA[cita.estado] ?? cita.estado} · {cita.doctorNombre} · Total Bs{" "}
                    {cita.total.toFixed(2)}
                    {saldo > 0 ? ` · Saldo pendiente Bs ${saldo.toFixed(2)}` : " · Pagado"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
