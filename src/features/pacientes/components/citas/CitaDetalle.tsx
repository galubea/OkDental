import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Receipt, CalendarClock, XCircle, CheckCircle2 } from "lucide-react";
import type { Cita, NuevoTratamientoInput, NuevoPagoInput } from "../../types/citas";
import { ModalNuevoTratamiento } from "./ModalNuevoTratamiento";
import { PagosSection } from "./PagosSection";

interface Props {
  cita: Cita;
  pacienteNombre: string;
  errorPago: string;
  onVolver: () => void;
  onAgregarTratamiento: (input: NuevoTratamientoInput) => void;
  onEliminarTratamiento: (tratamientoId: string) => void;
  onGuardarNotas: (notas: string) => void;
  onAgregarPago: (input: NuevoPagoInput) => Promise<boolean>;
  onEliminarPago: (pagoId: string) => void;
  onLimpiarErrorPago: () => void;
  onReprogramar: () => void;
  onCancelar: () => void;
  onMarcarAtendida: () => void;
}

const ETIQUETA_ESTADO: Record<Cita["estado"], string> = {
  programada: "Programada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatearFechaLarga(fecha: string, hora: string) {
  const [anio, mesStr, diaStr] = fecha.split("-");
  return `${Number(diaStr)} de ${MESES[Number(mesStr) - 1]} ${anio}, ${hora}`;
}

function formatoMoneda(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

export function CitaDetalle({
  cita, pacienteNombre, errorPago, onVolver,
  onAgregarTratamiento, onEliminarTratamiento, onGuardarNotas,
  onAgregarPago, onEliminarPago, onLimpiarErrorPago,
  onReprogramar, onCancelar, onMarcarAtendida,
}: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notasLocal, setNotasLocal] = useState(cita.notas);

  useEffect(() => {
    setNotasLocal(cita.notas);
  }, [cita.id, cita.notas]);

  const total = cita.tratamientos.reduce((acc, t) => acc + t.cantidad * t.precioUnitario, 0);

  return (
    <div className="cit-detalle">
      <div className="cit-detalle-header">
        <button className="cit-detalle-volver" onClick={onVolver} title="Volver">
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div className="cit-detalle-header-info">
          <div className="cit-detalle-titulo-fila">
            <h2 className="cit-detalle-titulo">{cita.motivo}</h2>
            <span className={`cit-badge cit-badge-${cita.estado}`}>{ETIQUETA_ESTADO[cita.estado]}</span>
          </div>
          <p className="cit-detalle-subtitulo">
            {pacienteNombre} · {formatearFechaLarga(cita.fecha, cita.hora)}
          </p>
        </div>

        {cita.estado !== "atendida" && (
          <div className="cit-detalle-header-acciones">
            {cita.estado === "programada" && (
              <>
                <button className="cit-btn-verde" onClick={onMarcarAtendida}>
                  <CheckCircle2 size={14} strokeWidth={2} />
                  Marcar como atendida
                </button>
                <button className="cit-btn-secundario" onClick={onReprogramar}>
                  <CalendarClock size={14} strokeWidth={2} />
                  Reprogramar
                </button>
                <button className="cit-btn-peligro-outline" onClick={onCancelar}>
                  <XCircle size={14} strokeWidth={2} />
                  Cancelar
                </button>
              </>
            )}
            {cita.estado === "cancelada" && (
              <button className="cit-btn-secundario" onClick={onReprogramar}>
                <CalendarClock size={14} strokeWidth={2} />
                Reprogramar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="cit-detalle-seccion">
        <div className="cit-detalle-seccion-header">
          <div className="cit-detalle-seccion-titulo">
            <span className="cit-detalle-icono">
              <Receipt size={16} strokeWidth={2} />
            </span>
            <h3>Tratamientos realizados</h3>
          </div>
          <button className="od-btn-primary" onClick={() => setModalAbierto(true)}>
            <Plus size={15} strokeWidth={2} />
            Agregar tratamiento
          </button>
        </div>

        {cita.tratamientos.length === 0 ? (
          <p className="cit-detalle-vacio">Aún no hay tratamientos registrados para esta cita.</p>
        ) : (
          <table className="cit-tabla">
            <thead>
              <tr>
                <th>Tratamiento</th>
                <th>Diente</th>
                <th>Cant.</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cita.tratamientos.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  <td className="cit-tabla-centro">{t.diente || "—"}</td>
                  <td className="cit-tabla-centro">{t.cantidad}</td>
                  <td className="cit-tabla-derecha">{formatoMoneda(t.precioUnitario)}</td>
                  <td className="cit-tabla-derecha cit-tabla-subtotal">
                    {formatoMoneda(t.cantidad * t.precioUnitario)}
                  </td>
                  <td className="cit-tabla-accion">
                    <button
                      className="cit-tabla-eliminar"
                      onClick={() => onEliminarTratamiento(t.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="cit-tabla-total-label">Total</td>
                <td className="cit-tabla-derecha cit-tabla-total-monto">{formatoMoneda(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <PagosSection
        cita={cita}
        errorPago={errorPago}
        onAgregarPago={onAgregarPago}
        onEliminarPago={onEliminarPago}
        onLimpiarError={onLimpiarErrorPago}
      />

      <div className="cit-detalle-seccion">
        <h3 className="cit-detalle-notas-titulo">Notas clínicas</h3>
        <textarea
          className="cit-notas-textarea"
          placeholder="Ej. Sin complicaciones, próxima revisión en 3 meses..."
          value={notasLocal}
          onChange={(e) => setNotasLocal(e.target.value)}
          onBlur={() => {
            if (notasLocal !== cita.notas) onGuardarNotas(notasLocal);
          }}
        />
      </div>

      {modalAbierto && (
        <ModalNuevoTratamiento
          onCancelar={() => setModalAbierto(false)}
          onAgregar={(input) => {
            onAgregarTratamiento(input);
            setModalAbierto(false);
          }}
        />
      )}
    </div>
  );
}