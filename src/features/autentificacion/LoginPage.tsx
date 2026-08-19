// LoginPage.tsx
import { LoginForm } from "./components/LoginForm";
import fondoImg from "../../assets/fondo.jpg";
import "./styles/login.css";

interface LoginPageProps {
  onExito?: () => void;
}

export function LoginPage({ onExito }: LoginPageProps) {
  return (
    <div
      className="od-login-page"
      style={{ "--od-login-bg": `url(${fondoImg})` } as React.CSSProperties}
    >
      <div className="od-login-card">
        <div className="od-login-brand">
          <div className="od-login-logo">OK</div>
          <div>
            <h2>Ok Dental</h2>
            <p>Portal de doctores</p>
          </div>
        </div>

        <div className="od-login-heading">
          <h2>Bienvenido de nuevo</h2>
          <p>Inicia sesión para acceder a tu cuenta</p>
        </div>

        <LoginForm onExito={onExito} />

      </div>

    </div>
  );
}