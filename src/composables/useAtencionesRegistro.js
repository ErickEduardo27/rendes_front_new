/**
 * Listado de atenciones para formularios de registro e Inicio TRR.
 * Incluye ACTIVO y también egresados (CERRADO / EGRESO) del periodo.
 * Si hay ACTIVO y egreso, prioriza ACTIVO (reingreso).
 */

function idPacienteAtencion(a) {
  return a?.id_paciente ?? a?.datosPaciente?.id_paciente ?? null;
}

function estadoAtencionUpper(a) {
  return String(a?.estado || '').trim().toUpperCase();
}

function tipoAtencionUpper(a) {
  return String(a?.tipo_atencion || '').trim().toUpperCase();
}

function esAtencionActiva(a) {
  return estadoAtencionUpper(a) === 'ACTIVO';
}

function esAtencionCerrada(a) {
  const e = estadoAtencionUpper(a);
  return e === 'CERRADO' || e === 'CERRADA';
}

/** True si la atención corresponde a un egreso (fila EGRESADO / tipo EGRESO). */
export function esAtencionEgresada(atencion) {
  if (!atencion) return false;
  if (atencion.es_egresado === true) return true;
  const estado = estadoAtencionUpper(atencion);
  const tipo = tipoAtencionUpper(atencion);
  return estado === 'EGRESADO' || tipo === 'EGRESO';
}

/** Prioridad: ACTIVO > CERRADA (ficha clínica) > EGRESO > resto. */
function rankAtencionListado(a) {
  if (esAtencionActiva(a)) return 3;
  if (esAtencionCerrada(a)) return 2;
  if (esAtencionEgresada(a)) return 1;
  return 0;
}

function idAtencionNum(a) {
  return Number(a?.id_paciente_atencion) || 0;
}

function preferirAtencion(prev, next) {
  if (!prev) return next;
  if (!next) return prev;
  const rp = rankAtencionListado(prev);
  const rn = rankAtencionListado(next);
  if (rn !== rp) return rn > rp ? next : prev;
  return idAtencionNum(next) > idAtencionNum(prev) ? next : prev;
}

/**
 * Una fila por paciente: activos + egresados del periodo/clínica/modalidad.
 * Egresados llevan es_egresado y estado/tipo normalizados a EGRESADO/EGRESO.
 */
export function atencionesParaListadoRegistros(atenciones) {
  const lista = Array.isArray(atenciones) ? atenciones : [];
  const porPaciente = new Map();

  for (const a of lista) {
    const rank = rankAtencionListado(a);
    if (rank < 1) continue;
    const pid = idPacienteAtencion(a);
    if (pid == null) continue;
    const key = String(pid);
    porPaciente.set(key, preferirAtencion(porPaciente.get(key), a));
  }

  return Array.from(porPaciente.values()).map((a) => {
    if (esAtencionActiva(a)) {
      return { ...a, es_egresado: false };
    }
    return {
      ...a,
      es_egresado: true,
      estado: 'EGRESADO',
      estado_atencion: 'EGRESADO',
      tipo_atencion: 'EGRESO',
    };
  });
}

/** Paciente egresado en el listado (no editable / sin nuevo registro). */
export function esPacienteEgresadoEnListado(atencionOFila) {
  if (!atencionOFila) return false;
  if (atencionOFila.es_egresado === true) return true;
  const estado = String(
    atencionOFila.estado_atencion
      ?? atencionOFila.estado
      ?? atencionOFila.datosPacienteAtencion?.estado
      ?? '',
  ).trim().toUpperCase();
  const tipo = String(
    atencionOFila.tipo_atencion
      ?? atencionOFila.datosPacienteAtencion?.tipo_atencion
      ?? '',
  ).trim().toUpperCase();
  if (estado === 'EGRESADO' || tipo === 'EGRESO') return true;
  if (estado === 'CERRADO' || estado === 'CERRADA') return true;
  return false;
}

function idPacienteDeRegistro(registro) {
  if (!registro) return null;
  return (
    registro.datosPaciente?.id_paciente
    ?? registro.datosPacienteAtencion?.datosPaciente?.id_paciente
    ?? registro.datosPacienteAtencion?.id_paciente
    ?? registro.id_paciente
    ?? null
  );
}

function idAtencionDeRegistro(registro) {
  if (!registro) return null;
  return (
    registro.id_paciente_atencion
    ?? registro.datosPacienteAtencion?.id_paciente_atencion
    ?? null
  );
}

/**
 * Índice de registros por id_paciente_atencion y por id_paciente.
 * Tras egreso+reingreso en el mismo periodo puede quedar un registro ligado a la atención
 * CERRADA; el listado ACTIVO lo reencuentra por paciente.
 */
export function indexarRegistrosPorAtencionYPaciente(registros, idRegistroKey) {
  const porAtencion = {};
  const porPaciente = {};
  const lista = Array.isArray(registros) ? registros : [];

  for (const r of lista) {
    const rid = Number(r?.[idRegistroKey]) || 0;
    const idAten = idAtencionDeRegistro(r);
    if (idAten != null) {
      const k = String(idAten);
      const prev = porAtencion[k];
      if (!prev || rid > (Number(prev[idRegistroKey]) || 0)) porAtencion[k] = r;
    }
    const pid = idPacienteDeRegistro(r);
    if (pid != null) {
      const k = String(pid);
      const prev = porPaciente[k];
      if (!prev || rid > (Number(prev[idRegistroKey]) || 0)) porPaciente[k] = r;
    }
  }

  return { porAtencion, porPaciente };
}

/** True si el registro clínico pertenece a un paciente egresado del listado actual. */
export function registroDePacienteEgresado(registro, listadoAtenciones) {
  if (!registro) return false;
  const lista = Array.isArray(listadoAtenciones) ? listadoAtenciones : [];
  const idAten = idAtencionDeRegistro(registro);
  if (idAten != null) {
    const a = lista.find((x) => String(x.id_paciente_atencion) === String(idAten));
    if (a) return esPacienteEgresadoEnListado(a);
  }
  const pid = idPacienteDeRegistro(registro);
  if (pid != null) {
    const a = lista.find((x) => String(idPacienteAtencion(x)) === String(pid));
    if (a) return esPacienteEgresadoEnListado(a);
  }
  return false;
}
