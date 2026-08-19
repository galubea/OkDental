import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { CasoClinico, EstadoCaso, NuevoCasoInput, NuevoPasoInput } from "../types/casoClinico";
import type { DoctorResumen } from "../types/citas";
import {
  listarCasosClinicos,
  crearCasoClinico,
  actualizarEstadoCaso,
  actualizarDiagnosticoCaso,
  agregarPasoPlanCaso,
  togglePasoPlanCaso,
  eliminarPasoPlanCaso,
  agregarEvolucionCaso,
  agregarObservacionCaso,
  agregarEvidenciaCaso,
  eliminarEvidenciaCaso,
} from "../api/casoClinicoApi";

// Mismo shape que usa el catálogo real (catalogo_tratamientos::commands::catalogo_get_tratamientos)
export interface CatalogoTratamientoResumen {
  id: string;
  nombre: string;
  precioBase: number;
  categoriaId: string;
}

export function useCasoClinico(pacienteId: number | null | undefined) {
  const [casos, setCasos] = useState<CasoClinico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [doctores, setDoctores] = useState<DoctorResumen[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoTratamientoResumen[]>([]);
  const [tabActivo, setTabActivo] = useState<EstadoCaso | "todos">("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [casoSeleccionadoId, setCasoSeleccionadoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pacienteId válido = número entero positivo. Mientras no lo sea (paciente
  // aún no cargó, prop no pasada, etc.) no disparamos ningún invoke: eso es
  // lo que causaba "missing required key pacienteId" (undefined se elimina
  // al serializar el objeto de args hacia Rust).
  const pacienteIdValido = typeof pacienteId === "number" && Number.isFinite(pacienteId) && pacienteId > 0;

  const cargar = useCallback(async () => {
    if (!pacienteIdValido) {
      setCasos([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const [casosData, doctoresData, catalogoData] = await Promise.all([
        listarCasosClinicos(pacienteId as number),
        invoke<DoctorResumen[]>("listar_doctores"),
        invoke<CatalogoTratamientoResumen[]>("catalogo_get_tratamientos"),
      ]);
      setCasos(casosData);
      setDoctores(doctoresData);
      setCatalogo(catalogoData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los casos clínicos.");
    } finally {
      setCargando(false);
    }
  }, [pacienteId, pacienteIdValido]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const actualizarUno = (caso: CasoClinico) => {
    setCasos((prev) => prev.map((c) => (c.id === caso.id ? caso : c)));
  };

  const tabsConConteo = useMemo(() => {
    const base: { key: EstadoCaso | "todos"; label: string }[] = [
      { key: "todos", label: "Todos" },
      { key: "activo", label: "Activos" },
      { key: "en_tratamiento", label: "En tratamiento" },
      { key: "resuelto", label: "Resueltos" },
    ];
    return base.map((tab) => ({
      ...tab,
      count: tab.key === "todos" ? casos.length : casos.filter((c) => c.estado === tab.key).length,
    }));
  }, [casos]);

  const casosFiltrados = useMemo(
    () => (tabActivo === "todos" ? casos : casos.filter((c) => c.estado === tabActivo)),
    [casos, tabActivo]
  );

  const casoSeleccionado = casos.find((c) => c.id === casoSeleccionadoId) ?? null;

  async function crearCaso(input: NuevoCasoInput) {
    if (!pacienteIdValido) {
      setError("No se puede crear el caso: no hay un paciente seleccionado.");
      return;
    }
    setGuardando(true);
    try {
      const nuevo = await crearCasoClinico(pacienteId as number, input);
      setCasos((prev) => [nuevo, ...prev]);
      setMostrarFormulario(false);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(casoId: string, estado: EstadoCaso) {
    actualizarUno(await actualizarEstadoCaso(casoId, estado));
  }

  async function guardarDiagnostico(casoId: string, diagnostico: string, piezas: number[]) {
    actualizarUno(await actualizarDiagnosticoCaso(casoId, diagnostico, piezas));
  }

  async function agregarPaso(casoId: string, input: NuevoPasoInput) {
    actualizarUno(await agregarPasoPlanCaso(casoId, input));
  }

  async function togglePaso(casoId: string, pasoId: string) {
    actualizarUno(await togglePasoPlanCaso(casoId, pasoId));
  }

  async function borrarPaso(casoId: string, pasoId: string) {
    actualizarUno(await eliminarPasoPlanCaso(casoId, pasoId));
  }

  async function agregarEvolucion(casoId: string, titulo: string, descripcion: string) {
    actualizarUno(await agregarEvolucionCaso(casoId, titulo, descripcion));
  }

  async function agregarObservacion(casoId: string, texto: string) {
    actualizarUno(await agregarObservacionCaso(casoId, texto));
  }

  async function agregarEvidencia(casoId: string, ruta: string, etiqueta: string) {
    actualizarUno(await agregarEvidenciaCaso(casoId, ruta, etiqueta));
  }

  async function borrarEvidencia(casoId: string, evidenciaId: string) {
    actualizarUno(await eliminarEvidenciaCaso(casoId, evidenciaId));
  }

  return {
    casos: casosFiltrados,
    cargando,
    guardando,
    error,
    pacienteIdValido,
    doctores,
    catalogo,
    tabsConConteo,
    tabActivo,
    setTabActivo,
    mostrarFormulario,
    abrirFormulario: () => setMostrarFormulario(true),
    cerrarFormulario: () => setMostrarFormulario(false),
    crearCaso,
    casoSeleccionado,
    seleccionarCaso: (id: string) => setCasoSeleccionadoId(id),
    volverALista: () => setCasoSeleccionadoId(null),
    cambiarEstado,
    guardarDiagnostico,
    agregarPaso,
    togglePaso,
    borrarPaso,
    agregarEvolucion,
    agregarObservacion,
    agregarEvidencia,
    borrarEvidencia,
  };
}