import { CheckCircle2, XCircle, Info, AlertTriangle, Bell, X } from "lucide-react";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";

export type ToastTipo = "exito" | "error" | "info" | "atencion" | "recordatorio";

interface Props {
  titulo: string;
  mensaje: string;
  tipo: ToastTipo;
  onCerrar: () => void;
  duracionMs?: number;
}

const CONFIG: Record<ToastTipo, { icon: LucideIcon }> = {
  exito: { icon: CheckCircle2 },
  error: { icon: XCircle },
  info: { icon: Info },
  atencion: { icon: AlertTriangle },
  recordatorio: { icon: Bell },
};

export function Toast({ titulo, mensaje, tipo, onCerrar, duracionMs = 4000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onCerrar, duracionMs);
    return () => clearTimeout(timer);
  }, [onCerrar, duracionMs]);

  const { icon: Icon } = CONFIG[tipo];

  return (
    <div className={`od-toast od-toast--${tipo}`}>
      <div className="od-toast-icono">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div className="od-toast-texto">
        <p className="od-toast-titulo">{titulo}</p>
        <p className="od-toast-mensaje">{mensaje}</p>
      </div>
      <button className="od-toast-cerrar" onClick={onCerrar} aria-label="Cerrar">
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}