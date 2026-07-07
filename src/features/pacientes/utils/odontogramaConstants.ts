import type { EstadoDental, DienteData } from "../types";

export const NUMEROS_ADULTO = {
  superiorDerecho: ["18", "17", "16", "15", "14", "13", "12", "11"],
  superiorIzquierdo: ["21", "22", "23", "24", "25", "26", "27", "28"],
  inferiorDerecho: ["48", "47", "46", "45", "44", "43", "42", "41"],
  inferiorIzquierdo: ["31", "32", "33", "34", "35", "36", "37", "38"],
};

export const NUMEROS_INFANTIL = {
  superiorDerecho: ["55", "54", "53", "52", "51"],
  superiorIzquierdo: ["61", "62", "63", "64", "65"],
  inferiorDerecho: ["85", "84", "83", "82", "81"],
  inferiorIzquierdo: ["71", "72", "73", "74", "75"],
};

export const ESTADOS_DENTALES: { key: EstadoDental; label: string; color: string }[] = [
  { key: "sano",                 label: "Sano",                color: "transparent" },
  { key: "caries",               label: "Caries",              color: "#F5B8B8" }, 
  { key: "obturado",             label: "Obturado",            color: "#AECBF2" }, 
  { key: "corona",               label: "Corona",              color: "#F3DBA3" }, 
  { key: "sellante",             label: "Sellante",            color: "#B7E4C7" }, 
  { key: "fracturado",           label: "Fracturado",          color: "#D6C2ED" }, 
  { key: "extraccion_indicada",  label: "Extracción indicada", color: "#F3C9A8" }, 
  { key: "ausente",              label: "Ausente",             color: "#CBD2D9" }, 
];

function dienteVacio(numero: string): DienteData {
  return {
    numero,
    ausente: false,
    superficies: {
      vestibular: "sano",
      lingual: "sano",
      mesial: "sano",
      distal: "sano",
      oclusal: "sano",
    },
    observacion: "",
    avances: [],
  };
}

export function crearOdontogramaVacio(
  numeros: typeof NUMEROS_ADULTO
): Record<string, DienteData> {
  const todos = [
    ...numeros.superiorDerecho,
    ...numeros.superiorIzquierdo,
    ...numeros.inferiorDerecho,
    ...numeros.inferiorIzquierdo,
  ];
  const result: Record<string, DienteData> = {};
  todos.forEach((n) => (result[n] = dienteVacio(n)));
  return result;
}