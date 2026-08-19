import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  mostrar: boolean;
  onToggleMostrar: () => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  requerido?: boolean;
}

export function PasswordField({
  id, label, value, onChange, mostrar, onToggleMostrar,
  error, disabled, autoComplete = "current-password", requerido = true,
}: PasswordFieldProps) {
  return (
    <div className="od-field">
      <label htmlFor={id}>
        {label}
        {requerido && <span className="req">*</span>}
      </label>
      <div className="od-login-input-wrap od-login-password-wrap">
        <Lock size={18} />
        <input
          id={id}
          type={mostrar ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="od-login-toggle-eye"
          onClick={onToggleMostrar}
          tabIndex={-1}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <div id={`${id}-error`} className="od-error">{error}</div>}
    </div>
  );
}