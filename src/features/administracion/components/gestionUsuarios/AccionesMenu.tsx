import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  abierto: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  children: React.ReactNode;
}

export default function AccionesMenu({ abierto, onClose, anchorEl, children }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!abierto || !anchorEl) return;

    const calcular = () => {
  const rect = anchorEl.getBoundingClientRect();
  const menuAncho = 220;
  const menuAltoEstimado = 180;
  const anchoDisponible = document.documentElement.clientWidth;
  const espacioAbajo = window.innerHeight - rect.bottom;
  const abreHaciaArriba = espacioAbajo < menuAltoEstimado;

  const leftIdeal = rect.right - menuAncho;
  const leftClamp = Math.min(Math.max(leftIdeal, 8), anchoDisponible - menuAncho - 8);

  setPos({
    top: abreHaciaArriba ? rect.top - menuAltoEstimado - 4 : rect.bottom + 4,
    left: leftClamp,
  });
};

    calcular();
    window.addEventListener("scroll", calcular, true);
    window.addEventListener("resize", calcular);
    return () => {
      window.removeEventListener("scroll", calcular, true);
      window.removeEventListener("resize", calcular);
    };
  }, [abierto, anchorEl]);

  useEffect(() => {
    if (!abierto) return;
    const handleClickFuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [abierto, onClose]);

  if (!abierto || !pos) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="od-acciones-dropdown od-acciones-dropdown-portal"
      style={{ position: "fixed", top: pos.top, left: pos.left }}
    >
      {children}
    </div>,
    document.body
  );
}