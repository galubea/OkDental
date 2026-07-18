export type EstadoCaso = "activo" | "en_tratamiento" | "resuelto";
export type Severidad = "bajo" | "medio" | "alto";

export interface PasoTratamiento {
  id: string;
  descripcion: string;
  completado: boolean;
}

export interface EntradaEvolucion {
  id: string;
  fecha: string; // ISO date (YYYY-MM-DD)
  titulo: string;
  descripcion: string;
}

export interface EntradaObservacion {
  id: string;
  fecha: string; // ISO date (YYYY-MM-DD)
  texto: string;
}

export interface Evidencia {
  id: string;
  url: string;
  etiqueta: string;
  fecha: string; // ISO date (YYYY-MM-DD)
}

export interface CasoClinico {
  id: string;
  titulo: string;
  descripcion: string;
  especialidad: string;
  doctor: string;
  estado: EstadoCaso;
  severidad: Severidad;
  piezas: number[];
  /** 0–100, calculado a partir de planTratamiento cuando tiene pasos */
  progreso: number;
  fechaObjetivo: string | null;
  fechaCreacion: string;
  diagnostico: string;
  planTratamiento: PasoTratamiento[];
  evolucion: EntradaEvolucion[];
  observaciones: EntradaObservacion[];
  evidencias: Evidencia[];
}

export interface TabDefinicion {
  key: EstadoCaso | "todos";
  label: string;
}

export interface TabConConteo extends TabDefinicion {
  count: number;
}