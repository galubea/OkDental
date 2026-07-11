import { useLoginForm } from "../hooks/useLoginForm";
import { PasswordField } from "./PasswordField";

interface LoginFormProps {
  onExito?: () => void;
}

export function LoginForm({ onExito }: LoginFormProps) {
  const { email, password, mostrarPassword, errors, enviando, setEmail, setPassword, toggleMostrarPassword, handleSubmit } = useLoginForm(onExito);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="od-field" style={{ marginBottom: 16 }}>
        <label htmlFor="email">Correo electrónico<span className="req">*</span></label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="doctor@luminadental.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={enviando}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <div id="email-error" className="od-error">{errors.email}</div>}
      </div>

      <PasswordField
        id="password"
        label="Contraseña"
        value={password}
        onChange={setPassword}
        mostrar={mostrarPassword}
        onToggleMostrar={toggleMostrarPassword}
        error={errors.password}
        disabled={enviando}
      />

      {errors.form && <div className="od-error" style={{ marginTop: 4 }}>{errors.form}</div>}

      <button type="submit" className="od-btn-primary od-login-submit" disabled={enviando}>
        {enviando ? "Verificando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}