import { useEffect, useState } from "react";
import { Save, X, SquarePen } from "lucide-react";
import type { Paciente } from "../types";

interface Props {
  paciente: Paciente;
  editando: boolean;
  guardando: boolean;
  onGuardar: (cambios: Partial<Omit<Paciente, "id">>) => Promise<boolean>;
  onEditar: () => void;
  onCancelar: () => void;
}

const FILAS: { label: string; key: keyof Paciente; type?: string }[][] = [
  [
    { label: "Nombre completo", key: "nombre" },
    { label: "CI / Identificación", key: "ci" },
  ],
  [
    { label: "Edad", key: "edad", type: "number" },
    { label: "Fecha de nacimiento", key: "fecha_nacimiento", type: "date" },
  ],
  [
    { label: "Género", key: "genero" },
    { label: "Teléfono", key: "telefono" },
  ],
  [
    { label: "Correo electrónico", key: "email" },
    { label: "Dirección", key: "direccion" },
  ],
  [{ label: "Ocupación", key: "ocupacion" }],
];

export function InfoPersonalTab({
  paciente,
  editando,
  guardando,
  onGuardar,
  onEditar,
  onCancelar,
}: Props) {
  const [form, setForm] = useState<Paciente>(paciente);

  useEffect(() => {
    setForm(paciente);
  }, [paciente, editando]);

  function campo(key: keyof Paciente, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="od-info-card">
      <h2 className="od-info-titulo">Información Personal</h2>

      {FILAS.map((fila, i) => (
        <div
          className={`od-info-fila ${i === FILAS.length - 1 ? "od-info-fila-ultima" : ""}`}
          key={i}
        >
          {fila.map(({ label, key, type }) => (
            <div className="od-field" key={key}>
              <label>{label}</label>
              {editando ? (
                <input
                  type={type || "text"}
                  value={(form[key] as string | number) ?? ""}
                  onChange={(e) => campo(key, e.target.value)}
                />
              ) : (
                <p className="od-info-value">{(paciente[key] as string) || "—"}</p>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="od-info-footer">
        {editando ? (
          <>
            <button className="od-btn-secondary" onClick={onCancelar} disabled={guardando}>
              <X size={15} strokeWidth={2} />
              Cancelar
            </button>
            <button className="od-btn-primary" onClick={() => onGuardar(form)} disabled={guardando}>
              <Save size={15} strokeWidth={2} />
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </>
        ) : (
          <button className="od-btn-primary" onClick={onEditar}>
            <SquarePen size={15} strokeWidth={2} />
            Editar información
          </button>
        )}
      </div>
    </div>
  );
}