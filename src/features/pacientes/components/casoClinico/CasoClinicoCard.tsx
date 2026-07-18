import { Calendar } from "lucide-react";
import type { CasoClinico } from "../../types/casoClinico";
import {
  ESTADO_LABEL,
  ESTADO_PILL_CLASS,
  ESTADO_CARD_CLASS,
  SEVERIDAD_LABEL,
  SEVERIDAD_CLASS,
} from "../../utils/casoClinicoEstilos";

const MAX_CHIPS_VISIBLES = 6;

function formatFecha(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "long", year: "numeric" });
}

interface CasoClinicoCardProps {
  caso: CasoClinico;
  onClick?: (caso: CasoClinico) => void;
}

export default function CasoClinicoCard({ caso, onClick }: CasoClinicoCardProps) {
  const piezasVisibles = caso.piezas.slice(0, MAX_CHIPS_VISIBLES);
  const piezasRestantes = caso.piezas.length - piezasVisibles.length;

  return (
    <div
      className={`cc-card ${ESTADO_CARD_CLASS[caso.estado]}`}
      onClick={() => onClick?.(caso)}
      role="button"
      tabIndex={0}
    >
      <div className="cc-card-item-header">
        <div>
          <h3 className="cc-card-titulo">{caso.titulo}</h3>
          {caso.descripcion && <p className="cc-card-descripcion">{caso.descripcion}</p>}
        </div>
        <span className={`cc-status-pill ${ESTADO_PILL_CLASS[caso.estado]}`}>
          {ESTADO_LABEL[caso.estado]}
        </span>
      </div>

      <div className="cc-card-meta">
        <div className="cc-meta-izq">
          <span className="cc-pill-especialidad">{caso.especialidad}</span>
          <span className="cc-doctor">{caso.doctor}</span>
        </div>
        <span className={`cc-severidad ${SEVERIDAD_CLASS[caso.severidad]}`}>
          {SEVERIDAD_LABEL[caso.severidad]}
        </span>
      </div>

      <div className="cc-piezas">
        {piezasVisibles.map((pieza) => (
          <span key={pieza} className="cc-pieza-chip">
            {pieza}
          </span>
        ))}
        {piezasRestantes > 0 && <span className="cc-piezas-mas">+{piezasRestantes} más</span>}
      </div>

      <div className="cc-progreso-row">
        <div className="cc-progreso-track">
          <div className="cc-progreso-fill" style={{ width: `${caso.progreso}%` }} />
        </div>
        <span className="cc-progreso-pct">{caso.progreso}%</span>
      </div>

      <div className="cc-card-footer">
        <span className="cc-footer-fecha">
          <Calendar size={13} />
          {formatFecha(caso.fechaObjetivo)}
        </span>
        <span>Creado: {formatFecha(caso.fechaCreacion)}</span>
      </div>
    </div>
  );
}