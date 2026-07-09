import { useState } from "react";
import { X } from "lucide-react";
import type { NuevoPagoInput, MetodoPago } from "../../types/citas";
import { METODOS_PAGO } from "../../types/citas";

interface Props {
  saldoPendiente: number;
  errorExterno: string;
  onCancelar: () => void;
  onAgregar: (input: NuevoPagoInput) => void;
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ModalNuevoPago({ saldoPendiente, errorExterno, onCancelar, onAgregar }: Props) {
  const [fecha, setFecha] = useState(hoyISO());
  const [metodo, setMetodo] = useState<MetodoPago>("efectivo");
  const [nota, setNota] = useState("");
  const [monto, setMonto] = useState<number>(saldoPendiente > 0 ? saldoPendiente : 0);

  const puedeAgregar = fecha.trim() !== "" && monto > 0;

  function handleAgregar() {
    if (!puedeAgregar) return;
    onAgregar({ fecha, metodo, nota: nota.trim() || undefined, monto });
  }

  return (
    <div className="odo-modal-overlay" onClick={onCancelar}>
      <div className="cit-modal odo-modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="cit-modal-header">
          <h3 className="cit-modal-titulo">Registrar pago</h3>
          <button className="odo-panel-icon-btn" onClick={onCancelar} title="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="cit-modal-body">
          <div className="cit-modal-fila">
            <div className="cit-campo">
              <label className="cit-campo-label">Fecha</label>
              <input
                type="date"
                className="cit-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="cit-campo">
              <label className="cit-campo-label">Método</label>
              <select
                className="cit-input"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as MetodoPago)}
              >
                {METODOS_PAGO.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Monto</label>
            <input
              type="number"
              min={0}
              className="cit-input"
              value={monto}
              onChange={(e) => setMonto(Math.max(0, Number(e.target.value)))}
            />
            {saldoPendiente > 0 && (
              <span className="cit-campo-ayuda">Saldo pendiente: ${saldoPendiente.toLocaleString("es-MX")}</span>
            )}
          </div>

          <div className="cit-campo">
            <label className="cit-campo-label">Nota (opcional)</label>
            <input
              type="text"
              className="cit-input"
              placeholder="Ej. Abono, anticipo..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          {errorExterno && <p className="cit-campo-error">{errorExterno}</p>}
        </div>

        <div className="cit-modal-footer">
          <button className="cit-btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="cit-btn-verde" onClick={handleAgregar} disabled={!puedeAgregar}>
            Registrar pago
          </button>
        </div>
      </div>
    </div>
  );
}