import { useEffect, useState } from "react";
import { X, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Select from "../../../../components/ui/Select";
import type {
  Tratamiento,
  TratamientoFormValues,
  CategoriaTratamiento,
} from "../../types/treatment";
import "../../styles/catalogo.css"

interface Props {
  abierto: boolean;
  tratamiento?: Tratamiento | null;
  categorias: CategoriaTratamiento[];
  onClose: () => void;
  onGuardar: (values: TratamientoFormValues) => Promise<void>;
}

const VALORES_INICIALES: TratamientoFormValues = {
  nombre: "",
  categoriaId: "",
  precioBase: 0,
  descripcion: "",
  duracionMin: undefined,
  requiereConsentimiento: false,
};

export default function TratamientoModal({
  abierto,
  tratamiento,
  categorias,
  onClose,
  onGuardar,
}: Props) {
  const [form, setForm] = useState<TratamientoFormValues>(VALORES_INICIALES);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [masOpciones, setMasOpciones] = useState(false);

  useEffect(() => {
    if (tratamiento) {
      setForm({
        nombre: tratamiento.nombre,
        categoriaId: tratamiento.categoriaId,
        precioBase: tratamiento.precioBase,
        descripcion: tratamiento.descripcion ?? "",
        duracionMin: tratamiento.duracionMin,
        requiereConsentimiento: tratamiento.requiereConsentimiento ?? false,
      });
      setMasOpciones(
        !!(tratamiento.descripcion || tratamiento.duracionMin || tratamiento.requiereConsentimiento)
      );
    } else {
      setForm({ ...VALORES_INICIALES, categoriaId: categorias[0]?.id ?? "" });
      setMasOpciones(false);
    }
    setErrores({});
  }, [tratamiento, abierto, categorias]);

  if (!abierto) return null;

  const opcionesCategoria = categorias.map((c) => ({ value: c.id, label: c.nombre }));

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.categoriaId) e.categoriaId = "Selecciona una categoría";
    if (form.precioBase < 0) e.precioBase = "El precio no puede ser negativo";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await onGuardar(form);
      onClose();
    } catch (err) {
      console.error(err);
      setErrores((prev) => ({ ...prev, general: "No se pudo guardar el tratamiento." }));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <h2>{tratamiento ? "Editar tratamiento" : "Nuevo tratamiento"}</h2>
        <p className="od-subtitle">
          {tratamiento
            ? "Actualiza los datos de este procedimiento del catálogo."
            : "Solo necesitas el nombre, la categoría y el precio. Lo demás es opcional."}
        </p>
        <hr className="od-divider" />

        <div className="od-field">
          <label>
            Nombre del tratamiento<span className="req">*</span>
          </label>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Resina compuesta"
            autoFocus
          />
          {errores.nombre && (
            <span className="od-error">
              <AlertCircle size={13} /> {errores.nombre}
            </span>
          )}
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>
              Categoría<span className="req">*</span>
            </label>
            <Select
              options={opcionesCategoria}
              value={form.categoriaId}
              onChange={(v) => setForm({ ...form, categoriaId: v })}
              placeholder="Selecciona..."
            />
            {errores.categoriaId && (
              <span className="od-error">
                <AlertCircle size={13} /> {errores.categoriaId}
              </span>
            )}
          </div>

          <div className="od-field">
            <label>
              Precio (Bs.)<span className="req">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.precioBase}
              onChange={(e) => setForm({ ...form, precioBase: Number(e.target.value) })}
              placeholder="250"
            />
            {errores.precioBase && (
              <span className="od-error">
                <AlertCircle size={13} /> {errores.precioBase}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="od-toggle-opciones"
          onClick={() => setMasOpciones((v) => !v)}
        >
          {masOpciones ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          Más opciones (opcional)
        </button>

        {masOpciones && (
          <div className="od-opciones-avanzadas">
            <div className="od-field-row">
              <div className="od-field">
                <label>Duración estimada (min)</label>
                <input
                  type="number"
                  min={0}
                  value={form.duracionMin ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duracionMin: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="45"
                />
              </div>
              <div className="od-field od-field-check">
                <label>Requiere consentimiento informado</label>
                <label className="od-switch">
                  <input
                    type="checkbox"
                    checked={!!form.requiereConsentimiento}
                    onChange={(e) =>
                      setForm({ ...form, requiereConsentimiento: e.target.checked })
                    }
                  />
                  <span className="od-switch-slider" />
                </label>
              </div>
            </div>

            <div className="od-field">
              <label>Descripción / notas clínicas</label>
              <textarea
                className="od-textarea"
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Notas generales sobre este procedimiento..."
              />
            </div>
          </div>
        )}

        {errores.general && (
          <span className="od-error">
            <AlertCircle size={13} /> {errores.general}
          </span>
        )}

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onClose} disabled={guardando}>
            Cancelar
          </button>
          <button className="od-btn-primary" onClick={handleSubmit} disabled={guardando}>
            {guardando ? "Guardando..." : tratamiento ? "Guardar cambios" : "Crear tratamiento"}
          </button>
        </div>
      </div>
    </div>
  );
}