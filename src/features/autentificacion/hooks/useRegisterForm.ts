// hooks/useRegisterForm.ts
import { useState, type FormEvent } from "react";
import { useAuth } from "./useAuth";
import type { LoginFormErrors } from "../types/doctor";

interface RegisterFormErrors extends LoginFormErrors {
  nombreCompleto?: string;
  confirmPassword?: string;
}

export function useRegisterForm(onExito?: () => void) {
  const { register } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [enviando, setEnviando] = useState(false);

  function toggleMostrarPassword() {
    setMostrarPassword((v) => !v);
  }

  function validar(): RegisterFormErrors {
    const nuevosErrores: RegisterFormErrors = {};

    if (!nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es obligatorio.";
    }

    if (!email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nuevosErrores.email = "Ingresa un correo válido.";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      nuevosErrores.password = "Debe tener al menos 8 caracteres.";
    }

    if (confirmPassword !== password) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
    }

    return nuevosErrores;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await register({
        nombreCompleto: nombreCompleto.trim(),
        email: email.trim().toLowerCase(),
        password,
        especialidad: especialidad.trim() || null,
      });
      onExito?.();
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "No se pudo completar el registro." });
    } finally {
      setEnviando(false);
    }
  }

  return {
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
  };
}