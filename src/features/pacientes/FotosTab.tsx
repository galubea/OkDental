import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useFotos } from "./hooks/useFotos";
import { ModalSubirFoto } from "./components/fotos/ModalSubirFoto";
import { VisualizadorFoto } from "./components/fotos/VisualizadorFoto";
import "./styles/fotos.css";

interface Props {
  pacienteId: number;
}

const MESES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatFecha(fecha: string) {
  const [anio, mesStr, diaStr] = fecha.split("-");
  return `${MESES[Number(mesStr) - 1]} ${String(Number(diaStr)).padStart(2, "0")}, ${anio}`;
}

export default function FotosTab({ pacienteId }: Props) {
  const { fotos, modalAbierto, abrirModal, cerrarModal, subiendo, subirFoto, eliminarFoto } = useFotos(pacienteId);
  const [indiceVisor, setIndiceVisor] = useState<number | null>(null);

  function handleEliminarDesdeVisor(id: string) {
    eliminarFoto(id);
    setIndiceVisor((actual) => {
      if (actual === null) return null;
      const restantes = fotos.length - 1;
      if (restantes <= 0) return null;
      return actual >= restantes ? restantes - 1 : actual;
    });
  }

  return (
    <div className="foto-grid">
      <button className="foto-upload-card" onClick={abrirModal}>
        <span className="foto-upload-icono">
          <Camera size={22} strokeWidth={1.8} />
        </span>
        <span className="foto-upload-titulo">Upload Media</span>
        <span className="foto-upload-subtitulo">Drag &amp; drop or click to browse</span>
      </button>

      {fotos.map((foto, i) => (
        <div
          key={foto.id}
          className="foto-card"
          style={{ backgroundImage: `url(${foto.url})` }}
          onClick={() => setIndiceVisor(i)}
        >
          <button
            className="foto-card-eliminar"
            onClick={(e) => {
              e.stopPropagation();
              eliminarFoto(foto.id);
            }}
            title="Eliminar"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
          <div className="foto-card-overlay">
            <p className="foto-card-titulo">{foto.titulo}</p>
            <p className="foto-card-fecha">{formatFecha(foto.fecha)}</p>
          </div>
        </div>
      ))}

      {modalAbierto && (
        <ModalSubirFoto subiendo={subiendo} onCancelar={cerrarModal} onSubir={subirFoto} />
      )}

      {indiceVisor !== null && (
        <VisualizadorFoto
          fotos={fotos}
          indiceActual={indiceVisor}
          onCerrar={() => setIndiceVisor(null)}
          onNavegar={setIndiceVisor}
          onEliminar={handleEliminarDesdeVisor}
        />
      )}
    </div>
  );
}