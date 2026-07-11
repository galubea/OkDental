import { useState } from "react";
import type { NuevoPacienteInput } from "../types/paciente";
import { crearPaciente } from "../api/pacienteApi";

export function useCrearPaciente(onCreated: () => void) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [ci, setCi] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function crear(): Promise<boolean> {
    if (!nombre.trim() || !apellido.trim() || !ci.trim()) {
      setError("Nombre, Apellido y CI son obligatorios.");
      return false;
    }
    setError("");
    setGuardando(true);
    try {
      const data: NuevoPacienteInput = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        ci: ci.trim(),
        email: email.trim() || undefined,
        telefono: telefono.trim() || undefined,
      };
      await crearPaciente(data);
      onCreated();
      return true;
    } catch (e) {
      setError("No se pudo crear el paciente. Intenta de nuevo.");
      return false;
    } finally {
      setGuardando(false);
    }
  }

  return {
    campos: { nombre, apellido, ci, email, telefono },
    setNombre,
    setApellido,
    setCi,
    setEmail,
    setTelefono,
    error,
    guardando,
    crear,
  };
}