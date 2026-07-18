import "../../styles/shared.css";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({ options, value, onChange, placeholder = "Seleccionar...", className = "" }: SelectProps) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const seleccionado = options.find((o) => o.value === value);

  return (
    <div className={`od-dropdown ${className}`} ref={ref}>
      <button type="button" className="od-dropdown-trigger" onClick={() => setAbierto((v) => !v)}>
        <span>{seleccionado ? seleccionado.label : placeholder}</span>
        <ChevronDown size={16} className={`od-dropdown-icon ${abierto ? "abierto" : ""}`} />
      </button>

      {abierto && (
        <div className="od-dropdown-menu">
          {options.map((o) => (
            <div
              key={o.value}
              className={`od-dropdown-item ${o.value === value ? "activo" : ""}`}
              onClick={() => {
                onChange(o.value);
                setAbierto(false);
              }}
            >
              <span>{o.label}</span>
              {o.value === value && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}