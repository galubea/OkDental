interface Props {
  numero: string;
  nota: string;
  onChange: (texto: string) => void;
  onCerrar: () => void;
}

export function NotaPanel({ numero, nota, onChange, onCerrar }: Props) {
  return (
    <div className="odo-nota-panel">
      <div className="odo-nota-header">
        <span>Nota — Diente {numero}</span>
        <button className="odo-nota-cerrar" onClick={onCerrar}>✕</button>
      </div>
      <textarea
        className="odo-nota-textarea"
        value={nota}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe hallazgos, tratamiento sugerido, observaciones…"
        rows={3}
        autoFocus
      />
    </div>
  );
}