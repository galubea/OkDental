export interface Doctor {
  id: number;
  nombreCompleto: string;
  email: string;
  especialidad: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDoctorInput {
  nombreCompleto: string;
  email: string;
  password: string;
  especialidad?: string | null;
}

export type AuthStatus =
  | "checking"
  | "idle"
  | "authenticating"
  | "authenticated"
  | "error";

export interface AuthState {
  doctor: Doctor | null;
  status: AuthStatus;
  error: string | null;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}