const PALETA = [
  { bg: "#fde2e2", texto: "#c0392b" },
  { bg: "#e3e8f0", texto: "#4a5568" },
  { bg: "#fdecd2", texto: "#b7791f" },
  { bg: "#fce4ec", texto: "#c2185b" },
  { bg: "#e0f2f1", texto: "#00695c" },
  { bg: "#ede7f6", texto: "#5e35b1" },
  { bg: "#e8f5e9", texto: "#2e7d32" },
  { bg: "#e1f5fe", texto: "#0277bd" },
];

export function colorCategoria(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETA.length;
  return PALETA[index];
}