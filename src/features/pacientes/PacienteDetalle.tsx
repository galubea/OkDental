import { useState } from "react";
import { usePacienteDetalle } from "./hooks/usePacienteDetalle";
import { PacienteDetalleBanner, InfoPersonalTab } from "./components";
import "./pacientes.css";

interface Props {
  pacienteId: number;
  onVolver: () => void;
}

export default function PacienteDetalle({ pacienteId, onVolver }: Props) {
  const { paciente, cargando, error, guardando, guardar } = usePacienteDetalle(pacienteId);
  const [editando, setEditando] = useState(false);

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
        <span className="od-detalle-tab activo">Info Personal</span>
        {/* Próximas pestañas: Resumen, Historial Médico, Citas, Fotos, Odontograma */}
      </div>

      <InfoPersonalTab
        paciente={paciente}
        editando={editando}
        guardando={guardando}
        onGuardar={handleGuardar}
        onEditar={() => setEditando(true)}
        onCancelar={() => setEditando(false)}
      />
    </div>
  );
}