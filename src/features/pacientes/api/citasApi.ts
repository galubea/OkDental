import { invoke } from "@tauri-apps/api/core";
import type {
  Cita,
  NuevaCitaInput,
  NuevoTratamientoInput,
  NuevoPagoInput,
  DoctorResumen,
} from "../types/citas";

export async function obtenerCitas(pacienteId: number): Promise<Cita[]> {
  return invoke("obtener_citas", { pacienteId });
}

export async function crearCita(pacienteId: number, input: NuevaCitaInput): Promise<Cita> {
  return invoke("crear_cita", {
    pacienteId,
    input: {
      fecha: input.fecha,
      hora: input.hora,
      motivo: input.motivo,
      doctorId: Number(input.doctorId),
      duracionMin: input.duracionMin,
    },
  });
}

export async function agregarTratamiento(
  pacienteId: number,
  citaId: string,
  input: NuevoTratamientoInput
): Promise<Cita> {
  return invoke("agregar_tratamiento", { pacienteId, citaId, input });
}

export async function eliminarTratamiento(
  pacienteId: number,
  citaId: string,
  tratamientoId: string
): Promise<Cita> {
  return invoke("eliminar_tratamiento", { pacienteId, citaId, tratamientoId });
}

export async function actualizarNotas(pacienteId: number, citaId: string, notas: string): Promise<Cita> {
  return invoke("actualizar_notas", { pacienteId, citaId, notas });
}

export async function agregarPago(
  pacienteId: number,
  citaId: string,
  input: NuevoPagoInput
): Promise<Cita> {
  return invoke("agregar_pago", { pacienteId, citaId, input });
}

export async function eliminarPago(pacienteId: number, citaId: string, pagoId: string): Promise<Cita> {
  return invoke("eliminar_pago", { pacienteId, citaId, pagoId });
}

export async function reprogramarCita(
  pacienteId: number,
  citaId: string,
  fecha: string,
  hora: string
): Promise<Cita> {
  return invoke("reprogramar_cita", { pacienteId, citaId, fecha, hora });
}

export async function cancelarCita(pacienteId: number, citaId: string): Promise<Cita> {
  return invoke("cancelar_cita", { pacienteId, citaId });
}

export async function marcarAtendida(pacienteId: number, citaId: string): Promise<Cita> {
  return invoke("marcar_atendida", { pacienteId, citaId });
}

export async function listarDoctores(): Promise<DoctorResumen[]> {
  return invoke("listar_doctores");
}

export async function obtenerTodasLasCitas(): Promise<Cita[]> {
  return invoke("obtener_todas_las_citas");
}