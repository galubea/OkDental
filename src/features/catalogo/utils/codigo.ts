import type { Tratamiento, CategoriaTratamiento } from "../types/treatment";

function prefijoDeCategoria(nombreCategoria: string): string {
  const limpio = nombreCategoria
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toUpperCase()
    .replace(/[^A-Z]/g, "");       

  return (limpio.slice(0, 3) || "TRT").padEnd(3, "X");
}


export function generarCodigo(
  categoria: CategoriaTratamiento,
  tratamientosExistentes: Tratamiento[]
): string {
  const prefijo = prefijoDeCategoria(categoria.nombre);

  const numeros = tratamientosExistentes
    .filter((t) => t.categoriaId === categoria.id)
    .map((t) => {
      const match = t.codigo.match(/-(\d+)$/); 
      return match ? parseInt(match[1], 10) : 0;
    });

  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
  const numeroFormateado = String(siguiente).padStart(2, "0");

  return `${prefijo}-${numeroFormateado}`;
}