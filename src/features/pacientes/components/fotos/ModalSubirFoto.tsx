import { useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import type { NuevaFotoInput } from "../../types/fotos";

interface Props {
  subiendo: boolean;
  onCancelar: () => void;
  onSubir: (input: NuevaFotoInput) => void;
}

function hoyISO() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function ModalSubirFoto({ subiendo, onCancelar, onSubir }: Props) {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const puedeSubir = titulo.trim() !== "" && fecha.trim() !== "" && archivo !== null;

  function manejarArchivo(file: File | null) {
    if (!file) return;
    setArchivo(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubir() {
    if (!archivo || !puedeSubir) return;
    onSubir({ titulo: titulo.trim(), fecha, archivo });
  }

  return (
    <div className="odo-modal-overlay" onClick={onCancelar}>
      <div className="cit-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-header">
          <h3 className="cit-modal-titulo">Subir Foto</h3>
          <button className="odo-panel-icon-btn" onClick={onCancelar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="cit-modal-body">
          <div
            className="foto-dropzone"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              manejarArchivo(e.dataTransfer.files?.[0] ?? null);
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Vista previa" className="foto-dropzone-preview" />
            ) : (
              <>
                <ImagePlus size={28} strokeWidth={1.5} />
                <p className="foto-dropzone-titulo">Arrastra una imagen aquí</p>
                <p className="foto-dropzone-subtitulo">o haz clic para buscar un archivo</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => manejarArchivo(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Título</label>
            <input
              type="text"
              className="cit-input"
              placeholder="Ej. Radiografía panorámica"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Fecha</label>
            <input type="date" className="cit-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        </div>

        <div className="cit-modal-footer">
          <button className="cit-btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="od-btn-primary" onClick={handleSubir} disabled={!puedeSubir || subiendo}>
            {subiendo ? "Subiendo..." : "Subir foto"}
          </button>
        </div>
      </div>
    </div>
  );
}