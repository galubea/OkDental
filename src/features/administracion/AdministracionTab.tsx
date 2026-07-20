import { useState } from "react";
import { Users } from "lucide-react";
import GestionUsuarios from "./components/gestionUsuarios/GestionUsuarios";

type SubSeccionAdmin = "usuarios";

const SUB_NAV = [
  { id: "usuarios" as const, label: "Gestión de cuentas", icon: Users },
];

export function AdministracionTab() {
  const [subSeccion, setSubSeccion] = useState<SubSeccionAdmin>("usuarios");

  return (
    <div className="od-admin-layout">
      <aside className="od-admin-subnav">
        {SUB_NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`od-admin-subnav-item ${subSeccion === id ? "activo" : ""}`}
            onClick={() => setSubSeccion(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </aside>

      <div className="od-admin-contenido">
        {subSeccion === "usuarios" && <GestionUsuarios />}
      </div>
    </div>
  );
}