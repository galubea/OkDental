import type { LoginCredentials, LoginFormErrors } from "../types/doctor";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return "El correo es obligatorio.";
  if (!EMAIL_REGEX.test(value)) return "Ingresa un correo válido.";
  return undefined;
}

export function validatePasswordPresente(password: string): string | undefined {
  if (!password) return "La contraseña es obligatoria.";
  return undefined;
}

export function validatePasswordNueva(password: string): string | undefined {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 8) return "Debe tener al menos 8 caracteres.";
  return undefined;
}

export function validateLoginForm(credentials: LoginCredentials): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePasswordPresente(credentials.password);
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function hasFormErrors(errors: LoginFormErrors): boolean {
  return Boolean(errors.email || errors.password || errors.form);
}