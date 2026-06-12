/**
 * Valores compactos para rf_unidades_actuales (columnas varchar(40) en BD legacy).
 */

const TIPO_ACCESO_POR_ID = {
  1: 'CVCT',
  2: 'CVCLP',
  3: 'FAV',
  4: 'Injerto Autólogo',
  5: 'Injerto Protésico',
  6: 'Catéter peritoneal',
};

const TIPO_ACCESO_POR_ETIQUETA = {
  'Catéter Venoso Central Temporal': 'CVCT',
  'Catéter Venoso Central de Larga Permanencia': 'CVCLP',
  'Fístula Arteriovenosa': 'FAV',
  'Injerto Autólogo': 'Injerto Autólogo',
  'Injerto Protésico': 'Injerto Protésico',
  'Catéter peritoneal': 'Catéter peritoneal',
  'NO HABIDO': 'NO HABIDO',
};

const MAX_LEN = 40;

function truncar(texto) {
  const s = String(texto || '').trim();
  if (s.length <= MAX_LEN) return s;
  return s.slice(0, MAX_LEN);
}

/** Normaliza tipo de acceso al formato que cabe en varchar(40). */
export function tipoAccesoParaDb(valor) {
  if (valor == null || valor === '') return '';
  const texto = String(valor).trim();
  if (TIPO_ACCESO_POR_ID[Number(texto)]) {
    return TIPO_ACCESO_POR_ID[Number(texto)];
  }
  if (TIPO_ACCESO_POR_ETIQUETA[texto]) {
    return TIPO_ACCESO_POR_ETIQUETA[texto];
  }
  const porEtiqueta = Object.entries(TIPO_ACCESO_POR_ETIQUETA).find(
    ([etiqueta]) => etiqueta.localeCompare(texto, undefined, { sensitivity: 'accent' }) === 0,
  );
  if (porEtiqueta) return porEtiqueta[1];
  return truncar(texto);
}

/** Quita prefijo "N. " y acota a 40 caracteres. */
export function localizacionAccesoParaDb(valor) {
  if (valor == null || valor === '') return '';
  const texto = String(valor).trim().replace(/^\d+\.\s*/, '');
  return truncar(texto);
}

/** Aplica compactación a un payload POST/PATCH de unidadesActuales. */
export function prepararPayloadUnidadesActuales(payload = {}) {
  const out = { ...payload };
  if (out.tipo_acceso != null && out.tipo_acceso !== '') {
    out.tipo_acceso = tipoAccesoParaDb(out.tipo_acceso);
  }
  if (out.localizacion_acceso != null && out.localizacion_acceso !== '') {
    out.localizacion_acceso = localizacionAccesoParaDb(out.localizacion_acceso);
  }
  if (out.motivo_cambio != null && out.motivo_cambio !== '') {
    out.motivo_cambio = truncar(out.motivo_cambio);
  }
  return out;
}
