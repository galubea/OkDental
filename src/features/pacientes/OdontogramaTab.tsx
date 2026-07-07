import { Save } from "lucide-react";
import { useOdontograma } from "./hooks/useOdontograma";
import { DienteSVG } from "./components/DienteSVG";
import { PanelDiente } from "./components/PanelDiente";
import { PaletaPintura } from "./components/PaletaPintura";
import { NUMEROS_ADULTO, NUMEROS_INFANTIL } from "./utils/odontogramaConstants";
import { useState } from "react";
import "./styles/odontograma.css";

interface Props {
  pacienteId: number;
}

export default function OdontogramaTab({ pacienteId }: Props) {
  const {
    modo, setModo, dientes, cargando, guardando, guardar, mensaje,
    pincelActivo, setPincelActivo,
    dienteSeleccionado, seleccionarDiente, seleccionarCara, cerrarPanel,
    aplicarEstadoCara, aplicarEstadoGeneral, reactivarDiente, resetearDiente,
    agregarAvance, actualizarObservacion, resumen,
  } = useOdontograma(pacienteId);

  const [panelColapsado, setPanelColapsado] = useState(false);
  const numeros = modo === "adulto" ? NUMEROS_ADULTO : NUMEROS_INFANTIL;

  if (cargando) return <p className="hc-estado">Cargando odontograma...</p>;

  return (
    <div className="odo-card">
      <div className="odo-header">
        <h2 className="odo-titulo">Odontograma</h2>
        <div className="odo-header-derecha">
          <div className="od-vista-toggle">
            <button className={`odo-modo-btn ${modo === "adulto" ? "activo" : ""}`} onClick={() => setModo("adulto")}>Adulto</button>
            <button className={`odo-modo-btn ${modo === "infantil" ? "activo" : ""}`} onClick={() => setModo("infantil")}>Infantil</button>
          </div>
          <button className="od-btn-primary" onClick={guardar} disabled={guardando}>
            <Save size={15} strokeWidth={2} />
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <PaletaPintura pincelActivo={pincelActivo} onSeleccionar={setPincelActivo} />

      <div className="odo-resumen">
        {resumen.length === 0 ? (
          <span className="odo-resumen-vacio">Sin hallazgos registrados</span>
        ) : (
          resumen.map((r) => (
            <span key={r.key} className="odo-resumen-chip">
              <span className="odo-resumen-dot" style={{ background: r.color === "transparent" ? "#e2e8f0" : r.color }} />
              {r.count} {r.count === 1 ? "diente" : "dientes"} — {r.label.toLowerCase()}
            </span>
          ))
        )}
      </div>

      <p className="odo-hint">
        {pincelActivo
          ? "Modo pincel activo: haz clic en una cara para pintar solo esa cara, o en el diente completo para pintarlo entero."
          : "Haz clic en un diente para ver y editar sus opciones."}
      </p>

      <div className="odo-arcadas">
        <div className="odo-arcada">
          <div className="odo-fila">
            {numeros.superiorDerecho.map((n, i) => (
              <DienteSVG
                key={n}
                diente={dientes[n]}
                indiceSvg={i + 1}
                esSuperior
                seleccionado={dienteSeleccionado === n}
                onClick={() => seleccionarDiente(n)}
                onCaraClick={(cara) => seleccionarCara(n, cara)}
              />
            ))}
            <div className="odo-linea-media" />
            {numeros.superiorIzquierdo.map((n, i) => (
              <DienteSVG
                key={n}
                diente={dientes[n]}
                indiceSvg={numeros.superiorDerecho.length + i + 1}
                esSuperior
                seleccionado={dienteSeleccionado === n}
                onClick={() => seleccionarDiente(n)}
                onCaraClick={(cara) => seleccionarCara(n, cara)}
              />
            ))}
          </div>
        </div>

        <div className="odo-arcada">
          <div className="odo-fila">
            {numeros.inferiorDerecho.map((n, i) => (
              <DienteSVG
                key={n}
                diente={dientes[n]}
                indiceSvg={i + 1}
                esSuperior={false}
                seleccionado={dienteSeleccionado === n}
                onClick={() => seleccionarDiente(n)}
                onCaraClick={(cara) => seleccionarCara(n, cara)}
              />
            ))}
            <div className="odo-linea-media" />
            {numeros.inferiorIzquierdo.map((n, i) => (
              <DienteSVG
                key={n}
                diente={dientes[n]}
                indiceSvg={numeros.inferiorDerecho.length + i + 1}
                esSuperior={false}
                seleccionado={dienteSeleccionado === n}
                onClick={() => seleccionarDiente(n)}
                onCaraClick={(cara) => seleccionarCara(n, cara)}
              />
            ))}
          </div>
        </div>
      </div>

      {dienteSeleccionado && (
        <PanelDiente
          numero={dienteSeleccionado}
          diente={dientes[dienteSeleccionado]}
          colapsado={panelColapsado}
          esInfantil={modo === "infantil"}
          onToggleColapsar={() => setPanelColapsado((c) => !c)}
          onEstadoGeneral={(estado) => aplicarEstadoGeneral(dienteSeleccionado, estado)}
          onEstadoCara={(cara, estado) => aplicarEstadoCara(dienteSeleccionado, cara, estado)}
          onReactivar={() => reactivarDiente(dienteSeleccionado)}
          onResetear={() => resetearDiente(dienteSeleccionado)}
          onObservacionChange={(texto) => actualizarObservacion(dienteSeleccionado, texto)}
          onAgregarAvance={(texto) => agregarAvance(dienteSeleccionado, texto)}
          onCerrar={cerrarPanel}
        />
      )}

      {mensaje && <p className="odo-mensaje">{mensaje}</p>}
    </div>
  );
}