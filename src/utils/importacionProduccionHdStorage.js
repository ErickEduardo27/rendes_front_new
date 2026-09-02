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
