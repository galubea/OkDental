import { X, TriangleAlert } from "lucide-react";
import { useCrearPaciente } from "../../hooks/useCrearPaciente";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function NuevoPacienteModal({ onClose, onCreated }: Props) {
  const {
    campos,
    setNombre,
    setApellido,
    setCi,
    setEmail,
    setTelefono,
    error,
    guardando,
    crear,
  } = useCrearPaciente(onCreated);

  async function handleCreate() {
    const ok = await crear();
    if (ok) onClose();
  }

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <h2>Agregar Nuevo Paciente</h2>
        <p className="od-subtitle">Ingresa los datos básicos para crear el registro.</p>
        <hr className="od-divider" />

        <div className="od-field-row">
          <div className="od-field">
            <label>
              Nombre<span className="req">*</span>
            </label>
            <input value={campos.nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="od-field">
            <label>
              Apellido<span className="req">*</span>
            </label>
            <input value={campos.apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>
              CI / Identificación<span className="req">*</span>
            </label>
            <input value={campos.ci} onChange={(e) => setCi(e.target.value)} />
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>Correo Electrónico</label>
            <input
              placeholder="ejemplo@correo.com"
              value={campos.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>Número de Teléfono</label>
            <input
              placeholder="Ej: 591 700 12345"
              value={campos.telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="od-error">
            <TriangleAlert size={14} strokeWidth={2} />
            {error}
          </p>
        )}

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="od-btn-primary" onClick={handleCreate} disabled={guardando}>
            {guardando ? "Creando..." : "Crear Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}