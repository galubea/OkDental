import { useState, type FormEvent } from "react";
import { useAuth } from "./useAuth";
import { validateLoginForm, hasFormErrors } from "../utils/validation";
import { toAuthErrorMessage } from "../utils/errors";
import type { LoginFormErrors } from "../types/doctor";

export interface UseLoginFormResult {
  email: string;
  password: string;
  mostrarPassword: boolean;
  errors: LoginFormErrors;
  enviando: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  toggleMostrarPassword: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useLoginForm(onExito?: () => void): UseLoginFormResult {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [enviando, setEnviando] = useState(false);

  const toggleMostrarPassword = () => setMostrarPassword((v) => !v);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credenciales = { email: email.trim(), password };
    const erroresValidacion = validateLoginForm(credenciales);

    if (hasFormErrors(erroresValidacion)) {
      setErrors(erroresValidacion);
      return;
    }

    setErrors({});
    setEnviando(true);
    try {
      await login(credenciales);
      onExito?.();
    } catch (error) {
      setErrors({ form: toAuthErrorMessage(error) });
    } finally {
      setEnviando(false);
    }
  };

  return { email, password, mostrarPassword, errors, enviando, setEmail, setPassword, toggleMostrarPassword, handleSubmit };
}