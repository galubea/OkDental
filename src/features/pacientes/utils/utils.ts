export function formatFecha(fecha: string | null | undefined): string {
  if (!fecha) return "Sin visitas registradas";

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const d = new Date(anio, mes - 1, dia);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const first = partes[0]?.[0] ?? "";
  const last = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (first + last).toUpperCase();
}