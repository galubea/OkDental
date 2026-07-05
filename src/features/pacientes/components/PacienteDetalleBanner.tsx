import { ArrowLeft, Phone, Mail, CalendarPlus } from "lucide-react";
import type { Paciente } from "../types";
import { iniciales } from "../utils/utils";

interface Props {
  paciente: Paciente;
  onVolver: () => void;
}

export function PacienteDetalleBanner({ paciente, onVolver }: Props) {
  return (
    <div className="od-detalle-banner">
      <div className="od-detalle-banner-top">
        <button className="od-icon-btn" onClick={onVolver} aria-label="Volver">
          <ArrowLeft size={18} strokeWidth={2} />
        </button>

        <div className="od-avatar-lg">{iniciales(paciente.nombre)}</div>

        <div className="od-detalle-info">
          <div className="od-detalle-name-row">
            <h1>{paciente.nombre}</h1>
            <span className="od-badge">Paciente Activo</span>
          </div>
          <div className="od-detalle-contact-row">
            <span className="od-contact-item">
              <Phone size={15} strokeWidth={2} className="od-icon" />
              {paciente.telefono || "—"}
            </span>
            <span className="od-contact-item">
              <Mail size={15} strokeWidth={2} className="od-icon" />
              {paciente.email || "—"}
            </span>
          </div>
        </div>

        <div className="od-detalle-actions">
          <button className="od-btn-primary" disabled title="Próximamente">
            <CalendarPlus size={15} strokeWidth={2} />
            Agendar Cita
          </button>
        </div>
      </div>
      <hr className="od-divider" />
    </div>
  );
}