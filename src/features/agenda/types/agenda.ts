export type VistaAgenda = "semana" | "mes" | "lista";

export interface Doctor {
  id: string;
  nombre: string;
  color: string;
}

export interface CitaAgendaVista {
  id: string;
  pacienteId: number;
  pacienteNombre: string;
  motivo: string;
  fecha: string;
  horaInicio: string;
  duracionMin: number;
  doctorId: string | null;
  estado: "programada" | "atendida" | "cancelada";
}