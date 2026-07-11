export interface RespuestaSN {
  sn: string;
  det: string; 
}

export interface HistoriaClinica {
  paciente_id: number;
  motivo_consulta: string;
  ant_familiares: string;
  ant_personales: string; 
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

export function historiaClinicaVacia(pacienteId: number): HistoriaClinica {
  return {
    paciente_id: pacienteId,
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