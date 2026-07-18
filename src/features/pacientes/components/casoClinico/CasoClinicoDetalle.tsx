import { useState } from "react";
import { ArrowLeft, FileText, ListChecks, Activity, StickyNote, Image as ImageIcon } from "lucide-react";
import type { CasoClinico } from "../../types/casoClinico";
import {
  ESTADO_LABEL,
  ESTADO_PILL_CLASS,
  SEVERIDAD_LABEL,
  SEVERIDAD_CLASS,
} from "../../utils/casoClinicoEstilos";
import DetalleDiagnostico from "./detalle/DetalleDiagnostico";
import DetallePlanTratamiento from "./detalle/DetallePlanTratamiento";
import DetalleEvolucion from "./detalle/DetalleEvolucion";
import DetalleObservaciones from "./detalle/DetalleObservaciones";
import DetalleEvidencias from "./detalle/DetalleEvidencias";

type SubTab = "diagnostico" | "tratamiento" | "evolucion" | "observaciones" | "evidencias";

const SUB_TABS: { key: SubTab; label: string; icon: typeof FileText }[] = [
  { key: "diagnostico", label: "Diagnóstico", icon: FileText },
  { key: "tratamiento", label: "Plan de tratamiento", icon: ListChecks },
  { key: "evolucion", label: "Evolución", icon: Activity },
  { key: "observaciones", label: "Observaciones", icon: StickyNote },
  { key: "evidencias", label: "Evidencias", icon: ImageIcon },
];

interface CasoClinicoDetalleProps {
  caso: CasoClinico;
  onVolver: () => void;
  onUpdate: (caso: CasoClinico) => void;
}

export default function CasoClinicoDetalle({ caso, onVolver, onUpdate }: CasoClinicoDetalleProps) {
  const [subTab, setSubTab] = useState<SubTab>("diagnostico");

  return (
    <div>
      <div className="ccd-header">
        <div className="ccd-header-izq">
          <button className="ccd-btn-volver" onClick={onVolver} type="button" aria-label="Volver">
            <ArrowLeft size={16} />
          </button>
          <div className="ccd-header-texto">
            <h2>{caso.titulo}</h2>
            {caso.descripcion && <p>{caso.descripcion}</p>}
            <div className="ccd-header-meta">
              <span className="cc-pill-especialidad">{caso.especialidad}</span>
              <span className="cc-doctor">{caso.doctor}</span>
            </div>
          </div>
        </div>
        <div className="ccd-header-der">
          <span className={`cc-status-pill ${ESTADO_PILL_CLASS[caso.estado]}`}>
            {ESTADO_LABEL[caso.estado]}
          </span>
          <span className={`cc-severidad ${SEVERIDAD_CLASS[caso.severidad]}`}>
            Severidad: {SEVERIDAD_LABEL[caso.severidad]}
          </span>
        </div>
      </div>

      <div className="ccd-tabs">
        {SUB_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`ccd-tab${subTab === key ? " is-active" : ""}`}
            onClick={() => setSubTab(key)}
            type="button"
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {subTab === "diagnostico" && <DetalleDiagnostico caso={caso} onUpdate={onUpdate} />}
      {subTab === "tratamiento" && <DetallePlanTratamiento caso={caso} onUpdate={onUpdate} />}
      {subTab === "evolucion" && <DetalleEvolucion caso={caso} onUpdate={onUpdate} />}
      {subTab === "observaciones" && <DetalleObservaciones caso={caso} onUpdate={onUpdate} />}
      {subTab === "evidencias" && <DetalleEvidencias caso={caso} onUpdate={onUpdate} />}
    </div>
  );
}