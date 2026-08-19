import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { CasoClinico } from "../../../types/casoClinico";
import type { CatalogoTratamientoResumen } from "../../../hooks/useCasoClinico";

interface Props {
  caso: CasoClinico;
  catalogo: CatalogoTratamientoResumen[];
  onAgregar: (
    casoId: string,
    input: { descripcion: string; diente?: string; catalogoTratId?: string; precio?: number }
  ) => Promise<void>;
  onToggle: (casoId: string, pasoId: string) => Promise<void>;
  onBorrar: (casoId: string, pasoId: string) => Promise<void>;
}

export default function DetallePlanTratamiento({ caso, catalogo, onAgregar, onToggle, onBorrar }: Props) {
  const [catalogoTratId, setCatalogoTratId] = useState("");
  const [descripcionManual, setDescripcionManual] = useState("");
  const [diente, setDiente] = useState("");
  const pasos = caso.planTratamiento;

  const agregar = async () => {
    if (catalogoTratId) {
      const item = catalogo.find((t) => t.id === catalogoTratId);
      if (!item) return;
      await onAgregar(caso.id, {
        descripcion: item.nombre,
        diente: diente.trim() || undefined,
        catalogoTratId: item.id,
        precio: item.precioBase,
      });
    } else {
      if (!descripcionManual.trim()) return;
      await onAgregar(caso.id, { descripcion: descripcionManual.trim(), diente: diente.trim() || undefined });
    }
    setCatalogoTratId("");
    setDescripcionManual("");
    setDiente("");
  };

  return (
    <div>
      <p className="ccd-seccion-titulo" style={{ marginTop: 0 }}>
        Plan de tratamiento
      </p>

      <div className="ccd-plan-resumen">
        <span className="ccd-plan-resumen-pct">{caso.progreso}%</span>
        <div className="ccd-plan-resumen-track">
          <div className="ccd-plan-resumen-fill" style={{ width: `${caso.progreso}%` }} />
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
                onClick={() => onToggle(caso.id, paso.id)}
                aria-label="Completar paso"
              >
                ✓
              </button>
              <span className={`ccd-paso-texto${paso.completado ? " is-checked" : ""}`}>
                {paso.descripcion}
                {paso.diente ? ` · pieza ${paso.diente}` : ""}
                {paso.precio != null ? ` · Bs ${paso.precio.toFixed(2)}` : ""}
              </span>
              <button
                type="button"
                className="ccd-paso-borrar"
                onClick={() => onBorrar(caso.id, paso.id)}
                aria-label="Eliminar paso"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cc-form-fila" style={{ marginTop: 16 }}>
        <div className="cc-form-grupo" style={{ marginBottom: 0 }}>
          <label>Tratamiento del catálogo</label>
          <select
            className="cc-form-select"
            value={catalogoTratId}
            onChange={(e) => {
              setCatalogoTratId(e.target.value);
              if (e.target.value) setDescripcionManual("");
            }}
          >
            <option value="">Escribir manualmente...</option>
            {catalogo.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} · Bs {t.precioBase.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-form-grupo" style={{ marginBottom: 0, maxWidth: 110 }}>
          <label>Pieza</label>
          <input
            className="cc-form-input"
            type="text"
            placeholder="Ej. 3.7"
            value={diente}
            onChange={(e) => setDiente(e.target.value)}
          />
        </div>
      </div>

      {!catalogoTratId && (
        <div className="cc-form-grupo" style={{ marginTop: 10 }}>
          <input
            className="cc-form-input"
            type="text"
            placeholder="Ej. Aplicar sellante en pieza 3.7"
            value={descripcionManual}
            onChange={(e) => setDescripcionManual(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregar()}
          />
        </div>
      )}

      <div className="ccd-form-footer">
        <button className="cc-btn-primario" type="button" onClick={agregar}>
          Agregar paso
        </button>
      </div>
    </div>
  );
}
