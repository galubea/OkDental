import { invoke } from "@tauri-apps/api/core";
import type { HistoriaClinica } from "../types/historiaClinica";

function mensajeError(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
}

export async function obtenerHistoriaClinica(pacienteId: number): Promise<HistoriaClinica> {
  try {
    return await invoke<HistoriaClinica>("obtener_historia_clinica", { pacienteId });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar la historia clínica."));
  }
}

export async function guardarHistoriaClinica(
  pacienteId: number,
  datos: HistoriaClinica
): Promise<HistoriaClinica> {
  try {
    return await invoke<HistoriaClinica>("guardar_historia_clinica", { pacienteId, datos });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo guardar la historia clínica."));
  }
}