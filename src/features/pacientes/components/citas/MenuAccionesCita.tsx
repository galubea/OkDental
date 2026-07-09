import { useEffect, useRef, useState } from "react";
import { MoreVertical, CalendarClock, XCircle } from "lucide-react";
import type { EstadoCita } from "../../types/citas";

interface Props {
  estado: EstadoCita;
  onReprogramar: () => void;
  onCancelar: () => void;
}

export function MenuAccionesCita({ estado, onReprogramar, onCancelar }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  if (estado === "atendida") return null; // fija, sin acciones

  return (
    <div className="cit-menu-acciones" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="cit-menu-trigger" onClick={() => setAbierto((a) => !a)} title="Más acciones">
        <MoreVertical size={17} strokeWidth={2} />
      </button>
      {abierto && (
        <div className="cit-menu-dropdown">
          <button className="cit-menu-item" onClick={() => { setAbierto(false); onReprogramar(); }}>
            <CalendarClock size={14} strokeWidth={2} />
            Reprogramar
          </button>
          {estado === "programada" && (
            <button className="cit-menu-item cit-menu-item-danger" onClick={() => { setAbierto(false); onCancelar(); }}>
              <XCircle size={14} strokeWidth={2} />
              Cancelar cita
            </button>
          )}
        </div>
      )}
    </div>
  );
}