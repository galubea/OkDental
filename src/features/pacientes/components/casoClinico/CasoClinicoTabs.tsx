import type { EstadoCaso, TabConConteo } from "../../types/casoClinico";

interface CasoClinicoTabsProps {
  tabs: TabConConteo[];
  active: EstadoCaso | "todos";
  onChange: (key: EstadoCaso | "todos") => void;
}

export default function CasoClinicoTabs({ tabs, active, onChange }: CasoClinicoTabsProps) {
  return (
    <div className="cc-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`cc-tab${active === tab.key ? " is-active" : ""}`}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
          <span className="cc-tab-count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}