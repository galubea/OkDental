import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CasoClinico, Evidencia } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onUpdate: (caso: CasoClinico) => void;
}

export default function DetalleEvidencias({ caso, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const evidencias = caso.evidencias;

  const handleArchivos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const nuevas: Evidencia[] = Array.from(files).map((file) => ({
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      etiqueta: file.name,
      fecha: new Date().toISOString().slice(0, 10),
    }));
    onUpdate({ ...caso, evidencias: [...nuevas, ...evidencias] });
  };

  const borrar = (id: string) => {
    onUpdate({ ...caso, evidencias: evidencias.filter((e) => e.id !== id) });
  };

  return (
    <div>
      <div className="ccd-evidencias-grid">
        <button
          type="button"
          className="ccd-evidencia-subir"
          onClick={() => inputRef.current?.click()}
        >
          <Plus size={20} />
          Subir foto
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleArchivos(e.target.files)}
        />

        {evidencias.map((ev) => (
          <div className="ccd-evidencia-card" key={ev.id}>
            <img src={ev.url} alt={ev.etiqueta} />
            <span className="ccd-evidencia-etiqueta">{ev.etiqueta}</span>
            <button
              type="button"
              className="ccd-evidencia-borrar"
              onClick={() => borrar(ev.id)}
              aria-label="Eliminar evidencia"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}