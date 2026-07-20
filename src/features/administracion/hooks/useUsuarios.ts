import { useCallback, useEffect, useMemo, useState } from "react";
import type { Usuario, UsuarioFormValues, FiltrosUsuarios } from "../types/user";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  regenerarPasswordUsuario,
} from "../api/usuarioApi";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setUsuarios(await listarUsuarios());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la lista de usuarios.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = useCallback(async (values: UsuarioFormValues) => {
    const { usuario, passwordTemporal } = await crearUsuario(values);
    setUsuarios((prev) => [...prev, usuario]);
    return { usuario, passwordTemporal };
  }, []);

  const actualizar = useCallback(async (id: number, values: UsuarioFormValues) => {
    const actualizado = await actualizarUsuario(id, values);
    setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)));
    return actualizado;
  }, []);

  const cambiarEstado = useCallback(async (id: number, activo: boolean) => {
    const actualizado = await cambiarEstadoUsuario(id, activo);
    setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)));
    return actualizado;
  }, []);

  const regenerarPassword = useCallback(async (id: number) => {
    return regenerarPasswordUsuario(id);
  }, []);

  return {
    usuarios,
    cargando,
    error,
    crear,
    actualizar,
    cambiarEstado,
    regenerarPassword,
    recargar: cargar,
  };
}

export function useFiltrosUsuarios(usuarios: Usuario[], filtros: FiltrosUsuarios) {
  return useMemo(
    () =>
      usuarios.filter((u) => {
        if (filtros.estado === "activo" && !u.activo) return false;
        if (filtros.estado === "inactivo" && u.activo) return false;
        if (filtros.rol !== "todos" && u.rol !== filtros.rol) return false;
        if (filtros.busqueda) {
          const q = filtros.busqueda.toLowerCase();
          if (
            !u.nombreCompleto.toLowerCase().includes(q) &&
            !u.email.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      }),
    [usuarios, filtros]
  );
}