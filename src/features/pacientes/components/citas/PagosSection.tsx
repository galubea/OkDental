import { useState } from "react";
import { Plus, Trash2, Banknote, CheckCircle2 } from "lucide-react";
import type { Cita, NuevoPagoInput } from "../../types/citas";
import { METODOS_PAGO } from "../../types/citas";
import { ModalNuevoPago } from "./ModalNuevoPago";

interface Props {
  cita: Cita;
  errorPago: string;
  onAgregarPago: (input: NuevoPagoInput) => Promise<boolean>;
  onEliminarPago: (pagoId: string) => void;
  onLimpiarError: () => void;
}

function formatoMoneda(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

function formatearFechaCorta(fecha: string) {
  const [anio, mesStr, diaStr] = fecha.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${Number(diaStr)} ${meses[Number(mesStr) - 1]} ${anio}`;
}

function labelMetodo(metodo: string) {
  return METODOS_PAGO.find((m) => m.key === metodo)?.label ?? metodo;
}

export function PagosSection({ cita, errorPago, onAgregarPago, onEliminarPago, onLimpiarError }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const total = cita.tratamientos.reduce((acc, t) => acc + t.cantidad * t.precioUnitario, 0);
  const pagado = cita.pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = Math.max(total - pagado, 0);
  const alDia = total > 0 && saldoPendiente === 0;

  async function handleAgregar(input: NuevoPagoInput) {
    const ok = await onAgregarPago(input);
    if (ok) setModalAbierto(false);
  }

  return (
    <div className="cit-detalle-seccion">
      <div className="cit-detalle-seccion-header">
        <div className="cit-detalle-seccion-titulo">
          <span className="cit-detalle-icono cit-detalle-icono-verde">
            <Banknote size={16} strokeWidth={2} />
          </span>
          <h3>Pagos</h3>
        </div>
        <button
          className="cit-btn-verde"
          onClick={() => setModalAbierto(true)}
          disabled={total === 0}
          title={total === 0 ? "Agrega un tratamiento antes de registrar pagos" : undefined}
        >
          <Plus size={15} strokeWidth={2} />
          Registrar pago
        </button>
      </div>

      {cita.pagos.length === 0 ? (
        <p className="cit-detalle-vacio">Aún no hay pagos registrados para esta cita.</p>
      ) : (
        <table className="cit-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Método</th>
              <th>Nota</th>
              <th>Monto</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cita.pagos.map((p) => (
              <tr key={p.id}>
                <td>{formatearFechaCorta(p.fecha)}</td>
                <td>
                  <span className="cit-badge cit-badge-metodo">{labelMetodo(p.metodo)}</span>
                </td>
                <td>{p.nota || "—"}</td>
                <td className="cit-tabla-derecha cit-tabla-subtotal">{formatoMoneda(p.monto)}</td>
                <td className="cit-tabla-accion">
                  <button className="cit-tabla-eliminar" onClick={() => onEliminarPago(p.id)} title="Eliminar">
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="cit-tabla-total-label">Total<br /><strong className="cit-pagos-monto">{formatoMoneda(total)}</strong></td>
              <td className="cit-tabla-total-label">Pagado<br /><strong className="cit-pagos-monto cit-pagos-verde">{formatoMoneda(pagado)}</strong></td>
              <td className="cit-tabla-total-label">Saldo pendiente<br /><strong className={`cit-pagos-monto ${saldoPendiente > 0 ? "" : "cit-pagos-verde"}`}>{formatoMoneda(saldoPendiente)}</strong></td>
              <td colSpan={2} className="cit-tabla-derecha">
                {total > 0 && (
                  <span className={`cit-estado-cuenta ${alDia ? "al-dia" : "pendiente"}`}>
                    {alDia ? <CheckCircle2 size={13} strokeWidth={2} /> : null}
                    {alDia ? "Al día" : "Pendiente"}
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      {modalAbierto && (
        <ModalNuevoPago
          saldoPendiente={saldoPendiente}
          errorExterno={errorPago}
          onCancelar={() => {
            setModalAbierto(false);
            onLimpiarError();
          }}
          onAgregar={handleAgregar}
        />
      )}
    </div>
  );
}