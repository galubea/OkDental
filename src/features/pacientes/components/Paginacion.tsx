import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, totalPaginas, onCambiar }: Props) {
  if (totalPaginas <= 1) return null;

  const paginas: number[] = [];
  const inicio = Math.max(1, pagina - 2);
  const fin = Math.min(totalPaginas, inicio + 4);
  for (let i = Math.max(1, fin - 4); i <= fin; i++) paginas.push(i);

  return (
    <div className="od-paginacion">
      <button
        className="od-pagina-btn"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {paginas[0] > 1 && (
        <>
          <button className="od-pagina-btn" onClick={() => onCambiar(1)}>
            1
          </button>
          {paginas[0] > 2 && <span className="od-pagina-dots">…</span>}
        </>
      )}

      {paginas.map((n) => (
        <button
          key={n}
          className={`od-pagina-btn ${n === pagina ? "activo" : ""}`}
          onClick={() => onCambiar(n)}
        >
          {n}
        </button>
      ))}

      {paginas[paginas.length - 1] < totalPaginas && (
        <>
          {paginas[paginas.length - 1] < totalPaginas - 1 && (
            <span className="od-pagina-dots">…</span>
          )}
          <button className="od-pagina-btn" onClick={() => onCambiar(totalPaginas)}>
            {totalPaginas}
          </button>
        </>
      )}

      <button
        className="od-pagina-btn"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}