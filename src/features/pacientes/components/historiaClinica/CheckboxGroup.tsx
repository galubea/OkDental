interface Props {
  opciones: string[];
  seleccion: string[];
  onChange: (sel: string[]) => void;
}

export function CheckboxGroup({ opciones, seleccion, onChange }: Props) {
  function toggle(op: string) {
    if (seleccion.includes(op)) {
      onChange(seleccion.filter((s) => s !== op));
    } else {
      onChange([...seleccion, op]);
    }
  }

  return (
    <div className="hc-checkbox-grid">
      {opciones.map((op) => (
        <label className="hc-checkbox" key={op}>
          <input
            type="checkbox"
            checked={seleccion.includes(op)}
            onChange={() => toggle(op)}
          />
          {op}
        </label>
      ))}
    </div>
  );
}