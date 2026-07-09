import { useState } from "react";
import { X } from "lucide-react";
import type { NuevoTratamientoInput } from "../../types/citas";

interface Props {
  onCancelar: () => void;
  onAgregar: (input: NuevoTratamientoInput) => void;
}

export function ModalNuevoTratamiento({ onCancelar, onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [diente, setDiente] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const puedeAgregar = nombre.trim() !== "" && cantidad > 0 && precioUnitario >= 0;

  function handleAgregar() {
    if (!puedeAgregar) return;
    onAgregar({
      nombre: nombre.trim(),
      diente: diente.trim() || undefined,
      cantidad,
      precioUnitario,
    });
  }

  return (
    <div className="odo-modal-overlay" onClick={onCancelar}>
      <div className="cit-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-header">
          <h3 className="cit-modal-titulo">Agregar tratamiento</h3>
          <button className="odo-panel-icon-btn" onClick={onCancelar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="cit-modal-body">
          <div className="cit-campo">
            <label className="cit-campo-label">Tratamiento</label>
            <input
              type="text"
              className="cit-input"
              placeholder="Ej. Limpieza dental"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Diente (opcional)</label>
            <input
              type="text"
              className="cit-input"
              placeholder="Ej. 16"
              value={diente}
              onChange={(e) => setDiente(e.target.value)}
            />
          </div>

          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Cantidad</label>
              <input
                type="number"
                min={1}
                className="cit-input"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
              />
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Precio unitario</label>
              <input
                type="number"
                min={0}
                className="cit-input"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>
        </div>

        <div className="cit-modal-footer">
          <button className="cit-btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="od-btn-primary" onClick={handleAgregar} disabled={!puedeAgregar}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}