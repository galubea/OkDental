import { Home, Users, Calendar, Search, Bell } from "lucide-react";
import type { SeccionNav } from "../../types/navegacion";
import "./styles/shell.css";

interface Props {
  seccionActiva: SeccionNav;
  onNavegar: (seccion: SeccionNav) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { key: SeccionNav; label: string; icono: React.ReactNode }[] = [
  { key: "inicio", label: "Inicio", icono: <Home size={17} strokeWidth={2} /> },
  { key: "pacientes", label: "Pacientes", icono: <Users size={17} strokeWidth={2} /> },
  { key: "agenda", label: "Agenda", icono: <Calendar size={17} strokeWidth={2} /> },
];

export function AppShell({ seccionActiva, onNavegar, children }: Props) {
  return (
    <div className="shell-page">
      <header className="shell-navbar">
        <div className="shell-navbar-izquierda">
          <span className="shell-logo">
            <span className="shell-logo-ok">OK</span> Dental
          </span>

          <nav className="shell-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`shell-nav-item ${seccionActiva === item.key ? "activo" : ""}`}
                onClick={() => onNavegar(item.key)}
              >
                {item.icono}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="shell-navbar-derecha">
          <div className="shell-buscador">
            <Search size={15} strokeWidth={2} className="shell-buscador-icono" />
            <input type="text" placeholder="Buscar pacientes..." className="shell-buscador-input" />
          </div>

          <button className="shell-icon-btn" title="Notificaciones">
            <Bell size={18} strokeWidth={2} />
          </button>

          <div className="shell-usuario">
            <span className="shell-avatar">DA</span>
            <span className="shell-usuario-nombre">Dr. Admin</span>
          </div>
        </div>
      </header>

      <main className="shell-contenido">{children}</main>
    </div>
  );
}