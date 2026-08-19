export type EstadoCaso = "activo" | "en_tratamiento" | "resuelto";
export type Severidad = "bajo" | "medio" | "alto";

export interface PasoTratamiento {
  id: string;
  catalogoTratId: string | null;
  descripcion: string;
  diente: string | null;
  precio: number | null;
  completado: boolean;
}

export interface EntradaEvolucion {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
}

export interface EntradaObservacion {
  id: string;
  fecha: string;
  texto: string;
}

export interface Evidencia {
  id: string;
  url: string;
  etiqueta: string;
  fecha: string;
}

export interface CitaResumenCaso {
  id: string;
  fecha: string;
  hora: string;
  estado: "programada" | "atendida" | "cancelada";
  motivo: string;
  doctorNombre: string;
  total: number;
  pagado: number;
}

export interface CasoClinico {
  id: string;
  pacienteId: number;
  doctorId: number | null;
  doctorNombre: string;
  titulo: string;
  descripcion: string;
  especialidad: string;
  estado: EstadoCaso;
  severidad: Severidad;
  diagnostico: string;
  piezas: number[];
  progreso: number;
  fechaObjetivo: string | null;
  fechaCreacion: string;
  planTratamiento: PasoTratamiento[];
  evolucion: EntradaEvolucion[];
  observaciones: EntradaObservacion[];
  evidencias: Evidencia[];
  citas: CitaResumenCaso[];
}

export interface NuevoCasoInput {
  titulo: string;
  descripcion: string;
  especialidad: string;
  doctorId: number | null;
  severidad: Severidad;
}

export interface NuevoPasoInput {
  descripcion: string;
  diente?: string;
  catalogoTratId?: string;
  precio?: number;
}

export interface TabDefinicion {
  key: EstadoCaso | "todos";
  label: string;
}

export interface TabConConteo extends TabDefinicion {
  count: number;
}
