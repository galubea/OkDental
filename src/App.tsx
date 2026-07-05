import { useState } from "react";
import PacienteLista from "./features/pacientes/PacientesLista";
import PacienteDetalle from "./features/pacientes/PacienteDetalle";

type Vista = { tipo: "lista" } | { tipo: "detalle"; id: number };

function App() {
  const [vista, setVista] = useState<Vista>({ tipo: "lista" });

  if (vista.tipo === "detalle") {
    return (
      <PacienteDetalle
        pacienteId={vista.id}
        onVolver={() => setVista({ tipo: "lista" })}
      />
    );
  }

  return (
    <PacienteLista
      onAbrirPaciente={(id) => setVista({ tipo: "detalle", id })}
    />
  );
}

export default App;