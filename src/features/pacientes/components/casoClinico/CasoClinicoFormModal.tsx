import { useState } from "react";
import { X } from "lucide-react";
import type { NuevoCasoInput, Severidad } from "../../types/casoClinico";
import type { DoctorResumen } from "../../types/citas";

interface FormState {
  titulo: string;
  descripcion: string;
  especialidad: string;
  doctorId: string;
  severidad: Severidad;
}

const initialForm: FormState = {
  titulo: "",
  descripcion: "",
  especialidad: "",
  doctorId: "",
  severidad: "medio",
};

interface CasoClinicoFormModalProps {
  doctores: DoctorResumen[];
  guardando: boolean;
  onClose: () => void;
  onCreate: (input: NuevoCasoInput) => void;
}

export default function CasoClinicoFormModal({ doctores, guardando, onClose, onCreate }: CasoClinicoFormModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");

  const setField = <K extends keyof FormState>(campo: K, valor: FormState[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const handleSubmit = () => {
    if (!form.titulo.trim()) {
      setError("El título del caso es obligatorio.");
      return;
    }

    onCreate({
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      especialidad: form.especialidad.trim(),
      doctorId: form.doctorId ? Number(form.doctorId) : null,
      severidad: form.severidad,
    });
  };

  return (
    <div className="cc-modal-overlay" onClick={onClose}>
      <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cc-modal-header">
          <h3>Nuevo caso clínico</h3>
          <button className="cc-modal-cerrar" onClick={onClose} type="button" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="cc-form-grupo">
          <label>Título del caso</label>
          <input
            className="cc-form-input"
            type="text"
            placeholder="Ej. Caries múltiple activa"
            value={form.titulo}
            onChange={(e) => setField("titulo", e.target.value)}
          />
        </div>

        <div className="cc-form-grupo">
          <label>Descripción</label>
          <textarea
            className="cc-form-textarea"
            placeholder="Breve resumen del motivo de consulta"
            value={form.descripcion}
            onChange={(e) => setField("descripcion", e.target.value)}
          />
        </div>

        <div className="cc-form-fila">
          <div className="cc-form-grupo">
            <label>Especialidad</label>
            <input
              className="cc-form-input"
              type="text"
              placeholder="Odontología General"
              value={form.especialidad}
              onChange={(e) => setField("especialidad", e.target.value)}
            />
          </div>
          <div className="cc-form-grupo">
            <label>Doctor responsable</label>
            <select
              className="cc-form-select"
              value={form.doctorId}
              onChange={(e) => setField("doctorId", e.target.value)}
            >
              <option value="">Sin asignar</option>
              {doctores.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombreCompleto}
                  {d.especialidad ? ` · ${d.especialidad}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cc-form-grupo">
          <label>Severidad</label>
          <select
            className="cc-form-select"
            value={form.severidad}
            onChange={(e) => setField("severidad", e.target.value as Severidad)}
          >
            <option value="bajo">Bajo</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
        </div>

        {error && (
          <p style={{ color: "var(--od-required)", fontSize: 12.5, marginTop: -8, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <div className="cc-modal-footer">
          <button className="cc-btn-secundario" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="cc-btn-primario" onClick={handleSubmit} type="button" disabled={guardando}>
            {guardando ? "Creando..." : "Crear caso clínico"}
          </button>
        </div>
      </div>
    </div>
  );
}
