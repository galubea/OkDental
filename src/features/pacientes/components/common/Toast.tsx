import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";

export type ToastTipo = "exito" | "error";

interface Props {
  mensaje: string;
  tipo: ToastTipo;
  onCerrar: () => void;
  duracionMs?: number;
}

export function Toast({ mensaje, tipo, onCerrar, duracionMs = 3000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onCerrar, duracionMs);
    return () => clearTimeout(timer);
  }, [onCerrar, duracionMs]);

  return (
    <div className={`od-toast od-toast--${tipo}`}>
      {tipo === "exito" ? (
        <CheckCircle2 size={18} strokeWidth={2} />
      ) : (
        <XCircle size={18} strokeWidth={2} />
      )}
      <span>{mensaje}</span>
    </div>
  );
}