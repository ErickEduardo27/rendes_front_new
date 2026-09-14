/**
 * Determina condición de ingreso según fecha de primer ingreso vs periodo (YYYY-MM).
 * Misma fecha (año-mes) del periodo → NUEVO; si no, el usuario debe elegir CONTINUADOR o REINGRESO.
 */
export function ymDesdeFechaIso(fechaIso) {
  const s = String(fechaIso || '').trim();
  if (!s || s.length < 7) return null;
  const ym = s.slice(0, 7);
  return /^\d{4}-\d{2}$/.test(ym) ? ym : null;
}

export function ymDesdePeriodoLabel(periodoLabel) {
  const s = String(periodoLabel || '').trim();
  if (!s) return null;
  const m = s.match(/^(\d{4}-\d{2})/);
  return m ? m[1] : null;
}

/**
 * @returns {'NUEVO' | 'SELECCIONAR' | null}
 */
export function tipoCondicionPorFechaYPeriodo(fechaIso, periodoLabel) {
  const ymFecha = ymDesdeFechaIso(fechaIso);
  const ymPeriodo = ymDesdePeriodoLabel(periodoLabel);
  if (!ymFecha || !ymPeriodo) return null;
  return ymFecha === ymPeriodo ? 'NUEVO' : 'SELECCIONAR';
}

/**
 * Hospital si el nombre contiene «hospital»/«hosp» o abrevia con «H.» / «H » (p. ej. H. ALMENARA).
 * El resto de IPRESS se trata como clínica (registro simplificado).
 */
export function esNombreIpressHospital(ipressItem) {
  if (!ipressItem) return false;
  const nombre = String(ipressItem?.ipress || '').trim();
  const corto = String(ipressItem?.nombre_corto || '').trim();
  const t = `${nombre} ${corto}`.toLowerCase();
  if (!t.trim()) return false;
  if (t.includes('hospital') || t.includes('hosp.') || /\bhosp\b/.test(t)) return true;
  // H. ALMENARA, H ALMENARA, H-ALMENARA (inicio de nombre o corto)
  if (/^h[\.\s\-]/i.test(nombre) || /^h[\.\s\-]/i.test(corto)) return true;
  // Abreviatura «H.» / «H » en cualquier parte del texto combinado
  if (/\bh[\.\s\-]+\S/i.test(t)) return true;
  return false;
}
