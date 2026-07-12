import { TriangleAlert, X } from "lucide-react";

interface Props {
  titulo: string;
  mensaje: string;
  confirmando?: boolean;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmModal({
  titulo,
  mensaje,
  confirmando = false,
  textoConfirmar = "Eliminar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className="od-modal-overlay" onClick={onCancelar}>
      <div className="od-modal-card od-modal-card--sm" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onCancelar} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <div className="od-confirm-icono">
          <TriangleAlert size={22} strokeWidth={2} />
        </div>

        <h2>{titulo}</h2>
        <p className="od-subtitle">{mensaje}</p>

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onCancelar} disabled={confirmando}>
            {textoCancelar}
          </button>
          <button className="od-btn-peligro" onClick={onConfirmar} disabled={confirmando}>
            {confirmando ? "Eliminando..." : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}