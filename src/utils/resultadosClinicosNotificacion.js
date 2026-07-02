const TIEMPO_DIALISIS_MIN = 0.25;
const TIEMPO_DIALISIS_MAX = 8;

export function listaDesdeResponse(res) {
  if (Array.isArray(res)) return res;
  if (res?.results && Array.isArray(res.results)) return res.results;
  return [];
}

export function esTiempoDialisisValorValido(raw) {
  if (raw === null || raw === '') return false;
  const texto = String(raw).trim().replace(',', '.');
  if (!texto) return false;
  if (/[a-zA-Z]/.test(texto)) return false;
  const n = Number(texto);
  if (Number.isNaN(n)) return false;
  return n >= TIEMPO_DIALISIS_MIN && n <= TIEMPO_DIALISIS_MAX;
}

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

export function mensajeBloqueoNotificacionClinica(totalPacientes, totalCompletos) {
  return (
    `No puede notificar: hay ${totalPacientes} paciente(s) en atención y solo ${totalCompletos} ` +
    'registro(s) de resultados clínicos completos (tiempo de diálisis y tratamientos: Eritropoyetina, Hierro y Calcitriol). ' +
    'Complete los registros faltantes antes de enviar a revisión.'
  );
}
