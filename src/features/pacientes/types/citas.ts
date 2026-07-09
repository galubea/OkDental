export type EstadoCita = "programada" | "atendida" | "cancelada";

export interface Cita {
  id: string;
  fecha: string;   
  hora: string;   
  motivo: string;
  estado: EstadoCita;
  total?: number;
  pagado?: number;
}

export interface NuevaCitaInput {
  fecha: string;
  hora: string;
  motivo: string;
}