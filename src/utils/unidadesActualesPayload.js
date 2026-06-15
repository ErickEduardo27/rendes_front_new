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

const COMPACTO_A_ETIQUETA = Object.fromEntries(
  Object.entries(TIPO_ACCESO_POR_ETIQUETA).map(([etiqueta, codigo]) => [codigo, etiqueta]),
);

const ID_A_ETIQUETA = Object.fromEntries(
  Object.entries(TIPO_ACCESO_POR_ID).map(([id, codigo]) => [id, COMPACTO_A_ETIQUETA[codigo] || codigo]),
);

/** Convierte valor de BD (código corto, id numérico o etiqueta) a etiqueta del formulario. */
export function tipoAccesoDesdeDb(valor) {
  if (valor == null || valor === '') return null;
  const texto = String(valor).trim();
  if (TIPO_ACCESO_POR_ETIQUETA[texto]) return texto;
  if (COMPACTO_A_ETIQUETA[texto]) return COMPACTO_A_ETIQUETA[texto];
  const id = Number(texto);
  if (!Number.isNaN(id) && ID_A_ETIQUETA[id]) return ID_A_ETIQUETA[id];
  const porEtiqueta = Object.keys(TIPO_ACCESO_POR_ETIQUETA).find(
    (etiqueta) => etiqueta.localeCompare(texto, undefined, { sensitivity: 'accent' }) === 0,
  );
  return porEtiqueta || texto;
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
