import { useState } from "react";
import { AppShell } from "./features/layout/AppShell";
import PacienteLista from "./features/pacientes/PacientesLista";
import PacienteDetalle from "./features/pacientes/PacienteDetalle";
import AgendaTab from "./features/agenda/AgendaTab";
import type { VistaApp, SeccionNav } from "./types/navegacion";

function App() {
  const [vista, setVista] = useState<VistaApp>({ tipo: "pacientes" });

  function seccionDeVista(v: VistaApp): SeccionNav {
    if (v.tipo === "paciente-detalle") return "pacientes";
    return v.tipo;
  }

  function navegar(seccion: SeccionNav) {
    if (seccion === "pacientes") setVista({ tipo: "pacientes" });
    else if (seccion === "agenda") setVista({ tipo: "agenda" });
    else setVista({ tipo: "inicio" });
  }

  return (
    <AppShell seccionActiva={seccionDeVista(vista)} onNavegar={navegar}>
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