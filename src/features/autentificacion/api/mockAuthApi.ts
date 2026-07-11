import type { Doctor, LoginCredentials, RegisterDoctorInput } from "../types/doctor";
import type { AuthApi } from "./authApi";

const DOCTOR_DEMO: Doctor = {
  id: 1,
  nombreCompleto: "Dra. Ana Pérez",
  email: "ana@luminadental.com",
  especialidad: "Ortodoncia",
};

const CREDENCIALES_DEMO = {
  email: "ana@luminadental.com",
  password: "contraseñaSegura123",
};

const LATENCIA_SIMULADA_MS = 550;

const doctoresRegistrados = new Map<string, { doctor: Doctor; password: string }>([
  [CREDENCIALES_DEMO.email, { doctor: DOCTOR_DEMO, password: CREDENCIALES_DEMO.password }],
]);

let sesionEnMemoria: Doctor | null = null;
let siguienteId = 2;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAuthApi: AuthApi = {
  async login(credentials: LoginCredentials): Promise<Doctor> {
    await esperar(LATENCIA_SIMULADA_MS);
    const email = credentials.email.trim().toLowerCase();
    const registro = doctoresRegistrados.get(email);
    if (!registro || registro.password !== credentials.password) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    sesionEnMemoria = registro.doctor;
    return registro.doctor;
  },

  async logout(): Promise<void> {
    await esperar(150);
    sesionEnMemoria = null;
  },

  async getActiveSession(): Promise<Doctor | null> {
    await esperar(150);
    return sesionEnMemoria;
  },

  async registerDoctor(input: RegisterDoctorInput): Promise<void> {
    await esperar(LATENCIA_SIMULADA_MS);
    const email = input.email.trim().toLowerCase();
    if (doctoresRegistrados.has(email)) {
      throw new Error("Ya existe un doctor registrado con ese correo.");
    }
    if (input.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }
    const doctor: Doctor = {
      id: siguienteId++,
      nombreCompleto: input.nombreCompleto,
      email,
      especialidad: input.especialidad ?? null,
    };
    doctoresRegistrados.set(email, { doctor, password: input.password });
  },
};