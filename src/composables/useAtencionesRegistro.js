/**
 * Una fila por paciente en formularios de registro.
 * Solo atenciones ACTIVO: pacientes egresados no pueden registrar ni editar en formularios.
 */
export function atencionesParaListadoRegistros(atenciones) {
  const lista = Array.isArray(atenciones) ? atenciones : [];
  const porPaciente = new Map();

  for (const a of lista) {
    if (String(a.estado || '').toUpperCase() !== 'ACTIVO') continue;

    const pid = a.id_paciente ?? a.datosPaciente?.id_paciente;
    if (pid == null) continue;
    const key = String(pid);
    const prev = porPaciente.get(key);
    if (!prev) {
      porPaciente.set(key, a);
      continue;
    }
    const idA = Number(a.id_paciente_atencion) || 0;
    const idP = Number(prev.id_paciente_atencion) || 0;
    if (idA > idP) porPaciente.set(key, a);
  }

  return Array.from(porPaciente.values());
}

/** True si la atención corresponde a un paciente egresado. */
export function esAtencionEgresada(atencion) {
  if (!atencion) return false;
  const estado = String(atencion.estado || '').toUpperCase();
  const tipo = String(atencion.tipo_atencion || '').toUpperCase();
  return estado === 'EGRESADO' || tipo === 'EGRESO';
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

/** Registro asociado a una atención activa (match directo o por paciente). */
export function registroParaAtencionActiva(atencion, porAtencion, porPaciente) {
  if (!atencion) return null;
  const idAten = atencion.id_paciente_atencion;
  if (idAten != null && porAtencion?.[String(idAten)]) return porAtencion[String(idAten)];
  const pid = atencion.id_paciente ?? atencion.datosPaciente?.id_paciente;
  if (pid != null && porPaciente?.[String(pid)]) return porPaciente[String(pid)];
  return null;
}
