// RegisterPage.tsx
import { RegisterForm } from "./components/RegisterForm";
import "./styles/login.css";

interface RegisterPageProps {
  onExito?: () => void;
  onIrALogin?: () => void;
}

export function RegisterPage({ onExito, onIrALogin }: RegisterPageProps) {
  return (
    <div className="od-login-page">
      <div className="od-login-card">
        <div className="od-login-brand">
          <div className="od-login-logo">LD</div>
          <div>
            <h1>Lumina Dental</h1>
            <p>Crear cuenta de doctor</p>
          </div>
        </div>
        <RegisterForm onExito={onExito} />

        {onIrALogin && (
          <p className="od-login-switch">
            ¿Ya tienes cuenta?{" "}
            <button type="button" className="od-login-link" onClick={onIrALogin}>
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
}