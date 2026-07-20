const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function generarPasswordTemporal(longitud = 10): string {
  const random = new Uint32Array(longitud);
  crypto.getRandomValues(random);
  let resultado = "";
  for (let i = 0; i < longitud; i++) {
    resultado += CARACTERES[random[i] % CARACTERES.length];
  }
  return resultado;
}