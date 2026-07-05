import type { Paciente, NuevoPacienteInput } from "./types";

// Cuando exista el comando de Rust (#[tauri::command] fn listar_pacientes),
// descomenta esta línea y borra el bloque MOCK de abajo.
// import { invoke } from "@tauri-apps/api/core";

const USE_MOCK = true;

const NOMBRES = [
  "Ana Gutiérrez", "Marco Rojas", "Lucía Fernández", "Diego Vargas", "Carla Mendoza",
  "Fernando Quispe", "Valeria Terán", "Ricardo Salazar", "Paola Ibáñez", "Sergio Choque",
  "Daniela Aguirre", "Andrés Peralta", "Mariana Suárez", "Jorge Escobar", "Camila Rivas",
  "Iván Montaño", "Rosa Delgado", "Tomás Ortiz", "Gabriela Paz", "Esteban Molina",
];

const MOCK_PACIENTES: Paciente[] = NOMBRES.map((nombre, i) => ({
  id: i + 1,
  nombre,
  ci: String(7500000 + i * 1234),
  telefono: i % 4 === 0 ? null : `591 7${(10000000 + i * 4321) % 100000000}`.slice(0, 12),
  email: i % 5 === 0 ? null : `${nombre.split(" ")[0].toLowerCase()}@correo.com`,
  fecha_registro: `2026-${String((i % 12) + 1).padStart(2, "0")}-10`,
  fecha_ultima_visita:
    i % 6 === 0 ? null : `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

export async function listarPacientes(query?: string): Promise<Paciente[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250)); // simula latencia real
    if (!query) return MOCK_PACIENTES;
    const q = query.toLowerCase();
    return MOCK_PACIENTES.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.ci.includes(q)
    );
  }
  // return invoke<Paciente[]>("listar_pacientes", { query });
  throw new Error("Backend real aún no conectado");
}

export async function crearPaciente(data: NuevoPacienteInput): Promise<Paciente> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    const nuevo: Paciente = {
      id: Math.max(0, ...MOCK_PACIENTES.map((p) => p.id)) + 1,
      nombre: `${data.nombre} ${data.apellido}`,
      ci: data.ci,
      email: data.email || null,
      telefono: data.telefono || null,
      fecha_registro: new Date().toISOString().slice(0, 10),
      fecha_ultima_visita: null,
    };
    MOCK_PACIENTES.unshift(nuevo);
    return nuevo;
  }
  // return invoke<Paciente>("crear_paciente", { data });
  throw new Error("Backend real aún no conectado");
}

export async function obtenerPacientePorId(id: number): Promise<Paciente | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_PACIENTES.find((p) => p.id === id) ?? null;
  }
  // return invoke<Paciente | null>("obtener_paciente_por_id", { id });
  throw new Error("Backend real aún no conectado");
}

export async function actualizarPaciente(
  id: number,
  data: Partial<Omit<Paciente, "id">>
): Promise<Paciente> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    const idx = MOCK_PACIENTES.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Paciente no encontrado");
    MOCK_PACIENTES[idx] = { ...MOCK_PACIENTES[idx], ...data };
    return MOCK_PACIENTES[idx];
  }
  // return invoke<Paciente>("actualizar_paciente", { id, data });
  throw new Error("Backend real aún no conectado");
}

export async function eliminarPaciente(id: number): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const idx = MOCK_PACIENTES.findIndex((p) => p.id === id);
    if (idx !== -1) MOCK_PACIENTES.splice(idx, 1);
    return;
  }
  // return invoke("eliminar_paciente", { id });
  throw new Error("Backend real aún no conectado");
}