import { esTiempoDialisisValorValido } from '@/utils/tiempoDialisis';

export function listaDesdeResponse(res) {
  if (Array.isArray(res)) return res;
  if (res?.results && Array.isArray(res.results)) return res.results;
  return [];
}

export { esTiempoDialisisValorValido };

function tratamientoCompleto(valor) {
  if (valor === null || valor === undefined) return false;
  if (typeof valor === 'boolean') return true;
  const s = String(valor).trim().toLowerCase();
  if (!s) return false;
  return ['1', '0', 'si', 'sí', 'no', 'true', 'false'].includes(s);
}

/** Tiempo de diálisis + Eritropoyetina, Hierro y Calcitriol (Sí/No). */
export function esResultadoClinicoCompleto(registro) {
  if (!registro || typeof registro !== 'object') return false;
  if (!esTiempoDialisisValorValido(registro.tiempo_dialisis)) return false;
  const erit = registro.eritoproyetina ?? registro.eritropoyetina;
  return tratamientoCompleto(erit) && tratamientoCompleto(registro.hierro) && tratamientoCompleto(registro.calcitriol);
}

function idPacienteAtencionDe(registro) {
  const v = registro?.id_paciente_atencion ?? registro?.datosPacienteAtencion?.id_paciente_atencion;
  return v != null && v !== '' ? String(v) : null;
}

export function ultimosResultadosPorAtencion(rows) {
  const grupos = new Map();
  for (const r of listaDesdeResponse(rows)) {
    const id = idPacienteAtencionDe(r);
    if (!id) continue;
    const rid = Number(r.id_resultado_clinico) || 0;
    const prev = grupos.get(id);
    if (!prev || rid > (Number(prev.id_resultado_clinico) || 0)) grupos.set(id, r);
  }
  return Array.from(grupos.values());
}

export function contarResultadosClinicosCompletos(rows) {
  return ultimosResultadosPorAtencion(rows).filter(esResultadoClinicoCompleto).length;
}

/**
 * Pacientes atendidos del periodo (condición final):
 * nuevos + reingresos + continuadores + egresos.
 * Para notificar, todos deben tener resultados clínicos, incluidos los egresados.
 */
export function totalPacientesEnAtencionDesdeEstadisticas(stats) {
  if (!stats || typeof stats !== 'object') return 0;
  return (
    Number(stats.nuevos || 0)
    + Number(stats.reingresos || 0)
    + Number(stats.continuadores || 0)
    + Number(stats.egresados || 0)
  );
}

export function mensajeBloqueoNotificacionClinica(totalPacientes, totalRegistros) {
  if (Number(totalPacientes) === Number(totalRegistros)) return '';
  return (
    `No puede notificar: hay ${totalPacientes} paciente(s) atendidos (incluidos egresos) y ${totalRegistros} ` +
    'registro(s) de resultados clínicos. Ambas cantidades deben ser iguales antes de enviar a revisión.'
  );
}

/** Serología mínima (VHB, Anti-HBc, VHC, VIH) para paciente NUEVO; Desconocido cuenta como completo. */
export function esSerologiaMinimaCompleta(registro) {
  if (!registro || typeof registro !== 'object') return false;
  const campos = [registro.vhb, registro.antiHbc, registro.vhc, registro.vih];
  return campos.every((v) => v != null && String(v).trim() !== '');
}

export function idsAtencionConSerologiaCompleta(rows) {
  const set = new Set();
  for (const r of listaDesdeResponse(rows)) {
    if (!esSerologiaMinimaCompleta(r)) continue;
    const id = r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion;
    if (id != null && id !== '') set.add(String(id));
  }
  return set;
}

/**
 * Atenciones NUEVO del periodo vs serología completa (mínimo Desconocido en los 4 marcadores).
 */
export function contarNuevosSerologia(listaAtenciones, idsConSerologia) {
  const idsSerologia = idsConSerologia instanceof Set ? idsConSerologia : new Set();
  const vistos = new Set();
  let total = 0;
  let con = 0;
  for (const a of Array.isArray(listaAtenciones) ? listaAtenciones : []) {
    const tipo = String(a?.tipo_atencion || '').trim().toUpperCase();
    const estado = String(a?.estado || '').trim().toUpperCase();
    if (tipo !== 'NUEVO' && estado !== 'NUEVO') continue;
    const id = a?.id_paciente_atencion;
    if (id == null || id === '') continue;
    const key = String(id);
    if (vistos.has(key)) continue;
    vistos.add(key);
    total += 1;
    if (idsSerologia.has(key)) con += 1;
  }
  return {
    totalNuevosSerologia: total,
    nuevosConSerologia: con,
    nuevosSinSerologia: Math.max(0, total - con),
  };
}

export function mensajeBloqueoSerologiaNuevos(totalNuevos, conSerologia) {
  const total = Number(totalNuevos || 0);
  const con = Number(conSerologia || 0);
  if (total <= 0 || total === con) return '';
  const sin = Math.max(0, total - con);
  return (
    `No puede notificar: hay ${sin} paciente(s) NUEVO sin serología completa ` +
    `(VHB, Anti-HBc, VHC y VIH). Debe registrarlos aunque sea como Desconocido ` +
    `(${con}/${total} con serología).`
  );
}

export function tieneNumeroAtencionesRegistrado(numeroAtenciones) {
  if (numeroAtenciones == null || numeroAtenciones === '') return false;
  const n = Number(numeroAtenciones);
  return Number.isInteger(n) && n >= 0;
}

export const MENSAJE_BLOQUEO_SIN_NUMERO_ATENCIONES =
  'No puede notificar: debe importar el reporte de producción HD (Atenciones totales) para el periodo, clínica y modalidad seleccionados.';
