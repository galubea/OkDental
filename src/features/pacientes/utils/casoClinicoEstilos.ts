import type { EstadoCaso, Severidad } from "../types/casoClinico";

export const ESTADO_LABEL: Record<EstadoCaso, string> = {
  activo: "Activo",
  en_tratamiento: "En tratamiento",
  resuelto: "Resuelto",
};

export const ESTADO_PILL_CLASS: Record<EstadoCaso, string> = {
  activo: "cc-status-pill--activo",
  en_tratamiento: "cc-status-pill--tratamiento",
  resuelto: "cc-status-pill--resuelto",
};

export const ESTADO_CARD_CLASS: Record<EstadoCaso, string> = {
  activo: "cc-card--activo",
  en_tratamiento: "cc-card--en_tratamiento",
  resuelto: "cc-card--resuelto",
};

export const SEVERIDAD_LABEL: Record<Severidad, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
};

export const SEVERIDAD_CLASS: Record<Severidad, string> = {
  bajo: "cc-severidad--bajo",
  medio: "cc-severidad--medio",
  alto: "cc-severidad--alto",
};