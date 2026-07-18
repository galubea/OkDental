import { useState } from "react";
import { Plus, FileClock, Pencil, Trash2 } from "lucide-react";
import { useRegistrosClinicos } from "./hooks/useRegistrosClinicos";
import { NuevoRegistroModal } from "./components/resumenClinico/NuevoRegistroModal";
import { ConfirmModal } from "./components/common/ConfirmModal";
import { Toast } from "./components/common/Toast";
import { useToast } from "./hooks/useToast";
import { formatFecha } from "./utils/utils";
import type { RegistroClinico } from "./types/registroClinico";
import "./styles/resumenClinico.css";
import "./styles/modal.css";

interface Props {
  pacienteId: number;
}

export default function ResumenClinicoTab({ pacienteId }: Props) {
  const { registros, cargando, error, guardando, agregar, editar, eliminar } = useRegistrosClinicos(pacienteId);
  const { toast, mostrarToast, cerrarToast } = useToast();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<RegistroClinico | null>(null);

  const [registroAEliminar, setRegistroAEliminar] = useState<RegistroClinico | null>(null);
  const [eliminando, setEliminando] = useState(false);

  function abrirCrear() {
    setRegistroEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(registro: RegistroClinico) {
    setRegistroEditando(registro);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setRegistroEditando(null);
  }

  async function handleGuardar(input: Parameters<typeof agregar>[0]) {
    const esEdicion = !!registroEditando;
    const ok = esEdicion ? await editar(registroEditando!.id, input) : await agregar(input);

    if (ok) {
      mostrarToast(esEdicion ? "Registro actualizado correctamente." : "Registro agregado correctamente.", "exito");
    } else {
      mostrarToast(esEdicion ? "No se pudo actualizar el registro." : "No se pudo guardar el registro.", "error");
    }
    return ok;
  }

  async function confirmarEliminar() {
    if (!registroAEliminar) return;
    setEliminando(true);
    const ok = await eliminar(registroAEliminar.id);
    setEliminando(false);
    setRegistroAEliminar(null);

    mostrarToast(
      ok ? "Registro eliminado correctamente." : "No se pudo eliminar el registro.",
      ok ? "exito" : "error"
    );
  }

  return (
    <div className="rc-card">
      <div className="rc-header">
        <h2 className="rc-titulo">Resumen Clínico</h2>
        <button className="rc-btn-add" onClick={abrirCrear}>
          <Plus size={16} strokeWidth={2.4} />
          Agregar Registro
        </button>
      </div>

      {cargando && <p className="hc-estado">Cargando registros...</p>}
      {!cargando && error && <p className="hc-estado">{error}</p>}

      {!cargando && !error && registros.length === 0 && (
        <div className="rc-vacio">
          <FileClock size={32} strokeWidth={1.5} />
          <p>Aún no hay registros clínicos para este paciente.</p>
        </div>
      )}

      {!cargando && registros.length > 0 && (
        <div className="rc-timeline">
          {registros.map((r) => (
            <div className="rc-item" key={r.id}>
              <div className="rc-punto-col">
                <span className="rc-punto" />
                <span className="rc-linea" />
              </div>
              <div className="rc-contenido">
                <div className="rc-item-header">
                  <span className="rc-fecha">{formatFecha(r.fecha).toUpperCase()}</span>
                  <div className="rc-item-acciones">
                    <button className="rc-btn-icono" onClick={() => abrirEditar(r)} aria-label="Editar">
                      <Pencil size={14} strokeWidth={2} />
                    </button>
                    <button
                      className="rc-btn-icono"
                      onClick={() => setRegistroAEliminar(r)}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <p className="rc-item-titulo">{r.titulo}</p>
                {r.descripcion && <p className="rc-item-desc">{r.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <NuevoRegistroModal
          onClose={cerrarModal}
          onGuardar={handleGuardar}
          guardando={guardando}
          registroEditando={registroEditando}
        />
      )}

      {registroAEliminar && (
        <ConfirmModal
          titulo="Eliminar registro"
          mensaje={`¿Seguro que quieres eliminar "${registroAEliminar.titulo}"? Esta acción no se puede deshacer.`}
          confirmando={eliminando}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setRegistroAEliminar(null)}
        />
      )}

      {toast && (
        <Toast
          key={toast.key}
          titulo={toast.tipo === "error" ? "Error" : "Éxito"}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={cerrarToast}
        />
      )}
    </div>
  );
}