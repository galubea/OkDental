import { Phone, Clock, ChevronRight } from "lucide-react";
import type { Paciente } from "../../types/paciente";
import { iniciales, formatFecha } from "../../utils/utils";

interface Props {
  paciente: Paciente;
  onClick: (id: number) => void;
}

export function PacienteCard({ paciente, onClick }: Props) {
  const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;

  return (
    <div className="od-card" onClick={() => onClick(paciente.id)}>
      <div className="od-card-top">
        <div className="od-avatar">{iniciales(nombreCompleto)}</div>
        <div>
          <p className="od-card-name">{nombreCompleto}</p>
          <span className="od-badge">Activo</span>
        </div>
      </div>

      <div className="od-info-row">
        <Phone size={15} strokeWidth={2} className="od-icon" />
        <span>{paciente.telefono || "Sin teléfono registrado"}</span>
      </div>
      <div className="od-info-row">
        <Clock size={15} strokeWidth={2} className="od-icon" />
        <span>Última visita: {formatFecha(paciente.fecha_ultima_visita)}</span>
      </div>

      <div className="od-card-footer">
        <span>Ver perfil completo</span>
        <ChevronRight size={16} strokeWidth={2.5} />
      </div>
    </div>
  );
}