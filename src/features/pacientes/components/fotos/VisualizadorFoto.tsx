import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import type { Foto } from "../../types/fotos";

interface Props {
  fotos: Foto[];
  indiceActual: number;
  onCerrar: () => void;
  onNavegar: (indice: number) => void;
  onEliminar: (id: string) => void;
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatFechaLarga(fecha: string) {
  const [anio, mesStr, diaStr] = fecha.split("-");
  return `${Number(diaStr)} de ${MESES[Number(mesStr) - 1]} de ${anio}`;
}

export function VisualizadorFoto({ fotos, indiceActual, onCerrar, onNavegar, onEliminar }: Props) {
  const foto = fotos[indiceActual];
  const hayAnterior = indiceActual > 0;
  const haySiguiente = indiceActual < fotos.length - 1;

  useEffect(() => {
    function handleTeclado(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft" && hayAnterior) onNavegar(indiceActual - 1);
      if (e.key === "ArrowRight" && haySiguiente) onNavegar(indiceActual + 1);
    }
    document.addEventListener("keydown", handleTeclado);
    return () => document.removeEventListener("keydown", handleTeclado);
  }, [indiceActual, hayAnterior, haySiguiente, onCerrar, onNavegar]);

  if (!foto) return null;

  return (
    <div className="foto-visor-overlay" onClick={onCerrar}>
      <div className="foto-visor-header" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="foto-visor-titulo">{foto.titulo}</p>
          <p className="foto-visor-fecha">{formatFechaLarga(foto.fecha)}</p>
        </div>
        <div className="foto-visor-acciones">
          <button
            className="foto-visor-btn-icono foto-visor-btn-peligro"
            onClick={() => onEliminar(foto.id)}
            title="Eliminar foto"
          >
            <Trash2 size={18} strokeWidth={2} />
          </button>
          <button className="foto-visor-btn-icono" onClick={onCerrar} title="Cerrar">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="foto-visor-body" onClick={(e) => e.stopPropagation()}>
        {hayAnterior && (
          <button
            className="foto-visor-nav foto-visor-nav-izq"
            onClick={() => onNavegar(indiceActual - 1)}
            title="Foto anterior"
          >
            <ChevronLeft size={26} strokeWidth={2.2} />
          </button>
        )}

        <img src={foto.url} alt={foto.titulo} className="foto-visor-imagen" />

        {haySiguiente && (
          <button
            className="foto-visor-nav foto-visor-nav-der"
            onClick={() => onNavegar(indiceActual + 1)}
            title="Foto siguiente"
          >
            <ChevronRight size={26} strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className="foto-visor-contador" onClick={(e) => e.stopPropagation()}>
        {indiceActual + 1} / {fotos.length}
      </div>
    </div>
  );
}