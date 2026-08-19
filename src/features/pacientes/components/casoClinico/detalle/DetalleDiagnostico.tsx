import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CasoClinico } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onGuardar: (casoId: string, diagnostico: string, piezas: number[]) => Promise<void>;
}

export default function DetalleDiagnostico({ caso, onGuardar }: Props) {
  const [diagnostico, setDiagnostico] = useState(caso.diagnostico);
  const [piezas, setPiezas] = useState<number[]>(caso.piezas);
  const [nuevaPieza, setNuevaPieza] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [huboCambios, setHuboCambios] = useState(false);

  useEffect(() => {
    setDiagnostico(caso.diagnostico);
    setPiezas(caso.piezas);
    setHuboCambios(false);
  }, [caso.id]);

  const agregarPieza = () => {
    const n = Number(nuevaPieza.trim());
    if (!Number.isNaN(n) && n > 0 && !piezas.includes(n)) {
      setPiezas((prev) => [...prev, n].sort((a, b) => a - b));
      setHuboCambios(true);
    }
    setNuevaPieza("");
  };

  const quitarPieza = (pieza: number) => {
    setPiezas((prev) => prev.filter((p) => p !== pieza));
    setHuboCambios(true);
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      await onGuardar(caso.id, diagnostico, piezas);
      setHuboCambios(false);
    } finally {
      setGuardando(false);
    }
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
        onChange={(e) => {
          setDiagnostico(e.target.value);
          setHuboCambios(true);
        }}
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
        <button className="cc-btn-primario" type="button" onClick={guardar} disabled={guardando || !huboCambios}>
          {guardando ? "Guardando..." : "Guardar diagnóstico"}
        </button>
      </div>
    </div>
  );
}
