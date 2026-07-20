import type { Doctor } from "../../autentificacion/types/doctor";

export type RolUsuario = "admin" | "doctor";

export interface Usuario extends Doctor {
  rol: RolUsuario;
  activo: boolean;
  debeCambiarPassword: boolean;
  creadoEn: string;
  ultimoAcceso: string | null;
}

export interface UsuarioFormValues {
  nombreCompleto: string;
  email: string;
  especialidad?: string | null;
  rol: RolUsuario;
}

export interface CrearUsuarioResultado {
  usuario: Usuario;
  passwordTemporal: string;
}

export interface FiltrosUsuarios {
  busqueda: string;
  rol: RolUsuario | "todos";
  estado: "todos" | "activo" | "inactivo";
}