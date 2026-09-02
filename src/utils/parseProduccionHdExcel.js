import * as XLSX from 'xlsx';

function cellStr(value) {
  if (value == null) return '';
  return String(value).trim();
}

function parseIntCell(value) {
  const digits = cellStr(value).replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function parseTimeMinutes(value) {
  const text = cellStr(value).replace(/\s/g, '');
  if (!text || text === ':' || text === '::' || text === ':  :') return null;
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function parseHoraInicio(value) {
  const text = cellStr(value).replace(/\s/g, '');
  if (!text || text === ':' || text === '::' || text === ':  :') return null;
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function colTiempoHd(day) {
  return 9 + day;
}

function colHoraInicioHd(day) {
  return 105 + day;
}

function minutesToHhmm(totalMinutes) {
  const minutes = Number(totalMinutes) || 0;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function extractHeaderRow(rows, rowIdx) {
  const row = rows[rowIdx] || [];
  let mes = '';
  let ipress = '';
  row.forEach((cell, col) => {
    const label = cellStr(cell).toUpperCase();
    if (label === 'MES DE CONSULTA:') mes = cellStr(row[col + 1]);
    if (label.includes('IPRESS')) {
      const candidate = cellStr(row[col + 1]);
      if (candidate) ipress = candidate;
    }
  });
  return { mes, ipress };
}

function findFooterTotals(rows) {
  let totalPacientes = null;
  let programadas = null;
  let ejecutadas = null;
  let adicionales = null;
  rows.forEach((row, rowIdx) => {
    const label = cellStr(row[0]).toLowerCase();
    if (label.startsWith('cantidad pacientes')) totalPacientes = parseIntCell(row[1]);
    if (label.startsWith('total atenciones')) {
      const next = rows[rowIdx + 1] || [];
      programadas = parseIntCell(next[7]);
      ejecutadas = parseIntCell(next[8]);
      adicionales = parseIntCell(next[9]);
    }
  });
  return { totalPacientes, programadas, ejecutadas, adicionales };
}

/**
 * Parsea el reporte RptProdAtenHDA (.xls/.xlsx) en el navegador.
 * @param {ArrayBuffer} buffer
 * @returns {{ resumen: object, detalle: object[] }}
 */
export function parseProduccionHdExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });

  const { mes, ipress } = extractHeaderRow(rows, 4);
  const footer = findFooterTotals(rows);

  let dataEnd = rows.length;
  for (let row = 8; row < rows.length; row += 1) {
    if (cellStr(rows[row]?.[0]).toLowerCase().startsWith('cantidad pacientes')) {
      dataEnd = row;
      break;
    }
  }

  const detalle = [];
  let totalSesionesTiempo = 0;

  for (let row = 8; row < dataEnd; row += 1) {
    const line = rows[row] || [];
    const tipoDocumento = cellStr(line[0]);
    if (!tipoDocumento) continue;

    const tiemposPorDia = {};
    const horasInicioPorDia = {};
    let tiempoTotalMinutos = 0;
    let sesionesConTiempo = 0;

    for (let day = 1; day <= 31; day += 1) {
      const minutes = parseTimeMinutes(line[colTiempoHd(day)]);
      if (minutes != null) {
        tiemposPorDia[String(day)] = minutesToHhmm(minutes);
        tiempoTotalMinutos += minutes;
        sesionesConTiempo += 1;
      }
      const horaInicio = parseHoraInicio(line[colHoraInicioHd(day)]);
      if (horaInicio != null) {
        horasInicioPorDia[String(day)] = horaInicio;
      }
    }

    totalSesionesTiempo += sesionesConTiempo;
    detalle.push({
      tipo_documento: tipoDocumento,
      numero_documento: cellStr(line[1]),
      apellidos_nombres: cellStr(line[2]),
      edad: cellStr(line[3]),
      sexo: cellStr(line[4]),
      direccion: cellStr(line[5]),
      telefono: cellStr(line[6]),
      atenciones_programadas: parseIntCell(line[7]),
      atenciones_ejecutadas: parseIntCell(line[8]),
      atenciones_adicionales: parseIntCell(line[9]),
      sesiones_con_tiempo: sesionesConTiempo,
      tiempo_total_minutos: tiempoTotalMinutos,
      tiempo_total_hhmm: minutesToHhmm(tiempoTotalMinutos),
      tiempos_por_dia: tiemposPorDia,
      horas_inicio_por_dia: horasInicioPorDia,
    });
  }

  const resumen = {
    mes_consulta_excel: mes,
    ipress_excel: ipress,
    total_pacientes: footer.totalPacientes ?? detalle.length,
    atenciones_programadas: footer.programadas,
    atenciones_ejecutadas: footer.ejecutadas,
    atenciones_adicionales: footer.adicionales,
    total_sesiones_tiempo: totalSesionesTiempo,
  };

  return { resumen, detalle };
}

export function diasDetallePaciente(row) {
  if (!row) return [];
  const tiempos = row.tiempos_por_dia || {};
  const inicios = row.horas_inicio_por_dia || {};
  const dias = new Set([...Object.keys(tiempos), ...Object.keys(inicios)]);
  return [...dias]
    .sort((a, b) => Number(a) - Number(b))
    .map((dia) => ({
      dia,
      tiempo: tiempos[dia] || null,
      hora_inicio: inicios[dia] || null,
    }));
}

export function formatMinutosAHhmm(totalMinutes) {
  return minutesToHhmm(totalMinutes);
}

export function sumarDetalleImportacion(detalle = []) {
  return detalle.reduce((acc, row) => {
    acc.pacientes += 1;
    acc.atenciones_programadas += Number(row.atenciones_programadas) || 0;
    acc.atenciones_ejecutadas += Number(row.atenciones_ejecutadas) || 0;
    acc.atenciones_adicionales += Number(row.atenciones_adicionales) || 0;
    acc.sesiones_con_tiempo += Number(row.sesiones_con_tiempo) || 0;
    acc.tiempo_total_minutos += Number(row.tiempo_total_minutos) || 0;
    return acc;
  }, {
    pacientes: 0,
    atenciones_programadas: 0,
    atenciones_ejecutadas: 0,
    atenciones_adicionales: 0,
    sesiones_con_tiempo: 0,
    tiempo_total_minutos: 0,
  });
}
