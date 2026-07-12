export interface RegistroClinico {
  id: number;
  pacienteId: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  creadoEn: string;
}

export interface NuevoRegistroClinicoInput {
  fecha: string;
  titulo: string;
  descripcion: string;
}