import { useState } from "react";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import type { DienteData, EstadoDental, SuperficieDental } from "../types";
import { ESTADOS_DENTALES } from "../odontogramaConstants";
import { FORMAS_DENTALES, tipoDeDiente, tipoDeDienteInfantil } from "../formasDentales";

interface Props {
  numero: string;
  diente: DienteData;
  colapsado: boolean;
  onToggleColapsar: () => void;
  onEstadoGeneral: (estado: EstadoDental) => void;
  onEstadoCara: (cara: SuperficieDental, estado: EstadoDental) => void;
  onReactivar: () => void;
  onResetear: () => void;
  onObservacionChange: (texto: string) => void;
  onAgregarAvance: (texto: string) => void;
  onCerrar: () => void;
  esInfantil?: boolean;
}

const CARAS: { key: SuperficieDental; label: string }[] = [
  { key: "vestibular", label: "Vestibular" },
  { key: "lingual", label: "Lingual" },
  { key: "mesial", label: "Mesial" },
  { key: "distal", label: "Distal" },
  { key: "oclusal", label: "Oclusal" },
];

function formatFechaCorta(fecha: string): string {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" });
}

function colorDe(estado: EstadoDental): string {
  const info = ESTADOS_DENTALES.find((e) => e.key === estado);
  return info && info.color !== "transparent" ? info.color : "#ffffff";
}

function DientePreview({ diente, esInfantil = false }: { diente: DienteData; esInfantil?: boolean }) {
  const { superficies, ausente, numero } = diente;
  const tipo = esInfantil ? tipoDeDienteInfantil(numero) : tipoDeDiente(numero);
  const forma = FORMAS_DENTALES[tipo];
  const caras: SuperficieDental[] = ["vestibular", "lingual", "mesial", "distal", "oclusal"];

  return (
    <svg viewBox={forma.viewBox} className="odo-panel-preview-svg">
      {caras.map((cara) => (
        <path
          key={cara}
          d={forma.paths[cara]}
          fill={colorDe(superficies[cara])}
          stroke={forma.strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={forma.strokeWidth}
        />
      ))}
      {ausente && (
        <line // línea diagonal simple, funciona en cualquier viewBox porque usa %
          x1="10%" y1="10%" x2="90%" y2="90%"
          stroke="#4a5568" strokeWidth="2%" strokeLinecap="round"
        />
      )}
    </svg>
  );
}
// Agrupa las caras afectadas por estado, para el resumen de texto.
function calcularResumen(diente: DienteData) {
  if (diente.ausente) return [{ label: "Diente ausente", color: "#CBD2D9", caras: [] as string[] }];

  const grupos: Record<string, string[]> = {};
  CARAS.forEach(({ key, label }) => {
    const estado = diente.superficies[key];
    if (estado === "sano") return;
    grupos[estado] = grupos[estado] ?? [];
    grupos[estado].push(label);
  });

  return Object.entries(grupos).map(([estado, caras]) => {
    const info = ESTADOS_DENTALES.find((e) => e.key === estado);
    return { label: info?.label ?? estado, color: info?.color ?? "#fff", caras };
  });
}

export function PanelDiente({
  numero, diente, colapsado, onToggleColapsar,
  onEstadoGeneral, onEstadoCara, onReactivar, onResetear,
  onObservacionChange, onAgregarAvance, onCerrar,
  esInfantil
}: Props) {
  const [textoNuevo, setTextoNuevo] = useState("");

  function handleAgregar() {
    if (!textoNuevo.trim()) return;
    onAgregarAvance(textoNuevo.trim());
    setTextoNuevo("");
  }

  const avancesOrdenados = [...diente.avances].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  const resumen = calcularResumen(diente);

  return (
    <div className={`odo-panel ${colapsado ? "odo-panel-colapsado" : ""}`}>
      <div className="odo-panel-header">
        <span className="odo-panel-titulo">Diente {numero}</span>
        <div className="odo-panel-header-acciones">
          <button className="odo-panel-icon-btn" onClick={onToggleColapsar} title={colapsado ? "Expandir" : "Colapsar"}>
            {colapsado ? <ChevronDown size={16} strokeWidth={2} /> : <ChevronUp size={16} strokeWidth={2} />}
          </button>
          <button className="odo-panel-icon-btn" onClick={onCerrar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {!colapsado && (
        <div className="odo-panel-body">
          {/* ---------- Vista previa ---------- */}
          <div className="odo-panel-preview">
            <DientePreview diente={diente} esInfantil={esInfantil} />
          </div>

          {/* ---------- Resumen ---------- */}
          <div className="odo-panel-seccion">
            <span className="odo-panel-subtitulo">Resumen</span>
            {resumen.length === 0 ? (
              <p className="odo-panel-resumen-vacio">Diente sano, sin hallazgos.</p>
            ) : (
              <div className="odo-panel-resumen-lista">
                {resumen.map((r, i) => (
                  <div key={i} className="odo-panel-resumen-fila">
                    <span
                      className="odo-panel-resumen-dot"
                      style={{ background: r.color === "transparent" ? "#e2e8f0" : r.color }}
                    />
                    <span>
                      <strong>{r.label}</strong>
                      {r.caras.length > 0 && `: ${r.caras.join(", ")}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {diente.ausente ? (
            <div className="odo-panel-ausente">
              <button className="odo-panel-reactivar" onClick={onReactivar}>Reactivar diente</button>
            </div>
          ) : (
            <>
              <div className="odo-panel-seccion">
                <span className="odo-panel-subtitulo">Estado general</span>
                <div className="odo-panel-swatches">
                  {ESTADOS_DENTALES.map((e) => (
                    <button
                      key={e.key}
                      className="odo-panel-swatch"
                      style={{ background: e.color === "transparent" ? "#fff" : e.color }}
                      onClick={() => onEstadoGeneral(e.key)}
                      title={e.label}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="odo-panel-seccion">
                <span className="odo-panel-subtitulo">Por superficie</span>
                {CARAS.map((c) => (
                  <div key={c.key} className="odo-panel-cara-row">
                    <span className="odo-panel-cara-label">{c.label}</span>
                    <div className="odo-panel-swatches-mini">
                      {ESTADOS_DENTALES.map((e) => (
                        <button
                          key={e.key}
                          className={`odo-panel-swatch-mini ${diente.superficies[c.key] === e.key ? "activo" : ""}`}
                          style={{ background: e.color === "transparent" ? "#fff" : e.color }}
                          onClick={() => onEstadoCara(c.key, e.key)}
                          title={e.label}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---------- Observación ---------- */}
          <div className="odo-panel-seccion">
            <span className="odo-panel-subtitulo">Observación</span>
            <textarea
              className="odo-panel-textarea"
              value={diente.observacion}
              onChange={(e) => onObservacionChange(e.target.value)}
              placeholder="Ej: Sensibilidad al frío, requiere endodoncia…"
              rows={2}
            />
          </div>

          {/* ---------- Avances ---------- */}
          <div className="odo-panel-seccion">
            <span className="odo-panel-subtitulo">Avances</span>

            <div className="odo-panel-avances-lista">
              {avancesOrdenados.length === 0 ? (
                <p className="odo-panel-avances-vacio">Sin avances registrados.</p>
              ) : (
                avancesOrdenados.map((a) => (
                  <div key={a.id} className="odo-panel-avance-item">
                    <span className="odo-panel-avance-fecha">{formatFechaCorta(a.fecha)}</span>
                    <p className="odo-panel-avance-texto">{a.texto}</p>
                  </div>
                ))
              )}
            </div>

            <div className="odo-panel-avance-nuevo">
              <textarea
                className="odo-panel-textarea"
                value={textoNuevo}
                onChange={(e) => setTextoNuevo(e.target.value)}
                placeholder="Ej: Se realizó obturación, próxima revisión en 3 meses…"
                rows={2}
              />
              <button className="odo-panel-agregar-avance" onClick={handleAgregar}>
                <Plus size={14} strokeWidth={2.4} />
                Agregar avance
              </button>
            </div>
          </div>

          <button className="odo-panel-resetear" onClick={onResetear}>↺ Restablecer diente</button>
        </div>
      )}
    </div>
  );
}