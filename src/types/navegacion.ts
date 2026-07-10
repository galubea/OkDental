export type VistaApp =
  | { tipo: "inicio" }
  | { tipo: "pacientes" }
  | { tipo: "paciente-detalle"; id: number }
  | { tipo: "agenda" };

export type SeccionNav = "inicio" | "pacientes" | "agenda";