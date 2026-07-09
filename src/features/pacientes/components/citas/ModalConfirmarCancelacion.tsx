import { AlertTriangle } from "lucide-react";

interface Props {
  motivo: string;
  guardando: boolean;
  onVolver: () => void;
  onConfirmar: () => void;
}

export function ModalConfirmarCancelacion({ motivo, guardando, onVolver, onConfirmar }: Props) {
  return (
    <div className="odo-modal-overlay" onClick={onVolver}>
      <div className="cit-modal odo-modal-contenido cit-modal-confirmar" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-confirmar-icono">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>
        <h3 className="cit-modal-titulo">¿Cancelar esta cita?</h3>
        <p className="cit-modal-confirmar-texto">
          «{motivo}» quedará marcada como <strong>Cancelada</strong> y se conservará en el historial.
          Podrás reprogramarla después si el paciente cambia de opinión.
        </p>
        <div className="cit-modal-footer cit-modal-footer-centro">
          <button className="cit-btn-secundario" onClick={onVolver}>Volver</button>
          <button className="cit-btn-peligro" onClick={onConfirmar} disabled={guardando}>
            {guardando ? "Cancelando..." : "Sí, cancelar cita"}
          </button>
        </div>
      </div>
    </div>
  );
}