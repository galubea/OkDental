export interface PacienteMini {
  id: number;
  nombre: string;
}

// ⚠️ Mock temporal — sustituye esto por tu fuente real de pacientes
// (la misma que alimenta tu Directorio de Pacientes) en cuanto la tengas disponible como función/API.
const PACIENTES_MOCK: PacienteMini[] = [
  { id: 1, nombre: "Alex Gabriel Barreto" },
  { id: 2, nombre: "Jared Pereira" },
  { id: 3, nombre: "Juan Orozco" },
  { id: 4, nombre: "Juan Pepe" },
  { id: 5, nombre: "Juan de la Torre" },
  { id: 6, nombre: "Maria Lopes" },
];

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function buscarPacientes(query: string): Promise<PacienteMini[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(PACIENTES_MOCK.slice(0, 5));
  return delay(PACIENTES_MOCK.filter((p) => p.nombre.toLowerCase().includes(q)));
}

export async function obtenerPaciente(id: number): Promise<PacienteMini | undefined> {
  return delay(PACIENTES_MOCK.find((p) => p.id === id));
}