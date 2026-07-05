import { useCallback, useEffect, useMemo, useState } from "react";
import type { Paciente } from "../types";
import { listarPacientes } from "../api";

const TAMANO_PAGINA = 9;

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);

  const cargar = useCallback(async (query?: string) => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarPacientes(query);
      setPacientes(data);
      setPagina(1); // toda búsqueda nueva vuelve a la página 1
    } catch (e) {
      setError("No se pudo cargar la lista de pacientes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const totalPaginas = Math.max(1, Math.ceil(pacientes.length / TAMANO_PAGINA));

  const pacientesPagina = useMemo(() => {
    const inicio = (pagina - 1) * TAMANO_PAGINA;
    return pacientes.slice(inicio, inicio + TAMANO_PAGINA);
  }, [pacientes, pagina]);

  function irAPagina(n: number) {
    setPagina(Math.min(Math.max(1, n), totalPaginas));
  }

  return {
    pacientes,
    pacientesPagina,
    cargando,
    error,
    cargar,
    pagina,
    totalPaginas,
    irAPagina,
  };
}