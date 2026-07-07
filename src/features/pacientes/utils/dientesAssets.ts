const superiorModules = import.meta.glob(
  "../assets/dientes-referencia/superior/*.svg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const inferiorModules = import.meta.glob(
  "../assets/dientes-referencia/inferior/*.svg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

function construirMapa(modules: Record<string, string>): Record<number, string> {
  const mapa: Record<number, string> = {};
  for (const path in modules) {
    const match = path.match(/(\d+)\.svg$/);
    if (match) {
      mapa[parseInt(match[1], 10)] = modules[path];
    }
  }
  return mapa;
}

export const SVG_SUPERIOR = construirMapa(superiorModules);
export const SVG_INFERIOR = construirMapa(inferiorModules);

export function getDienteSvgUrl(indiceSvg: number, esSuperior: boolean): string | undefined {
  return esSuperior ? SVG_SUPERIOR[indiceSvg] : SVG_INFERIOR[indiceSvg];
}