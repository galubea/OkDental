import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Columna {
  label: string;
  valor: string;
  editor: ReactNode;
  stretch?: number;
  icon?: LucideIcon;
}

interface Props {
  editando: boolean;
  columnas: Columna[];
}

export function CampoFila({ editando, columnas }: Props) {
  return (
    <div className="hc-fila">
      {columnas.map((col, i) => (
        <div
          className="hc-campo-card"
          style={{ flex: col.stretch ?? 1, minWidth: 180 }}
          key={i}
        >
          {col.icon && (
            <div className="hc-campo-card-icono">
              <col.icon size={16} strokeWidth={2} />
            </div>
          )}
          <div className="hc-campo-card-texto">
            <label>{col.label}</label>
            {editando ? col.editor : <p className="hc-valor">{col.valor || "—"}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}