import { ChevronRight } from "lucide-react";
import type { Paciente } from "../types";

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
            <th>Nombre</th>
            <th>CI</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th aria-label="Acciones"></th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} onClick={() => onClick(p.id)}>
              <td className="od-tabla-nombre">{p.nombre}</td>
              <td>{p.ci}</td>
              <td>{p.telefono || "—"}</td>
              <td>{p.email || "—"}</td>
              <td>
                <span className="od-badge">Activo</span>
              </td>
              <td className="od-tabla-accion">
                <ChevronRight size={16} strokeWidth={2.5} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}