import { invoke } from "@tauri-apps/api/core";
import type { Usuario, UsuarioFormValues, CrearUsuarioInput } from "../types/user";

function mensajeError(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  try {
    return await invoke<Usuario[]>("listar_usuarios");
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cargar la lista de usuarios."));
  }
}

export async function crearUsuario(input: CrearUsuarioInput): Promise<Usuario> {
  try {
    return await invoke<Usuario>("crear_usuario", { input });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo crear la cuenta."));
  }
}

export async function actualizarUsuario(id: number, input: UsuarioFormValues): Promise<Usuario> {
  try {
    return await invoke<Usuario>("actualizar_usuario", { id, input });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo actualizar la cuenta."));
  }
}

export async function cambiarEstadoUsuario(id: number, activo: boolean): Promise<Usuario> {
  try {
    return await invoke<Usuario>("cambiar_estado_usuario", { id, activo });
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo cambiar el estado de la cuenta."));
  }
}

export async function regenerarPasswordUsuario(id: number): Promise<string> {
  try {
    const resultado = await invoke<{ passwordTemporal: string }>("regenerar_password_usuario", { id });
    return resultado.passwordTemporal;
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo regenerar la contraseña."));
  }
}

export async function sugerirUsername(nombre: string, apellido: string): Promise<string> {
  try {
    const resultado = await invoke<{ username: string }>("sugerir_username", { nombre, apellido });
    return resultado.username;
  } catch (error) {
    throw new Error(mensajeError(error, "No se pudo generar el nombre de usuario."));
  }
}