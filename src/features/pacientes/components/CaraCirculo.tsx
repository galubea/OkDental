import type { DienteData, SuperficieDental } from "../types";
import { ESTADOS_DENTALES } from "../odontogramaConstants";

interface Props {
  diente: DienteData;
  onCaraClick?: (cara: SuperficieDental) => void;
}

function colorDe(estado: string): string {
  if (estado === "sano") return "transparent";
  return ESTADOS_DENTALES.find((e) => e.key === estado)?.color ?? "transparent";
}

const CX = 20, CY = 20, R = 18;
const OFF = R * Math.SQRT1_2;

export function CaraCirculo({ diente, onCaraClick }: Props) {
  const { superficies, ausente } = diente;
  const arribaIzq = [CX - OFF, CY - OFF];
  const arribaDer = [CX + OFF, CY - OFF];
  const abajoDer = [CX + OFF, CY + OFF];
  const abajoIzq = [CX - OFF, CY + OFF];

  function click(cara: SuperficieDental) {
    return (e: React.MouseEvent) => {
      e.stopPropagation(); // evita que el clic le llegue al <div> del diente completo
      onCaraClick?.(cara);
    };
  }

  return (
    <svg viewBox="0 0 40 40" className={`odo-cara-circulo ${ausente ? "odo-ausente" : ""}`}>
      {ausente ? (
        <>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#a0aec0" strokeWidth={1} />
          <line x1={CX - 8} y1={CY - 8} x2={CX + 8} y2={CY + 8} stroke="#8492A6" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={CX + 8} y1={CY - 8} x2={CX - 8} y2={CY + 8} stroke="#8492A6" strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d={`M${CX},${CY} L${arribaIzq[0]},${arribaIzq[1]} A${R},${R} 0 0,1 ${arribaDer[0]},${arribaDer[1]} Z`}
            fill={colorDe(superficies.vestibular)}
            stroke="#cbd5e0"
            strokeWidth={0.6}
            onClick={click("vestibular")}
            style={{ cursor: "pointer" }}
          />
          <path
            d={`M${CX},${CY} L${arribaDer[0]},${arribaDer[1]} A${R},${R} 0 0,1 ${abajoDer[0]},${abajoDer[1]} Z`}
            fill={colorDe(superficies.distal)}
            stroke="#cbd5e0"
            strokeWidth={0.6}
            onClick={click("distal")}
            style={{ cursor: "pointer" }}
          />
          <path
            d={`M${CX},${CY} L${abajoDer[0]},${abajoDer[1]} A${R},${R} 0 0,1 ${abajoIzq[0]},${abajoIzq[1]} Z`}
            fill={colorDe(superficies.lingual)}
            stroke="#cbd5e0"
            strokeWidth={0.6}
            onClick={click("lingual")}
            style={{ cursor: "pointer" }}
          />
          <path
            d={`M${CX},${CY} L${abajoIzq[0]},${abajoIzq[1]} A${R},${R} 0 0,1 ${arribaIzq[0]},${arribaIzq[1]} Z`}
            fill={colorDe(superficies.mesial)}
            stroke="#cbd5e0"
            strokeWidth={0.6}
            onClick={click("mesial")}
            style={{ cursor: "pointer" }}
          />
          <circle
            cx={CX}
            cy={CY}
            r={7}
            fill={colorDe(superficies.oclusal)}
            stroke="#cbd5e0"
            strokeWidth={0.6}
            onClick={click("oclusal")}
            style={{ cursor: "pointer" }}
          />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#a0aec0" strokeWidth={1} />
        </>
      )}
    </svg>
  );
}