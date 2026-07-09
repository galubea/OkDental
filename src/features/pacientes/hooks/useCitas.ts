import { useCallback, useEffect, useMemo, useState } from "react";
import type { Cita, NuevaCitaInput, NuevoTratamientoInput, NuevoPagoInput } from "../types/citas";
import {
  obtenerCitas, crearCita,
  agregarTratamiento, eliminarTratamiento,
  actualizarNotas,
  agregarPago, eliminarPago,
  reprogramarCita, cancelarCita, marcarAtendida,
} from "../api/citasApi";

export function useCitas(pacienteId: number) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [citaSeleccionadaId, setCitaSeleccionadaId] = useState<string | null>(null);
  const [errorPago, setErrorPago] = useState("");
  const [modalReprogramarId, setModalReprogramarId] = useState<string | null>(null);
  const [modalCancelarId, setModalCancelarId] = useState<string | null>(null);
  const [accionando, setAccionando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerCitas(pacienteId);
      setCitas(data);
    } finally {
      setCargando(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const citasOrdenadas = useMemo(
    () => [...citas].sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1)),
    [citas]
  );

  const saldoPendienteTotal = useMemo(
    () =>
      citas.reduce((acc, c) => {
        if (c.total == null) return acc;
        const saldo = c.total - (c.pagado ?? 0);
        return saldo > 0 ? acc + saldo : acc;
      }, 0),
    [citas]
  );

  const citaSeleccionada = useMemo(
    () => citas.find((c) => c.id === citaSeleccionadaId) ?? null,
    [citas, citaSeleccionadaId]
  );

  async function agendarCita(input: NuevaCitaInput) {
    setGuardando(true);
    try {
      await crearCita(pacienteId, input);
      await cargar();
      setModalAbierto(false);
    } finally {
      setGuardando(false);
    }
  }

  async function agregarTratamientoACita(citaId: string, input: NuevoTratamientoInput) {
    const actualizada = await agregarTratamiento(pacienteId, citaId, input);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
  }

  async function eliminarTratamientoDeCita(citaId: string, tratamientoId: string) {
    const actualizada = await eliminarTratamiento(pacienteId, citaId, tratamientoId);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
  }

  async function guardarNotas(citaId: string, notas: string) {
    const actualizada = await actualizarNotas(pacienteId, citaId, notas);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
  }

  async function agregarPagoACita(citaId: string, input: NuevoPagoInput): Promise<boolean> {
    setErrorPago("");
    try {
      const actualizada = await agregarPago(pacienteId, citaId, input);
      setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
      return true;
    } catch (e) {
      setErrorPago(e instanceof Error ? e.message : "No se pudo registrar el pago.");
      return false;
    }
  }

  async function eliminarPagoDeCita(citaId: string, pagoId: string) {
    const actualizada = await eliminarPago(pacienteId, citaId, pagoId);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
  }

  async function confirmarReprogramar(citaId: string, fecha: string, hora: string) {
    setAccionando(true);
    try {
      const actualizada = await reprogramarCita(pacienteId, citaId, fecha, hora);
      setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
      setModalReprogramarId(null);
    } finally {
      setAccionando(false);
    }
  }

  async function confirmarCancelacion(citaId: string) {
    setAccionando(true);
    try {
      const actualizada = await cancelarCita(pacienteId, citaId);
      setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
      setModalCancelarId(null);
    } finally {
      setAccionando(false);
    }
  }

  async function marcarComoAtendida(citaId: string) {
    const actualizada = await marcarAtendida(pacienteId, citaId);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? actualizada : c)));
  }

  return {
    citas: citasOrdenadas,
    cargando,
    guardando,
    saldoPendienteTotal,
    modalAbierto,
    abrirModal: () => setModalAbierto(true),
    cerrarModal: () => setModalAbierto(false),
    agendarCita,
    citaSeleccionada,
    seleccionarCita: (id: string) => setCitaSeleccionadaId(id),
    volverALista: () => setCitaSeleccionadaId(null),
    agregarTratamientoACita,
    eliminarTratamientoDeCita,
    guardarNotas,
    agregarPagoACita,
    eliminarPagoDeCita,
    errorPago,
    limpiarErrorPago: () => setErrorPago(""),
    modalReprogramarId,
    abrirReprogramar: (id: string) => setModalReprogramarId(id),
    cerrarReprogramar: () => setModalReprogramarId(null),
    modalCancelarId,
    abrirCancelar: (id: string) => setModalCancelarId(id),
    cerrarCancelar: () => setModalCancelarId(null),
    accionando,
    confirmarReprogramar,
    confirmarCancelacion,
    marcarComoAtendida,
  };
}