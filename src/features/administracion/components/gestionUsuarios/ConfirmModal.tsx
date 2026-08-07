import { KeyRound, ShieldCheck, TriangleAlert, X } from "lucide-react";
import "../../styles/gestionUsuarios.css";

interface Props {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  notaIcono?: React.ReactNode;
  nota?: string;
  textoConfirmar?: string;
  cargando?: boolean;
  variante?: "peligro" | "normal";
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  notaIcono,
  nota,
  textoConfirmar = "Confirmar",
  cargando = false,
  variante = "normal",
  onConfirmar,
  onCancelar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="od-modal-overlay" onClick={onCancelar}>
      <div className="od-modal-card od-modal-confirm" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onCancelar} aria-label="Cerrar"><X size={18} /></button>

        <div className={`od-confirm-icono ${variante === "peligro" ? "od-confirm-icono-peligro" : "od-confirm-icono-normal"}`}>
          {variante === "peligro" ? <TriangleAlert size={24} /> : <KeyRound size={24} />}
        </div>

        <h2>{titulo}</h2>
        <p className="od-subtitle">{mensaje}</p>

        {nota && (
          <div className="od-info-box">
            <span className="od-info-box-icono">{notaIcono ?? <ShieldCheck size={16} />}</span>
            <p>{nota}</p>
          </div>
        )}

        <div className="od-modal-actions od-modal-actions-center">
          <button className="od-btn-secondary od-btn-pill" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
          <button
            className={variante === "peligro" ? "od-btn-peligro od-btn-pill" : "od-btn-primary od-btn-pill"}
            onClick={onConfirmar}
            disabled={cargando}
          >
            {variante !== "peligro" && <KeyRound size={15} />}
            {cargando ? "Procesando..." : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}