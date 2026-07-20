export type VistaApp =
  | { tipo: "inicio" }
  | { tipo: "pacientes" }
  | { tipo: "paciente-detalle"; id: number }
  | { tipo: "agenda" }
  | { tipo: "catalogo" }
  | { tipo: "administracion" };

export type SeccionNav = "inicio" | "pacientes" | "agenda" | "catalogo" | "administracion";