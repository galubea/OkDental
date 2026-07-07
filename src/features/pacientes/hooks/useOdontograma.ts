import { useCallback, useEffect, useMemo, useState } from "react";
import type { Avance, DienteData, EstadoDental, ModoOdontograma, SuperficieDental } from "../types";
import { obtenerOdontograma, guardarOdontograma } from "../api";
import { ESTADOS_DENTALES } from "../odontogramaConstants";

export function useOdontograma(pacienteId: number) {
  const [modo, setModo] = useState<ModoOdontograma>("adulto");
  const [dientesAdulto, setDientesAdulto] = useState<Record<string, DienteData>>({});
  const [dientesInfantil, setDientesInfantil] = useState<Record<string, DienteData>>({});
  const [pincelActivo, setPincelActivo] = useState<EstadoDental | null>(null);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerOdontograma(pacienteId);
      setDientesAdulto(data.adulto);
      setDientesInfantil(data.infantil);
    } finally {
      setCargando(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const dientes = modo === "adulto" ? dientesAdulto : dientesInfantil;
  const setDientes = modo === "adulto" ? setDientesAdulto : setDientesInfantil;

  // ── Selección: clic en el diente completo ──
  // Si hay pincel activo, pinta TODAS las caras (estado general) y NO abre panel.
  // Si no hay pincel activo, abre/cierra el panel de detalle.
  function seleccionarDiente(numero: string) {
    if (pincelActivo) {
      aplicarEstadoGeneral(numero, pincelActivo);
      return;
    }
    setDienteSeleccionado((actual) => (actual === numero ? null : numero));
  }

  // ── Selección: clic en UNA cara del círculo ──
  // Si hay pincel activo, pinta SOLO esa cara.
  // Si no hay pincel activo, abre el panel igual que un clic normal (sin pintar).
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
    setGuardando(true);
    try {
      await guardarOdontograma(pacienteId, modo, dientes);
      setMensaje("Odontograma guardado correctamente.");
    } catch {
      setMensaje("No se pudo guardar el odontograma.");
    } finally {
      setGuardando(false);
      setTimeout(() => setMensaje(""), 3000);
    }
  }

  // Resumen: cuántos dientes tienen cada estado (mirando la superficie vestibular como referencia rápida)
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
    modo, setModo,
    dientes,
    pincelActivo, setPincelActivo,
    dienteSeleccionado, seleccionarDiente, seleccionarCara, cerrarPanel,
    aplicarEstadoCara, aplicarEstadoGeneral, reactivarDiente, resetearDiente,
    agregarAvance, actualizarObservacion,
    cargando, guardando, guardar, mensaje,
    resumen,
  };
}