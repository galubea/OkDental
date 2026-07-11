import { invoke } from "@tauri-apps/api/core";
import type { Paciente } from "../types/paciente";

function mensajeError(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
}

export async function obtenerPacientePorId(id: number): Promise<Paciente | null> {
  try {
    return await invoke<Paciente | null>("obtener_paciente_por_id", { id });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar el paciente."));
  }
}

export async function actualizarPaciente(
  id: number,
  cambios: Partial<Omit<Paciente, "id">>
): Promise<Paciente> {
  try {
    return await invoke<Paciente>("actualizar_paciente", { id, cambios });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo guardar los cambios."));
  }
}