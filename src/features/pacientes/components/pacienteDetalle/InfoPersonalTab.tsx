import { useEffect, useState } from "react";
import {
  Save,
  X,
  SquarePen,
  User,
  IdCard,
  Calendar,
  Cake,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";
import type { Paciente } from "../../types/paciente";

interface Props {
  paciente: Paciente;
  editando: boolean;
  guardando: boolean;
  onGuardar: (cambios: Partial<Omit<Paciente, "id">>) => Promise<boolean>;
  onEditar: () => void;
  onCancelar: () => void;
}

type Color = "azul" | "verde" | "morado" | "naranja";

const FILAS: {
  label: string;
  key: keyof Paciente;
  type?: string;
  icon: LucideIcon;
  color: Color;
}[] = [
  { label: "Nombre", key: "nombre", icon: User, color: "azul" },
  { label: "Apellido", key: "apellido", icon: User, color: "azul" },
  { label: "CI / Identificación", key: "ci", icon: IdCard, color: "verde" },
  { label: "Edad", key: "edad", type: "number", icon: Calendar, color: "morado" },
  {
    label: "Fecha de nacimiento",
    key: "fecha_nacimiento",
    type: "date",
    icon: Cake,
    color: "morado",
  },
  { label: "Género", key: "genero", icon: UserRound, color: "morado" },
  { label: "Teléfono", key: "telefono", icon: Phone, color: "naranja" },
  { label: "Correo electrónico", key: "email", icon: Mail, color: "naranja" },
  { label: "Dirección", key: "direccion", icon: MapPin, color: "azul" },
  { label: "Ocupación", key: "ocupacion", icon: Briefcase, color: "azul" },
];

function normalizarCambios(form: Paciente): Partial<Omit<Paciente, "id">> {
  const { id, ...resto } = form;
  const edadTexto = String(form.edad ?? "").trim();
  const edadNum = edadTexto === "" ? null : Number(edadTexto);

  return {
    ...resto,
    edad: edadNum !== null && Number.isNaN(edadNum) ? null : edadNum,
  };
}

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
      <div className="od-info-header">
        <div className="od-info-header-icono">
          <UserRoundCog size={20} strokeWidth={2} />
        </div>
        <div className="od-info-header-texto">
          <h2 className="od-info-titulo">Información Personal</h2>
          <p className="od-info-subtitulo">
            Datos personales del paciente registrados en el sistema.
          </p>
        </div>
      </div>

      <div className="od-info-grid">
        {FILAS.map(({ label, key, type, icon: Icon, color }) => (
          <div className={`od-campo-card ${editando ? "editando" : ""}`} key={key}>
            <div className={`od-campo-icono ${color}`}>
              <Icon size={19} strokeWidth={2} />
            </div>
            <div className="od-campo-texto">
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
          </div>
        ))}
      </div>

      <div className="od-info-footer">
        {editando ? (
          <>
            <button className="od-btn-secondary" onClick={onCancelar} disabled={guardando}>
              <X size={15} strokeWidth={2} />
              Cancelar
            </button>
            <button
              className="od-btn-primary"
              onClick={() => onGuardar(normalizarCambios(form))}
              disabled={guardando}
            >
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