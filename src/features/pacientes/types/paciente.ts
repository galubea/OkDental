export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  edad?: number | null;
  fecha_nacimiento?: string | null;
  genero?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ocupacion?: string | null;
  fecha_registro?: string;
  fecha_ultima_visita?: string | null;
}

export interface NuevoPacienteInput {
  nombre: string;
  apellido: string;
  ci: string;
  email?: string;
  telefono?: string;
}