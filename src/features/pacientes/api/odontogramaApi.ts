import { invoke } from "@tauri-apps/api/core";
import type {
  DienteData,
  ModoOdontograma,
  NuevoOdontogramaInput,
  OdontogramaCompleto,
  OdontogramaResumen,
} from "../types/odontograma";

function mensajeError(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function listarOdontogramas(pacienteId: number): Promise<OdontogramaResumen[]> {
  try {
    return await invoke<OdontogramaResumen[]>("listar_odontogramas", { pacienteId });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar la lista de odontogramas."));
  }
}

export async function obtenerOdontogramaPorId(odontogramaId: string): Promise<OdontogramaCompleto> {
  try {
    return await invoke<OdontogramaCompleto>("obtener_odontograma", { odontogramaId });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar el odontograma."));
  }
}

export async function crearOdontograma(
  pacienteId: number,
  input: NuevoOdontogramaInput
): Promise<OdontogramaCompleto> {
  try {
    return await invoke<OdontogramaCompleto>("crear_odontograma", { pacienteId, input });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo crear el odontograma."));
  }
}

export async function guardarDientes(
  odontogramaId: string,
  modo: ModoOdontograma,
  dientes: Record<string, DienteData>
): Promise<void> {
  try {
    await invoke<void>("guardar_odontograma", { odontogramaId, modo, dientes });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo guardar el odontograma."));
  }
}

export async function guardarObservacionGeneral(
  odontogramaId: string,
  observacion: string
): Promise<void> {
  try {
    await invoke<void>("guardar_observacion_general", { odontogramaId, observacion });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo guardar la observación general."));
  }
}

export async function eliminarOdontograma(odontogramaId: string): Promise<void> {
  try {
    await invoke<void>("eliminar_odontograma", { odontogramaId });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo eliminar el odontograma."));
  }
}

export async function obtenerOdontogramaActual(pacienteId: number): Promise<OdontogramaCompleto> {
  const lista = await listarOdontogramas(pacienteId);

  if (lista.length === 0) {
    return crearOdontograma(pacienteId, {
      titulo: "Odontograma inicial",
      fecha: fechaHoy(),
    });
  }

  return obtenerOdontogramaPorId(lista[0].id);
}