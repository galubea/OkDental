import { invoke } from "@tauri-apps/api/core";
import type { Paciente, NuevoPacienteInput } from "../types/paciente";

function mensajeError(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
}

export async function crearPaciente(input: NuevoPacienteInput): Promise<Paciente> {
  try {
    return await invoke<Paciente>("crear_paciente", { input });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo crear el paciente."));
  }
}

export async function listarPacientes(query?: string): Promise<Paciente[]> {
  try {
    return await invoke<Paciente[]>("listar_pacientes", { query: query ?? null });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar la lista de pacientes."));
  }
}