import { useCallback, useEffect, useState } from "react";
import type { Paciente } from "../types";
import { obtenerPacientePorId, actualizarPaciente } from "../api";

export function usePacienteDetalle(id: number) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPacientePorId(id);
      setPaciente(data);
      if (!data) setError("Paciente no encontrado.");
    } catch {
      setError("No se pudo cargar el paciente.");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function guardar(cambios: Partial<Omit<Paciente, "id">>): Promise<boolean> {
    setGuardando(true);
    try {
      const actualizado = await actualizarPaciente(id, cambios);
      setPaciente(actualizado);
      return true;
    } catch {
      setError("No se pudo guardar los cambios.");
      return false;
    } finally {
      setGuardando(false);
    }
  }

  return { paciente, cargando, error, guardando, guardar };
}