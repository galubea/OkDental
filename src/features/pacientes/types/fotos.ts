export interface Foto {
  id: string;
  titulo: string;
  fecha: string;
  url: string;
}

export interface NuevaFotoInput {
  titulo: string;
  fecha: string;
  archivo: File;
}