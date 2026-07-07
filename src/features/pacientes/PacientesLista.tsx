import { useState } from "react";
import { UserRoundPlus, Users } from "lucide-react";
import { usePacientes } from "./hooks/usePacientes";
import {
  PacienteCard,
  BuscadorPacientes,
  NuevoPacienteModal,
  SelectorVista,
  PacienteTabla,
  Paginacion,
} from "./components";

type VistaPacientes = "cards" | "tabla";
import "./styles/Pacientes.css";

interface Props {
  onAbrirPaciente: (id: number) => void;
}

export default function PacienteLista({ onAbrirPaciente }: Props) {
  const { pacientes, pacientesPagina, cargando, error, cargar, pagina, totalPaginas, irAPagina } =
    usePacientes();
  const [query, setQuery] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState<VistaPacientes>("cards");

  function handleBuscar() {
    cargar(query.trim() || undefined);
  }

  return (
    <div className="od-page">
      <div className="od-header">
        <div>
          <h1>Directorio de Pacientes</h1>
          <p>Administra los registros de pacientes de tu clínica</p>
        </div>
        <button className="od-btn-primary" onClick={() => setModalAbierto(true)}>
          <UserRoundPlus size={17} strokeWidth={2.2} />
          Nuevo Paciente
        </button>
      </div>

      <BuscadorPacientes query={query} onQueryChange={setQuery} onBuscar={handleBuscar} />

      <div className="od-toolbar">
        <p className="od-count">
          {cargando
            ? "Cargando..."
            : error
            ? error
            : `${pacientes.length} paciente(s) encontrado(s)`}
        </p>
        <SelectorVista vista={vista} onChange={setVista} />
      </div>

      {!cargando && !error && pacientes.length === 0 && (
        <div className="od-empty">
          <Users size={36} strokeWidth={1.5} />
          <p>No hay pacientes registrados</p>
          <button className="od-btn-primary" onClick={() => setModalAbierto(true)}>
            <UserRoundPlus size={17} strokeWidth={2.2} />
            Agregar el primero
          </button>
        </div>
      )}

      {!cargando && pacientes.length > 0 && vista === "cards" && (
        <div className="od-grid">
          {pacientesPagina.map((p) => (
            <PacienteCard key={p.id} paciente={p} onClick={onAbrirPaciente} />
          ))}
        </div>
      )}

      {!cargando && pacientes.length > 0 && vista === "tabla" && (
        <PacienteTabla pacientes={pacientesPagina} onClick={onAbrirPaciente} />
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={irAPagina} />

      {modalAbierto && (
        <NuevoPacienteModal
          onClose={() => setModalAbierto(false)}
          onCreated={() => cargar(query.trim() || undefined)}
        />
      )}
    </div>
  );
}