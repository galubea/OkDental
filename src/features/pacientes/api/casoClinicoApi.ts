import { invoke } from "@tauri-apps/api/core";
import type {
  CasoClinico,
  NuevoCasoInput,
  NuevoPasoInput,
} from "../types/casoClinico";

export function listarCasosClinicos(pacienteId: number): Promise<CasoClinico[]> {
  return invoke("listar_casos_clinicos", { pacienteId });
}

export function crearCasoClinico(pacienteId: number, input: NuevoCasoInput): Promise<CasoClinico> {
  return invoke("crear_caso_clinico", { pacienteId, input });
}

export function actualizarEstadoCaso(casoId: string, estado: string): Promise<CasoClinico> {
  return invoke("actualizar_estado_caso", { casoId, estado });
}

export function actualizarDiagnosticoCaso(
  casoId: string,
  diagnostico: string,
  piezas: number[]
): Promise<CasoClinico> {
  return invoke("actualizar_diagnostico_caso", { casoId, input: { diagnostico, piezas } });
}

export function agregarPasoPlanCaso(casoId: string, input: NuevoPasoInput): Promise<CasoClinico> {
  return invoke("agregar_paso_plan_caso", { casoId, input });
}

export function togglePasoPlanCaso(casoId: string, pasoId: string): Promise<CasoClinico> {
  return invoke("toggle_paso_plan_caso", { casoId, pasoId });
}

export function eliminarPasoPlanCaso(casoId: string, pasoId: string): Promise<CasoClinico> {
  return invoke("eliminar_paso_plan_caso", { casoId, pasoId });
}

export function agregarEvolucionCaso(
  casoId: string,
  titulo: string,
  descripcion: string
): Promise<CasoClinico> {
  return invoke("agregar_evolucion_caso", { casoId, input: { titulo, descripcion } });
}

export function agregarObservacionCaso(casoId: string, texto: string): Promise<CasoClinico> {
  return invoke("agregar_observacion_caso", { casoId, input: { texto } });
}

export function agregarEvidenciaCaso(
  casoId: string,
  ruta: string,
  etiqueta: string
): Promise<CasoClinico> {
  return invoke("agregar_evidencia_caso", { casoId, ruta, etiqueta });
}

export function eliminarEvidenciaCaso(casoId: string, evidenciaId: string): Promise<CasoClinico> {
  return invoke("eliminar_evidencia_caso", { casoId, evidenciaId });
}
