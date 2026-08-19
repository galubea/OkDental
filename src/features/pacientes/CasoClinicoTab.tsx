import { ClipboardList, Plus } from "lucide-react";
import CasoClinicoTabs from "./components/casoClinico/CasoClinicoTabs";
import CasoClinicoCard from "./components/casoClinico/CasoClinicoCard";
import CasoClinicoFormModal from "./components/casoClinico/CasoClinicoFormModal";
import CasoClinicoDetalle from "./components/casoClinico/CasoClinicoDetalle";
import { useCasoClinico } from "./hooks/useCasoClinico";
import "./styles/casoClinico.css";

interface CasosClinicosPanelProps {
  pacienteId: number | null | undefined;
}

export default function CasosClinicosPanel({ pacienteId }: CasosClinicosPanelProps) {
  const {
    casos,
    cargando,
    guardando,
    error,
    pacienteIdValido,
    doctores,
    catalogo,
    tabsConConteo,
    tabActivo,
    setTabActivo,
    mostrarFormulario,
    abrirFormulario,
    cerrarFormulario,
    crearCaso,
    casoSeleccionado,
    seleccionarCaso,
    volverALista,
    cambiarEstado,
    guardarDiagnostico,
    agregarPaso,
    togglePaso,
    borrarPaso,
    agregarEvolucion,
    agregarObservacion,
    agregarEvidencia,
    borrarEvidencia,
  } = useCasoClinico(pacienteId);

  if (!pacienteIdValido) {
    return (
      <div className="cc-panel">
        <div className="cc-card-contenedor">
          <div className="hc-estado">
            Selecciona un paciente para ver sus casos clínicos.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-panel">
      <div className="cc-card-contenedor">
        {error && (
          <p style={{ color: "var(--od-required)", fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        {cargando ? (
          <div className="hc-estado">Cargando casos clínicos...</div>
        ) : casoSeleccionado ? (
          <CasoClinicoDetalle
            caso={casoSeleccionado}
            catalogo={catalogo}
            onVolver={volverALista}
            onCambiarEstado={cambiarEstado}
            onGuardarDiagnostico={guardarDiagnostico}
            onAgregarPaso={agregarPaso}
            onTogglePaso={togglePaso}
            onBorrarPaso={borrarPaso}
            onAgregarEvolucion={agregarEvolucion}
            onAgregarObservacion={agregarObservacion}
            onAgregarEvidencia={agregarEvidencia}
            onBorrarEvidencia={borrarEvidencia}
          />
        ) : (
          <>
            <div className="cc-panel-header">
              <div className="cc-panel-header-info">
                <div className="cc-panel-header-icono">
                  <ClipboardList size={22} />
                </div>
                <div className="cc-panel-header-texto">
                  <h2>Casos Clínicos</h2>
                  <p>Seguimiento de diagnósticos, tratamientos y evolución del paciente.</p>
                </div>
              </div>
              <button className="cc-btn-add" onClick={abrirFormulario} type="button">
                <Plus size={16} />
                Nuevo caso clínico
              </button>
            </div>

            <div className="cc-toolbar">
              <CasoClinicoTabs tabs={tabsConConteo} active={tabActivo} onChange={setTabActivo} />
            </div>

            <div className="cc-grid">
              {casos.length === 0 ? (
                <div className="cc-vacio hc-estado">Aún no hay casos clínicos en esta categoría.</div>
              ) : (
                casos.map((caso) => (
                  <CasoClinicoCard key={caso.id} caso={caso} onClick={(c) => seleccionarCaso(c.id)} />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {mostrarFormulario && (
        <CasoClinicoFormModal
          doctores={doctores}
          guardando={guardando}
          onClose={cerrarFormulario}
          onCreate={crearCaso}
        />
      )}
    </div>
  );
}