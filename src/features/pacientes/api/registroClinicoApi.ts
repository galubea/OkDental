import type { NuevoRegistroClinicoInput, RegistroClinico } from "../types/registroClinico";
import { invoke } from "@tauri-apps/api/core";

export async function listarRegistrosClinicos(pacienteId: number): Promise<RegistroClinico[]> {
  return invoke("listar_registros_clinicos", { pacienteId });
}

export async function crearRegistroClinico(
  pacienteId: number,
  input: NuevoRegistroClinicoInput
): Promise<RegistroClinico> {
  return invoke("crear_registro_clinico", { pacienteId, input });
}

export async function actualizarRegistroClinico(
  id: number,
  input: NuevoRegistroClinicoInput
): Promise<RegistroClinico> {
  return invoke("actualizar_registro_clinico", { id, input });
}

export async function eliminarRegistroClinico(id: number): Promise<void> {
  return invoke("eliminar_registro_clinico", { id });
}