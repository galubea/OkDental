import { useState } from "react";
import { usePacienteDetalle } from "./hooks/usePacienteDetalle";
import { PacienteDetalleBanner, InfoPersonalTab } from "./components";
import HistoriaClinicaTab from "./HistoriaClinicaTab";
import ResumenClinicoTab from "./ResumenClinicoTab";
import "./pacientes.css";

interface Props {
  pacienteId: number;
  onVolver: () => void;
}

type TabDetalle = "info" | "historia" | "resumen";

export default function PacienteDetalle({ pacienteId, onVolver }: Props) {
  const { paciente, cargando, error, guardando, guardar } = usePacienteDetalle(pacienteId);
  const [editando, setEditando] = useState(false);
  const [tab, setTab] = useState<TabDetalle>("info");

  async function handleGuardar(cambios: Parameters<typeof guardar>[0]) {
    const ok = await guardar(cambios as any);
    if (ok) setEditando(false);
    return ok;
  }

  if (cargando) return <p className="od-detalle-estado">Cargando paciente...</p>;
  if (error || !paciente) {
    return <p className="od-detalle-estado">{error || "Paciente no encontrado."}</p>;
  }

  return (
    <div className="od-page">
      <PacienteDetalleBanner paciente={paciente} onVolver={onVolver} />

      <div className="od-detalle-tabs">
        <span
          className={`od-detalle-tab ${tab === "info" ? "activo" : ""}`}
          onClick={() => setTab("info")}
        >
          Info Personal
        </span>
        <span
          className={`od-detalle-tab ${tab === "historia" ? "activo" : ""}`}
          onClick={() => setTab("historia")}
        >
          Historia Clínica
        </span>
        <span
          className={`od-detalle-tab ${tab === "resumen" ? "activo" : ""}`}
          onClick={() => setTab("resumen")}
        >
          Resumen Clínico
        </span>
      </div>

      {tab === "info" && (
        <InfoPersonalTab
          paciente={paciente}
          editando={editando}
          guardando={guardando}
          onGuardar={handleGuardar}
          onEditar={() => setEditando(true)}
          onCancelar={() => setEditando(false)}
        />
      )}

      {tab === "historia" && <HistoriaClinicaTab pacienteId={pacienteId} />}
      {tab === "resumen" && <ResumenClinicoTab pacienteId={pacienteId} />}
    </div>
  );
}