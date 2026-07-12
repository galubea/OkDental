import { useState } from "react";
import { Save, Plus, FileText, Trash2 } from "lucide-react";
import { useOdontograma } from "./hooks/useOdontograma";
import { DienteSVG } from "./components/odontograma/DienteSVG";
import { PanelDiente } from "./components/odontograma/PanelDiente";
import { PaletaPintura } from "./components/odontograma/PaletaPintura";
import { NUMEROS_ADULTO, NUMEROS_INFANTIL } from "./utils/odontogramaConstants";
import "./styles/odontograma.css";

interface Props {
  pacienteId: number;
}

function formatFechaCorta(fecha: string): string {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" });
}

export default function OdontogramaTab({ pacienteId }: Props) {
  const {
    odontogramas, odontogramaId, seleccionarOdontograma,
    crearNuevoOdontograma, creando,
    eliminar, eliminando,
    modo, setModo, dientes, cargando, guardando, guardar, mensaje,
    observacionGeneral, setObservacionGeneral,
    pincelActivo, setPincelActivo,
    dienteSeleccionado, seleccionarDiente, seleccionarCara, cerrarPanel,
    aplicarEstadoCara, aplicarEstadoGeneral, reactivarDiente, resetearDiente,
    agregarAvance, actualizarObservacion, resumen, guardarDiente,
  } = useOdontograma(pacienteId);

  const [panelColapsado, setPanelColapsado] = useState(false);
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);
  const [tituloNuevo, setTituloNuevo] = useState("");
  const [fechaNuevo, setFechaNuevo] = useState(() => new Date().toISOString().slice(0, 10));

  const numeros = modo === "adulto" ? NUMEROS_ADULTO : NUMEROS_INFANTIL;

  async function handleCrearNuevo() {
    if (!tituloNuevo.trim() || !fechaNuevo) return;
    const ok = await crearNuevoOdontograma(tituloNuevo.trim(), fechaNuevo);
    if (ok) {
      setMostrarFormNuevo(false);
      setTituloNuevo("");
      setFechaNuevo(new Date().toISOString().slice(0, 10));
    }
  }

  async function handleEliminar(id: string, titulo: string) {
    const confirmado = window.confirm(
      `¿Eliminar el odontograma "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;
    await eliminar(id);
  }

  if (cargando) return <p className="hc-estado">Cargando odontograma...</p>;

  return (
    <div className={`odo-layout ${dienteSeleccionado ? "odo-layout-panel-abierto" : ""}`}>
      {/* ---------- Tarjeta del odontograma ---------- */}
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
            <p className="odo-arcada-titulo">Superior</p>
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
            <p className="odo-arcada-titulo">Inferior</p>
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

        {/* ---------- Observación general ---------- */}
        <div className="odo-observacion-general">
          <span className="odo-observacion-general-titulo">Observación general del odontograma</span>
          <textarea
            className="odo-observacion-general-textarea"
            value={observacionGeneral}
            onChange={(e) => setObservacionGeneral(e.target.value)}
            placeholder="Notas generales sobre el estado bucal, plan de tratamiento, recomendaciones…"
            rows={3}
          />
        </div>

        {mensaje && <p className="odo-mensaje">{mensaje}</p>}

        {/* ---------- Lista de odontogramas del paciente ---------- */}
        <div className="odo-historial">
          <div className="odo-historial-header">
            <span className="odo-historial-titulo">Odontogramas del paciente</span>
            <button
              className="od-btn-secondary"
              onClick={() => setMostrarFormNuevo((v) => !v)}
            >
              <Plus size={15} strokeWidth={2} />
              Nuevo odontograma
            </button>
          </div>

          {mostrarFormNuevo && (
            <div className="odo-nuevo-form">
              <div className="od-field">
                <label>Título</label>
                <input
                  type="text"
                  placeholder="Ej: Control semestral"
                  value={tituloNuevo}
                  onChange={(e) => setTituloNuevo(e.target.value)}
                />
              </div>
              <div className="od-field">
                <label>Fecha</label>
                <input
                  type="date"
                  value={fechaNuevo}
                  onChange={(e) => setFechaNuevo(e.target.value)}
                />
              </div>
              <div className="odo-nuevo-form-acciones">
                <button
                  className="od-btn-secondary"
                  onClick={() => setMostrarFormNuevo(false)}
                  disabled={creando}
                >
                  Cancelar
                </button>
                <button
                  className="od-btn-primary"
                  onClick={handleCrearNuevo}
                  disabled={creando || !tituloNuevo.trim()}
                >
                  {creando ? "Creando..." : "Crear odontograma vacío"}
                </button>
              </div>
            </div>
          )}

          <div className="odo-historial-lista">
            {odontogramas.map((o) => (
              <div key={o.id} className={`odo-historial-item ${o.id === odontogramaId ? "activo" : ""}`}>
                <button
                  className="odo-historial-item-contenido"
                  onClick={() => seleccionarOdontograma(o.id)}
                >
                  <FileText size={16} strokeWidth={2} />
                  <div className="odo-historial-item-info">
                    <span className="odo-historial-item-titulo">{o.titulo}</span>
                    <span className="odo-historial-item-fecha">{formatFechaCorta(o.fecha)}</span>
                  </div>
                </button>
                <button
                  className="odo-historial-item-eliminar"
                  onClick={() => handleEliminar(o.id, o.titulo)}
                  disabled={eliminando}
                  title="Eliminar odontograma"
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Tarjeta del panel (hermana, no anidada) ---------- */}
      <div className={`odo-panel-slot ${dienteSeleccionado ? "odo-panel-slot-abierto" : ""}`}>
        {dienteSeleccionado && (
        <PanelDiente
          numero={dienteSeleccionado}
          diente={dientes[dienteSeleccionado]}
          colapsado={panelColapsado}
          guardando={guardando}
          esInfantil={modo === "infantil"}
          onToggleColapsar={() => setPanelColapsado((c) => !c)}
          onEstadoGeneral={(estado) => aplicarEstadoGeneral(dienteSeleccionado, estado)}
          onEstadoCara={(cara, estado) => aplicarEstadoCara(dienteSeleccionado, cara, estado)}
          onReactivar={() => reactivarDiente(dienteSeleccionado)}
          onResetear={() => resetearDiente(dienteSeleccionado)}
          onObservacionChange={(texto) => actualizarObservacion(dienteSeleccionado, texto)}
          onGuardar={(texto) => guardarDiente(dienteSeleccionado, texto)}
          onCerrar={cerrarPanel}
        />
      )}
      </div>
    </div>
  );
}