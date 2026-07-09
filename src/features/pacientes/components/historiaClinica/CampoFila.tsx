import type { ReactNode } from "react";

interface Columna {
  label: string;
  valor: string;
  editor: ReactNode;
  stretch?: number;
}

interface Props {
  columnas: Columna[];
  editando: boolean;
}

export function CampoFila({ columnas, editando }: Props) {
  return (
    <div className="hc-fila">
      {columnas.map((col, i) => (
        <div className="hc-campo" key={i} style={{ flexGrow: col.stretch ?? 1 }}>
          <label>{col.label}</label>
          {editando ? col.editor : <p className="hc-valor">{col.valor || "—"}</p>}
        </div>
      ))}
    </div>
  );
}