import "../../styles/shared.css";
import { colorCategoria } from "../../utils/colorCategoria";

interface CategoriaBadgeProps {
  id: string;
  nombre: string;
}

export default function CategoriaBadge({ id, nombre }: CategoriaBadgeProps) {
  const color = colorCategoria(id);
  return (
    <span className="od-badge-categoria" style={{ background: color.bg, color: color.texto }}>
      {nombre}
    </span>
  );
}