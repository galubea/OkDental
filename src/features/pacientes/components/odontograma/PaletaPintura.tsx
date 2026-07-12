import type { EstadoDental } from "../../types/odontograma";
import { ESTADOS_DENTALES } from "../../utils/odontogramaConstants";

interface Props {
  pincelActivo: EstadoDental | null;
  onSeleccionar: (estado: EstadoDental | null) => void;
}

export function PaletaPintura({ pincelActivo, onSeleccionar }: Props) {
  return (
    <div className="odo-pincel-barra">
      <span className="odo-pincel-label">Pincel rápido:</span>
      <div className="odo-pincel-swatches">
        {ESTADOS_DENTALES.map((e) => (
          <button
            key={e.key}
            className={`odo-pincel-swatch ${pincelActivo === e.key ? "activo" : ""}`}
            style={{ background: e.color === "transparent" ? "#fff" : e.color }}
            onClick={() => onSeleccionar(pincelActivo === e.key ? null : e.key)}
            title={e.label}
          >
            {e.label}
          </button>
        ))}
        {pincelActivo && (
          <button className="odo-pincel-limpiar" onClick={() => onSeleccionar(null)}>
            Desactivar pincel
          </button>
        )}
      </div>
      {pincelActivo && (
        <span className="odo-pincel-hint">
          Haz clic en los dientes para pintarlos con este estado.
        </span>
      )}
    </div>
  );
}