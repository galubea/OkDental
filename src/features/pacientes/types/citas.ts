export type EstadoCita = "programada" | "atendida" | "cancelada";
export type MetodoPago = "efectivo" | "tarjeta" | "transferencia";

export interface Tratamiento {
  id: string;
  nombre: string;
  diente?: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pago {
  id: string;
  fecha: string; // ISO: "2026-07-07"
  metodo: MetodoPago;
  nota?: string;
  monto: number;
}

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  total?: number;
  pagado?: number;
  tratamientos: Tratamiento[];
  pagos: Pago[];
  notas: string;
}

export interface NuevaCitaInput {
  fecha: string;
  hora: string;
  motivo: string;
}

export interface NuevoTratamientoInput {
  nombre: string;
  diente?: string;
  cantidad: number;
  precioUnitario: number;
}

export interface NuevoPagoInput {
  fecha: string;
  metodo: MetodoPago;
  nota?: string;
  monto: number;
}

export const METODOS_PAGO: { key: MetodoPago; label: string }[] = [
  { key: "efectivo", label: "Efectivo" },
  { key: "tarjeta", label: "Tarjeta" },
  { key: "transferencia", label: "Transferencia" },
];