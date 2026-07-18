export type VistaApp =
  | { tipo: "inicio" }
  | { tipo: "pacientes" }
  | { tipo: "paciente-detalle"; id: number }
  | { tipo: "agenda" }
  | { tipo: "catalogo" };

export type SeccionNav = "inicio" | "pacientes" | "agenda" | "catalogo";