interface Props {
  name: string;
  opciones: string[];
  valor: string;
  onChange: (v: string) => void;
}

export function RadioGroup({ name, opciones, valor, onChange }: Props) {
  return (
    <div className="hc-radio-group">
      {opciones.map((op) => (
        <label className="hc-radio" key={op}>
          <input
            type="radio"
            name={name}
            checked={valor === op}
            onChange={() => onChange(op)}
          />
          {op}
        </label>
      ))}
    </div>
  );
}