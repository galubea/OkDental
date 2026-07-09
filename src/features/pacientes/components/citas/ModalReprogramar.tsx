import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  fechaActual: string;
  horaActual: string;
  guardando: boolean;
  onCancelar: () => void;
  onConfirmar: (fecha: string, hora: string) => void;
}

export function ModalReprogramar({ fechaActual, horaActual, guardando, onCancelar, onConfirmar }: Props) {
  const [fecha, setFecha] = useState(fechaActual);
  const [hora, setHora] = useState(horaActual);
  const puedeConfirmar = fecha.trim() !== "" && hora.trim() !== "";

  return (
    <div className="odo-modal-overlay" onClick={onCancelar}>
      <div className="cit-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-header">
          <h3 className="cit-modal-titulo">Reprogramar cita</h3>
          <button className="odo-panel-icon-btn" onClick={onCancelar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="cit-modal-body">
          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Nueva fecha</label>
              <input type="date" className="cit-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Nueva hora</label>
              <input type="time" className="cit-input" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="cit-modal-footer">
          <button className="cit-btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="od-btn-primary" onClick={() => onConfirmar(fecha, hora)} disabled={!puedeConfirmar || guardando}>
            {guardando ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}