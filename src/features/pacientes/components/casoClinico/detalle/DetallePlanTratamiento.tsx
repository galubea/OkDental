import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { CasoClinico, PasoTratamiento } from "../../../types/casoClinico";

interface Props {
  caso: CasoClinico;
  onUpdate: (caso: CasoClinico) => void;
}

function calcularProgreso(pasos: PasoTratamiento[]): number {
  if (pasos.length === 0) return 0;
  const completados = pasos.filter((p) => p.completado).length;
  return Math.round((completados / pasos.length) * 100);
}

export default function DetallePlanTratamiento({ caso, onUpdate }: Props) {
  const [nuevoPaso, setNuevoPaso] = useState("");
  const pasos = caso.planTratamiento;
  const progreso = calcularProgreso(pasos);

  const actualizarPasos = (pasosActualizados: PasoTratamiento[]) => {
    onUpdate({ ...caso, planTratamiento: pasosActualizados, progreso: calcularProgreso(pasosActualizados) });
  };

  const toggle = (id: string) => {
    actualizarPasos(pasos.map((p) => (p.id === id ? { ...p, completado: !p.completado } : p)));
  };

  const borrar = (id: string) => {
    actualizarPasos(pasos.filter((p) => p.id !== id));
  };

  const agregar = () => {
    if (!nuevoPaso.trim()) return;
    actualizarPasos([...pasos, { id: `paso_${Date.now()}`, descripcion: nuevoPaso.trim(), completado: false }]);
    setNuevoPaso("");
  };

  return (
    <div>
      <div className="ccd-plan-resumen">
        <span className="ccd-plan-resumen-pct">{progreso}%</span>
        <div className="ccd-plan-resumen-track">
          <div className="ccd-plan-resumen-fill" style={{ width: `${progreso}%` }} />
        </div>
        <span className="ccd-plan-resumen-texto">
          {pasos.filter((p) => p.completado).length} de {pasos.length} pasos completados
        </span>
      </div>

      {pasos.length === 0 ? (
        <p style={{ color: "var(--od-subtext)", fontSize: 13.5 }}>
          Aún no hay pasos en el plan de tratamiento.
        </p>
      ) : (
        <div>
          {pasos.map((paso) => (
            <div className="ccd-paso" key={paso.id}>
              <button
                type="button"
                className={`ccd-paso-check${paso.completado ? " is-checked" : ""}`}
                onClick={() => toggle(paso.id)}
                aria-label="Completar paso"
              >
                ✓
              </button>
              <span className={`ccd-paso-texto${paso.completado ? " is-checked" : ""}`}>
                {paso.descripcion}
              </span>
              <button
                type="button"
                className="ccd-paso-borrar"
                onClick={() => borrar(paso.id)}
                aria-label="Eliminar paso"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="ccd-agregar-paso">
        <input
          className="cc-form-input"
          type="text"
          placeholder="Ej. Aplicar sellante en pieza 3.7"
          value={nuevoPaso}
          onChange={(e) => setNuevoPaso(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
        />
        <button className="cc-btn-primario" type="button" onClick={agregar}>
          Agregar paso
        </button>
      </div>
    </div>
  );
}