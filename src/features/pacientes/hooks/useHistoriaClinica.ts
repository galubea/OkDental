import { useCallback, useEffect, useRef, useState } from "react";
import type { HistoriaClinica } from "../types/historiaClinica";
import { obtenerHistoriaClinica, guardarHistoriaClinica } from "../api/historiaClinicaApi";

type Mensaje = { texto: string; tipo: "ok" | "error" | "info" } | null;

export function useHistoriaClinica(pacienteId: number) {
  const [datos, setDatos] = useState<HistoriaClinica | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);
  const snapshot = useRef<HistoriaClinica | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const d = await obtenerHistoriaClinica(pacienteId);
      setDatos(d);
    } catch {
      setMensaje({ texto: "No se pudo cargar la historia clínica.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function entrarEdicion() {
    snapshot.current = datos;
    setEditando(true);
    setMensaje({ texto: "Modo edición — modifica los campos y guarda.", tipo: "info" });
  }

  function cancelarEdicion() {
    if (snapshot.current) setDatos(snapshot.current);
    setEditando(false);
    setMensaje({ texto: "Edición cancelada.", tipo: "info" });
  }

  async function guardar() {
    if (!datos) return;
    setGuardando(true);
    try {
      await guardarHistoriaClinica(pacienteId, datos);
      setEditando(false);
      setMensaje({ texto: "Historia clínica guardada correctamente.", tipo: "ok" });
    } catch {
      setMensaje({ texto: "Error al guardar la historia clínica.", tipo: "error" });
    } finally {
      setGuardando(false);
    }
  }

  function actualizarCampo<K extends keyof HistoriaClinica>(campo: K, valor: HistoriaClinica[K]) {
    setDatos((d) => (d ? { ...d, [campo]: valor } : d));
  }

  return {
    datos,
    cargando,
    guardando,
    editando,
    mensaje,
    entrarEdicion,
    cancelarEdicion,
    guardar,
    actualizarCampo,
  };
}