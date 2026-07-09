import { CalendarPlus, AlertCircle, ChevronRight } from "lucide-react";
import { useCitas } from "./hooks/useCitas";
import { ModalNuevaCita } from "./components/citas/ModalNuevaCita";
import { ModalReprogramar } from "./components/citas/ModalReprogramar";
import { ModalConfirmarCancelacion } from "./components/citas/ModalConfirmarCancelacion";
import { MenuAccionesCita } from "./components/citas/MenuAccionesCita";
import { CitaDetalle } from "./components/citas/CitaDetalle";
import type { Cita } from "./types/citas";
import "./styles/citas.css";

interface Props {
  pacienteId: number;
  pacienteNombre: string;
}

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function formatearFecha(fecha: string) {
  const [, mesStr, diaStr] = fecha.split("-");
  return { mes: MESES[Number(mesStr) - 1], dia: String(Number(diaStr)) };
}

const ETIQUETA_ESTADO: Record<Cita["estado"], string> = {
  programada: "Programada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

function formatoMoneda(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

export default function CitasTab({ pacienteId, pacienteNombre }: Props) {
  const {
    citas, cargando, guardando,
    saldoPendienteTotal,
    modalAbierto, abrirModal, cerrarModal, agendarCita,
    citaSeleccionada, seleccionarCita, volverALista,
    agregarTratamientoACita, eliminarTratamientoDeCita, guardarNotas,
    agregarPagoACita, eliminarPagoDeCita, errorPago, limpiarErrorPago,
    modalReprogramarId, abrirReprogramar, cerrarReprogramar,
    modalCancelarId, abrirCancelar, cerrarCancelar,
    accionando, confirmarReprogramar, confirmarCancelacion, marcarComoAtendida,
  } = useCitas(pacienteId);

  if (cargando) return <p className="hc-estado">Cargando citas...</p>;

  const citaEnReprogramacion = citas.find((c) => c.id === modalReprogramarId);
  const citaEnCancelacion = citas.find((c) => c.id === modalCancelarId);

  if (citaSeleccionada) {
    return (
      <div className="cit-card">
        <CitaDetalle
          cita={citaSeleccionada}
          pacienteNombre={pacienteNombre}
          errorPago={errorPago}
          onVolver={volverALista}
          onAgregarTratamiento={(input) => agregarTratamientoACita(citaSeleccionada.id, input)}
          onEliminarTratamiento={(tratamientoId) => eliminarTratamientoDeCita(citaSeleccionada.id, tratamientoId)}
          onGuardarNotas={(notas) => guardarNotas(citaSeleccionada.id, notas)}
          onAgregarPago={(input) => agregarPagoACita(citaSeleccionada.id, input)}
          onEliminarPago={(pagoId) => eliminarPagoDeCita(citaSeleccionada.id, pagoId)}
          onLimpiarErrorPago={limpiarErrorPago}
          onReprogramar={() => abrirReprogramar(citaSeleccionada.id)}
          onCancelar={() => abrirCancelar(citaSeleccionada.id)}
          onMarcarAtendida={() => marcarComoAtendida(citaSeleccionada.id)}
        />

        {citaEnReprogramacion && (
          <ModalReprogramar
            fechaActual={citaEnReprogramacion.fecha}
            horaActual={citaEnReprogramacion.hora}
            guardando={accionando}
            onCancelar={cerrarReprogramar}
            onConfirmar={(fecha, hora) => confirmarReprogramar(citaEnReprogramacion.id, fecha, hora)}
          />
        )}
        {citaEnCancelacion && (
          <ModalConfirmarCancelacion
            motivo={citaEnCancelacion.motivo}
            guardando={accionando}
            onVolver={cerrarCancelar}
            onConfirmar={() => confirmarCancelacion(citaEnCancelacion.id)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="cit-card">
      <div className="cit-header">
        <div>
          <h2 className="cit-titulo">Citas</h2>
          <p className="cit-subtitulo">{citas.length} {citas.length === 1 ? "cita registrada" : "citas registradas"}</p>
        </div>
        <button className="od-btn-primary" onClick={abrirModal}>
          <CalendarPlus size={15} strokeWidth={2} />
          Nueva Cita
        </button>
      </div>

      {saldoPendienteTotal > 0 && (
        <div className="cit-saldo-banner">
          <div>
            <span className="cit-saldo-label">Saldo pendiente total</span>
            <span className="cit-saldo-monto">{formatoMoneda(saldoPendienteTotal)}</span>
          </div>
          <AlertCircle size={22} strokeWidth={2} className="cit-saldo-icono" />
        </div>
      )}

      {citas.length === 0 ? (
        <p className="cit-vacio">Aún no hay citas registradas para este paciente.</p>
      ) : (
        <div className="cit-lista">
          {citas.map((c) => {
            const { mes, dia } = formatearFecha(c.fecha);
            const saldo = c.total != null ? c.total - (c.pagado ?? 0) : null;
            return (
              <div key={c.id} className="cit-item" onClick={() => seleccionarCita(c.id)}>
                <div className="cit-item-fecha">
                  <span className="cit-item-mes">{mes}</span>
                  <span className="cit-item-dia">{dia}</span>
                  <span className="cit-item-hora">{c.hora}</span>
                </div>

                <div className="cit-item-info">
                  <span className="cit-item-motivo">{c.motivo}</span>
                  <span className={`cit-badge cit-badge-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
                </div>

                {c.total != null && (
                  <div className="cit-item-montos">
                    <span className="cit-item-total">Total: {formatoMoneda(c.total)}</span>
                    {saldo != null && saldo > 0 && (
                      <span className="cit-item-saldo">{formatoMoneda(saldo)}</span>
                    )}
                  </div>
                )}

                <MenuAccionesCita
                  estado={c.estado}
                  onReprogramar={() => abrirReprogramar(c.id)}
                  onCancelar={() => abrirCancelar(c.id)}
                />

                <ChevronRight size={18} strokeWidth={2} className="cit-item-chevron" />
              </div>
            );
          })}
        </div>
      )}

      {modalAbierto && (
        <ModalNuevaCita guardando={guardando} onCancelar={cerrarModal} onAgendar={agendarCita} />
      )}

      {citaEnReprogramacion && (
        <ModalReprogramar
          fechaActual={citaEnReprogramacion.fecha}
          horaActual={citaEnReprogramacion.hora}
          guardando={accionando}
          onCancelar={cerrarReprogramar}
          onConfirmar={(fecha, hora) => confirmarReprogramar(citaEnReprogramacion.id, fecha, hora)}
        />
      )}
      {citaEnCancelacion && (
        <ModalConfirmarCancelacion
          motivo={citaEnCancelacion.motivo}
          guardando={accionando}
          onVolver={cerrarCancelar}
          onConfirmar={() => confirmarCancelacion(citaEnCancelacion.id)}
        />
      )}
    </div>
  );
}