import { getAllIpress, postAllIpress, patchAllIpress, deleteAllIpress } from '@/services/ipress/Ipress.service';
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

const MARCA_EGRESO_HOSP = 'Generado automáticamente desde morbilidad hospitalaria';
const MARCA_EGRESO_HOSP_ALT = 'Generado automáticamente desde hospitalización';
const MARCA_REINGRESO_HOSP = 'Reingreso automático tras hospitalización';

function truncarObservaciones(texto, max = 100) {
  const s = String(texto || '');
  return s.length <= max ? s : `${s.slice(0, max - 3)}...`;
}

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function soloFecha(value) {
  if (value == null || value === '') return '';
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
}

function fechaAtencion(row) {
  return soloFecha(row?.fecha_atencion || row?.fecha_inicio || row?.fecha_fin);
}

function obsTexto(row) {
  return String(row?.observaciones || '');
}

function esEgresoAutoHospitalizacion(row, idMorbilidad = null) {
  if (String(row?.tipo_atencion || '').toUpperCase() !== 'EGRESO') return false;
  const obs = obsTexto(row);
  if (idMorbilidad != null && idMorbilidad !== '') {
    if (
      (obs.includes(`[Hosp#${idMorbilidad}]`) || obs.includes(`#${idMorbilidad}`))
      && /morbilidad hospitalaria|desde hospitalizaci/i.test(obs)
    ) {
      return true;
    }
  }
  return obs.includes(MARCA_EGRESO_HOSP) || obs.includes(MARCA_EGRESO_HOSP_ALT);
}

function esReingresoAutoHospitalizacion(row, idMorbilidad = null) {
  if (String(row?.tipo_atencion || '').toUpperCase() !== 'REINGRESO') return false;
  const obs = obsTexto(row);
  if (idMorbilidad != null && idMorbilidad !== '') {
    if (
      (obs.includes(`[Hosp#${idMorbilidad}]`) || obs.includes(`#${idMorbilidad}`))
      && /tras hospitalizaci/i.test(obs)
    ) {
      return true;
    }
  }
  return obs.includes(MARCA_REINGRESO_HOSP);
}

function estadoPacienteDesdeTipoAtencion(tipoAtencion) {
  const t = String(tipoAtencion || '').toUpperCase();
  if (t === 'NUEVO') return 'NUEVO';
  if (t === 'REINGRESO') return 'REINGRESO';
  if (t === 'CONTINUADOR') return 'CONTINUADOR';
  if (t === 'EGRESO') return 'EGRESADO';
  return 'ACTIVO';
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

async function listarAtencionesPaciente(pacienteId) {
  const res = await getAllIpress(`/pacienteAtencion/?id_paciente=${encodeURIComponent(pacienteId)}`);
  return Array.isArray(res) ? res : (res?.results || []);
}

function filtrarPorFechasCandidatas(lista, fechasCandidatas) {
  const set = new Set(
    (fechasCandidatas || []).map(soloFecha).filter(Boolean),
  );
  if (!set.size) return [];
  return lista.filter((row) => set.has(fechaAtencion(row)));
}

/**
 * Elimina egresos/reingresos generados automáticamente por una hospitalización
 * y reactiva la atención de origen.
 */
export async function revertirMovimientosPorHospitalizacion({
  pacienteId,
  idPacienteAtencionOrigen = null,
  idMorbilidad = null,
  fechasEgresoCandidatas = [],
  fechasReingresoCandidatas = [],
  ipressId = null,
} = {}) {
  if (!pacienteId) return { eliminados: 0, restauradaOrigen: false };

  let atenciones = [];
  try {
    atenciones = await listarAtencionesPaciente(pacienteId);
  } catch (e) {
    console.warn('No se pudieron listar atenciones para revertir hospitalización:', e);
    return { eliminados: 0, restauradaOrigen: false };
  }

  const fechasEgreso = [...(fechasEgresoCandidatas || [])];
  const idOrigenNum = idPacienteAtencionOrigen != null ? Number(idPacienteAtencionOrigen) : null;
  if (idOrigenNum && !Number.isNaN(idOrigenNum)) {
    const origenRow = atenciones.find(
      (a) => Number(a.id_paciente_atencion) === idOrigenNum,
    );
    if (origenRow?.fecha_fin) fechasEgreso.push(origenRow.fecha_fin);
  }

  const mismaIpress = (row) => {
    if (ipressId == null || ipressId === '') return true;
    const id = row?.id_ipress ?? row?.datosIpress?.id_ipress;
    return id == null || String(id) === String(ipressId);
  };

  let egresos = atenciones.filter(
    (a) => esEgresoAutoHospitalizacion(a, idMorbilidad) && mismaIpress(a),
  );
  let reingresos = atenciones.filter(
    (a) => esReingresoAutoHospitalizacion(a, idMorbilidad) && mismaIpress(a),
  );

  const conMarcaId = (row) => idMorbilidad != null
    && idMorbilidad !== ''
    && (
      obsTexto(row).includes(`[Hosp#${idMorbilidad}]`)
      || obsTexto(row).includes(`#${idMorbilidad}`)
    );

  const egresosPorId = egresos.filter(conMarcaId);
  const reingresosPorId = reingresos.filter(conMarcaId);
  if (egresosPorId.length) {
    egresos = egresosPorId;
  } else {
    egresos = filtrarPorFechasCandidatas(egresos, fechasEgreso);
  }
  if (reingresosPorId.length) {
    reingresos = reingresosPorId;
  } else {
    reingresos = filtrarPorFechasCandidatas(reingresos, fechasReingresoCandidatas);
  }

  const idsAEliminar = [
    ...reingresos.map((r) => r.id_paciente_atencion),
    ...egresos.map((r) => r.id_paciente_atencion),
  ].filter((id) => id != null);

  let eliminados = 0;
  for (const id of idsAEliminar) {
    try {
      await deleteAllIpress(`/pacienteAtencion/${id}/`);
      eliminados += 1;
    } catch (e) {
      console.warn(`No se pudo eliminar atención ${id} generada por hospitalización:`, e);
    }
  }

  let restauradaOrigen = false;
  if (idOrigenNum && !Number.isNaN(idOrigenNum)) {
    try {
      const origen = await getAllIpress(`/pacienteAtencion/${idOrigenNum}/`);
      const estadoOrigen = String(origen?.estado || '').toUpperCase();
      // Solo reactivar si quitamos movimientos auto o la atención quedó cerrada por el egreso hosp.
      if (eliminados > 0 || estadoOrigen === 'CERRADO' || estadoOrigen === 'EGRESADO') {
        const tipoOrigen = origen?.tipo_atencion;
        await patchAllIpress(`/pacienteAtencion/${idOrigenNum}/`, {
          estado: 'ACTIVO',
          fecha_fin: '',
          ...(tipoOrigen ? { tipo_atencion: tipoOrigen } : {}),
        });
        await patchPacienteEstado(pacienteId, estadoPacienteDesdeTipoAtencion(tipoOrigen));
        restauradaOrigen = true;
      }
    } catch (e) {
      console.warn('No se pudo restaurar la atención de origen tras revertir hospitalización:', e);
    }
  }

  return { eliminados, restauradaOrigen };
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
  tipoEgreso = 'Hospitalización',
  observacionesExtra = '',
  idMorbilidad = null,
}) {
  if (!idPacienteAtencion || !pacienteId || !periodoId || !fechaEgreso) {
    throw new Error('Faltan datos para generar el egreso por hospitalización.');
  }

  const tipo = String(tipoEgreso || 'Hospitalización').trim() || 'Hospitalización';
  const esFallecimiento = /fallec/i.test(tipo);
  const prefijoId = idMorbilidad != null && idMorbilidad !== '' ? `[Hosp#${idMorbilidad}] ` : '';
  const marcaBase = esFallecimiento
    ? `${MARCA_EGRESO_HOSP} (fallecimiento)`
    : MARCA_EGRESO_HOSP;
  const obsEgreso = truncarObservaciones(
    `${prefijoId}Egreso: ${tipo}. ${marcaBase}`,
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
      tipo_egreso: tipo,
      fecha_egreso: fechaEgreso,
      observaciones: truncarObservaciones(
        idMorbilidad != null && idMorbilidad !== ''
          ? `[Hosp#${idMorbilidad}] ${MARCA_EGRESO_HOSP_ALT}`
          : MARCA_EGRESO_HOSP_ALT,
      ),
    });
  } catch (e) {
    console.warn('PacienteRegistro (auditoría egreso hosp.):', e);
  }

  await patchPacienteEstado(pacienteId, esFallecimiento ? 'FALLECIDO' : 'EGRESADO');

  return { idAtencionCerrada: Number(idPacienteAtencion) };
}

/**
 * Reactiva al paciente como REINGRESO creando una atención NUEVA.
 * No sobrescribe la atención cerrada (conserva el NUEVO/CONTINUADOR histórico).
 */
export async function generarReingresoPorHospitalizacion({
  idAtencionCerrada,
  pacienteId,
  ipressId,
  periodoId,
  modalidadId,
  fechaReingreso,
  observacionesExtra = '',
  idMorbilidad = null,
}) {
  if (!pacienteId || !periodoId || !fechaReingreso) {
    throw new Error('Faltan datos para generar el reingreso por hospitalización.');
  }

  // Asegura que la atención de origen quede cerrada sin cambiar su tipo_atencion
  // (así el historial conserva NUEVO / CONTINUADOR / REINGRESO previo).
  if (idAtencionCerrada) {
    try {
      const origen = await getAllIpress(`/pacienteAtencion/${Number(idAtencionCerrada)}/`);
      const tipoOrigen = origen?.tipo_atencion;
      await patchAllIpress(`/pacienteAtencion/${Number(idAtencionCerrada)}/`, {
        estado: 'CERRADO',
        fecha_fin: origen?.fecha_fin || fechaReingreso,
        ...(tipoOrigen ? { tipo_atencion: tipoOrigen } : {}),
      });
    } catch (e) {
      console.warn('No se pudo asegurar cierre de atención origen en reingreso hosp.:', e);
    }
  }

  const prefijoId = idMorbilidad != null && idMorbilidad !== '' ? `[Hosp#${idMorbilidad}] ` : '';
  const marca = `${prefijoId}${MARCA_REINGRESO_HOSP}`;
  const now = nowSql();
  await postAllIpress('/pacienteAtencion/', {
    id_paciente: pacienteId,
    id_ipress: ipressId,
    id_periodo: periodoId,
    id_modalidad: modalidadId,
    fecha_atencion: fechaReingreso,
    tipo_atencion: 'REINGRESO',
    fecha_inicio: fechaReingreso,
    fecha_fin: '',
    estado: 'ACTIVO',
    observaciones: truncarObservaciones(observacionesExtra || marca),
    created_at: now,
  });

  await patchPacienteEstado(pacienteId, 'REINGRESO');
  await actualizarPeriodoIpressPaciente(pacienteId, periodoId, ipressId);
}

/**
 * Aplica el efecto elegido tras guardar la morbilidad hospitalaria.
 * Si ya existían movimientos auto de esta hospitalización, los revierte antes de regenerar.
 */
export async function aplicarEfectoMovimientoHospitalizacion({
  efecto,
  atencion,
  fechaHospitalizacion,
  fechaAlta,
  fechaFallecimiento,
  idMorbilidad = null,
  fechasEgresoPrevias = [],
  fechasReingresoPrevias = [],
  revertirPrevios = true,
}) {
  const efectoNorm = String(efecto || '').trim() || EFECTO_HOSP.SIN_EGRESO;

  const pacienteId = atencion?.id_paciente ?? atencion?.datosPaciente?.id_paciente;
  const idPacienteAtencion = atencion?.id_paciente_atencion;
  const ipressId = atencion?.id_ipress ?? atencion?.datosIpress?.id_ipress;
  const periodoId = atencion?.id_periodo ?? atencion?.datosPeriodo?.id_periodo;
  const modalidadId = atencion?.id_modalidad ?? atencion?.datosModalidad?.id_modalidad;

  const esFallecimiento = Boolean(fechaFallecimiento);
  const fechaEgreso = fechaFallecimiento || fechaHospitalizacion;

  if (revertirPrevios && pacienteId) {
    const fechasEgresoCandidatas = [
      ...fechasEgresoPrevias,
      fechaHospitalizacion,
      fechaFallecimiento,
      fechaEgreso,
    ];
    const fechasReingresoCandidatas = [
      ...fechasReingresoPrevias,
      fechaAlta,
    ];
    await revertirMovimientosPorHospitalizacion({
      pacienteId,
      idPacienteAtencionOrigen: idPacienteAtencion,
      idMorbilidad,
      fechasEgresoCandidatas,
      fechasReingresoCandidatas,
      ipressId,
    });
  }

  if (!efectoNorm || efectoNorm === EFECTO_HOSP.SIN_EGRESO) {
    return { movimientosGenerados: false, efecto: EFECTO_HOSP.SIN_EGRESO };
  }

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
    tipoEgreso: esFallecimiento ? 'Fallecimiento' : 'Hospitalización',
    idMorbilidad,
  });

  if (efectoNorm === EFECTO_HOSP.EGRESO || esFallecimiento) {
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
      idMorbilidad,
    });
    return { movimientosGenerados: true, efecto: EFECTO_HOSP.EGRESO_Y_REINGRESO };
  }

  return { movimientosGenerados: false, efecto: efectoNorm };
}
