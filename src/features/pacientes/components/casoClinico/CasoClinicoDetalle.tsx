import { useState } from "react";
import {
  ArrowLeft,
  Stethoscope,
  Grid3x3,
  ClipboardList,
  CalendarClock,
  Activity,
  MessageSquareText,
  Image as ImageIcon,
} from "lucide-react";
import type { CasoClinico, EstadoCaso } from "../../types/casoClinico";
import { ESTADO_LABEL, SEVERIDAD_LABEL, SEVERIDAD_CLASS } from "../../utils/casoClinicoEstilos";
import type { CatalogoTratamientoResumen } from "../../hooks/useCasoClinico";
import DetalleDiagnostico from "./detalle/DetalleDiagnostico";
import DetallePlanTratamiento from "./detalle/DetallePlanTratamiento";
import DetalleEvolucion from "./detalle/DetalleEvolucion";
import DetalleObservaciones from "./detalle/DetalleObservaciones";
import DetalleEvidencias from "./detalle/DetalleEvidencias";
import DetalleCitasRelacionadas from "./detalle/DetalleCitasRelacionadas";

const ESTADOS: EstadoCaso[] = ["activo", "en_tratamiento", "resuelto"];

const TABS = [
  { key: "diagnostico", label: "Diagnóstico", icono: Stethoscope },
  { key: "plan", label: "Tratamiento", icono: ClipboardList },
  { key: "citas", label: "Citas", icono: CalendarClock },
  { key: "evolucion", label: "Evolución", icono: Activity },
  { key: "observaciones", label: "Observaciones", icono: MessageSquareText },
  { key: "evidencias", label: "Evidencias", icono: ImageIcon },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface CasoClinicoDetalleProps {
  caso: CasoClinico;
  catalogo: CatalogoTratamientoResumen[];
  onVolver: () => void;
  onCambiarEstado: (casoId: string, estado: EstadoCaso) => Promise<void>;
  onGuardarDiagnostico: (casoId: string, diagnostico: string, piezas: number[]) => Promise<void>;
  onAgregarPaso: (
    casoId: string,
    input: { descripcion: string; diente?: string; catalogoTratId?: string; precio?: number }
  ) => Promise<void>;
  onTogglePaso: (casoId: string, pasoId: string) => Promise<void>;
  onBorrarPaso: (casoId: string, pasoId: string) => Promise<void>;
  onAgregarEvolucion: (casoId: string, titulo: string, descripcion: string) => Promise<void>;
  onAgregarObservacion: (casoId: string, texto: string) => Promise<void>;
  onAgregarEvidencia: (casoId: string, ruta: string, etiqueta: string) => Promise<void>;
  onBorrarEvidencia: (casoId: string, evidenciaId: string) => Promise<void>;
}

export default function CasoClinicoDetalle({
  caso,
  catalogo,
  onVolver,
  onCambiarEstado,
  onGuardarDiagnostico,
  onAgregarPaso,
  onTogglePaso,
  onBorrarPaso,
  onAgregarEvolucion,
  onAgregarObservacion,
  onAgregarEvidencia,
  onBorrarEvidencia,
}: CasoClinicoDetalleProps) {
  const [tab, setTab] = useState<TabKey>("diagnostico");
  const pasosCompletados = caso.planTratamiento.filter((p) => p.completado).length;

  return (
    <div>
      <div className="ccd-header">
        <div className="ccd-header-izq">
          <button className="ccd-btn-volver" onClick={onVolver} type="button" aria-label="Volver">
            <ArrowLeft size={16} />
          </button>
          <div className={`ccd-icono ccd-icono--${caso.estado}`}>
            <Stethoscope size={22} />
          </div>
          <div className="ccd-header-texto">
            <h2>{caso.titulo}</h2>
            {caso.descripcion && <p>{caso.descripcion}</p>}
            <div className="ccd-header-meta">
              <span className="cc-pill-especialidad">{caso.especialidad}</span>
              <span className="cc-doctor">{caso.doctorNombre}</span>
            </div>
          </div>
        </div>
        <div className="ccd-header-der">
          <select
            className="cc-form-select"
            style={{ width: "auto" }}
            value={caso.estado}
            onChange={(e) => onCambiarEstado(caso.id, e.target.value as EstadoCaso)}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABEL[estado]}
              </option>
            ))}
          </select>
          <span className={`cc-severidad ${SEVERIDAD_CLASS[caso.severidad]}`}>
            Severidad: {SEVERIDAD_LABEL[caso.severidad]}
          </span>
        </div>
      </div>

      <div className="ccd-stats-row">
        <div className="ccd-stat">
          <div className="ccd-stat-icono ccd-stat-icono--piezas">
            <Grid3x3 size={17} />
          </div>
          <div className="ccd-stat-texto">
            <span className="ccd-stat-valor">{caso.piezas.length}</span>
            <span className="ccd-stat-label">Piezas afectadas</span>
          </div>
        </div>

        <div className="ccd-stat">
          <div className="ccd-stat-icono ccd-stat-icono--tratamientos">
            <ClipboardList size={17} />
          </div>
          <div className="ccd-stat-texto">
            <span className="ccd-stat-valor">{caso.planTratamiento.length}</span>
            <span className="ccd-stat-label">Tratamientos</span>
          </div>
        </div>

        <div className="ccd-stat">
          <div
            className="ccd-stat-ring"
            style={{
              background: `conic-gradient(var(--od-primary) ${caso.progreso * 3.6}deg, var(--od-border) 0deg)`,
            }}
          >
            <div className="ccd-stat-ring-inner">{caso.progreso}%</div>
          </div>
          <div className="ccd-stat-texto">
            <span className="ccd-stat-valor">
              {pasosCompletados} de {caso.planTratamiento.length}
            </span>
            <span className="ccd-stat-label">Completados</span>
          </div>
        </div>

        <div className="ccd-stat">
          <div className="ccd-stat-icono ccd-stat-icono--citas">
            <CalendarClock size={17} />
          </div>
          <div className="ccd-stat-texto">
            <span className="ccd-stat-valor">{caso.citas.length}</span>
            <span className="ccd-stat-label">Citas relacionadas</span>
          </div>
        </div>
      </div>

      <div className="ccd-tabs">
        {TABS.map((t) => {
          const TabIcono = t.icono;
          return (
            <button
              key={t.key}
              className={`ccd-tab${tab === t.key ? " is-active" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              <TabIcono size={14} />
              {t.label}
              {t.key === "plan" && <span className="cc-tab-count">{caso.planTratamiento.length}</span>}
              {t.key === "citas" && <span className="cc-tab-count">{caso.citas.length}</span>}
              {t.key === "evidencias" && <span className="cc-tab-count">{caso.evidencias.length}</span>}
            </button>
          );
        })}
      </div>

      <div className="ccd-tab-panel">
        {tab === "diagnostico" && <DetalleDiagnostico caso={caso} onGuardar={onGuardarDiagnostico} />}

        {tab === "plan" && (
          <DetallePlanTratamiento
            caso={caso}
            catalogo={catalogo}
            onAgregar={onAgregarPaso}
            onToggle={onTogglePaso}
            onBorrar={onBorrarPaso}
          />
        )}

        {tab === "citas" && <DetalleCitasRelacionadas caso={caso} />}

        {tab === "evolucion" && <DetalleEvolucion caso={caso} onAgregar={onAgregarEvolucion} />}

        {tab === "observaciones" && <DetalleObservaciones caso={caso} onAgregar={onAgregarObservacion} />}

        {tab === "evidencias" && (
          <DetalleEvidencias caso={caso} onAgregar={onAgregarEvidencia} onBorrar={onBorrarEvidencia} />
        )}
      </div>
    </div>
  );
}
