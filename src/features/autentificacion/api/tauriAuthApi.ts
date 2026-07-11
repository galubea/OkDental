import { invoke } from "@tauri-apps/api/core";
import type { Doctor, LoginCredentials, RegisterDoctorInput } from "../types/doctor";
import type { AuthApi } from "./authApi";
import { toAuthErrorMessage } from "../utils/errors";

export const tauriAuthApi: AuthApi = {
  async login(credentials: LoginCredentials): Promise<Doctor> {
    try {
      return await invoke<Doctor>("login", {
        input: { email: credentials.email, password: credentials.password },
      });
    } catch (error) {
      throw new Error(toAuthErrorMessage(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await invoke<void>("cerrar_sesion");
    } catch (error) {
      throw new Error(toAuthErrorMessage(error));
    }
  },

  async getActiveSession(): Promise<Doctor | null> {
    try {
      const doctor = await invoke<Doctor | null>("sesion_activa");
      return doctor ?? null;
    } catch (error) {
      throw new Error(toAuthErrorMessage(error));
    }
  },

  async registerDoctor(input: RegisterDoctorInput): Promise<void> {
    try {
      await invoke<void>("registrar_doctor", {
        input: {
          nombre_completo: input.nombreCompleto,
          email: input.email,
          password: input.password,
          especialidad: input.especialidad ?? null,
        },
      });
    } catch (error) {
      throw new Error(toAuthErrorMessage(error));
    }
  },
};