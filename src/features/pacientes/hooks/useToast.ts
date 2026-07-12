import { useCallback, useState } from "react";
import type { ToastTipo } from "../components/common/Toast";

interface ToastState {
  mensaje: string;
  tipo: ToastTipo;
  key: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const mostrarToast = useCallback((mensaje: string, tipo: ToastTipo) => {
    setToast({ mensaje, tipo, key: Date.now() });
  }, []);

  const cerrarToast = useCallback(() => setToast(null), []);

  return { toast, mostrarToast, cerrarToast };
}