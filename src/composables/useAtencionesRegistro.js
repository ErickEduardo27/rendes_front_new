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
