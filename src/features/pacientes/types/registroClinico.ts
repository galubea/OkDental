export interface RegistroClinico {
  id: number;
  paciente_id: number;
  fecha: string;     
  titulo: string;     
  descripcion: string; 
}

export interface NuevoRegistroClinicoInput {
  fecha: string;
  titulo: string;
  descripcion: string;
}