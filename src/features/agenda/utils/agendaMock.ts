import type { Doctor, CitaAgendaVista } from "../types/agenda";

export const DOCTORES: Doctor[] = [
  { id: "d1", nombre: "Dr. Martínez", color: "#4C7DF0" },
  { id: "d2", nombre: "Dra. López", color: "#9B6BF2" },
  { id: "d3", nombre: "Dr. Torres", color: "#2FA36B" },
  { id: "d4", nombre: "Dra. Ríos", color: "#E8873A" },
];

const MOTIVOS = [
  "Limpieza profiláctica", "Revisión general", "Extracción simple", "Extracción compleja",
  "Endodoncia", "Endodoncia control", "Blanqueamiento dental", "Corona de porcelana",
  "Radiografía de control", "Ortodoncia ajuste",
];

const PACIENTES = [
  "Ana García", "Carlos Ramírez", "María Torres", "Sofía Mendoza", "Roberto Herrera",
  "Valentina Cruz", "Lucía Vargas", "Andrés Castillo", "Fernanda Ruiz", "Isabella Flores",
  "Pablo Navarro", "Camila Reyes", "Gabriela Mora", "Sebastián Lima", "Natalia Ponce",
  "Diego Salazar", "Renata Ibarra", "Joaquín Peña",
];

function lunesDeEstaSemana(): Date {
  const hoy = new Date();
  const dia = hoy.getDay(); // 0 = domingo
  const offset = dia === 0 ? -6 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + offset);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

function sumarDias(fecha: Date, dias: number): Date {
  const d = new Date(fecha);
  d.setDate(d.getDate() + dias);
  return d;
}

function aISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

let seed = 42;
function random(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function generarCitasMock(): CitaAgendaVista[] {
  const lunes = lunesDeEstaSemana();
  const citas: CitaAgendaVista[] = [];
  const horasBase = [8, 9, 9.5, 10, 11, 11.5, 12, 13, 14, 15, 16];
  let contador = 0;

  for (let diaOffset = 0; diaOffset < 6; diaOffset++) { // lun-sáb
    const fecha = aISO(sumarDias(lunes, diaOffset));
    const citasDelDia = 2 + Math.floor(random() * 3); // 2-4 citas por día

    for (let i = 0; i < citasDelDia && contador < 20; i++) {
      const horaDecimal = horasBase[Math.floor(random() * horasBase.length)];
      const hora = Math.floor(horaDecimal);
      const minuto = horaDecimal % 1 === 0.5 ? "30" : "00";
      const duracion = [30, 60, 60, 90][Math.floor(random() * 4)];
      const doctor = DOCTORES[Math.floor(random() * DOCTORES.length)];
      const paciente = PACIENTES[contador % PACIENTES.length];
      const motivo = MOTIVOS[Math.floor(random() * MOTIVOS.length)];

      let estado: CitaAgendaVista["estado"] = "programada";
      if (random() < 0.15) estado = "cancelada";
      else if (diaOffset < 2 && random() < 0.3) estado = "atendida";

      citas.push({
          id: `ag-${contador}`,
          pacienteNombre: paciente,
          motivo,
          fecha,
          horaInicio: `${String(hora).padStart(2, "0")}:${minuto}`,
          duracionMin: duracion,
          doctorId: doctor.id,
          estado,
          pacienteId: 0
      });
      contador++;
    }
  }
  return citas;
}

export const CITAS_AGENDA_MOCK: CitaAgendaVista[] = generarCitasMock();