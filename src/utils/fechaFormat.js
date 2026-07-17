/**
 * Formato de fecha del sistema: dd-mm-aaaa (visualización).
 * Internamente (inputs type="date", API DateField) se usa yyyy-mm-dd.
 */

/** Convierte dd-mm-aaaa, dd/mm/aaaa o aaaa-mm-dd (con o sin hora) a yyyy-mm-dd. */
export function parseFechaAISO(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const s = String(value).trim();
  if (!s || s === 'N/A' || s === '—') return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const dmY = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmY) {
    const d = dmY[1].padStart(2, '0');
    const m = dmY[2].padStart(2, '0');
    const y = dmY[3];
    return `${y}-${m}-${d}`;
  }
  return null;
}

/** Formato visible del sistema: dd-mm-aaaa */
export function formatFechaDDMMAAAA(value) {
  const iso = parseFechaAISO(value);
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

/** Celda de tabla: dd-mm-aaaa o guión si vacío. */
export function fechaCelda(value) {
  if (value == null || String(value).trim() === '' || value === 'N/A') return '—';
  return formatFechaDDMMAAAA(value) || String(value).trim();
}

/**
 * Fecha-hora visible: dd-mm-aaaa HH:mm (si hay hora en el valor).
 * Si solo hay fecha, dd-mm-aaaa.
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
      return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
    }
  } catch {
    /* fall through */
  }
  return formatFechaDDMMAAAA(s) || s;
}
