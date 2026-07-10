import { DOCTORES } from "../../utils/agendaMock";

interface Props {
  doctorFiltro: string | null;
  onCambiar: (doctorId: string | null) => void;
}

export function FiltroDoctores({ doctorFiltro, onCambiar }: Props) {
  return (
    <div className="ag-filtro-doctores">
      <button
        className={`ag-chip-todos ${doctorFiltro === null ? "activo" : ""}`}
        onClick={() => onCambiar(null)}
      >
        Todos
      </button>
      {DOCTORES.map((d) => (
        <button
          key={d.id}
          className={`ag-chip-doctor ${doctorFiltro === d.id ? "activo" : ""}`}
          style={{ borderColor: doctorFiltro === d.id ? d.color : undefined }}
          onClick={() => onCambiar(doctorFiltro === d.id ? null : d.id)}
        >
          <span className="ag-chip-dot" style={{ background: d.color }} />
          {d.nombre}
        </button>
      ))}
    </div>
  );
}