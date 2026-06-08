import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';

export function countFromResponse(res) {
  if (Array.isArray(res)) return res.length;
  if (res?.results && Array.isArray(res.results)) return res.results.length;
  return 0;
}

export async function resolverIdPeriodoIpress(idPeriodo, idIpress) {
  if (idPeriodo == null || idPeriodo === '' || idIpress == null || idIpress === '') {
    return null;
  }
  try {
    const res = await postAllIpress('/consulta_periodo_ipress/', {
      id_periodo: Number(idPeriodo),
      id_ipress: Number(idIpress),
      id_estado: 1,
    });
    const lista = Array.isArray(res) ? res : [];
    return lista.length ? lista[0].id_periodo_ipress : null;
  } catch (e) {
    console.error('Error al resolver id_periodo_ipress:', e);
    return null;
  }
}

/**
 * Mismos conteos que el bloque «Registros por formulario» (ListaPacientes / dashboard).
 */
export async function obtenerEstadisticasRegistrosFormularios({ idPeriodo, idIpress, idModalidad }) {
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', String(idPeriodo));
  if (idIpress != null && idIpress !== '') params.set('id_ipress', String(idIpress));
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', String(idModalidad));
  const qs = params.toString();
  if (!qs) {
    return {
      totalUnidades: 0,
      totalEventos: 0,
      totalMorbilidades: 0,
      totalResultados: 0,
      totalVacunaciones: 0,
    };
  }
  try {
    const [resUnidades, resEventos, resMorb, resResultados, idPeriodoIpress] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      resolverIdPeriodoIpress(idPeriodo, idIpress),
    ]);

    let totalVacunaciones = 0;
    if (idPeriodoIpress != null) {
      try {
        const resVac = await getAllIpress(`/vacunaciones/?id_periodo_ipress=${idPeriodoIpress}`);
        totalVacunaciones = countFromResponse(resVac);
      } catch (e) {
        console.error('Error al contar vacunaciones:', e);
      }
    }

    return {
      totalUnidades: countFromResponse(resUnidades),
      totalEventos: countFromResponse(resEventos),
      totalMorbilidades: countFromResponse(resMorb),
      totalResultados: countFromResponse(resResultados),
      totalVacunaciones,
    };
  } catch (e) {
    console.error(e);
    return {
      totalUnidades: 0,
      totalEventos: 0,
      totalMorbilidades: 0,
      totalResultados: 0,
      totalVacunaciones: 0,
    };
  }
}
