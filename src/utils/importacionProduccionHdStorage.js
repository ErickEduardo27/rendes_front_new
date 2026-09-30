const PREFIX = 'rendes_importacion_produccion_hd';

function clave(periodo, ipress, modalidad) {
  return `${PREFIX}_${periodo}_${ipress}_${modalidad}`;
}

export function guardarImportacionLocal(periodo, ipress, modalidad, payload) {
  const data = {
    ...payload,
    importado: true,
    almacenamiento_local: true,
    creado_en: payload.creado_en || new Date().toISOString(),
    detalle: Array.isArray(payload.detalle) ? payload.detalle : [],
  };
  localStorage.setItem(clave(periodo, ipress, modalidad), JSON.stringify(data));
  return data;
}

export function leerImportacionLocal(periodo, ipress, modalidad) {
  try {
    const raw = localStorage.getItem(clave(periodo, ipress, modalidad));
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      importado: true,
      almacenamiento_local: true,
      ...data,
      detalle: Array.isArray(data.detalle) ? data.detalle : [],
    };
  } catch {
    return null;
  }
}

export function eliminarImportacionLocal(periodo, ipress, modalidad) {
  localStorage.removeItem(clave(periodo, ipress, modalidad));
}

export function esErrorEndpointNoDisponible(error) {
  const status = error?.status ?? error?.response?.status;
  if (status === 404) return true;
  const data = error?.data ?? error?.response?.data;
  const texto = typeof data === 'string'
    ? data
    : String(error?.error || error?.message || '');
  return texto.includes('Page not found') || texto.includes('<!DOCTYPE html>');
}

/** Atenciones totales por fila: ejecutadas + adicionales. */
export function atencionesTotalesFila(row) {
  return (Number(row?.atenciones_ejecutadas) || 0) + (Number(row?.atenciones_adicionales) || 0);
}

/**
 * Atenciones totales del resumen (misma lógica que Importación tiempo diálisis):
 * ejecutadas + adicionales; si no hay totales en cabecera, suma del detalle.
 * @returns {number|'—'}
 */
export function atencionesTotalesResumen(resumen) {
  if (!resumen || typeof resumen !== 'object') return '—';
  const tieneEjec = resumen.atenciones_ejecutadas != null && resumen.atenciones_ejecutadas !== '';
  const tieneAdic = resumen.atenciones_adicionales != null && resumen.atenciones_adicionales !== '';
  if (tieneEjec || tieneAdic) {
    return (Number(resumen.atenciones_ejecutadas) || 0) + (Number(resumen.atenciones_adicionales) || 0);
  }
  const detalle = Array.isArray(resumen.detalle) ? resumen.detalle : [];
  if (!detalle.length) return '—';
  return detalle.reduce((acc, row) => acc + atencionesTotalesFila(row), 0);
}

/** Compara documentos ignorando espacios y caracteres no numéricos. */
export function normalizarDocumentoImportacion(doc) {
  return String(doc || '').replace(/\D/g, '');
}

export function pacienteDesdeFilaInicioTrr(row) {
  const documento = row?.datosPaciente?.documento || row?.documento || '';
  const nombre = row?.datosPaciente?.paciente || row?.paciente || '—';
  return {
    documento: String(documento || '').trim() || '—',
    clave: normalizarDocumentoImportacion(documento),
    nombre: String(nombre || '—').trim() || '—',
  };
}

export function pacienteDesdeFilaImportacion(row) {
  const documento = row?.numero_documento || '';
  const nombre = row?.apellidos_nombres || '—';
  return {
    documento: String(documento || '').trim() || '—',
    clave: normalizarDocumentoImportacion(documento),
    nombre: String(nombre || '—').trim() || '—',
  };
}

/**
 * Compara pacientes de la planilla importada vs Inicio TRR (por documento).
 * @returns {{ soloEnImportacion: object[], soloEnInicioTrr: object[], coinciden: boolean, totalImportacion: number, totalInicioTrr: number }}
 */
export function compararImportacionVsInicioTrr(detalleImportacion, listaInicioTrr) {
  const mapaImport = new Map();
  (Array.isArray(detalleImportacion) ? detalleImportacion : []).forEach((row) => {
    const p = pacienteDesdeFilaImportacion(row);
    if (!p.clave) return;
    if (!mapaImport.has(p.clave)) mapaImport.set(p.clave, p);
  });

  const mapaTrr = new Map();
  (Array.isArray(listaInicioTrr) ? listaInicioTrr : []).forEach((row) => {
    const p = pacienteDesdeFilaInicioTrr(row);
    if (!p.clave) return;
    if (!mapaTrr.has(p.clave)) mapaTrr.set(p.clave, p);
  });

  const soloEnImportacion = [];
  mapaImport.forEach((p, claveDoc) => {
    if (!mapaTrr.has(claveDoc)) soloEnImportacion.push(p);
  });
  soloEnImportacion.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const soloEnInicioTrr = [];
  mapaTrr.forEach((p, claveDoc) => {
    if (!mapaImport.has(claveDoc)) soloEnInicioTrr.push(p);
  });
  soloEnInicioTrr.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return {
    soloEnImportacion,
    soloEnInicioTrr,
    coinciden: soloEnImportacion.length === 0 && soloEnInicioTrr.length === 0,
    totalImportacion: mapaImport.size,
    totalInicioTrr: mapaTrr.size,
  };
}

export function mensajeBloqueoPacientesPlanillaVsInicioTrr(comparacion) {
  if (!comparacion || comparacion.coinciden) return '';
  const soloImp = Number(comparacion.soloEnImportacion?.length || 0);
  const soloTrr = Number(comparacion.soloEnInicioTrr?.length || 0);
  const partes = [];
  if (soloImp > 0) {
    partes.push(`${soloImp} en planilla que no están en Inicio TRR`);
  }
  if (soloTrr > 0) {
    partes.push(`${soloTrr} en Inicio TRR que no están en la planilla`);
  }
  return (
    'No puede notificar: los pacientes de la importación de planilla (producción HD) '
    + `deben coincidir con Inicio TRR (${partes.join('; ')}).`
  );
}

/**
 * Obtiene la importación HD (API o local) con detalle de pacientes.
 * @returns {Promise<object|null>}
 */
export async function obtenerImportacionProduccionHd(getAllIpress, idPeriodo, idIpress, idModalidad) {
  if (
    idPeriodo == null || idPeriodo === ''
    || idIpress == null || idIpress === ''
    || idModalidad == null || idModalidad === ''
  ) {
    return null;
  }
  const qs = new URLSearchParams({
    id_periodo: String(idPeriodo),
    id_ipress: String(idIpress),
    id_modalidad: String(idModalidad),
  }).toString();

  let data = null;
  try {
    const res = await getAllIpress(`/consulta_importacion_produccion_hd/?${qs}`);
    if (res?.importado) data = res;
  } catch (e) {
    if (!esErrorEndpointNoDisponible(e)) {
      console.warn('Importación producción HD:', e);
    }
  }
  if (!data) {
    data = leerImportacionLocal(idPeriodo, idIpress, idModalidad);
  }
  if (!data?.importado) return null;
  return {
    ...data,
    detalle: Array.isArray(data.detalle) ? data.detalle : [],
  };
}

/**
 * Obtiene el N° de sesiones (= atenciones totales) desde la importación HD
 * (API o respaldo local). Devuelve null si no hay importación.
 */
export async function obtenerAtencionesTotalesImportacion(getAllIpress, idPeriodo, idIpress, idModalidad) {
  const data = await obtenerImportacionProduccionHd(getAllIpress, idPeriodo, idIpress, idModalidad);
  if (!data) return null;

  const total = atencionesTotalesResumen(data);
  if (total === '—' || total == null || total === '') return null;
  const n = Number(total);
  return Number.isFinite(n) ? n : null;
}
