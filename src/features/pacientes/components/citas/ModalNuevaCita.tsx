import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { NuevaCitaInput, DoctorResumen } from "../../types/citas";
import { listarDoctores } from "../../api/citasApi";

interface Props {
  guardando: boolean;
  onCancelar: () => void;
  onAgendar: (input: NuevaCitaInput) => void;
}

export function ModalNuevaCita({ guardando, onCancelar, onAgendar }: Props) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");
  const [motivo, setMotivo] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctores, setDoctores] = useState<DoctorResumen[]>([]);
  const [cargandoDoctores, setCargandoDoctores] = useState(true);
  const [errorDoctores, setErrorDoctores] = useState("");

  useEffect(() => {
    listarDoctores()
      .then((data) => {
        setDoctores(data);
        if (data.length === 1) setDoctorId(String(data[0].id));
      })
      .catch(() => setErrorDoctores("No se pudieron cargar los doctores."))
      .finally(() => setCargandoDoctores(false));
  }, []);

  const puedeAgendar = fecha.trim() !== "" && hora.trim() !== "" && doctorId !== "";

  function handleAgendar() {
    if (!puedeAgendar) return;
    onAgendar({ fecha, hora, motivo: motivo.trim(), doctorId });
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
          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Fecha</label>
              <input
                type="date"
                className="cit-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Hora</label>
              <input
                type="time"
                className="cit-input"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Doctor que atenderá</label>
            <select
              className="cit-input"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              disabled={cargandoDoctores}
            >
              <option value="" disabled>
                {cargandoDoctores ? "Cargando doctores..." : "Selecciona un doctor"}
              </option>
              {doctores.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombreCompleto}
                  {d.especialidad ? ` · ${d.especialidad}` : ""}
                </option>
              ))}
            </select>
            {errorDoctores && <p className="cit-campo-error">{errorDoctores}</p>}
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
          <button className="cit-btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className="od-btn-primary"
            onClick={handleAgendar}
            disabled={!puedeAgendar || guardando}
          >
            {guardando ? "Agendando..." : "Agendar cita"}
          </button>
        </div>
      </div>
    </div>
  );
}