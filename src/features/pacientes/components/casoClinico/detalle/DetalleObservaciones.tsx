import { useState } from "react";
import type { CasoClinico, EntradaObservacion } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onUpdate: (caso: CasoClinico) => void;
}

function formatFecha(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export default function DetalleObservaciones({ caso, onUpdate }: Props) {
  const [texto, setTexto] = useState("");
  const entradas = caso.observaciones;

  const agregar = () => {
    if (!texto.trim()) return;
    const nueva: EntradaObservacion = {
      id: `obs_${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      texto: texto.trim(),
    };
    onUpdate({ ...caso, observaciones: [nueva, ...entradas] });
    setTexto("");
  };

  return (
    <div>
      <div className="ccd-nuevo-registro" style={{ marginBottom: 24 }}>
        <div className="cc-form-grupo" style={{ marginBottom: 10 }}>
          <textarea
            className="cc-form-textarea"
            placeholder="Escribe una observación (ej. Paciente reporta sensibilidad leve)"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="cc-btn-primario" type="button" onClick={agregar}>
            Agregar observación
          </button>
        </div>
      </div>

      {entradas.length === 0 ? (
        <p style={{ color: "var(--od-subtext)", fontSize: 13.5 }}>Aún no hay observaciones registradas.</p>
      ) : (
        <div className="ccd-timeline">
          {entradas.map((entrada, i) => (
            <div className="ccd-timeline-item" key={entrada.id}>
              <div className="ccd-timeline-punto-col">
                <div className="ccd-timeline-punto" />
                {i < entradas.length - 1 && <div className="ccd-timeline-linea" />}
              </div>
              <div className="ccd-timeline-contenido">
                <span className="ccd-timeline-fecha">{formatFecha(entrada.fecha)}</span>
                <p className="ccd-timeline-texto" style={{ marginTop: 4 }}>
                  {entrada.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}