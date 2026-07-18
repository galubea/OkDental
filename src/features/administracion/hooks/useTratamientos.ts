// hooks/useTratamientos.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type {
  Tratamiento,
  TratamientoFormValues,
  CategoriaTratamiento,
  FiltrosCatalogo,
} from "../types/treatment";

/**
 * Comandos Rust esperados (ver src-tauri/catalogo_tratamientos/commands.rs):
 *  - get_tratamientos()               -> Tratamiento[]
 *  - get_categorias_tratamiento()     -> CategoriaTratamiento[]
 *  - crear_tratamiento(payload)       -> Tratamiento   (el backend genera "codigo")
 *  - actualizar_tratamiento(id, payload) -> Tratamiento
 *  - eliminar_tratamiento(id)         -> void   (soft-delete: activo = false)
 *
 * El código (ej. "OPE-04") ya NO se calcula aquí: se genera en Rust, dentro
 * del mismo lock de la conexión SQLite, así que no hay riesgo de colisión
 * aunque dos personas creen tratamientos casi al mismo tiempo.
 */
export function useTratamientos() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaTratamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [tData, cData] = await Promise.all([
        invoke<Tratamiento[]>("catalogo_get_tratamientos"),
        invoke<CategoriaTratamiento[]>("catalogo_get_categorias"),
      ]);
      setTratamientos(tData);
      setCategorias(cData);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el catálogo. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = useCallback(async (values: TratamientoFormValues) => {
    const nuevo = await invoke<Tratamiento>("catalogo_crear_tratamiento", {
      payload: values,
    });
    setTratamientos((prev) => [nuevo, ...prev]);
    return nuevo;
  }, []);

  const actualizar = useCallback(
    async (id: string, values: TratamientoFormValues) => {
      // El código NO se recalcula al editar: una vez asignado, se mantiene
      // (aunque el dentista cambie el nombre o el precio después).
      const actualizado = await invoke<Tratamiento>("catalogo_actualizar_tratamiento", {
        id,
        payload: values,
      });
      setTratamientos((prev) =>
        prev.map((t) => (t.id === id ? actualizado : t))
      );
      return actualizado;
    },
    []
  );

  const eliminar = useCallback(async (id: string) => {
    await invoke("catalogo_eliminar_tratamiento", { id });
    // soft-delete recomendado: no lo saques de la lista, marca activo=false
    setTratamientos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, activo: false } : t))
    );
  }, []);

  return { tratamientos, categorias, cargando, error, cargar, crear, actualizar, eliminar };
}

/** Filtra en memoria: búsqueda por nombre/código y por categoría/estado */
export function useFiltrosCatalogo(tratamientos: Tratamiento[], filtros: FiltrosCatalogo) {
  return useMemo(() => {
    const texto = filtros.busqueda.trim().toLowerCase();
    return tratamientos.filter((t) => {
      if (filtros.soloActivos && !t.activo) return false;
      if (filtros.categoriaId !== "todas" && t.categoriaId !== filtros.categoriaId)
        return false;
      if (!texto) return true;
      return (
        t.nombre.toLowerCase().includes(texto) ||
        t.codigo.toLowerCase().includes(texto)
      );
    });
  }, [tratamientos, filtros]);
}