import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SeccionColor = "azul" | "morado" | "verde" | "naranja" | "rosado";

interface Props {
  numero: number;
  titulo: string;
  subtitulo: string;
  icon: LucideIcon;
  color: SeccionColor;
  children: ReactNode;
}

export function Seccion({ numero, titulo, subtitulo, icon: Icon, color, children }: Props) {
  return (
    <div className={`hc-seccion hc-seccion--${color}`}>
      <div className="hc-seccion-header">
        <div className="hc-seccion-icono">
          <Icon size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="hc-seccion-titulo">
            {numero}. {titulo}
          </p>
          <p className="hc-seccion-subtitulo">{subtitulo}</p>
        </div>
      </div>
      {children}
    </div>
  );
}