import { getAllIpress } from '@/services/ipress/Ipress.service';

export function countFromResponse(res) {
  if (Array.isArray(res)) return res.length;
  if (res?.results && Array.isArray(res.results)) return res.results.length;
  return 0;
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
    const [resUnidades, resEventos, resMorb, resResultados, resVac] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      getAllIpress(`/vacunaciones/?${qs}`),
    ]);
    return {
      totalUnidades: countFromResponse(resUnidades),
      totalEventos: countFromResponse(resEventos),
      totalMorbilidades: countFromResponse(resMorb),
      totalResultados: countFromResponse(resResultados),
      totalVacunaciones: countFromResponse(resVac),
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
