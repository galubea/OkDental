// Refleja la tabla `paciente` de consultorio.db
export interface Paciente {
  id: number;
  nombre: string;
  ci: string;
  edad?: number | null;
  fecha_nacimiento?: string | null;
  genero?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ocupacion?: string | null;
  alergias?: string | null;
  antecedentes_medicos?: string | null;
  fecha_registro?: string;
  fecha_ultima_visita?: string | null;
}

// Datos que pide el modal "Agregar Nuevo Paciente"
export interface NuevoPacienteInput {
  nombre: string;
  apellido: string;
  ci: string;
  email?: string;
  telefono?: string;
}