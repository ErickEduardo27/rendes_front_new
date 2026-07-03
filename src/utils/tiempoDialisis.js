export const TIEMPO_DIALISIS_MIN = 2;
export const TIEMPO_DIALISIS_MAX = 5;
export const TIEMPO_DIALISIS_PASO = 0.25;

export const MENSAJE_TIEMPO_DIALISIS_INVALIDO =
  'Tiempo de diálisis inválido. Use un valor entre 2 y 5 horas, en incrementos de 0,25 (ej.: 2, 2,25, 2,5, …, 5).';

export function parseTiempoDialisisNumero(raw) {
  if (raw === null || raw === '') return null;
  const texto = String(raw).trim().replace(',', '.');
  if (!texto) return null;
  const n = Number(texto);
  return Number.isNaN(n) ? null : n;
}

export function esIncrementoCuartoHora(n) {
  const centesimas = Math.round(n * 100);
  return centesimas % 25 === 0;
}

export function esTiempoDialisisValorValido(raw) {
  const n = parseTiempoDialisisNumero(raw);
  if (n == null) return false;
  if (n < TIEMPO_DIALISIS_MIN || n > TIEMPO_DIALISIS_MAX) return false;
  return esIncrementoCuartoHora(n);
}

export function opcionesTiempoDialisis() {
  const opts = [];
  for (let v = TIEMPO_DIALISIS_MIN; v <= TIEMPO_DIALISIS_MAX + 1e-9; v += TIEMPO_DIALISIS_PASO) {
    opts.push(Math.round(v * 100) / 100);
  }
  return opts;
}

export function formatearTiempoDialisisEtiqueta(n) {
  return String(n).replace('.', ',');
}
