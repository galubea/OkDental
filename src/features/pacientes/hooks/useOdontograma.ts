import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Avance,
  DienteData,
  EstadoDental,
  ModoOdontograma,
  OdontogramaResumen,
  SuperficieDental,
} from "../types/odontograma";
import {
  listarOdontogramas,
  obtenerOdontogramaPorId,
  crearOdontograma,
  guardarDientes,
  guardarObservacionGeneral,
  eliminarOdontograma,
} from "../api/odontogramaApi";
import { ESTADOS_DENTALES } from "../utils/odontogramaConstants";

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useOdontograma(pacienteId: number) {
  const [odontogramas, setOdontogramas] = useState<OdontogramaResumen[]>([]);
  const [odontogramaId, setOdontogramaId] = useState<string | null>(null);
  const [modo, setModo] = useState<ModoOdontograma>("adulto");
  const [dientesAdulto, setDientesAdulto] = useState<Record<string, DienteData>>({});
  const [dientesInfantil, setDientesInfantil] = useState<Record<string, DienteData>>({});
  const [observacionGeneral, setObservacionGeneral] = useState("");
  const [pincelActivo, setPincelActivo] = useState<EstadoDental | null>(null);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [creando, setCreando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function mostrarMensaje(texto: string) {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  }

  // Trae un odontograma específico y lo pone como "activo" en pantalla
  const cargarOdontograma = useCallback(async (id: string) => {
    const data = await obtenerOdontogramaPorId(id);
    setOdontogramaId(data.id);
    setDientesAdulto(data.adulto);
    setDientesInfantil(data.infantil);
    setObservacionGeneral(data.observacionGeneral ?? "");
    setDienteSeleccionado(null);
  }, []);

  // Trae la lista de odontogramas del paciente. Si no hay ninguno, crea uno inicial.
  const cargarTodo = useCallback(async () => {
    setCargando(true);
    try {
      const lista = await listarOdontogramas(pacienteId);

      if (lista.length === 0) {
        const nuevo = await crearOdontograma(pacienteId, {
          titulo: "Odontograma inicial",
          fecha: fechaHoy(),
        });
        const listaActualizada = await listarOdontogramas(pacienteId);
        setOdontogramas(listaActualizada);
        setOdontogramaId(nuevo.id);
        setDientesAdulto(nuevo.adulto);
        setDientesInfantil(nuevo.infantil);
        setObservacionGeneral(nuevo.observacionGeneral ?? "");
      } else {
        setOdontogramas(lista);
        await cargarOdontograma(lista[0].id);
      }
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo cargar el odontograma.");
    } finally {
      setCargando(false);
    }
  }, [pacienteId, cargarOdontograma]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const dientes = modo === "adulto" ? dientesAdulto : dientesInfantil;
  const setDientes = modo === "adulto" ? setDientesAdulto : setDientesInfantil;

  function seleccionarDiente(numero: string) {
    if (pincelActivo) {
      aplicarEstadoGeneral(numero, pincelActivo);
      return;
    }
    setDienteSeleccionado((actual) => (actual === numero ? null : numero));
  }

  function seleccionarCara(numero: string, cara: SuperficieDental) {
    if (pincelActivo) {
      aplicarEstadoCara(numero, cara, pincelActivo);
      return;
    }
    setDienteSeleccionado((actual) => (actual === numero ? null : numero));
  }

  function cerrarPanel() {
    setDienteSeleccionado(null);
  }

  function aplicarEstadoGeneral(numero: string, estado: EstadoDental) {
    setDientes((prev) => ({
      ...prev,
      [numero]: {
        ...prev[numero],
        ausente: estado === "ausente",
        superficies: {
          vestibular: estado,
          lingual: estado,
          mesial: estado,
          distal: estado,
          oclusal: estado,
        },
      },
    }));
  }

  function aplicarEstadoCara(numero: string, cara: SuperficieDental, estado: EstadoDental) {
    setDientes((prev) => ({
      ...prev,
      [numero]: {
        ...prev[numero],
        superficies: { ...prev[numero].superficies, [cara]: estado },
      },
    }));
  }

  function reactivarDiente(numero: string) {
    setDientes((prev) => ({
      ...prev,
      [numero]: {
        ...prev[numero],
        ausente: false,
        superficies: {
          vestibular: "sano", lingual: "sano", mesial: "sano", distal: "sano", oclusal: "sano",
        },
      },
    }));
  }

  function resetearDiente(numero: string) {
    setDientes((prev) => ({
      ...prev,
      [numero]: {
        ...prev[numero],
        ausente: false,
        superficies: {
          vestibular: "sano", lingual: "sano", mesial: "sano", distal: "sano", oclusal: "sano",
        },
        avances: [],
      },
    }));
  }

  function agregarAvance(numero: string, texto: string) {
    const nuevo: Avance = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString().slice(0, 10),
      texto,
    };
    setDientes((prev) => ({
      ...prev,
      [numero]: { ...prev[numero], avances: [...prev[numero].avances, nuevo] },
    }));
  }

  function actualizarObservacion(numero: string, texto: string) {
    setDientes((prev) => ({
      ...prev,
      [numero]: { ...prev[numero], observacion: texto },
    }));
  }

  async function guardar() {
    if (!odontogramaId) {
      mostrarMensaje("No se pudo guardar: odontograma no identificado.");
      return;
    }
    setGuardando(true);
    try {
      await guardarDientes(odontogramaId, modo, dientes);
      await guardarObservacionGeneral(odontogramaId, observacionGeneral);
      const listaActualizada = await listarOdontogramas(pacienteId);
      setOdontogramas(listaActualizada);
      mostrarMensaje("Odontograma guardado correctamente.");
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo guardar el odontograma.");
    } finally {
      setGuardando(false);
    }
  }

  // Cambia de odontograma activo (sin perder los otros)
  async function seleccionarOdontograma(id: string) {
    if (id === odontogramaId) return;
    setCargando(true);
    try {
      await cargarOdontograma(id);
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo cargar ese odontograma.");
    } finally {
      setCargando(false);
    }
  }
  const [eliminando, setEliminando] = useState(false);

  async function eliminar(id: string) {
    setEliminando(true);
    try {
      await eliminarOdontograma(id);
      const listaActualizada = await listarOdontogramas(pacienteId);
      setOdontogramas(listaActualizada);

      // Si el que borraste era el que estabas viendo, cambia al primero de la lista (o crea uno nuevo si ya no queda ninguno)
      if (id === odontogramaId) {
        if (listaActualizada.length > 0) {
          await cargarOdontograma(listaActualizada[0].id);
        } else {
          const nuevo = await crearOdontograma(pacienteId, {
            titulo: "Odontograma inicial",
            fecha: fechaHoy(),
          });
          const listaFinal = await listarOdontogramas(pacienteId);
          setOdontogramas(listaFinal);
          setOdontogramaId(nuevo.id);
          setDientesAdulto(nuevo.adulto);
          setDientesInfantil(nuevo.infantil);
          setObservacionGeneral(nuevo.observacionGeneral ?? "");
        }
      }

      mostrarMensaje("Odontograma eliminado.");
      return true;
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo eliminar el odontograma.");
      return false;
    } finally {
      setEliminando(false);
    }
  }
  async function guardarDiente(numero: string, textoAvanceNuevo: string) {
    if (!odontogramaId) {
      mostrarMensaje("No se pudo guardar: odontograma no identificado.");
      return false;
    }

    setGuardando(true);
    try {
      let dientesActualizados = dientes;

      if (textoAvanceNuevo.trim()) {
        const nuevo: Avance = {
          id: crypto.randomUUID(),
          fecha: new Date().toISOString().slice(0, 10),
          texto: textoAvanceNuevo.trim(),
        };
        dientesActualizados = {
          ...dientes,
          [numero]: { ...dientes[numero], avances: [...dientes[numero].avances, nuevo] },
        };
        setDientes(dientesActualizados);
      }

      await guardarDientes(odontogramaId, modo, dientesActualizados);
      await guardarObservacionGeneral(odontogramaId, observacionGeneral);
      mostrarMensaje("Cambios del diente guardados.");
      return true;
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo guardar los cambios.");
      return false;
    } finally {
      setGuardando(false);
    }
  }

  // Crea un odontograma nuevo, vacío, y lo deja seleccionado
  async function crearNuevoOdontograma(titulo: string, fecha: string) {
    setCreando(true);
    try {
      const nuevo = await crearOdontograma(pacienteId, { titulo, fecha });
      const listaActualizada = await listarOdontogramas(pacienteId);
      setOdontogramas(listaActualizada);
      setOdontogramaId(nuevo.id);
      setDientesAdulto(nuevo.adulto);
      setDientesInfantil(nuevo.infantil);
      setObservacionGeneral(nuevo.observacionGeneral ?? "");
      setDienteSeleccionado(null);
      mostrarMensaje("Odontograma creado.");
      return true;
    } catch (e) {
      mostrarMensaje(e instanceof Error ? e.message : "No se pudo crear el odontograma.");
      return false;
    } finally {
      setCreando(false);
    }
  }
  

  const resumen = useMemo(() => {
    const conteo: Record<string, number> = {};
    Object.values(dientes).forEach((d) => {
      const estados = new Set(Object.values(d.superficies));
      estados.forEach((e) => {
        if (e === "sano") return;
        conteo[e] = (conteo[e] ?? 0) + 1;
      });
    });
    return ESTADOS_DENTALES
      .filter((e) => e.key !== "sano" && conteo[e.key] > 0)
      .map((e) => ({ key: e.key, label: e.label, color: e.color, count: conteo[e.key] }));
  }, [dientes]);

  return {
    odontogramas, odontogramaId, seleccionarOdontograma,
    crearNuevoOdontograma, creando,
    eliminar, eliminando,
    modo, setModo,
    dientes,
    observacionGeneral, setObservacionGeneral,
    pincelActivo, setPincelActivo,
    dienteSeleccionado, seleccionarDiente, seleccionarCara, cerrarPanel,
    aplicarEstadoCara, aplicarEstadoGeneral, reactivarDiente, resetearDiente,
    agregarAvance, actualizarObservacion,
    guardarDiente,
    cargando, guardando, guardar, mensaje,
    resumen,
  };
}