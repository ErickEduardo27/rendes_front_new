import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import { contarResultadosClinicosCompletos, listaDesdeResponse, tieneNumeroAtencionesRegistrado, totalPacientesEnAtencionDesdeEstadisticas, ultimosResultadosPorAtencion } from '@/utils/resultadosClinicosNotificacion';
import { contarUnidadesAccesoEnPeriodo, rangoFechasDesdePeriodoTexto } from '@/utils/accesoVascularValidacion';

export function countFromResponse(res) {
  return listaDesdeResponse(res).length;
}

function vacioConteoAtencion() {
  return { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 };
}

export function normalizarConteoAtencion(obj) {
  const o = obj && typeof obj === 'object' ? obj : {};
  const nuevos = Number(o.nuevos || 0);
  const reingresos = Number(o.reingresos || 0);
  const continuadores = Number(o.continuadores || 0);
  const egresados = Number(o.egresados || 0);
  return {
    nuevos,
    reingresos,
    continuadores,
    egresados,
    total: Number(o.total || 0) || (nuevos + reingresos + continuadores + egresados),
  };
}

function conteoTieneDatos(obj) {
  const c = normalizarConteoAtencion(obj);
  return c.total > 0 || c.nuevos > 0 || c.reingresos > 0 || c.continuadores > 0 || c.egresados > 0;
}

function clasificarCondicionAtencion(at, porIngreso = false) {
  const estado = String(at?.estado || '').trim().toUpperCase();
  const tipo = String(at?.tipo_atencion || '').trim().toUpperCase();
  if (porIngreso) {
    if (tipo === 'EGRESO' || estado === 'EGRESADO') return 'egresados';
  } else if (['EGRESADO', 'CERRADO', 'CERRADA'].includes(estado) || tipo === 'EGRESO') {
    return 'egresados';
  }
  if (tipo.includes('REINGRESO')) return 'reingresos';
  if (tipo === 'NUEVO' || estado === 'NUEVO') return 'nuevos';
  return 'continuadores';
}

function contarCondicionesAtencion(ats, porIngreso = false) {
  const c = vacioConteoAtencion();
  for (const at of ats) {
    c[clasificarCondicionAtencion(at, porIngreso)] += 1;
  }
  c.total = c.nuevos + c.reingresos + c.continuadores + c.egresados;
  return c;
}

/** Fallback si el API aún no envía inicial/final (misma lógica que ListaPacientes). */
function conteosCondicionDesdeAtenciones(lista) {
  const porPaciente = new Map();
  for (const a of Array.isArray(lista) ? lista : []) {
    const pid = a?.id_paciente ?? a?.datosPaciente?.id_paciente ?? null;
    if (pid == null) continue;
    const key = String(pid);
    if (!porPaciente.has(key)) porPaciente.set(key, []);
    porPaciente.get(key).push(a);
  }
  const primeras = [];
  const ultimas = [];
  for (const ats of porPaciente.values()) {
    const sorted = [...ats].sort(
      (a, b) => (Number(a.id_paciente_atencion) || 0) - (Number(b.id_paciente_atencion) || 0),
    );
    primeras.push(sorted[0]);
    ultimas.push(sorted[sorted.length - 1]);
  }
  return {
    inicial: contarCondicionesAtencion(primeras, true),
    final: contarCondicionesAtencion(ultimas, false),
  };
}

async function resolverConteosInicialFinal(statsAtencion, qs) {
  const finalApi = normalizarConteoAtencion(statsAtencion?.final || statsAtencion);
  let inicial = normalizarConteoAtencion(statsAtencion?.inicial);
  let final = finalApi;
  if (!conteoTieneDatos(statsAtencion?.inicial) && conteoTieneDatos(finalApi)) {
    try {
      const lista = listaDesdeResponse(await getAllIpress(`/pacienteAtencion/?${qs}`));
      const cortes = conteosCondicionDesdeAtenciones(lista);
      inicial = cortes.inicial;
      final = cortes.final;
    } catch (e) {
      console.error('Error al calcular condición inicial/final:', e);
      inicial = { ...finalApi };
    }
  }
  return { inicial, final };
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
  const vacio = {
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
    inicial: vacioConteoAtencion(),
    final: vacioConteoAtencion(),
  };
  if (!qs) {
    return { ...vacio };
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
    const { inicial, final } = await resolverConteosInicialFinal(statsAtencion, qs);
    const nuevos = Number(final.nuevos || 0);
    const reingresos = Number(final.reingresos || 0);
    const continuadores = Number(final.continuadores || 0);
    const egresados = Number(final.egresados || 0);
    const totalPacientesAtendidos = totalPacientesEnAtencionDesdeEstadisticas(final);
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
      inicial,
      final,
    };
  } catch (e) {
    console.error(e);
    return { ...vacio };
  }
}
