import { getAllIpress, postAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service';
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';

/** Efectos de la confirmación al registrar hospitalización */
export const EFECTO_HOSP = {
  EGRESO_Y_REINGRESO: '1',
  EGRESO: '2',
  SIN_EGRESO: '3',
};

export const OPCIONES_EFECTO_HOSPITALIZACION = [
  {
    value: EFECTO_HOSP.EGRESO_Y_REINGRESO,
    label: 'La hospitalización genera egreso y reingreso del paciente',
    requiereAlta: true,
  },
  {
    value: EFECTO_HOSP.EGRESO,
    label: 'La hospitalización genera egreso del paciente',
    requiereAlta: false,
  },
  {
    value: EFECTO_HOSP.SIN_EGRESO,
    label: 'La hospitalización no genera el egreso del paciente',
    requiereAlta: false,
  },
];

function truncarObservaciones(texto, max = 100) {
  const s = String(texto || '');
  return s.length <= max ? s : `${s.slice(0, max - 3)}...`;
}

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function patchPacienteEstado(pacienteId, nuevoEstado) {
  await patchAllIpress(`/pacientes/${pacienteId}/`, { estado: nuevoEstado });
}

async function actualizarPeriodoIpressPaciente(pacienteId, periodoId, ipressId) {
  try {
    const respuesta = await getAllIpress(`/pacientesDialisis/?id_paciente=${pacienteId}`);
    const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    if (!lista[0]?.id_paciente_dialisis) return;
    const idPeriodoIpress = await resolverIdPeriodoIpress(periodoId, ipressId);
    if (idPeriodoIpress == null) return;
    await patchAllIpress(`/pacientesDialisis/${lista[0].id_paciente_dialisis}/`, {
      id_periodo_ipress: idPeriodoIpress,
    });
  } catch (e) {
    console.warn('No se actualizó periodo_ipress del paciente:', e);
  }
}

/**
 * Cierra la atención activa y crea el movimiento de egreso por hospitalización.
 * @returns {{ idAtencionCerrada: number|null }}
 */
export async function generarEgresoPorHospitalizacion({
  idPacienteAtencion,
  pacienteId,
  ipressId,
  periodoId,
  modalidadId,
  fechaEgreso,
  observacionesExtra = '',
}) {
  if (!idPacienteAtencion || !pacienteId || !periodoId || !fechaEgreso) {
    throw new Error('Faltan datos para generar el egreso por hospitalización.');
  }

  const obsEgreso = truncarObservaciones(
    observacionesExtra
      ? `Egreso: Hospitalización. ${observacionesExtra}`
      : 'Egreso: Hospitalización',
  );
  const now = nowSql();

  await patchAllIpress(`/pacienteAtencion/${idPacienteAtencion}/`, {
    estado: 'CERRADO',
    fecha_fin: fechaEgreso,
  });

  await postAllIpress('/pacienteAtencion/', {
    id_paciente: pacienteId,
    id_ipress: ipressId,
    id_periodo: periodoId,
    id_modalidad: modalidadId,
    fecha_atencion: fechaEgreso,
    tipo_atencion: 'EGRESO',
    fecha_inicio: fechaEgreso,
    fecha_fin: fechaEgreso,
    estado: 'EGRESADO',
    observaciones: obsEgreso,
    created_at: now,
  });

  try {
    await postAllIpress('/PacienteRegistro/', {
      paciente: pacienteId,
      periodo: periodoId,
      ipress: ipressId,
      condicion: 'EGRESADO',
      tipo_egreso: 'Hospitalización',
      fecha_egreso: fechaEgreso,
      observaciones: observacionesExtra || 'Generado automáticamente desde hospitalización',
    });
  } catch (e) {
    console.warn('PacienteRegistro (auditoría egreso hosp.):', e);
  }

  await patchPacienteEstado(pacienteId, 'EGRESADO');

  return { idAtencionCerrada: Number(idPacienteAtencion) };
}

/**
 * Reactiva la atención cerrada como REINGRESO (misma atención / registros clínicos).
 */
export async function generarReingresoPorHospitalizacion({
  idAtencionCerrada,
  pacienteId,
  ipressId,
  periodoId,
  modalidadId,
  fechaReingreso,
  observacionesExtra = '',
}) {
  if (!idAtencionCerrada || !pacienteId || !periodoId || !fechaReingreso) {
    throw new Error('Faltan datos para generar el reingreso por hospitalización.');
  }

  const now = nowSql();
  const payload = {
    id_paciente: pacienteId,
    id_ipress: ipressId,
    id_periodo: periodoId,
    id_modalidad: modalidadId,
    fecha_atencion: fechaReingreso,
    tipo_atencion: 'REINGRESO',
    fecha_inicio: fechaReingreso,
    fecha_fin: '',
    estado: 'ACTIVO',
    observaciones: observacionesExtra
      || 'Reingreso automático tras hospitalización',
    created_at: now,
  };

  await patchAllIpress(`/pacienteAtencion/${idAtencionCerrada}/`, payload);
  await patchPacienteEstado(pacienteId, 'REINGRESO');
  await actualizarPeriodoIpressPaciente(pacienteId, periodoId, ipressId);
}

/**
 * Aplica el efecto elegido tras guardar la morbilidad hospitalaria.
 */
export async function aplicarEfectoMovimientoHospitalizacion({
  efecto,
  atencion,
  fechaHospitalizacion,
  fechaAlta,
  fechaFallecimiento,
}) {
  const efectoNorm = String(efecto || '').trim();
  if (!efectoNorm || efectoNorm === EFECTO_HOSP.SIN_EGRESO) {
    return { movimientosGenerados: false, efecto: EFECTO_HOSP.SIN_EGRESO };
  }

  const pacienteId = atencion?.id_paciente ?? atencion?.datosPaciente?.id_paciente;
  const idPacienteAtencion = atencion?.id_paciente_atencion;
  const ipressId = atencion?.id_ipress ?? atencion?.datosIpress?.id_ipress;
  const periodoId = atencion?.id_periodo ?? atencion?.datosPeriodo?.id_periodo;
  const modalidadId = atencion?.id_modalidad ?? atencion?.datosModalidad?.id_modalidad;

  const fechaEgreso = fechaFallecimiento || fechaHospitalizacion;
  if (!fechaEgreso) {
    throw new Error('No hay fecha de hospitalización (ni de fallecimiento) para el egreso.');
  }

  const { idAtencionCerrada } = await generarEgresoPorHospitalizacion({
    idPacienteAtencion,
    pacienteId,
    ipressId,
    periodoId,
    modalidadId,
    fechaEgreso,
    observacionesExtra: 'Generado automáticamente desde morbilidad hospitalaria',
  });

  if (efectoNorm === EFECTO_HOSP.EGRESO) {
    return { movimientosGenerados: true, efecto: EFECTO_HOSP.EGRESO };
  }

  if (efectoNorm === EFECTO_HOSP.EGRESO_Y_REINGRESO) {
    if (!fechaAlta) {
      throw new Error('Para egreso y reingreso se requiere fecha de alta de hospitalización.');
    }
    await generarReingresoPorHospitalizacion({
      idAtencionCerrada,
      pacienteId,
      ipressId,
      periodoId,
      modalidadId,
      fechaReingreso: fechaAlta,
    });
    return { movimientosGenerados: true, efecto: EFECTO_HOSP.EGRESO_Y_REINGRESO };
  }

  return { movimientosGenerados: false, efecto: efectoNorm };
}
