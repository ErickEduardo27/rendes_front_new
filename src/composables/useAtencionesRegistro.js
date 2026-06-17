/**
 * Una fila por paciente en formularios de registro: prioriza atención ACTIVA
 * (evita duplicados tras egreso/reingreso en el mismo periodo).
 */
export function atencionesParaListadoRegistros(atenciones) {
  const lista = Array.isArray(atenciones) ? atenciones : [];
  const porPaciente = new Map();

  for (const a of lista) {
    const pid = a.id_paciente ?? a.datosPaciente?.id_paciente;
    if (pid == null) continue;
    const key = String(pid);
    const prev = porPaciente.get(key);
    if (!prev) {
      porPaciente.set(key, a);
      continue;
    }
    const esActivo = String(a.estado || '').toUpperCase() === 'ACTIVO';
    const prevActivo = String(prev.estado || '').toUpperCase() === 'ACTIVO';
    if (esActivo && !prevActivo) {
      porPaciente.set(key, a);
    } else if (esActivo === prevActivo) {
      const idA = Number(a.id_paciente_atencion) || 0;
      const idP = Number(prev.id_paciente_atencion) || 0;
      if (idA > idP) porPaciente.set(key, a);
    }
  }

  return Array.from(porPaciente.values());
}
