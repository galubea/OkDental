import { useState } from "react";
import type { Foto, NuevaFotoInput } from "../types/fotos";

const FOTOS_INICIALES: Foto[] = [
  {
    id: "1",
    titulo: "Panoramic X-Ray",
    fecha: "2023-10-12",
    url: "",
  },
  {
    id: "2",
    titulo: "Intraoral Scan",
    fecha: "2023-10-12",
    url: "",
  },
  {
    id: "3",
    titulo: "Before Treatment",
    fecha: "2023-05-04",
    url: "",
  },
];

export function useFotos(_pacienteId: number) {
  const [fotos, setFotos] = useState<Foto[]>(FOTOS_INICIALES);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  function abrirModal() {
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  async function subirFoto(input: NuevaFotoInput): Promise<boolean> {
    setSubiendo(true);
    try {
      const url = URL.createObjectURL(input.archivo);
      const nueva: Foto = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        fecha: input.fecha,
        url,
      };
      setFotos((prev) => [nueva, ...prev]);
      setModalAbierto(false);
      return true;
    } finally {
      setSubiendo(false);
    }
  }

  function eliminarFoto(id: string) {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  return { fotos, modalAbierto, abrirModal, cerrarModal, subiendo, subirFoto, eliminarFoto };
}