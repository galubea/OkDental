import { Home, Users, Calendar, Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import type { SeccionNav } from "../../types/navegacion";
import { useAuth } from "../autentificacion/hooks/useAuth";
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
  { key: "catalogo", label: "Catálogo", icono: <Search size={17} strokeWidth={2} /> },
];

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "??";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function AppShell({ seccionActiva, onNavegar, children }: Props) {
  const { doctor, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const nombreMostrado = doctor?.nombreCompleto ?? "Doctor";
  const avatarTexto = iniciales(nombreMostrado);

  async function manejarLogout() {
    setMenuAbierto(false);
    await logout();
  }

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

          <div className="shell-usuario-wrapper">
            <button
              className="shell-usuario"
              onClick={() => setMenuAbierto((v) => !v)}
            >
              <span className="shell-avatar">{avatarTexto}</span>
              <span className="shell-usuario-nombre">{nombreMostrado}</span>
            </button>

            {menuAbierto && (
              <>
                <div className="shell-usuario-overlay" onClick={() => setMenuAbierto(false)} />
                <div className="shell-usuario-menu">
                  {doctor?.especialidad && (
                    <div className="shell-usuario-menu-especialidad">{doctor.especialidad}</div>
                  )}
                  <button className="shell-usuario-menu-item" onClick={manejarLogout}>
                    <LogOut size={15} strokeWidth={2} />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="shell-contenido">{children}</main>
    </div>
  );
}