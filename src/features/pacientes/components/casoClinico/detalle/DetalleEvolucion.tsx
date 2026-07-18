import { useState } from "react";
import type { CasoClinico, EntradaEvolucion } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onUpdate: (caso: CasoClinico) => void;
}

function formatFecha(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export default function DetalleEvolucion({ caso, onUpdate }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const entradas = caso.evolucion;

  const agregar = () => {
    if (!titulo.trim()) return;
    const nueva: EntradaEvolucion = {
      id: `evo_${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
    };
    onUpdate({ ...caso, evolucion: [nueva, ...entradas] });
    setTitulo("");
    setDescripcion("");
  };

  return (
    <div>
      <div className="ccd-nuevo-registro" style={{ marginBottom: 24 }}>
        <div className="cc-form-grupo" style={{ marginBottom: 10 }}>
          <input
            className="cc-form-input"
            type="text"
            placeholder="Título de la evolución (ej. Control post-tratamiento)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="cc-form-grupo" style={{ marginBottom: 10 }}>
          <textarea
            className="cc-form-textarea"
            placeholder="Describe el avance del caso..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="cc-btn-primario" type="button" onClick={agregar}>
            Registrar evolución
          </button>
        </div>
      </div>

      {entradas.length === 0 ? (
        <p style={{ color: "var(--od-subtext)", fontSize: 13.5 }}>Aún no hay registros de evolución.</p>
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
                <p className="ccd-timeline-titulo">{entrada.titulo}</p>
                {entrada.descripcion && <p className="ccd-timeline-texto">{entrada.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}