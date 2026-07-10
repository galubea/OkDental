import { useCallback, useEffect, useMemo, useState } from "react";
import type { CitaAgendaVista, VistaAgenda } from "../types/agenda";
import type { NuevaCitaInput } from "../../pacientes/types/citas";
import { obtenerTodasLasCitas, crearCita } from "../../pacientes/api/citasApi";
import { obtenerPaciente } from "../utils/pacientesDirectorio";

function inicioDeSemana(fecha: Date): Date {
  const d = new Date(fecha);
  const dia = d.getDay();
  const offset = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function aISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export interface PrellenadoNuevaCita {
  fecha: string;
  hora: string;
}

export function useAgenda() {
  const [citas, setCitas] = useState<CitaAgendaVista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<VistaAgenda>("semana");
  const [fechaRef, setFechaRef] = useState(new Date());
  const [doctorFiltro, setDoctorFiltro] = useState<string | null>(null);
  const [modalNuevaCitaAbierto, setModalNuevaCitaAbierto] = useState(false);
  const [prellenado, setPrellenado] = useState<PrellenadoNuevaCita | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const todas = await obtenerTodasLasCitas();
      const vistas = await Promise.all(
        todas.map(async (c) => {
          const paciente = await obtenerPaciente(c.pacienteId);
          return {
            id: c.id,
            pacienteId: c.pacienteId,
            pacienteNombre: paciente?.nombre ?? "Paciente sin nombre",
            motivo: c.motivo,
            fecha: c.fecha,
            horaInicio: c.hora,
            duracionMin: c.duracionMin ?? 60,
            doctorId: c.doctorId ?? null,
            estado: c.estado,
          } as CitaAgendaVista;
        })
      );
      setCitas(vistas);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const citasFiltradas = useMemo(
    () => (doctorFiltro ? citas.filter((c) => c.doctorId === doctorFiltro) : citas),
    [citas, doctorFiltro]
  );

  const inicioSemana = useMemo(() => inicioDeSemana(fechaRef), [fechaRef]);
  const diasSemana = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicioSemana);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [inicioSemana]
  );

  const citasHoy = useMemo(() => {
    const hoyISO = aISO(new Date());
    return citasFiltradas.filter((c) => c.fecha === hoyISO).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }, [citasFiltradas]);

  function irHoy() { setFechaRef(new Date()); }

  function avanzar() {
    setFechaRef((prev) => {
      const d = new Date(prev);
      if (vista === "semana") d.setDate(d.getDate() + 7);
      else if (vista === "mes") d.setMonth(d.getMonth() + 1);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  }

  function retroceder() {
    setFechaRef((prev) => {
      const d = new Date(prev);
      if (vista === "semana") d.setDate(d.getDate() - 7);
      else if (vista === "mes") d.setMonth(d.getMonth() - 1);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  }

  function abrirModalNuevaCita(pre?: PrellenadoNuevaCita) {
    setPrellenado(pre ?? null);
    setModalNuevaCitaAbierto(true);
  }

  function cerrarModalNuevaCita() {
    setModalNuevaCitaAbierto(false);
    setPrellenado(null);
  }

  async function agendar(pacienteId: number, input: NuevaCitaInput) {
    setGuardando(true);
    try {
      await crearCita(pacienteId, input);
      await cargar();
      cerrarModalNuevaCita();
    } finally {
      setGuardando(false);
    }
  }

  return {
    citas: citasFiltradas,
    citasHoy,
    cargando,
    guardando,
    vista, setVista,
    fechaRef,
    diasSemana,
    doctorFiltro, setDoctorFiltro,
    irHoy, avanzar, retroceder,
    totalCitasSemana: citasFiltradas.filter((c) => diasSemana.some((d) => aISO(d) === c.fecha)).length,
    modalNuevaCitaAbierto, prellenado,
    abrirModalNuevaCita, cerrarModalNuevaCita,
    agendar,
  };
}