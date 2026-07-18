import { useState } from "react";
import { X } from "lucide-react";
import type { CasoClinico } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onUpdate: (caso: CasoClinico) => void;
}

export default function DetalleDiagnostico({ caso, onUpdate }: Props) {
  const [diagnostico, setDiagnostico] = useState(caso.diagnostico);
  const [piezas, setPiezas] = useState<number[]>(caso.piezas);
  const [nuevaPieza, setNuevaPieza] = useState("");

  const agregarPieza = () => {
    const n = Number(nuevaPieza.trim());
    if (!Number.isNaN(n) && n > 0 && !piezas.includes(n)) {
      setPiezas((prev) => [...prev, n].sort((a, b) => a - b));
    }
    setNuevaPieza("");
  };

  const quitarPieza = (pieza: number) => {
    setPiezas((prev) => prev.filter((p) => p !== pieza));
  };

  const guardar = () => {
    onUpdate({ ...caso, diagnostico, piezas });
  };

  return (
    <div>
      <p className="ccd-seccion-titulo" style={{ marginTop: 0 }}>
        Diagnóstico
      </p>
      <textarea
        className="ccd-diagnostico-textarea"
        placeholder="Describe el diagnóstico del caso..."
        value={diagnostico}
        onChange={(e) => setDiagnostico(e.target.value)}
      />

      <p className="ccd-seccion-titulo">Piezas dentales afectadas</p>
      <div className="ccd-piezas-editor">
        {piezas.map((pieza) => (
          <span key={pieza} className="ccd-pieza-chip-x">
            {pieza}
            <button type="button" onClick={() => quitarPieza(pieza)} aria-label={`Quitar pieza ${pieza}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          className="ccd-pieza-input"
          type="text"
          inputMode="numeric"
          placeholder="+ pieza"
          value={nuevaPieza}
          onChange={(e) => setNuevaPieza(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarPieza()}
          onBlur={agregarPieza}
        />
      </div>

      <div className="ccd-form-footer">
        <button className="cc-btn-primario" type="button" onClick={guardar}>
          Guardar diagnóstico
        </button>
      </div>
    </div>
  );
}