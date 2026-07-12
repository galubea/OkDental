import { useState } from "react";
import { X, TriangleAlert } from "lucide-react";
import type { NuevoRegistroClinicoInput, RegistroClinico } from "../../types/registroClinico";

interface Props {
  onClose: () => void;
  onGuardar: (input: NuevoRegistroClinicoInput) => Promise<boolean>;
  guardando: boolean;
  registroEditando?: RegistroClinico | null;
}

export function NuevoRegistroModal({ onClose, onGuardar, guardando, registroEditando }: Props) {
  const esEdicion = !!registroEditando;

  const [fecha, setFecha] = useState(() => registroEditando?.fecha ?? new Date().toISOString().slice(0, 10));
  const [titulo, setTitulo] = useState(registroEditando?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(registroEditando?.descripcion ?? "");
  const [error, setError] = useState("");

  async function handleGuardar() {
    if (!titulo.trim() || !fecha) {
      setError("Fecha y título son obligatorios.");
      return;
    }
    setError("");
    const ok = await onGuardar({ fecha, titulo: titulo.trim(), descripcion: descripcion.trim() });
    if (ok) onClose();
  }

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <h2>{esEdicion ? "Editar Registro" : "Agregar Registro"}</h2>
        <p className="od-subtitle">Anota lo que se hizo o se observó en esta visita.</p>
        <hr className="od-divider" />

        <div className="od-field-row">
          <div className="od-field">
            <label>
              Fecha<span className="req">*</span>
            </label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>
              Título<span className="req">*</span>
            </label>
            <input
              placeholder="Ej: Gingivitis"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>Descripción</label>
            <textarea
              className="rc-textarea"
              placeholder="Ej: Inflamación leve observada en cuadrante inferior"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="od-error">
            <TriangleAlert size={14} strokeWidth={2} />
            {error}
          </p>
        )}

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="od-btn-primary" onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Guardar Registro"}
          </button>
        </div>
      </div>
    </div>
  );
}