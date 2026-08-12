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

/** Fístula arteriovenosa (FAV). */
export function esTipoAccesoFistula(tipo) {
  const t = String(tipo || '').trim().toUpperCase();
  if (!t) return false;
  return t === 'FAV' || t.includes('FÍSTULA') || t.includes('FISTULA') || t.includes('ARTERIOVENOSA');
}

export function esRegistroCambioAcceso(unidad) {
  const motivo = unidad?.motivo_cambio;
  return motivo != null && String(motivo).trim() !== '';
}

export function idPacienteDesdeUnidad(unidad) {
  return unidad?.id_paciente
    ?? unidad?.datosPaciente?.id_paciente
    ?? unidad?.datosPacienteAtencion?.id_paciente
    ?? unidad?.id_paciente_atencion?.id_paciente;
}

export function fechaCreacionAccesoISO(unidad) {
  return fechaCreacionAccesoColumna(unidad).slice(0, 10);
}

/** Valor mostrado en la columna «F. creación» (Acceso Vascular). */
export function fechaCreacionAccesoColumna(unidad) {
  return String(unidad?.fecha_creacion_acceso || unidad?.fecha_creacion_acceso_actual || '').trim();
}

export const MENSAJE_CAMBIO_ACCESO_MISMO_DIA = 'Ya existe un cambio de acceso registrado para este paciente en la misma fecha. No se permiten dos cambios el mismo día.';

export function claveCambioAccesoMismoDia(idPaciente, fecha) {
  return `${idPaciente}|${String(fecha || '').trim().slice(0, 10)}`;
}

/** Impide más de un cambio de acceso (con motivo) por paciente y fecha. */
export function existeCambioAccesoMismoDia(registros, { idPaciente, fecha, excluirIdUnidad = null }) {
  const fechaNorm = String(fecha || '').trim().slice(0, 10);
  if (!fechaNorm || idPaciente == null) return false;
  const idP = String(idPaciente);
  const excluir = excluirIdUnidad != null ? String(excluirIdUnidad) : null;
  return (registros || []).some((r) => {
    if (excluir && r?.id_unidad_actual != null && String(r.id_unidad_actual) === excluir) return false;
    const pac = idPacienteDesdeUnidad(r);
    if (pac == null || String(pac) !== idP) return false;
    if (fechaCreacionAccesoISO(r) !== fechaNorm) return false;
    return esRegistroCambioAcceso(r);
  });
}

/** Para FAV con canulación registrada, la vigencia del acceso usa esa fecha; si no, fecha de creación. */
export function fechaReferenciaVigenciaAcceso(unidad) {
  const tipo = unidad?.tipo_acceso || unidad?.tipo_acceso_actual || '';
  const creacion = unidad?.fecha_creacion_acceso || unidad?.fecha_creacion_acceso_actual || '';
  const canulacion = String(unidad?.fecha_inicio_canulacion || '').trim().slice(0, 10);
  if (esTipoAccesoFistula(tipo) && canulacion) return canulacion;
  return creacion;
}

/** Acceso vascular vigente en una fecha de evento (p. ej. infección). */
export function accesoVigenteEnFechaEvento(unidades, fechaEvento) {
  if (!fechaEvento || !Array.isArray(unidades) || !unidades.length) return null;
  const ordenados = [...unidades]
    .map((u) => {
      const fechaCreacion = String(u.fecha_creacion_acceso || u.fecha_creacion_acceso_actual || '').trim().slice(0, 10);
      const fechaRef = String(fechaReferenciaVigenciaAcceso(u) || '').trim().slice(0, 10);
      return { ...u, fechaCreacion, fechaRef };
    })
    .filter((u) => u.fechaCreacion && u.fechaCreacion <= fechaEvento && u.fechaRef && u.fechaRef <= fechaEvento)
    .sort((a, b) => (b.fechaRef || '').localeCompare(a.fechaRef || ''));
  return ordenados[0] || null;
}

export function minFechaEventoSegunAcceso(acceso) {
  if (!acceso) return null;
  const tipo = acceso.tipo_acceso || acceso.tipo_acceso_actual || '';
  if (esTipoAccesoFistula(tipo)) {
    const canulacion = String(acceso.fecha_inicio_canulacion || '').trim().slice(0, 10);
    if (canulacion) return canulacion;
  }
  const creacion = String(acceso.fecha_creacion_acceso || acceso.fecha_creacion_acceso_actual || '').trim().slice(0, 10);
  return creacion || null;
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

/** Rango ISO (yyyy-mm-dd) del mes de periodo en formato «YYYY-MM». */
export function rangoFechasDesdePeriodoTexto(periodoTexto) {
  if (!periodoTexto) return { min: null, max: null };
  const [yearStr, monthStr] = String(periodoTexto).split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return { min: null, max: null };
  const lastDay = new Date(year, month, 0).getDate();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    min: `${year}-${pad(month)}-01`,
    max: `${year}-${pad(month)}-${pad(lastDay)}`,
  };
}

/** True si la columna «F. creación» cae dentro del mes del periodo (inclusive). */
export function fechaCreacionAccesoEnPeriodo(unidad, rango) {
  if (!rango?.min || !rango?.max) return false;
  const raw = fechaCreacionAccesoColumna(unidad);
  if (!raw) return false;
  const fecha = parseFechaAcceso(raw);
  const min = parseFechaAcceso(rango.min);
  const max = parseFechaAcceso(rango.max);
  if (!fecha || !min || !max) return false;
  const t = fecha.getTime();
  return t >= min.getTime() && t <= max.getTime();
}

/**
 * Acceso inicial (p. ej. FormularioPaciente) no trae motivo_cambio.
 * Un «cambio del periodo» sí tiene motivo de cambio registrado.
 */
export function esCambioAccesoVascular(unidad) {
  return String(unidad?.motivo_cambio || '').trim() !== '';
}

export function contarUnidadesAccesoEnPeriodo(lista, rango) {
  return (Array.isArray(lista) ? lista : []).filter(
    (u) => fechaCreacionAccesoEnPeriodo(u, rango) && esCambioAccesoVascular(u),
  ).length;
}

export function filtrarUnidadesAccesoEnPeriodo(lista, rango) {
  return (Array.isArray(lista) ? lista : []).filter(
    (u) => fechaCreacionAccesoEnPeriodo(u, rango) && esCambioAccesoVascular(u),
  );
}

export const MENSAJE_CANULACION_MENOR_UN_MES =
  'La fecha de canulación es anterior a un mes desde la fecha de creación de la FAV. Verifique las fechas ingresadas.';

/** True si la canulación ocurre antes de cumplirse un mes desde la creación del acceso. */
export function esCanulacionMenorUnMesDesdeCreacion(fechaCreacion, fechaCanulacion) {
  const creacion = parseFechaAcceso(fechaCreacion);
  const canulacion = parseFechaAcceso(fechaCanulacion);
  if (!creacion || !canulacion || canulacion < creacion) return false;
  const unMesDespues = new Date(creacion);
  unMesDespues.setMonth(unMesDespues.getMonth() + 1);
  return canulacion < unMesDespues;
}
