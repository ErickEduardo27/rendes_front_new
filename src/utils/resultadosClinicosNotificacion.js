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

export function mensajeBloqueoNotificacionClinica(totalPacientes, totalRegistros) {
  return (
    `No puede notificar: hay ${totalPacientes} paciente(s) en atención y ${totalRegistros} ` +
    'registro(s) de resultados clínicos. Ambas cantidades deben ser iguales antes de enviar a revisión.'
  );
}

export function tieneNumeroAtencionesRegistrado(numeroAtenciones) {
  if (numeroAtenciones == null || numeroAtenciones === '') return false;
  const n = Number(numeroAtenciones);
  return Number.isInteger(n) && n >= 0;
}

export const MENSAJE_BLOQUEO_SIN_NUMERO_ATENCIONES =
  'No puede notificar: debe registrar el N° de Atenciones en Inicio de TRR para el periodo, clínica y modalidad seleccionados.';
