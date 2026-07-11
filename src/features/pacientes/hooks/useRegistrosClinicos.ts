import { useCallback, useEffect, useState } from "react";
import type { NuevoRegistroClinicoInput, RegistroClinico } from "../types/registroClinico";
import { listarRegistrosClinicos, crearRegistroClinico } from "../api";

export function useRegistrosClinicos(pacienteId: number) {
  const [registros, setRegistros] = useState<RegistroClinico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarRegistrosClinicos(pacienteId);
      setRegistros(data);
    } catch {
      setError("No se pudieron cargar los registros clínicos.");
    } finally {
      setCargando(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregar(input: NuevoRegistroClinicoInput): Promise<boolean> {
    setGuardando(true);
    try {
      const nuevo = await crearRegistroClinico(pacienteId, input);
      setRegistros((r) => [nuevo, ...r]);
      return true;
    } catch {
      setError("No se pudo guardar el registro.");
      return false;
    } finally {
      setGuardando(false);
    }
  }

  return { registros, cargando, error, guardando, agregar };
}