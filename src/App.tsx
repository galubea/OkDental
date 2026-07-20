import { useState } from "react";
import { AppShell } from "./features/layout/AppShell";
import PacienteLista from "./features/pacientes/PacientesLista";
import PacienteDetalle from "./features/pacientes/PacienteDetalle";
import AgendaTab from "./features/agenda/AgendaTab";
import { LoginPage } from "./features/autentificacion/LoginPage";
import { RegisterPage } from "./features/autentificacion/RegisterPage";
import { useAuth } from "./features/autentificacion/hooks/useAuth";
import CatalogoTratamientos from "./features/catalogo/components/catalogo/CatalogoTratamientos";
import { AdministracionTab } from "./features/administracion/AdministracionTab";
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
    else if (seccion === "catalogo") setVista({ tipo: "catalogo" });
    else if (seccion === "administracion") setVista({ tipo: "administracion" });
    else setVista({ tipo: "inicio" });
  }

  if (status === "checking") {
    return <p className="hc-estado">Cargando sesión...</p>;
  }

  if (status !== "authenticated") {
    return pantallaAuth === "login" ? (
      <LoginPage onIrARegistro={() => setPantallaAuth("registro")} />
    ) : (
      <RegisterPage onIrALogin={() => setPantallaAuth("login")} />
    );
  }

  return (
    <AppShell seccionActiva={seccionDeVista(vista)} onNavegar={navegar}>
      {vista.tipo === "inicio" && (
        <p className="hc-estado">Inicio (pendiente de construir)</p>
      )}

      {vista.tipo === "pacientes" && (
        <PacienteLista onAbrirPaciente={(id) => setVista({ tipo: "paciente-detalle", id })} />
      )}

      {vista.tipo === "paciente-detalle" && (
        <PacienteDetalle pacienteId={vista.id} onVolver={() => setVista({ tipo: "pacientes" })} />
      )}

      {vista.tipo === "agenda" && <AgendaTab />}
      {vista.tipo === "catalogo" && <CatalogoTratamientos />}
      {vista.tipo === "administracion" && <AdministracionTab />}
    </AppShell>
  );
}

export default App;