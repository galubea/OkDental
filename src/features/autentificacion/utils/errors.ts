export function toAuthErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  return "Ocurrió un error inesperado. Intenta de nuevo.";
}