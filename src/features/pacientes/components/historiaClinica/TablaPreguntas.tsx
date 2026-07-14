import type { LucideIcon } from "lucide-react";

interface Pregunta {
  key: string;
  pregunta: string;
  icon: LucideIcon;
}

interface Resp {
  sn: string;
  det: string;
}

interface Props {
  preguntas: Pregunta[];
  respuestas: Record<string, Resp>;
  editando: boolean;
  onChange: (key: string, resp: Resp) => void;
}

export function TablaPreguntas({ preguntas, respuestas, editando, onChange }: Props) {
  if (editando) {
    return (
      <table className="hc-tabla-preguntas">
        <thead>
          <tr>
            <th>Pregunta</th>
            <th style={{ width: 150, whiteSpace: "nowrap" }}>Respuesta</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map(({ key, pregunta, icon: Icon }) => {
            const resp = respuestas[key] ?? { sn: "", det: "" };
            return (
              <tr key={key}>
                <td>
                  <div className="hc-pregunta-celda">
                    <div className="hc-pregunta-icono">
                      <Icon size={15} strokeWidth={2} />
                    </div>
                    {pregunta}
                  </div>
                </td>
                <td>
                  <div className="hc-radio-group" style={{ flexWrap: "nowrap" }}>
                    {["Sí", "No"].map((op) => (
                      <label className="hc-radio" key={op}>
                        <input
                          type="radio"
                          name={`preg-${key}`}
                          checked={resp.sn === op}
                          onChange={() => onChange(key, { ...resp, sn: op })}
                        />
                        {op}
                      </label>
                    ))}
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Detalle…"
                    value={resp.det}
                    onChange={(e) => onChange(key, { ...resp, det: e.target.value })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <table className="hc-tabla-preguntas">
      <thead>
        <tr>
          <th>Pregunta</th>
          <th style={{ width: 150, whiteSpace: "nowrap" }}>Respuesta</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        {preguntas.map(({ key, pregunta, icon: Icon }) => {
          const resp = respuestas[key] ?? { sn: "", det: "" };
          const badgeClase =
            resp.sn === "Sí" ? "hc-badge-sn--si" : resp.sn === "No" ? "hc-badge-sn--no" : "hc-badge-sn--neutro";
          return (
            <tr key={key}>
              <td>
                <div className="hc-pregunta-celda">
                  <div className="hc-pregunta-icono">
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  {pregunta}
                </div>
              </td>
              <td>
                <span className={`hc-badge-sn ${badgeClase}`}>{resp.sn || "—"}</span>
              </td>
              <td className="hc-detalle-celda">{resp.det || "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}