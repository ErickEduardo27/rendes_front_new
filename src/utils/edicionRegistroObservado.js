/** El supervisor observó este registro: la clínica puede corregirlo aunque el periodo esté notificado. */
export function registroEstaObservado(registro) {
  return String(registro?.estado_aprobacion || '').toUpperCase() === 'OBSERVADO';
}

/**
 * Clínica: si el periodo está notificado o hay observaciones, solo se edita el registro OBSERVADO.
 * No habilita «Nuevo» ni el resto del formulario.
 */
export function puedeEditarRegistroClinica(registro, opts = {}) {
  const formularioAbierto = !!opts.formularioAbierto;
  const bloqueadoPorNotificacion = !!opts.bloqueadoPorNotificacion;
  const hayObservados = !!opts.hayObservados;
  if (!registro || registro.sin_registro_modulo) return false;
  const estado = String(registro.estado_aprobacion || '').toUpperCase();
  if (estado === 'APROBADO') return false;
  const observado = estado === 'OBSERVADO';
  if (bloqueadoPorNotificacion || hayObservados) return observado;
  if (observado) return true;
  return formularioAbierto;
}

export function tituloEdicionRegistroClinica(registro, opts = {}) {
  if (puedeEditarRegistroClinica(registro, opts)) {
    return registroEstaObservado(registro)
      ? 'Registro observado por el supervisor: puede corregirlo'
      : 'Editar registro';
  }
  return opts.motivoCerrado || 'No se puede editar';
}
