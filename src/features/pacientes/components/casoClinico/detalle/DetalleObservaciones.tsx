import { useState } from "react";
import type { CasoClinico } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onAgregar: (casoId: string, texto: string) => Promise<void>;
}

function formatFecha(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export default function DetalleObservaciones({ caso, onAgregar }: Props) {
  const [texto, setTexto] = useState("");
  const entradas = caso.observaciones;

  const agregar = async () => {
    if (!texto.trim()) return;
    await onAgregar(caso.id, texto.trim());
    setTexto("");
  };

  return (
    <div>
      <p className="ccd-seccion-titulo" style={{ marginTop: 0 }}>
        Observaciones
      </p>

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
                <div className="ccd-timeline-punto ccd-timeline-punto--observacion" />
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
