import { Search } from "lucide-react";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  onBuscar: () => void;
}

export function BuscadorPacientes({ query, onQueryChange, onBuscar }: Props) {
  return (
    <div className="od-search-row">
      <div className="od-search-wrap">
        <Search size={17} strokeWidth={2} className="od-search-icon" />
        <input
          className="od-search-input"
          placeholder="Buscar por nombre o CI..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onBuscar()}
        />
      </div>
      <button className="od-btn-secondary" onClick={onBuscar}>
        Buscar
      </button>
    </div>
  );
}