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

// ---------- Historia Clínica ----------
export interface RespuestaSN {
  sn: string;   // "Sí" | "No" | ""
  det: string;  // detalle opcional
}

export interface HistoriaClinica {
  motivo_consulta: string;
  ant_familiares: string;
  ant_personales: string; // lista separada por comas, ej: "Anemia, Asma"
  renal: string;
  coagulacion: string;
  anamnesis: Record<string, RespuestaSN>;
  covid: Record<string, RespuestaSN>;
  dosis_covid: string;
  extraoral_atm: string;
  extraoral_labios: string;
  extraoral_ganglios: string;
  respirador: string;
  intraoral: Record<string, string>;
  ultima_visita: string;
  habitos: string;
  habitos_otros: string;
  protesis: string;
  cepillo: string;
  hilo: string;
  enjuague: string;
  sangrado: string;
  frecuencia: string;
  higiene_dental: string;
  problema_anterior: string;
  observaciones: string;
}

export function historiaClinicaVacia(): HistoriaClinica {
  return {
    motivo_consulta: "",
    ant_familiares: "",
    ant_personales: "",
    renal: "",
    coagulacion: "",
    anamnesis: {},
    covid: {},
    dosis_covid: "",
    extraoral_atm: "",
    extraoral_labios: "",
    extraoral_ganglios: "",
    respirador: "",
    intraoral: {},
    ultima_visita: "",
    habitos: "",
    habitos_otros: "",
    protesis: "",
    cepillo: "",
    hilo: "",
    enjuague: "",
    sangrado: "",
    frecuencia: "",
    higiene_dental: "",
    problema_anterior: "",
    observaciones: "",
  };
}

// ---------- Resumen Clínico (bitácora de visitas) ----------
export interface RegistroClinico {
  id: number;
  paciente_id: number;
  fecha: string;     // ISO, ej: "2026-02-27"
  titulo: string;     // ej: "Gingivitis"
  descripcion: string; // ej: "Inflamación leve en cuadrante inferior"
}

export interface NuevoRegistroClinicoInput {
  fecha: string;
  titulo: string;
  descripcion: string;
}

// ---------- Odontograma ----------
export type SuperficieDental = "vestibular" | "lingual" | "mesial" | "distal" | "oclusal";

export type EstadoDental =
  | "sano"
  | "caries"
  | "obturado"
  | "corona"
  | "sellante"
  | "fracturado"
  | "extraccion_indicada"
  | "ausente";

export interface DienteData {
  numero: string;
  ausente: boolean;
  superficies: Record<SuperficieDental, EstadoDental>;
  observacion: string;   
  avances: Avance[];     
}

export interface OdontogramaCompleto {
  adulto: Record<string, DienteData>;
  infantil: Record<string, DienteData>;
}

export type ModoOdontograma = "adulto" | "infantil";

export interface Avance {
  id: string;
  fecha: string; 
  texto: string;
}

export interface DienteData {
  numero: string;
  ausente: boolean;
  superficies: Record<SuperficieDental, EstadoDental>;
  avances: Avance[]; 
}