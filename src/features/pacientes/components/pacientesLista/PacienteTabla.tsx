import { ChevronRight } from "lucide-react";
import type { Paciente } from "../../types";
import { iniciales, formatFecha } from "../../utils/utils";

interface Props {
  pacientes: Paciente[];
  onClick: (id: number) => void;
}

export function PacienteTabla({ pacientes, onClick }: Props) {
  return (
    <div className="od-tabla-wrap">
      <table className="od-tabla">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Estado</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Última visita</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} onClick={() => onClick(p.id)}>
              <td>
                <div className="od-tabla-paciente">
                  <div className="od-avatar od-avatar-sm">{iniciales(p.nombre)}</div>
                  <span className="od-tabla-nombre">{p.nombre}</span>
                </div>
              </td>
              <td>
                <span className="od-badge">Activo</span>
              </td>
              <td>{p.telefono || "—"}</td>
              <td>{p.email || "—"}</td>
              <td>{formatFecha(p.fecha_ultima_visita)}</td>
              <td>
                <span className="od-tabla-accion">
                  Ver perfil
                  <ChevronRight size={14} strokeWidth={2.5} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}