export function formatFecha(fecha?: string | null): string {
  if (!fecha) return "Sin visitas registradas";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" });
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const first = partes[0]?.[0] ?? "";
  const last = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (first + last).toUpperCase();
}