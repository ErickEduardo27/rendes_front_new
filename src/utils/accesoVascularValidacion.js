/** Días sin cambio de acceso para considerarlo antiguo (validación automática). */
export const DIAS_ACCESO_ANTIGUO = 90;

const TIPOS_ACCESO_TEMPORAL = /^(CVCT|CVC\s*\/?\s*T|CATETER\s+VENOSO\s+CENTRAL\s+TEMPORAL)/i;

export function parseFechaAcceso(valor) {
  if (!valor) return null;
  const s = String(valor).trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T12:00:00`);
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T12:00:00`);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function diasDesdeFechaAcceso(fecha, referencia = new Date()) {
  const d = parseFechaAcceso(fecha);
  if (!d) return null;
  const ref = referencia instanceof Date ? referencia : new Date(referencia);
  const diff = ref.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function esTipoAccesoTemporal(tipo) {
  const t = String(tipo || '').trim();
  if (!t) return false;
  return TIPOS_ACCESO_TEMPORAL.test(t) || /^CVCT$/i.test(t);
}

/**
 * Acceso antiguo: temporal (CVCT) o con más de DIAS_ACCESO_ANTIGUO días desde su creación.
 */
export function esAccesoVascularAntiguo(row, referenciaFecha = new Date()) {
  const tipo = row?.tipo_acceso || row?.tipo_acceso_actual || '';
  const fecha = row?.fecha_creacion_acceso || row?.fecha_creacion_acceso_actual || '';
  if (esTipoAccesoTemporal(tipo)) return true;
  const dias = diasDesdeFechaAcceso(fecha, referenciaFecha);
  return dias != null && dias >= DIAS_ACCESO_ANTIGUO;
}

export function claseFilaAccesoAntiguo(row, referenciaFecha = new Date()) {
  return esAccesoVascularAntiguo(row, referenciaFecha)
    ? 'bg-amber-50 ring-1 ring-inset ring-amber-200'
    : '';
}

export function motivoAccesoAntiguo(row, referenciaFecha = new Date()) {
  const tipo = row?.tipo_acceso || row?.tipo_acceso_actual || '';
  if (esTipoAccesoTemporal(tipo)) {
    return 'Acceso temporal (CVCT/CVC-T): requiere acceso definitivo.';
  }
  const dias = diasDesdeFechaAcceso(
    row?.fecha_creacion_acceso || row?.fecha_creacion_acceso_actual,
    referenciaFecha,
  );
  if (dias != null && dias >= DIAS_ACCESO_ANTIGUO) {
    return `Acceso con ${dias} días desde su creación (≥ ${DIAS_ACCESO_ANTIGUO} días).`;
  }
  return '';
}

/** Entre varios registros del mismo paciente, devuelve Set de id_unidad_actual más antiguos. */
export function idsAccesosMasAntiguosPorPaciente(registros, idKey = 'id_unidad_actual') {
  const porPaciente = new Map();
  for (const r of registros || []) {
    const pid = r?.id_paciente_atencion
      ?? r?.datosPacienteAtencion?.id_paciente_atencion
      ?? r?.datosPaciente?.id_paciente
      ?? r?.id_paciente;
    if (pid == null) continue;
    const clave = String(pid);
    const fecha = parseFechaAcceso(r?.fecha_creacion_acceso || r?.fecha_creacion_acceso_actual);
    const id = r?.[idKey];
    if (id == null) continue;
    const prev = porPaciente.get(clave);
    if (!prev || (fecha && prev.fecha && fecha < prev.fecha) || (!prev.fecha && fecha)) {
      porPaciente.set(clave, { id, fecha, idNum: Number(id) || 0 });
    } else if (prev && fecha && prev.fecha && fecha.getTime() === prev.fecha.getTime()) {
      if ((Number(id) || 0) < prev.idNum) {
        porPaciente.set(clave, { id, fecha, idNum: Number(id) || 0 });
      }
    }
  }
  return new Set([...porPaciente.values()].map((v) => v.id));
}
