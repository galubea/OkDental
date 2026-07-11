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
  observacion: string;
  avances: Avance[];
}

export interface OdontogramaCompleto {
  adulto: Record<string, DienteData>;
  infantil: Record<string, DienteData>;
}