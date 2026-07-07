import { useState } from "react";
import { Plus, FileClock } from "lucide-react";
import { useRegistrosClinicos } from "./hooks/useRegistrosClinicos";
import { NuevoRegistroModal } from "./components/NuevoRegistroModal";
import { formatFecha } from "./utils/utils";
import "./styles/resumenClinico.css";

interface Props {
  pacienteId: number;
}

export default function ResumenClinicoTab({ pacienteId }: Props) {
  const { registros, cargando, error, guardando, agregar } = useRegistrosClinicos(pacienteId);
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="rc-card">
      <div className="rc-header">
        <h2 className="rc-titulo">Resumen Clínico</h2>
        <button className="rc-btn-add" onClick={() => setModalAbierto(true)}>
          <Plus size={16} strokeWidth={2.4} />
          Agregar Registro
        </button>
      </div>

      {cargando && <p className="hc-estado">Cargando registros...</p>}
      {!cargando && error && <p className="hc-estado">{error}</p>}

      {!cargando && !error && registros.length === 0 && (
        <div className="rc-vacio">
          <FileClock size={32} strokeWidth={1.5} />
          <p>Aún no hay registros clínicos para este paciente.</p>
        </div>
      )}

      {!cargando && registros.length > 0 && (
        <div className="rc-timeline">
          {registros.map((r) => (
            <div className="rc-item" key={r.id}>
              <div className="rc-punto-col">
                <span className="rc-punto" />
                <span className="rc-linea" />
              </div>
              <div className="rc-contenido">
                <span className="rc-fecha">{formatFecha(r.fecha).toUpperCase()}</span>
                <p className="rc-item-titulo">{r.titulo}</p>
                {r.descripcion && <p className="rc-item-desc">{r.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <NuevoRegistroModal
          onClose={() => setModalAbierto(false)}
          onGuardar={agregar}
          guardando={guardando}
        />
      )}
    </div>
  );
}