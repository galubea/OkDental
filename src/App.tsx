import PacienteLista from "./features/pacientes/PacientesLista";

function App() {
  return (
    <PacienteLista onAbrirPaciente={(id) => console.log("Abrir paciente", id)} />
  );
}

export default App;