import type { DienteData, SuperficieDental } from "../../types";
import { getDienteSvgUrl } from "../../utils/dientesAssets";
import { DienteFigura } from "./DienteFigura";

interface Props {
  diente: DienteData;
  indiceSvg: number;
  esSuperior: boolean;
  esInfantil?: boolean;
  seleccionado: boolean;
  onClick: () => void;
  onCaraClick?: (cara: SuperficieDental) => void;
}

export function DienteSVG({
  diente, indiceSvg, esSuperior, esInfantil, seleccionado, onClick, onCaraClick,
}: Props) {
  const { ausente, numero } = diente;
  const svgHref = getDienteSvgUrl(indiceSvg, esSuperior);

  const dienteSvg = (
    <svg viewBox="0 0 100 100" className={`odo-diente-svg ${ausente ? "odo-ausente" : ""}`}>
      {svgHref && (
        <image href={svgHref} x="0" y="0" width="100" height="100" style={{ pointerEvents: "none" }} />
      )}
      {ausente && (
        <>
          <line x1="8" y1="8" x2="92" y2="92" stroke="#8492A6" strokeWidth="6" strokeLinecap="round" />
          <line x1="92" y1="8" x2="8" y2="92" stroke="#8492A6" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  return (
    <div className={`odo-diente ${seleccionado ? "odo-diente-seleccionado" : ""}`} onClick={onClick}>
      <DienteFigura
        diente={diente}
        esInfantil={esInfantil}
        onCaraClick={onCaraClick}
        className="odo-diente-figura-mini"
      />
      {dienteSvg}
      <span className="odo-diente-numero">{numero}</span>
    </div>
  );
}