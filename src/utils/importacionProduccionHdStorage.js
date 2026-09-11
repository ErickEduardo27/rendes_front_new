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

/**
 * Obtiene el N° de sesiones (= atenciones totales) desde la importación HD
 * (API o respaldo local). Devuelve null si no hay importación.
 */
export async function obtenerAtencionesTotalesImportacion(getAllIpress, idPeriodo, idIpress, idModalidad) {
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
      console.warn('Importación producción HD (sesiones):', e);
    }
  }
  if (!data) {
    data = leerImportacionLocal(idPeriodo, idIpress, idModalidad);
  }
  if (!data?.importado) return null;

  const total = atencionesTotalesResumen(data);
  if (total === '—' || total == null || total === '') return null;
  const n = Number(total);
  return Number.isFinite(n) ? n : null;
}
