import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import { contarResultadosClinicosCompletos, listaDesdeResponse, tieneNumeroAtencionesRegistrado, totalPacientesEnAtencionDesdeEstadisticas, ultimosResultadosPorAtencion } from '@/utils/resultadosClinicosNotificacion';
import { contarUnidadesAccesoEnPeriodo, rangoFechasDesdePeriodoTexto } from '@/utils/accesoVascularValidacion';

export function countFromResponse(res) {
  return listaDesdeResponse(res).length;
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

export async function resolverIdUsuarioIpress(idIpress) {
  if (idIpress == null || idIpress === '') return null;
  let idUsuario = null;
  try {
    idUsuario = JSON.parse(localStorage.getItem('user') || 'null')?.id_usuario ?? null;
  } catch {
    idUsuario = null;
  }
  if (idUsuario) {
    try {
      const asig = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
      const lista = Array.isArray(asig) ? asig : (asig?.results || []);
      const match = lista.find((a) => String(a.id_ipress) === String(idIpress));
      if (match?.id_usuario_ipress != null) return match.id_usuario_ipress;
    } catch (e) {
      console.error('Error al resolver usuario IPRESS:', e);
    }
  }
  try {
    const uiList = await getAllIpress(`/usuarioIpress/?id_ipress=${idIpress}`);
    const lista = Array.isArray(uiList) ? uiList : (uiList?.results || []);
    return lista[0]?.id_usuario_ipress ?? null;
  } catch (e) {
    console.error('Error al obtener vínculo usuario–IPRESS:', e);
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
      totalCalidadAgua: 0,
      totalPacientesAtendidos: 0,
      nuevos: 0,
      reingresos: 0,
      continuadores: 0,
      egresados: 0,
      numeroAtenciones: null,
      totalResultadosRegistrados: 0,
      totalResultadosCompletos: 0,
      puedeNotificarClinica: false,
    };
  }
  try {
    const [resUnidades, resEventos, resMorb, resResultados, resEstadisticasAtencion, resInicioTrr, idPeriodoIpress, idUsuarioIpress, resPeriodos] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${new URLSearchParams({
        ...(idIpress != null && idIpress !== '' ? { id_ipress: String(idIpress) } : {}),
        ...(idModalidad != null && idModalidad !== '' ? { id_modalidad: String(idModalidad) } : {}),
      }).toString()}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      getAllIpress(`/pacienteAtencion/estadisticas/?${qs}`),
      getAllIpress(`/consulta_inicio_trr_periodo/?${qs}`),
      resolverIdPeriodoIpress(idPeriodo, idIpress),
      resolverIdUsuarioIpress(idIpress),
      getAllIpress('/periodos/'),
    ]);

    const listaPeriodos = Array.isArray(resPeriodos) ? resPeriodos : (resPeriodos?.results || []);
    const periodoItem = listaPeriodos.find((p) => String(p.id_periodo) === String(idPeriodo));
    const rangoAcceso = rangoFechasDesdePeriodoTexto(periodoItem?.periodo);
    const listaUnidades = listaDesdeResponse(resUnidades);

    const statsAtencion = resEstadisticasAtencion || {};
    const nuevos = Number(statsAtencion.nuevos || 0);
    const reingresos = Number(statsAtencion.reingresos || 0);
    const continuadores = Number(statsAtencion.continuadores || 0);
    const egresados = Number(statsAtencion.egresados || 0);
    const totalPacientesAtendidos = totalPacientesEnAtencionDesdeEstadisticas(statsAtencion);
    const numeroAtenciones =
      resInicioTrr?.numero_atenciones != null && resInicioTrr?.numero_atenciones !== ''
        ? Number(resInicioTrr.numero_atenciones)
        : null;
    const listaResultados = listaDesdeResponse(resResultados);
    const totalResultadosRegistrados = ultimosResultadosPorAtencion(listaResultados).length;
    const totalResultadosCompletos = contarResultadosClinicosCompletos(resResultados);

    let totalCalidadAgua = 0;
    if (idPeriodoIpress != null && idUsuarioIpress != null) {
      try {
        const resCal = await postAllIpress('/reporte_calidad_microbiologicas/', {
          id_usuario_ipress: Number(idUsuarioIpress),
          id_periodo_ipress: Number(idPeriodoIpress),
        });
        totalCalidadAgua = countFromResponse(resCal);
      } catch (e) {
        console.error('Error al contar calidad de agua:', e);
      }
    }

    return {
      totalUnidades: contarUnidadesAccesoEnPeriodo(listaUnidades, rangoAcceso),
      totalEventos: countFromResponse(resEventos),
      totalMorbilidades: countFromResponse(resMorb),
      totalResultados: countFromResponse(resResultados),
      totalCalidadAgua,
      totalPacientesAtendidos,
      nuevos,
      reingresos,
      continuadores,
      egresados,
      numeroAtenciones,
      totalResultadosRegistrados,
      totalResultadosCompletos,
      puedeNotificarClinica:
        tieneNumeroAtencionesRegistrado(numeroAtenciones)
        && totalPacientesAtendidos > 0
        && totalPacientesAtendidos === totalResultadosRegistrados,
    };
  } catch (e) {
    console.error(e);
    return {
      totalUnidades: 0,
      totalEventos: 0,
      totalMorbilidades: 0,
      totalResultados: 0,
      totalCalidadAgua: 0,
      totalPacientesAtendidos: 0,
      nuevos: 0,
      reingresos: 0,
      continuadores: 0,
      egresados: 0,
      numeroAtenciones: null,
      totalResultadosRegistrados: 0,
      totalResultadosCompletos: 0,
      puedeNotificarClinica: false,
    };
  }
}
