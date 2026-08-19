import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CasoClinico } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onAgregar: (casoId: string, ruta: string, etiqueta: string) => Promise<void>;
  onBorrar: (casoId: string, evidenciaId: string) => Promise<void>;
}

export default function DetalleEvidencias({ caso, onAgregar, onBorrar }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const evidencias = caso.evidencias;

  const handleArchivos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // NOTA: esto guarda una URL de objeto local (solo dura la sesión).
    // Para persistir el archivo en disco entre reinicios de la app, hay que
    // copiarlo con el plugin `@tauri-apps/plugin-fs` a app_data_dir y guardar
    // esa ruta absoluta aquí en vez del blob URL.
    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      await onAgregar(caso.id, url, file.name);
    }
  };

  return (
    <div>
      <p className="ccd-seccion-titulo" style={{ marginTop: 0 }}>
        Evidencias
      </p>
      <div className="ccd-evidencias-grid">
        <button type="button" className="ccd-evidencia-subir" onClick={() => inputRef.current?.click()}>
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
              onClick={() => onBorrar(caso.id, ev.id)}
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
