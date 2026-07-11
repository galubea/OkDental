import { useState } from "react";
import { AppShell } from "./features/layout/AppShell";
import PacienteLista from "./features/pacientes/PacientesLista";
import PacienteDetalle from "./features/pacientes/PacienteDetalle";
import AgendaTab from "./features/agenda/AgendaTab";
import { LoginPage } from "./features/autentificacion/LoginPage";
import { RegisterPage } from "./features/autentificacion/RegisterPage";
import { useAuth } from "./features/autentificacion/hooks/useAuth";
import type { VistaApp, SeccionNav } from "./types/navegacion";

function App() {
  const [vista, setVista] = useState<VistaApp>({ tipo: "pacientes" });
  const [pantallaAuth, setPantallaAuth] = useState<"login" | "registro">("login");

  const { status, logout } = useAuth();

  function seccionDeVista(v: VistaApp): SeccionNav {
    if (v.tipo === "paciente-detalle") return "pacientes";
    return v.tipo;
  }

  function navegar(seccion: SeccionNav) {
    if (seccion === "pacientes") setVista({ tipo: "pacientes" });
    else if (seccion === "agenda") setVista({ tipo: "agenda" });
    else setVista({ tipo: "inicio" });
  }

  // Mientras se revisa si hay sesión activa guardada
  if (status === "checking") {
    return <p className="hc-estado">Cargando sesión...</p>;
  }

  // Sin sesión -> login o registro
  if (status !== "authenticated") {
    return pantallaAuth === "login" ? (
      <LoginPage onIrARegistro={() => setPantallaAuth("registro")} />
    ) : (
      <RegisterPage onIrALogin={() => setPantallaAuth("login")} />
    );
  }

  // Doctor autenticado -> app normal
  return (
    <AppShell
      seccionActiva={seccionDeVista(vista)}
      onNavegar={navegar}
    >
      {vista.tipo === "inicio" && (
        <p className="hc-estado">Inicio (pendiente de construir)</p>
      )}

      {vista.tipo === "pacientes" && (
        <PacienteLista
          onAbrirPaciente={(id) => setVista({ tipo: "paciente-detalle", id })}
        />
      )}

      {vista.tipo === "paciente-detalle" && (
        <PacienteDetalle
          pacienteId={vista.id}
          onVolver={() => setVista({ tipo: "pacientes" })}
        />
      )}

      {vista.tipo === "agenda" && <AgendaTab />}
    </AppShell>
  );
}

export default App;