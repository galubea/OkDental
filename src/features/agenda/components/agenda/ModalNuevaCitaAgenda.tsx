import { useState } from "react";
import { X } from "lucide-react";
import type { PacienteMini } from "../../utils/pacientesDirectorio";
import { DOCTORES } from "../../utils/doctoresMock";
import { DURACIONES_CITA } from "../../../pacientes/types/citas";
import { SelectorPaciente } from "./SelectorPaciente";
import type { PrellenadoNuevaCita } from "../../hooks/useAgenda";

interface Props {
  prellenado: PrellenadoNuevaCita | null;
  guardando: boolean;
  onCancelar: () => void;
  onAgendar: (pacienteId: number, input: { fecha: string; hora: string; motivo: string; doctorId?: string; duracionMin: number }) => void;
}

function hoyISO() { return new Date().toISOString().slice(0, 10); }
function horaActualRedondeada() {
  const d = new Date();
  const min = d.getMinutes() < 30 ? "00" : "30";
  return `${String(d.getHours()).padStart(2, "0")}:${min}`;
}

export function ModalNuevaCitaAgenda({ prellenado, guardando, onCancelar, onAgendar }: Props) {
  const [paciente, setPaciente] = useState<PacienteMini | null>(null);
  const [fecha, setFecha] = useState(prellenado?.fecha ?? hoyISO());
  const [hora, setHora] = useState(prellenado?.hora ?? horaActualRedondeada());
  const [duracionMin, setDuracionMin] = useState(60);
  const [doctorId, setDoctorId] = useState<string>("");
  const [motivo, setMotivo] = useState("");

  const puedeAgendar = paciente !== null && fecha.trim() !== "" && hora.trim() !== "";

  function handleAgendar() {
    if (!puedeAgendar || !paciente) return;
    onAgendar(paciente.id, {
      fecha, hora, duracionMin, motivo: motivo.trim(),
      doctorId: doctorId || undefined,
    });
  }

  return (
    <div className="odo-modal-overlay" onClick={onCancelar}>
      <div className="cit-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-header">
          <h3 className="cit-modal-titulo">Nueva Cita</h3>
          <button className="odo-panel-icon-btn" onClick={onCancelar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="cit-modal-body">
          <div className="cit-campo">
            <label className="cit-campo-label">Paciente</label>
            <SelectorPaciente pacienteSeleccionado={paciente} onSeleccionar={setPaciente} />
          </div>

          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Fecha</label>
              <input type="date" className="cit-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Hora</label>
              <input type="time" className="cit-input" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>

          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Duración</label>
              <select className="cit-input" value={duracionMin} onChange={(e) => setDuracionMin(Number(e.target.value))}>
                {DURACIONES_CITA.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Doctor</label>
              <select className="cit-input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                <option value="">Sin asignar</option>
                {DOCTORES.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Motivo / Tipo de consulta</label>
            <input
              type="text"
              className="cit-input"
              placeholder="Ej. Limpieza de rutina"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
        </div>

        <div className="cit-modal-footer">
          <button className="cit-btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="od-btn-primary" onClick={handleAgendar} disabled={!puedeAgendar || guardando}>
            {guardando ? "Agendando..." : "Agendar cita"}
          </button>
        </div>
      </div>
    </div>
  );
}