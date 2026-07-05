import { Phone, Mail, IdCard, ChevronRight } from "lucide-react";
import type { Paciente } from "../types";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const first = partes[0]?.[0] ?? "";
  const last = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface Props {
  paciente: Paciente;
  onClick: (id: number) => void;
}

export function PacienteCard({ paciente, onClick }: Props) {
  return (
    <div className="od-card" onClick={() => onClick(paciente.id)}>
      <div className="od-card-top">
        <div className="od-avatar">{iniciales(paciente.nombre)}</div>
        <div>
          <p className="od-card-name">{paciente.nombre}</p>
          <span className="od-badge">Activo</span>
        </div>
      </div>

      <div className="od-info-row">
        <Phone size={15} strokeWidth={2} className="od-icon" />
        <span>{paciente.telefono || "Sin teléfono registrado"}</span>
      </div>
      <div className="od-info-row">
        <Mail size={15} strokeWidth={2} className="od-icon" />
        <span>{paciente.email || "Sin correo registrado"}</span>
      </div>
      <div className="od-info-row">
        <IdCard size={15} strokeWidth={2} className="od-icon" />
        <span>CI {paciente.ci}</span>
      </div>

      <div className="od-card-footer">
        <span>Ver perfil completo</span>
        <ChevronRight size={16} strokeWidth={2.5} />
      </div>
    </div>
  );
}