/**
 * Formato de fecha del sistema (visualización): dd/mm/aaaa.
 * Internamente (API / DateField): yyyy-mm-dd.
 * Acepta escritura compacta: 27031997 → 27/03/1997.
 */

function esFechaCalendarioValida(y, m, d) {
  const yi = Number(y);
  const mi = Number(m);
  const di = Number(d);
  if (!yi || !mi || !di) return false;
  if (mi < 1 || mi > 12 || di < 1 || di > 31) return false;
  const dt = new Date(yi, mi - 1, di);
  return dt.getFullYear() === yi && dt.getMonth() === mi - 1 && dt.getDate() === di;
}

function aISO(y, m, d) {
  const yy = String(y).padStart(4, '0');
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  if (!esFechaCalendarioValida(yy, mm, dd)) return null;
  return `${yy}-${mm}-${dd}`;
}

/** Convierte cualquier entrada conocida a yyyy-mm-dd. */
export function parseFechaAISO(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return aISO(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }
  const s = String(value).trim();
  if (!s || s === 'N/A' || s === '—') return null;

  // ISO con o sin hora
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const iso = s.slice(0, 10);
    const [y, m, d] = iso.split('-');
    return aISO(y, m, d);
  }

  // Solo dígitos: ddmmyyyy (8) o ddmmyy (6)
  const soloDigitos = s.replace(/\D/g, '');
  if (soloDigitos.length === 8 && /^\d{8}$/.test(soloDigitos)) {
    const d = soloDigitos.slice(0, 2);
    const m = soloDigitos.slice(2, 4);
    const y = soloDigitos.slice(4, 8);
    return aISO(y, m, d);
  }
  if (soloDigitos.length === 6 && /^\d{6}$/.test(soloDigitos)) {
    const d = soloDigitos.slice(0, 2);
    const m = soloDigitos.slice(2, 4);
    let y = Number(soloDigitos.slice(4, 6));
    // 00–49 → 2000–2049; 50–99 → 1950–1999
    y += y <= 49 ? 2000 : 1900;
    return aISO(y, m, d);
  }

  // dd/mm/aaaa | dd-mm-aaaa | d/m/aaaa
  const dmY = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (dmY) {
    let y = dmY[3];
    if (y.length === 2) {
      const n = Number(y);
      y = String(n <= 49 ? 2000 + n : 1900 + n);
    }
    return aISO(y, dmY[2], dmY[1]);
  }

  return null;
}

/** Formato visible del sistema: dd/mm/aaaa */
export function formatFechaDDMMAAAA(value) {
  const iso = parseFechaAISO(value);
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Normaliza lo que el usuario escribió a dd/mm/aaaa.
 * Si no se puede interpretar, devuelve el texto original recortado.
 */
export function formatearFechaEscrita(value) {
  if (value == null || value === '') return '';
  const formateada = formatFechaDDMMAAAA(value);
  if (formateada) return formateada;
  return String(value).trim();
}

/**
 * Si el valor ya es ISO o display válido, lo deja listo para guardar/mostrar.
 * Útil en @blur de inputs de texto.
 */
export function aplicarFormatoFechaInput(value) {
  if (value == null || String(value).trim() === '') return '';
  return formatFechaDDMMAAAA(value) || String(value).trim();
}

/** Celda de tabla: dd/mm/aaaa o guión si vacío. */
export function fechaCelda(value) {
  if (value == null || String(value).trim() === '' || value === 'N/A') return '—';
  return formatFechaDDMMAAAA(value) || String(value).trim();
}

/**
 * Fecha-hora visible: dd/mm/aaaa HH:mm (si hay hora en el valor).
 * Si solo hay fecha, dd/mm/aaaa.
 */
export function formatFechaHoraDDMMAAAA(value) {
  if (value == null || value === '') return '—';
  const s = String(value).trim();
  if (!s) return '—';
  try {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime()) && /T|\d{2}:\d{2}/.test(s)) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
    }
  } catch {
    /* fall through */
  }
  return formatFechaDDMMAAAA(s) || s;
}
