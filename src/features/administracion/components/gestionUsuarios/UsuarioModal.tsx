import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Select from "../../../../components/ui/Select";
import type { Usuario, UsuarioFormValues } from "../../types/user";

interface Props {
  abierto: boolean;
  usuario?: Usuario | null;
  onClose: () => void;
  onGuardar: (values: UsuarioFormValues) => Promise<void>;
}

const VALORES_INICIALES: UsuarioFormValues = { nombreCompleto: "", email: "", especialidad: "", rol: "doctor" };
const OPCIONES_ROL = [{ value: "doctor", label: "Doctor" }, { value: "admin", label: "Administrador" }];

export default function UsuarioModal({ abierto, usuario, onClose, onGuardar }: Props) {
  const [form, setForm] = useState<UsuarioFormValues>(VALORES_INICIALES);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({ nombreCompleto: usuario.nombreCompleto, email: usuario.email, especialidad: usuario.especialidad || "", rol: usuario.rol });
    } else {
      setForm(VALORES_INICIALES);
    }
    setErrores({});
  }, [usuario, abierto]);

  if (!abierto) return null;

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombreCompleto.trim()) e.nombreCompleto = "El nombre es obligatorio";
    if (!form.email.trim()) e.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Correo inválido";
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
      setErrores((prev) => ({ ...prev, general: "No se pudo guardar la cuenta." }));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>

        <h2>{usuario ? "Editar cuenta" : "Nueva cuenta"}</h2>
        <p className="od-subtitle">
          {usuario ? "Actualiza los datos de esta cuenta." : "Se generará una contraseña temporal automáticamente al crear la cuenta."}
        </p>
        <hr className="od-divider" />

        <div className="od-field">
          <label>Nombre completo<span className="req">*</span></label>
          <input value={form.nombreCompleto} onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })} placeholder="Dra. Ana Pérez" autoFocus />
          {errores.nombreCompleto && <span className="od-error"><AlertCircle size={13} /> {errores.nombreCompleto}</span>}
        </div>

        <div className="od-field">
          <label>Correo electrónico<span className="req">*</span></label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@luminadental.com" disabled={!!usuario} />
          {errores.email && <span className="od-error"><AlertCircle size={13} /> {errores.email}</span>}
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>Rol<span className="req">*</span></label>
            <Select options={OPCIONES_ROL} value={form.rol} onChange={(v) => setForm({ ...form, rol: v as UsuarioFormValues["rol"] })} />
          </div>
          <div className="od-field">
            <label>Especialidad</label>
            <input
  value={form.especialidad ?? ""}
  onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
  placeholder="Ortodoncia (opcional)" />
          </div>
        </div>

        {errores.general && <span className="od-error"><AlertCircle size={13} /> {errores.general}</span>}

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="od-btn-primary" onClick={handleSubmit} disabled={guardando}>
            {guardando ? "Guardando..." : usuario ? "Guardar cambios" : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}