// components/RegisterForm.tsx
import { useRegisterForm } from "../hooks/useRegisterForm";
import { PasswordField } from "./PasswordField";

interface RegisterFormProps {
  onExito?: () => void;
}

export function RegisterForm({ onExito }: RegisterFormProps) {
  const {
    nombreCompleto,
    email,
    especialidad,
    password,
    confirmPassword,
    mostrarPassword,
    errors,
    enviando,
    setNombreCompleto,
    setEmail,
    setEspecialidad,
    setPassword,
    setConfirmPassword,
    toggleMostrarPassword,
    handleSubmit,
  } = useRegisterForm(onExito);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="od-field" style={{ marginBottom: 16 }}>
        <label htmlFor="nombreCompleto">Nombre completo<span className="req">*</span></label>
        <input
          id="nombreCompleto"
          type="text"
          autoComplete="name"
          placeholder="Dra. Ana Pérez"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          disabled={enviando}
          aria-invalid={Boolean(errors.nombreCompleto)}
          aria-describedby={errors.nombreCompleto ? "nombreCompleto-error" : undefined}
        />
        {errors.nombreCompleto && (
          <div id="nombreCompleto-error" className="od-error">{errors.nombreCompleto}</div>
        )}
      </div>

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

      <div className="od-field" style={{ marginBottom: 16 }}>
        <label htmlFor="especialidad">Especialidad</label>
        <input
          id="especialidad"
          type="text"
          placeholder="Ortodoncia (opcional)"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          disabled={enviando}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <PasswordField
          id="password"
          label="Contraseña"
          value={password}
          onChange={setPassword}
          mostrar={mostrarPassword}
          onToggleMostrar={toggleMostrarPassword}
          error={errors.password}
          disabled={enviando}
          autoComplete="new-password"
        />
      </div>

      <PasswordField
        id="confirmPassword"
        label="Confirmar contraseña"
        value={confirmPassword}
        onChange={setConfirmPassword}
        mostrar={mostrarPassword}
        onToggleMostrar={toggleMostrarPassword}
        error={errors.confirmPassword}
        disabled={enviando}
        autoComplete="new-password"
      />

      {errors.form && <div className="od-error" style={{ marginTop: 4 }}>{errors.form}</div>}

      <button type="submit" className="od-btn-primary od-login-submit" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}