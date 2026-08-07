import type { Doctor } from "../../autentificacion/types/doctor";

export type RolUsuario = "admin" | "doctor";

export interface Usuario extends Doctor {
  nombre: string | null;
  apellido: string | null;
  username: string | null;
  telefono: string | null;
  ci: string | null;
  sucursal: string | null;
  rol: RolUsuario;
  activo: boolean;
  debeCambiarPassword: boolean;
  creadoEn: string;
  ultimoAcceso: string | null;
}

export interface UsuarioFormValues {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  ci?: string | null;
  especialidad?: string | null;
  sucursal?: string | null;
  rol: RolUsuario;
}

export interface CrearUsuarioInput extends UsuarioFormValues {
  passwordTemporal: string;
  activo: boolean;
  debeCambiarPassword: boolean;
}

export interface FiltrosUsuarios {
  busqueda: string;
  rol: RolUsuario | "todos";
  estado: "todos" | "activo" | "inactivo";
}