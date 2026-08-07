import { useEffect, useState } from "react";
import { X, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import type { Usuario, UsuarioFormValues, CrearUsuarioInput, RolUsuario } from "../../types/user";
import { sugerirUsername } from "../../api/usuarioApi";
import { generarPasswordTemporal } from "../../utils/generarPassword";
import "../../styles/gestionUsuarios.css";

interface Props {
  abierto: boolean;
  usuario?: Usuario | null;
  onClose: () => void;
  onGuardar: (values: UsuarioFormValues | CrearUsuarioInput) => Promise<void>;
}

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ci: string;
  rol: RolUsuario;
  especialidad: string;
  sucursal: string;
}

const VALORES_INICIALES: FormState = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  ci: "",
  rol: "doctor",
  especialidad: "",
  sucursal: "",
};

function splitNombreCompleto(nombreCompleto: string): { nombre: string; apellido: string } {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 1) return { nombre: partes[0], apellido: "" };
  return { nombre: partes.slice(0, -1).join(" "), apellido: partes[partes.length - 1] };
}

export default function UsuarioModal({ abierto, usuario, onClose, onGuardar }: Props) {
  const [form, setForm] = useState<FormState>(VALORES_INICIALES);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [passwordPreview, setPasswordPreview] = useState<string | null>(null);
  const [usernamePreview, setUsernamePreview] = useState<string | null>(null);
  const [generandoCredenciales, setGenerandoCredenciales] = useState(false);
  const [obligarCambio, setObligarCambio] = useState(true);
  const [cuentaActiva, setCuentaActiva] = useState(true);

  const esEdicion = !!usuario;

  useEffect(() => {
    if (usuario) {
      const { nombre, apellido } = usuario.nombre && usuario.apellido
        ? { nombre: usuario.nombre, apellido: usuario.apellido }
        : splitNombreCompleto(usuario.nombreCompleto);
      setForm({
        nombre,
        apellido,
        email: usuario.email,
        telefono: usuario.telefono ?? "",
        ci: usuario.ci ?? "",
        rol: usuario.rol,
        especialidad: usuario.especialidad ?? "",
        sucursal: usuario.sucursal ?? "",
      });
    } else {
      setForm(VALORES_INICIALES);
      setObligarCambio(true);
      setCuentaActiva(true);
    }
    setPasswordPreview(null);
    setUsernamePreview(null);
    setErrores({});
  }, [usuario, abierto]);

  if (!abierto) return null;

  const generarCredenciales = async () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setErrores((prev) => ({ ...prev, credenciales: "Ingresa nombre y apellido primero." }));
      return;
    }
    setErrores((prev) => ({ ...prev, credenciales: "" }));
    setGenerandoCredenciales(true);
    try {
      const username = await sugerirUsername(form.nombre.trim(), form.apellido.trim());
      setUsernamePreview(username);
      setPasswordPreview(generarPasswordTemporal());
    } catch (err) {
      setErrores((prev) => ({ ...prev, credenciales: "No se pudo generar el usuario, intenta de nuevo." }));
    } finally {
      setGenerandoCredenciales(false);
    }
  };

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio";
    if (!form.email.trim()) e.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Correo inválido";
    if (!esEdicion && (!passwordPreview || !usernamePreview)) {
      e.credenciales = "Genera las credenciales antes de crear la cuenta.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      const base: UsuarioFormValues = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || null,
        ci: form.ci.trim() || null,
        rol: form.rol,
        especialidad: form.rol === "doctor" ? form.especialidad.trim() || null : null,
        sucursal: form.rol === "doctor" ? form.sucursal.trim() || null : null,
      };

      if (esEdicion) {
        await onGuardar(base);
      } else {
        const input: CrearUsuarioInput = {
          ...base,
          username: usernamePreview as string,
          passwordTemporal: passwordPreview as string,
          activo: cuentaActiva,
          debeCambiarPassword: obligarCambio,
        };
        await onGuardar(input);
      }
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
      <div className="od-modal-card od-modal-card-ancho" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>

        <h2>{esEdicion ? "Editar usuario" : "Crear Usuario"}</h2>
        <p className="od-subtitle">
          {esEdicion ? "Actualiza los datos de esta cuenta." : "Complete los datos para registrar un nuevo usuario en el sistema."}
        </p>
        <hr className="od-divider" />

        {/* 1. Información personal */}
        <p className="od-seccion-titulo">1. Información personal</p>

        <div className="od-field-row">
          <div className="od-field">
            <label>Nombre<span className="req">*</span></label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ana" autoFocus />
            {errores.nombre && <span className="od-error"><AlertCircle size={13} /> {errores.nombre}</span>}
          </div>
          <div className="od-field">
            <label>Apellido<span className="req">*</span></label>
            <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} placeholder="Pérez" />
            {errores.apellido && <span className="od-error"><AlertCircle size={13} /> {errores.apellido}</span>}
          </div>
        </div>

        <div className="od-field-row">
          <div className="od-field">
            <label>Correo electrónico<span className="req">*</span></label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@luminadental.com" disabled={esEdicion} />
            {errores.email && <span className="od-error"><AlertCircle size={13} /> {errores.email}</span>}
          </div>
          <div className="od-field">
            <label>Teléfono</label>
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="70000000" />
          </div>
        </div>

        <div className="od-field">
          <label>Carnet de Identidad (CI)</label>
          <input value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} placeholder="1234567" />
        </div>

        <hr className="od-divider" />

        {/* 2. Tipo de usuario */}
        <p className="od-seccion-titulo">2. Tipo de usuario</p>

        <div className="od-rol-opciones">
          <button type="button" className={`od-rol-opcion ${form.rol === "doctor" ? "seleccionado" : ""}`} onClick={() => setForm({ ...form, rol: "doctor" })}>
            <span className="od-rol-radio" /> Doctor
          </button>
          <button type="button" className={`od-rol-opcion ${form.rol === "admin" ? "seleccionado" : ""}`} onClick={() => setForm({ ...form, rol: "admin" })}>
            <span className="od-rol-radio" /> Administrador
          </button>
        </div>

        {form.rol === "doctor" && (
          <div className="od-rol-detalle">
            <div className="od-field-row">
              <div className="od-field">
                <label>Especialidad</label>
                <input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} placeholder="Ortodoncia" />
              </div>
              <div className="od-field">
                <label>Sucursal</label>
                <input value={form.sucursal} onChange={(e) => setForm({ ...form, sucursal: e.target.value })} placeholder="Sucursal Central" />
              </div>
            </div>
          </div>
        )}

        {!esEdicion && (
          <>
            <hr className="od-divider" />

            {/* 3. Credenciales generadas */}
            <div className="od-credenciales-header">
              <p className="od-seccion-titulo">3. Credenciales generadas</p>
              <button type="button" className="od-btn-secondary od-btn-chico" onClick={generarCredenciales} disabled={generandoCredenciales}>
                <RefreshCw size={13} /> {usernamePreview ? "Generar nuevamente" : "Generar"}
              </button>
            </div>

            {usernamePreview && passwordPreview ? (
              <div className="od-credenciales-preview">
                <div><span className="od-cred-label">Usuario:</span> {usernamePreview}</div>
                <div><span className="od-cred-label">Correo:</span> {form.email || "-"}</div>
                <div><span className="od-cred-label">Contraseña temporal:</span> {passwordPreview}</div>
              </div>
            ) : (
              <div className="od-credenciales-preview od-credenciales-vacio" onClick={generarCredenciales}>
                <p>Ingrese nombre y apellido y presione generar para ver una vista previa.</p>
                <span className="od-generar-link"><Sparkles size={13} /> {generandoCredenciales ? "Generando..." : "Generar ahora"}</span>
              </div>
            )}
            {errores.credenciales && <span className="od-error"><AlertCircle size={13} /> {errores.credenciales}</span>}
            <p className="od-nota-chica">Las credenciales finales se guardan tal cual se muestran aquí.</p>

            <hr className="od-divider" />

            {/* 4. Opciones */}
            <p className="od-seccion-titulo">4. Opciones</p>

            <label className="od-check-opcion">
              <input type="checkbox" checked={obligarCambio} onChange={(e) => setObligarCambio(e.target.checked)} />
              <div>
                <span>Obligar cambio de contraseña al primer inicio</span>
                <p>Recomendado por seguridad.</p>
              </div>
            </label>

            <label className="od-check-opcion">
              <input type="checkbox" checked={cuentaActiva} onChange={(e) => setCuentaActiva(e.target.checked)} />
              <div>
                <span>Cuenta activa inmediatamente</span>
                <p>El usuario podrá iniciar sesión tan pronto como se cree la cuenta.</p>
              </div>
            </label>
          </>
        )}

        {errores.general && <span className="od-error"><AlertCircle size={13} /> {errores.general}</span>}

        <div className="od-modal-actions">
          <button className="od-btn-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="od-btn-primary" onClick={handleSubmit} disabled={guardando}>
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}