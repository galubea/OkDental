import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { buscarPacientes, type PacienteMini } from "../../utils/pacientesDirectorio";

interface Props {
  pacienteSeleccionado: PacienteMini | null;
  onSeleccionar: (paciente: PacienteMini | null) => void;
}

export function SelectorPaciente({ pacienteSeleccionado, onSeleccionar }: Props) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<PacienteMini[]>([]);
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    buscarPacientes(query).then(setResultados);
  }, [query, abierto]);

  if (pacienteSeleccionado) {
    return (
      <div className="ag-selector-paciente-chip">
        <span>{pacienteSeleccionado.nombre}</span>
        <button type="button" onClick={() => onSeleccionar(null)} title="Quitar">
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div className="ag-selector-paciente" ref={ref}>
      <div className="ag-selector-paciente-input-wrap">
        <Search size={14} strokeWidth={2} className="ag-selector-paciente-icono" />
        <input
          type="text"
          className="cit-input ag-selector-paciente-input"
          placeholder="Buscar paciente por nombre..."
          value={query}
          onFocus={() => setAbierto(true)}
          onChange={(e) => { setQuery(e.target.value); setAbierto(true); }}
        />
      </div>
      {abierto && (
        <div className="ag-selector-paciente-dropdown">
          {resultados.length === 0 ? (
            <p className="ag-selector-paciente-vacio">No se encontraron pacientes.</p>
          ) : (
            resultados.map((p) => (
              <button
                key={p.id}
                type="button"
                className="ag-selector-paciente-item"
                onClick={() => { onSeleccionar(p); setAbierto(false); setQuery(""); }}
              >
                {p.nombre}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}