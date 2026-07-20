import { useState } from "react";
import { X, Copy, Check, ShieldAlert } from "lucide-react";
import type { Usuario } from "../../types/user";

interface Props {
  credenciales: { usuario: Usuario; password: string } | null;
  onClose: () => void;
}

export default function CredencialesModal({ credenciales, onClose }: Props) {
  const [copiado, setCopiado] = useState(false);
  if (!credenciales) return null;

  const copiar = async () => {
    await navigator.clipboard.writeText(credenciales.password);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>

        <h2>Cuenta creada</h2>
        <p className="od-subtitle">
          Comparte esta contraseña temporal con {credenciales.usuario.nombreCompleto}. No podrás volver a verla.
        </p>
        <hr className="od-divider" />

        <div className="od-field">
          <label>Correo</label>
          <input value={credenciales.usuario.email} readOnly />
        </div>

        <div className="od-field">
          <label>Contraseña temporal</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={credenciales.password} readOnly style={{ fontFamily: "monospace" }} />
            <button className="od-btn-secondary" onClick={copiar} type="button">
              {copiado ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="od-aviso">
          <ShieldAlert size={15} />
          <span>Pídele que la cambie apenas inicie sesión.</span>
        </div>

        <div className="od-modal-actions">
          <button className="od-btn-primary" onClick={onClose}>Listo</button>
        </div>
      </div>
    </div>
  );
}