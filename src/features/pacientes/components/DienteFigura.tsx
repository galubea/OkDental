import type { DienteData, EstadoDental, SuperficieDental } from "../types";
import { ESTADOS_DENTALES } from "../utils/odontogramaConstants";
import { FORMAS_DENTALES, tipoDeDiente, tipoDeDienteInfantil } from "../utils/formasDentales";

interface Props {
  diente: DienteData;
  esInfantil?: boolean;
  onCaraClick?: (cara: SuperficieDental) => void;
  className?: string;
}

const CARAS: SuperficieDental[] = ["vestibular", "lingual", "mesial", "distal", "oclusal"];

function colorDe(estado: EstadoDental): string {
  const info = ESTADOS_DENTALES.find((e) => e.key === estado);
  return info && info.color !== "transparent" ? info.color : "#ffffff";
}

export function DienteFigura({ diente, esInfantil = false, onCaraClick, className }: Props) {
  const { superficies, ausente, numero } = diente;
  const tipo = esInfantil ? tipoDeDienteInfantil(numero) : tipoDeDiente(numero);
  const forma = FORMAS_DENTALES[tipo];

  function handleClick(cara: SuperficieDental) {
    return (e: React.MouseEvent) => {
      if (!onCaraClick || ausente) return;
      e.stopPropagation(); // evita que el clic suba al <div> del diente completo
      onCaraClick(cara);
    };
  }

  return (
    <svg viewBox={forma.viewBox} className={className ?? "odo-diente-figura-svg"}>
      {CARAS.map((cara) => (
        <path
          key={cara}
          d={forma.paths[cara]}
          fill={colorDe(superficies[cara])}
          stroke={forma.strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={forma.strokeWidth}
          onClick={onCaraClick ? handleClick(cara) : undefined}
          style={onCaraClick && !ausente ? { cursor: "pointer" } : undefined}
        />
      ))}
      {ausente && (
        <line
          x1="10%" y1="10%" x2="90%" y2="90%"
          stroke="#4a5568" strokeWidth="2%" strokeLinecap="round"
        />
      )}
    </svg>
  );
}