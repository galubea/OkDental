import { useState } from "react";
import { usePacienteDetalle } from "./hooks/usePacienteDetalle";
import { PacienteDetalleBanner, InfoPersonalTab } from "./components";
import HistoriaClinicaTab from "./HistoriaClinicaTab";
import ResumenClinicoTab from "./ResumenClinicoTab";
import OdontogramaTab from "./OdontogramaTab";
import CitasTab from "./CitasTab"; 
import FotosTab from "./FotosTab";
import { Toast, type ToastTipo } from "./components/common/Toast";
import "./styles/Pacientes.css";
import "./styles/modal.css";

interface Props {
  pacienteId: number;
  onVolver: () => void;
}

type TabDetalle = "info" | "historia" | "resumen" | "citas" | "odontograma" | "fotos";

export default function PacienteDetalle({ pacienteId, onVolver }: Props) {
  const { paciente, cargando, error, guardando, guardar } = usePacienteDetalle(pacienteId);
  const [editando, setEditando] = useState(false);
  const [tab, setTab] = useState<TabDetalle>("info");
  const [toast, setToast] = useState<{ titulo: string; mensaje: string; tipo: ToastTipo } | null>(null);

  async function handleGuardar(cambios: Parameters<typeof guardar>[0]) {
    const ok = await guardar(cambios);
    if (ok) {
      setEditando(false);
      setToast({
        titulo: "¡Éxito!",
        mensaje: "La información se ha guardado correctamente.",
        tipo: "exito",
      });
    } else {
      setToast({
        titulo: "Error",
        mensaje: "Ocurrió un problema al guardar los cambios.",
        tipo: "error",
      });
    }
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
        <span
          className={`od-detalle-tab ${tab === "citas" ? "activo" : ""}`}
          onClick={() => setTab("citas")}
        >
          Citas
        </span>
        <span
          className={`od-detalle-tab ${tab === "odontograma" ? "activo" : ""}`}
          onClick={() => setTab("odontograma")}
        >
          Odontograma
        </span>
        <span
          className={`od-detalle-tab ${tab === "fotos" ? "activo" : ""}`}
          onClick={() => setTab("fotos")}
        >
          Fotos
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
      {tab === "citas" && <CitasTab pacienteId={pacienteId} pacienteNombre={paciente.nombre} />}
      {tab === "odontograma" && <OdontogramaTab pacienteId={pacienteId} />}
      {tab === "fotos" && <FotosTab pacienteId={pacienteId} />}

      {toast && (
        <Toast
          titulo={toast.titulo}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast(null)}
        />
      )}
    </div>
  );
}