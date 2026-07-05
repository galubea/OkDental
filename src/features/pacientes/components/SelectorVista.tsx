import { LayoutGrid, List } from "lucide-react";

export type VistaPacientes = "cards" | "tabla";

interface Props {
  vista: VistaPacientes;
  onChange: (vista: VistaPacientes) => void;
}

export function SelectorVista({ vista, onChange }: Props) {
  return (
    <div className="od-vista-toggle" role="tablist" aria-label="Cambiar vista">
      <button
        role="tab"
        aria-selected={vista === "cards"}
        className={`od-vista-btn ${vista === "cards" ? "activo" : ""}`}
        onClick={() => onChange("cards")}
        title="Ver en tarjetas"
      >
        <LayoutGrid size={16} strokeWidth={2} />
      </button>
      <button
        role="tab"
        aria-selected={vista === "tabla"}
        className={`od-vista-btn ${vista === "tabla" ? "activo" : ""}`}
        onClick={() => onChange("tabla")}
        title="Ver en lista"
      >
        <List size={16} strokeWidth={2} />
      </button>
    </div>
  );
}