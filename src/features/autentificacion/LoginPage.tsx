// LoginPage.tsx
import { LoginForm } from "./components/LoginForm";
import "./styles/login.css";

interface LoginPageProps {
  onExito?: () => void;
  onIrARegistro?: () => void;
}

export function LoginPage({ onExito, onIrARegistro }: LoginPageProps) {
  return (
    <div className="od-login-page">
      <div className="od-login-card">
        <div className="od-login-brand">
          <div className="od-login-logo">LD</div>
          <div>
            <h1>Lumina Dental</h1>
            <p>Portal de doctores</p>
          </div>
        </div>
        <LoginForm onExito={onExito} />

        {onIrARegistro && (
          <p className="od-login-switch">
            ¿No tienes cuenta?{" "}
            <button type="button" className="od-login-link" onClick={onIrARegistro}>
              Regístrate
            </button>
          </p>
        )}
      </div>
    </div>
  );
}