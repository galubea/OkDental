import type { Cita, NuevaCitaInput, NuevoTratamientoInput, NuevoPagoInput } from "../types/citas";

const CITAS_MOCK: Record<number, Cita[]> = {
  1: [
    { id: "c1", fecha: "2026-07-15", hora: "20:58", motivo: "Radiografía de control", estado: "programada", tratamientos: [], pagos: [], notas: "" },
    { id: "c2", fecha: "2026-07-10", hora: "05:00", motivo: "Prueba", estado: "programada", tratamientos: [], pagos: [], notas: "" },
    {
      id: "c3", fecha: "2026-06-08", hora: "20:58", motivo: "Revisión de control", estado: "atendida",
      tratamientos: [
        { id: "t1", nombre: "Revisión / Control", cantidad: 1, precioUnitario: 500 },
        { id: "t2", nombre: "Extracción simple", cantidad: 1, precioUnitario: 1500 },
      ],
      pagos: [
        { id: "p1", fecha: "2026-06-08", metodo: "efectivo", monto: 500 },
      ],
      notas: "Sin complicaciones. Obturación integrada correctamente.",
    },
  ],
};

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function recalcular(cita: Cita): Cita {
  const total = cita.tratamientos.reduce((acc, t) => acc + t.cantidad * t.precioUnitario, 0);
  const pagado = cita.pagos.reduce((acc, p) => acc + p.monto, 0);
  return { ...cita, total: total > 0 ? total : undefined, pagado: pagado > 0 ? pagado : undefined };
}

function buscar(pacienteId: number, citaId: string) {
  const lista = CITAS_MOCK[pacienteId] ?? [];
  const idx = lista.findIndex((c) => c.id === citaId);
  if (idx === -1) throw new Error("Cita no encontrada");
  return { lista, idx };
}

export async function obtenerCitas(pacienteId: number): Promise<Cita[]> {
  return delay((CITAS_MOCK[pacienteId] ?? []).map(recalcular));
}

export async function crearCita(pacienteId: number, input: NuevaCitaInput): Promise<Cita> {
  const nueva: Cita = {
    id: crypto.randomUUID(),
    fecha: input.fecha,
    hora: input.hora,
    motivo: input.motivo,
    estado: "programada",
    tratamientos: [],
    pagos: [],
    notas: "",
  };
  CITAS_MOCK[pacienteId] = [...(CITAS_MOCK[pacienteId] ?? []), nueva];
  return delay(nueva);
}

export async function agregarTratamiento(pacienteId: number, citaId: string, input: NuevoTratamientoInput): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const nuevoTratamiento = { id: crypto.randomUUID(), ...input };
  const actualizada = recalcular({ ...lista[idx], tratamientos: [...lista[idx].tratamientos, nuevoTratamiento] });
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function eliminarTratamiento(pacienteId: number, citaId: string, tratamientoId: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = recalcular({
    ...lista[idx],
    tratamientos: lista[idx].tratamientos.filter((t) => t.id !== tratamientoId),
  });
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function actualizarNotas(pacienteId: number, citaId: string, notas: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = { ...lista[idx], notas };
  lista[idx] = actualizada;
  return delay(actualizada);
}

// ── Pagos ──
export async function agregarPago(pacienteId: number, citaId: string, input: NuevoPagoInput): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const cita = lista[idx];

  const totalTratamientos = cita.tratamientos.reduce((acc, t) => acc + t.cantidad * t.precioUnitario, 0);
  const pagadoActual = cita.pagos.reduce((acc, p) => acc + p.monto, 0);
  const disponible = totalTratamientos - pagadoActual;

  if (input.monto > disponible) {
    throw new Error(
      disponible <= 0
        ? "Esta cita ya está saldada, no puedes registrar más pagos."
        : `El monto excede el saldo pendiente ($${disponible.toLocaleString("es-MX")}).`
    );
  }

  const nuevoPago = { id: crypto.randomUUID(), ...input };
  const actualizada = recalcular({ ...cita, pagos: [...cita.pagos, nuevoPago] });
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function eliminarPago(pacienteId: number, citaId: string, pagoId: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = recalcular({
    ...lista[idx],
    pagos: lista[idx].pagos.filter((p) => p.id !== pagoId),
  });
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function reprogramarCita(pacienteId: number, citaId: string, fecha: string, hora: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = { ...lista[idx], fecha, hora, estado: "programada" as const };
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function cancelarCita(pacienteId: number, citaId: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = { ...lista[idx], estado: "cancelada" as const };
  lista[idx] = actualizada;
  return delay(actualizada);
}

export async function marcarAtendida(pacienteId: number, citaId: string): Promise<Cita> {
  const { lista, idx } = buscar(pacienteId, citaId);
  const actualizada = { ...lista[idx], estado: "atendida" as const };
  lista[idx] = actualizada;
  return delay(actualizada);
}