import * as XLSX from 'xlsx';
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat';

function nombreHojaSeguro(nombre) {
  const s = String(nombre || 'Hoja').replace(/[:\\/?*[\]]/g, '_').trim();
  return (s || 'Hoja').slice(0, 31);
}

function asList(res) {
  if (Array.isArray(res)) return res;
  if (res?.results && Array.isArray(res.results)) return res.results;
  return [];
}

function siNo(val) {
  if (val === true || val === 1 || val === '1' || String(val).toLowerCase() === 'true' || String(val).toLowerCase() === 'si' || String(val).toLowerCase() === 'sí') {
    return 'Sí';
  }
  if (val === false || val === 0 || val === '0' || String(val).toLowerCase() === 'false' || String(val).toLowerCase() === 'no') {
    return 'No';
  }
  if (val == null || val === '') return '';
  return String(val);
}

function nombrePaciente(r) {
  return r?.datosPacienteAtencion?.datosPaciente?.paciente
    || r?.datosPaciente?.paciente
    || r?.paciente
    || '—';
}

function documentoPaciente(r) {
  return r?.datosPacienteAtencion?.datosPaciente?.documento
    || r?.datosPaciente?.documento
    || r?.documento
    || '—';
}

function appendJsonSheet(wb, nombre, rows) {
  const data = Array.isArray(rows) && rows.length
    ? rows
    : [{ Info: 'Sin registros en el periodo' }];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, nombreHojaSeguro(nombre));
}

function hojaConstanciaAoA(datos) {
  const regs = datos.registros || {};
  const inicial = datos.inicial || {};
  const final = datos.final || {};
  const actual = datos.actual || {};
  const ubigeo = datos.ubigeo || {};
  const fechaVal = formatFechaHoraDDMMAAAA(datos.conformidadEn) || formatFechaHoraDDMMAAAA(new Date().toISOString());

  return [
    ['CONSTANCIA DE CUMPLIMIENTO DE REPORTE DE LA IPRESS DE DIÁLISIS / REGISTRO NACIONAL DE DIÁLISIS'],
    ['Código documento', datos.codigoDocumento ?? ''],
    [],
    ['Modalidad', datos.modalidad || '—'],
    ['Periodo', datos.periodoTexto || '—'],
    [],
    ['DATOS DE LA UNIDAD'],
    ['Unidad', datos.unidad || '—'],
    ['Red asistencial', datos.redAsistencial || '—'],
    ['Departamento', ubigeo.departamento || '—'],
    ['Provincia', ubigeo.provincia || '—'],
    ['Distrito', ubigeo.distrito || '—'],
    ['Responsable', datos.responsable || '—'],
    ['Correo', datos.correo || '—'],
    ['Teléfono', datos.telefono || '—'],
    ['Celular', datos.celular || '—'],
    ['Pacientes (condición final)', datos.pacientes ?? '—'],
    ['Sesiones', datos.sesiones ?? '—'],
    [],
    ['RESUMEN DEL PERIODO'],
    ['Concepto', 'Total', 'Nuevos', 'Reingresos', 'Continuadores', 'Egresos'],
    ['Condición inicial', inicial.total ?? 0, inicial.nuevos ?? 0, inicial.reingresos ?? 0, inicial.continuadores ?? 0, inicial.egresados ?? 0],
    ['Condición final', final.total ?? 0, final.nuevos ?? 0, final.reingresos ?? 0, final.continuadores ?? 0, final.egresados ?? 0],
    ['Condición actual', actual.total ?? 0, actual.nuevos ?? 0, actual.reingresos ?? 0, actual.continuadores ?? 0, actual.egresados ?? 0],
    [],
    ['REGISTROS DEL PERIODO POR MÓDULO'],
    ['Módulo', 'Cantidad'],
    ['Cambio de acceso vascular', regs.cambioAccesoVascular ?? 0],
    ['Eventos infecciosos', regs.eventosInfecciosos ?? 0],
    ['Morbilidad hospitalaria', regs.morbilidadHospitalaria ?? 0],
    ['Resultados clínicos', regs.resultadosClinicos ?? 0],
    ['Calidad de agua', regs.calidadAgua ?? 0],
    [],
    ['Validado por', datos.validadoPor || '—'],
    ['Fecha de conformidad', fechaVal],
  ];
}

export function mapInicioTrrRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: r.datosPaciente?.paciente || r.paciente || '—',
    Documento: r.datosPaciente?.documento || r.documento || '—',
    'Tipo doc.': r.datosPaciente?.tipo_documento || '',
    Sexo: r.datosPaciente?.genero || '',
    'Etiol. general': r.datosEti?.etiologia_general || r.general || '',
    'Etiol. específica': r.datosEti?.etiologia_especifica || r.especifica || '',
    'Modalidad inicio TRR': r.modalidad_inicio_trr || '',
    'F. inicio TRR': r.fecha_inicio_trr || '',
    'Subsistema': r.subsistema_salud || '',
    'Tipo acceso': r.tipo_acceso || '',
    'F. creación acceso': r.fecha_creacion_acceso || '',
    'F. 1er ingreso': r.fecha_primer_ingreso || '',
    'Condición': r.tipo_atencion_inicial || r.condicion_inicial || r.tipo_atencion || '',
    Estado: r.estado_aprobacion || (r.sin_registro_dialisis ? 'SIN REGISTRO' : 'PENDIENTE'),
  }));
}

export function mapAccesoVascularRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    'Tipo acceso': r.tipo_acceso || r.tipo_acceso_actual || '',
    Localización: r.localizacion_acceso || r.localizacion_acceso_actual || '',
    'Fecha creación': r.fecha_creacion_acceso || '',
    'F. inicio canulación': r.fecha_inicio_canulacion || '',
    'Motivo cambio': r.motivo_cambio || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
  }));
}

export function mapEventosInfecciososRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    'Fecha evento': r.fecha_evento || '',
    'Tipo infección': r.tipo_infeccion || '',
    Antimicrobial: r.antmicrobial || '',
    Vancomicina: r.vancomicina || '',
    'Hemocultivo (+)': r.hemocultivo_positivo || '',
    Germen: r.germen || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
  }));
}

export function mapMorbilidadRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    Diagnóstico: r.diagnostico || '',
    Código: r.codigo_diagnostico || '',
    'F. hospitalización': r.fecha_hospitalizacion || '',
    'F. alta': r.fecha_alta_hospitalizacion || r.fecha_alta || '',
    Desenlace: r.desenlace || '',
    Fuente: r.fuente || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
  }));
}

export function mapResultadosClinicosRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    Hb: r.Hb ?? r.hb ?? '',
    Calcio: r.calcio ?? '',
    Fósforo: r.fosforo ?? '',
    PTHi: r.PTHi ?? r.pthi ?? '',
    Alb: r.Alb ?? r.alb ?? '',
    'Calcio corregido': r.calcio_corregido ?? '',
    'Kt/V': r.ktv ?? '',
    'T. diálisis': r.tiempo_dialisis ?? '',
    Eritropoyetina: siNo(r.eritoproyetina),
    Hierro: siNo(r.hierro),
    Calcitriol: siNo(r.calcitriol),
    Estado: r.estado_aprobacion || 'PENDIENTE',
  }));
}

export function mapSerologiaVacunacionRows(lista) {
  return asList(lista).map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    VHB: r.vhb ?? '',
    VHC: r.vhc ?? '',
    VIH: r.vih ?? '',
    'Título AcHBs': r.titulo_acHbs ?? '',
    'Dosis Hepatitis B': r.dosis_hepatitis_b ?? '',
    'Dosis Covid': r.dosis_covid ?? '',
    'Fecha Influenza': r.fecha_influenza ?? '',
    'Fecha Neumococo': r.fecha_neumococo ?? '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
  }));
}

export function mapCalidadAguaRows(lista) {
  return asList(lista).map((r) => ({
    Control: r.control ?? '',
    'Salida ósmosis UFC': r.salida_osmosis_ufc ?? '',
    'Anillo circulación UFC': r.anillo_circulacion_ufc ?? '',
    'Salida ósmosis UE': r.salida_osmosis_ue ?? '',
    'Anillo circulación UE': r.anillo_circulacion_ue ?? '',
    'Máquina 1 UFC': r.maquina_1_ufc ?? '',
    'Máquina 2 UFC': r.maquina_2_ufc ?? '',
    'Máquina 1 UE': r.maquina_1_ue ?? '',
    'Máquina 2 UE': r.maquina_2_ue ?? '',
  }));
}

/**
 * Genera Excel multipágina: hoja 1 = constancia/resumen; resto = tablas de registros.
 * @param {object} datosConstancia mismos campos que el PDF
 * @param {object} hojas { inicioTrr, accesoVascular, eventosInfecciosos, morbilidad, resultadosClinicos, serologia, calidadAgua }
 */
export function exportConstanciaCumplimientoExcel(datosConstancia, hojas = {}) {
  const wb = XLSX.utils.book_new();

  const wsConstancia = XLSX.utils.aoa_to_sheet(hojaConstanciaAoA(datosConstancia || {}));
  XLSX.utils.book_append_sheet(wb, wsConstancia, nombreHojaSeguro('1. Constancia'));

  appendJsonSheet(wb, '2. Inicio TRR', mapInicioTrrRows(hojas.inicioTrr));
  appendJsonSheet(wb, '3. Acceso vascular', mapAccesoVascularRows(hojas.accesoVascular));
  appendJsonSheet(wb, '4. Eventos infecciosos', mapEventosInfecciososRows(hojas.eventosInfecciosos));
  appendJsonSheet(wb, '5. Morbilidad hosp.', mapMorbilidadRows(hojas.morbilidad));
  appendJsonSheet(wb, '6. Resultados clinicos', mapResultadosClinicosRows(hojas.resultadosClinicos));
  appendJsonSheet(wb, '7. Serologia vacunacion', mapSerologiaVacunacionRows(hojas.serologia));
  appendJsonSheet(wb, '8. Calidad de agua', mapCalidadAguaRows(hojas.calidadAgua));

  const stamp = String(datosConstancia?.periodoTexto || 'periodo').replace(/[^\w\-]+/g, '_');
  const unidad = String(datosConstancia?.unidad || 'ipress').replace(/[^\w\-]+/g, '_').slice(0, 40);
  XLSX.writeFile(wb, `constancia_registros_${stamp}_${unidad}.xlsx`);
}

export { asList };
