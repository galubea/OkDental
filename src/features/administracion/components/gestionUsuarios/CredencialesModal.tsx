// components/gestionUsuarios/CredencialesModal.tsx
import { useState } from "react";
import { X, Copy, Check, Mail, KeyRound, ShieldCheck, ClipboardCopy } from "lucide-react";
import type { Usuario } from "../../types/user";
import "../../styles/gestionUsuarios.css";

interface Props {
  credenciales: { usuario: Usuario; password: string } | null;
  onClose: () => void;
}

type CampoCopiado = "correo" | "password" | "ambos" | null;

export default function CredencialesModal({ credenciales, onClose }: Props) {
  const [copiado, setCopiado] = useState<CampoCopiado>(null);
  if (!credenciales) return null;

  const copiarCampo = async (campo: CampoCopiado, texto: string) => {
    await navigator.clipboard.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const copiarAmbos = () =>
    copiarCampo(
      "ambos",
      `Correo: ${credenciales.usuario.email}\nContraseña temporal: ${credenciales.password}`
    );

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-card od-modal-confirm" onClick={(e) => e.stopPropagation()}>
        <button className="od-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>

        <div className="od-confirm-icono od-confirm-icono-exito">
          <Check size={26} strokeWidth={3} />
        </div>

        <h2>Cuenta creada</h2>
        <p className="od-subtitle">
          Comparte esta contraseña temporal con {credenciales.usuario.nombreCompleto}. No podrás volver a verla.
        </p>

        <div className="od-cred-card">
          <span className="od-cred-card-icono"><Mail size={16} /></span>
          <div>
            <span className="od-cred-card-label">Correo</span>
            <span className="od-cred-card-valor">{credenciales.usuario.email}</span>
          </div>
          <button
            className="od-cred-copiar"
            onClick={() => copiarCampo("correo", credenciales.usuario.email)}
            type="button"
            aria-label="Copiar correo"
          >
            {copiado === "correo" ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="od-cred-card">
          <span className="od-cred-card-icono"><KeyRound size={16} /></span>
          <div>
            <span className="od-cred-card-label">Contraseña temporal</span>
            <span className="od-cred-card-valor od-cred-card-mono">{credenciales.password}</span>
          </div>
          <button
            className="od-cred-copiar"
            onClick={() => copiarCampo("password", credenciales.password)}
            type="button"
            aria-label="Copiar contraseña"
          >
            {copiado === "password" ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <button className="od-copiar-ambos" onClick={copiarAmbos} type="button">
          <ClipboardCopy size={14} />
          {copiado === "ambos" ? "Credenciales copiadas" : "Copiar correo y contraseña"}
        </button>

        <div className="od-info-box od-info-box-exito">
          <span className="od-info-box-icono"><ShieldCheck size={16} /></span>
          <p>Pídele que la cambie apenas inicie sesión.</p>
        </div>

        <div className="od-modal-actions od-modal-actions-center">
          <button className="od-btn-primary od-btn-pill" onClick={onClose}>
            <Check size={15} /> Listo
          </button>
        </div>
      </div>
    </div>
  );
}