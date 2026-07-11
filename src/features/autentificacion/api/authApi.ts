import type { Doctor, LoginCredentials, RegisterDoctorInput } from "../types/doctor";

export interface AuthApi {
  login(credentials: LoginCredentials): Promise<Doctor>;
  logout(): Promise<void>;
  getActiveSession(): Promise<Doctor | null>;
  registerDoctor(input: RegisterDoctorInput): Promise<void>;
}