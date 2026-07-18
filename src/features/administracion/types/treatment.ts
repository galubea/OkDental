export interface CategoriaTratamiento {
  id: string;
  nombre: string; 
}

export interface Tratamiento {
  id: string;
  codigo: string;             
  nombre: string;              
  categoriaId: string;         
  precioBase: number;           
  descripcion?: string;
  duracionMin?: number;
  requiereConsentimiento?: boolean;

  activo: boolean;              
  createdAt: string;     
  updatedAt: string;          
}

export interface TratamientoFormValues {
  nombre: string;
  categoriaId: string;
  precioBase: number;
  descripcion?: string;
  duracionMin?: number;
  requiereConsentimiento?: boolean;
}

export type VistaCatalogo = "grid" | "lista";

export interface FiltrosCatalogo {
  busqueda: string;
  categoriaId: string | "todas";
  soloActivos: boolean;
}