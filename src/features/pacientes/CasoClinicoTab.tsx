import { useState, useMemo } from "react";
import { ClipboardList, Plus } from "lucide-react";
import CasoClinicoTabs from "./components/casoClinico/CasoClinicoTabs";
import CasoClinicoCard from "./components/casoClinico/CasoClinicoCard";
import CasoClinicoFormModal from "./components/casoClinico/CasoClinicoFormModal";
import CasoClinicoDetalle from "./components/casoClinico/CasoClinicoDetalle";
import type { CasoClinico, EstadoCaso, TabDefinicion } from "./types/casoClinico";
import "./styles/casoClinico.css";

const CASOS_INICIALES: CasoClinico[] = [
  {
    id: "c1",
    titulo: "Caries múltiple activa",
    descripcion: "Caries de esmalte y dentina en piezas 1.6, 2.5, 3.7",
    especialidad: "Odontología General",
    doctor: "Dra. Ana López Ruiz",
    estado: "activo",
    severidad: "medio",
    piezas: [16, 25, 37],
    progreso: 40,
    fechaObjetivo: "2026-07-28",
    fechaCreacion: "2026-07-14",
    diagnostico: "Caries de esmalte y dentina en piezas 1.6, 2.5, 3.7, sin compromiso pulpar.",
    planTratamiento: [
      { id: "p1", descripcion: "Restauración con resina en pieza 1.6", completado: true },
      { id: "p2", descripcion: "Restauración con resina en pieza 2.5", completado: false },
      { id: "p3", descripcion: "Restauración con resina en pieza 3.7", completado: false },
    ],
    evolucion: [],
    observaciones: [],
    evidencias: [],
  },
  {
    id: "c2",
    titulo: "Periodontitis moderada generalizada",
    descripcion: "Periodontitis estadio III, grado B, generalizada",
    especialidad: "Periodoncia",
    doctor: "Dr. Juan Pérez Martínez",
    estado: "en_tratamiento",
    severidad: "alto",
    piezas: [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38],
    progreso: 65,
    fechaObjetivo: "2026-07-21",
    fechaCreacion: "2026-07-14",
    diagnostico: "Periodontitis estadio III, grado B, generalizada, con bolsas periodontales de 5-7mm.",
    planTratamiento: [],
    evolucion: [],
    observaciones: [],
    evidencias: [],
  },
];

const TABS: TabDefinicion[] = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Activos" },
  { key: "en_tratamiento", label: "En tratamiento" },
  { key: "resuelto", label: "Resueltos" },
];

export default function CasosClinicosPanel() {
  const [casos, setCasos] = useState<CasoClinico[]>(CASOS_INICIALES);
  const [tabActivo, setTabActivo] = useState<EstadoCaso | "todos">("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [casoSeleccionadoId, setCasoSeleccionadoId] = useState<string | null>(null);

  const tabsConConteo = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count: tab.key === "todos" ? casos.length : casos.filter((c) => c.estado === tab.key).length,
      })),
    [casos]
  );

  const casosFiltrados = useMemo(
    () => (tabActivo === "todos" ? casos : casos.filter((c) => c.estado === tabActivo)),
    [casos, tabActivo]
  );

  const casoSeleccionado = casos.find((c) => c.id === casoSeleccionadoId) ?? null;

  const handleCrearCaso = (nuevoCaso: CasoClinico) => {
    setCasos((prev) => [nuevoCaso, ...prev]);
    setMostrarFormulario(false);
  };

  const handleUpdateCaso = (casoActualizado: CasoClinico) => {
    setCasos((prev) => prev.map((c) => (c.id === casoActualizado.id ? casoActualizado : c)));
  };

  return (
    <div className="cc-panel">
      <div className="cc-card-contenedor">
        {casoSeleccionado ? (
          <CasoClinicoDetalle
            caso={casoSeleccionado}
            onVolver={() => setCasoSeleccionadoId(null)}
            onUpdate={handleUpdateCaso}
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
              <button className="cc-btn-add" onClick={() => setMostrarFormulario(true)} type="button">
                <Plus size={16} />
                Nuevo caso clínico
              </button>
            </div>

            <div className="cc-toolbar">
              <CasoClinicoTabs tabs={tabsConConteo} active={tabActivo} onChange={setTabActivo} />
            </div>

            <div className="cc-grid">
              {casosFiltrados.length === 0 ? (
                <div className="cc-vacio hc-estado">Aún no hay casos clínicos en esta categoría.</div>
              ) : (
                casosFiltrados.map((caso) => (
                  <CasoClinicoCard
                    key={caso.id}
                    caso={caso}
                    onClick={(c) => setCasoSeleccionadoId(c.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {mostrarFormulario && (
        <CasoClinicoFormModal onClose={() => setMostrarFormulario(false)} onCreate={handleCrearCaso} />
      )}
    </div>
  );
}