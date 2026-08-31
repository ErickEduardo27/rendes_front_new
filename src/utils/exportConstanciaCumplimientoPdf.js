import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat';

const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

const MACROREGION_POR_DEP = {
  '15': 'Lima y Oriente',
  LIMA: 'Lima y Oriente',
};

function parsePeriodoAnioMes(periodoTexto) {
  const txt = String(periodoTexto || '').trim();
  const m = txt.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return { anio: txt || '—', mes: '—' };
  const anio = m[1];
  const mesNum = Number(m[2]);
  const mesNombre = MESES[mesNum - 1] || m[2];
  const mes = `${mesNombre} ${String(mesNum).padStart(2, '0')}`;
  return { anio, mes };
}

function celdaUbigeo(ubigeo, campo, codigoCampo) {
  if (!ubigeo || typeof ubigeo !== 'object') return '—';
  const cod = ubigeo[codigoCampo] || '';
  const nom = ubigeo[campo] || '';
  if (cod && nom) return `${cod} ${nom}`.trim();
  return nom || cod || '—';
}

function macroregionDesdeUbigeo(ubigeo) {
  const cod = String(ubigeo?.codDepartamento_inei || '').trim();
  const dep = String(ubigeo?.departamento || '').trim().toUpperCase();
  return MACROREGION_POR_DEP[cod] || MACROREGION_POR_DEP[dep] || dep || '—';
}

function filaConteo(titulo, c) {
  return [
    titulo,
    String(c?.total ?? 0),
    String(c?.nuevos ?? 0),
    String(c?.reingresos ?? 0),
    String(c?.continuadores ?? 0),
    String(c?.egresados ?? 0),
  ];
}

/**
 * Genera la constancia de cumplimiento (PDF) según formato OECIS.
 * @param {object} datos
 */
export function exportConstanciaCumplimientoPdf(datos) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 12;
  let y = margin;

  const azul = [30, 64, 120];
  doc.setFillColor(...azul);
  doc.rect(margin, y, pageW - margin * 2, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const titulo = 'CONSTANCIA DE CUMPLIMIENTO DE REPORTE DE LA IPRESS DE DIÁLISIS / REGISTRO NACIONAL DE DIÁLISIS';
  doc.text(titulo, pageW / 2, y + 9, { align: 'center', maxWidth: pageW - margin * 2 - 16 });
  if (datos.codigoDocumento) {
    doc.setFontSize(10);
    doc.text(String(datos.codigoDocumento), pageW - margin - 2, y + 5, { align: 'right' });
  }
  y += 18;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Modalidad', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.rect(margin, y, pageW - margin * 2, 7);
  doc.text(String(datos.modalidad || '—'), margin + 2, y + 5);
  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.text('Datos de la Unidad', margin, y);
  y += 5;

  const { anio, mes } = parsePeriodoAnioMes(datos.periodoTexto);
  const ubigeo = datos.ubigeo || {};
  const filasUnidad = [
    ['Macrorregión', macroregionDesdeUbigeo(ubigeo), 'Año', String(anio)],
    ['Departamento', celdaUbigeo(ubigeo, 'departamento', 'codDepartamento_inei'), 'Mes', String(mes)],
    ['Provincia', celdaUbigeo(ubigeo, 'provincia', 'codProvincia_inei'), 'Responsable', String(datos.responsable || '—')],
    ['Distrito', celdaUbigeo(ubigeo, 'distrito', ''), 'Correo', String(datos.correo || '—')],
    ['Unidad', String(datos.unidad || '—'), 'Pacientes', String(datos.pacientes ?? '—')],
    ['Red Asistencial / Centro Especializado', String(datos.redAsistencial || '—'), 'Sesiones', String(datos.sesiones ?? '—')],
    ['Teléfono', String(datos.telefono || '—'), 'Celular', String(datos.celular || '—')],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 1.8, lineColor: [180, 180, 180], lineWidth: 0.2 },
    headStyles: { fillColor: [245, 245, 245], textColor: [30, 30, 30], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold', fillColor: [250, 250, 250] },
      1: { cellWidth: 58 },
      2: { cellWidth: 28, fontStyle: 'bold', fillColor: [250, 250, 250] },
      3: { cellWidth: 58 },
    },
    body: filasUnidad,
  });
  y = doc.lastAutoTable.finalY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Resumen del periodo — pacientes atendidos y registros', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'Condición inicial (ingreso al mes) y condición final (último estado) · periodo, IPRESS y modalidad',
    margin,
    y,
  );
  y += 5;

  const colsResumen = ['Concepto', 'Total', 'Nuevos', 'Reingresos', 'Continuadores', 'Egresos'];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [colsResumen],
    body: [
      filaConteo('Condición inicial', datos.inicial),
      filaConteo('Condición final', datos.final),
      filaConteo('Condición actual', datos.actual),
    ],
    styles: { fontSize: 7.5, cellPadding: 1.8, halign: 'center' },
    headStyles: { fillColor: azul, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' },
    },
  });
  y = doc.lastAutoTable.finalY + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Registros del periodo por módulo', margin, y);
  y += 4;

  const regs = datos.registros || {};
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [['Módulo', 'Cantidad']],
    body: [
      ['Cambio de acceso vascular', String(regs.cambioAccesoVascular ?? 0)],
      ['Eventos infecciosos', String(regs.eventosInfecciosos ?? 0)],
      ['Morbilidad hospitalaria', String(regs.morbilidadHospitalaria ?? 0)],
      ['Resultados clínicos', String(regs.resultadosClinicos ?? 0)],
      ['Calidad de agua', String(regs.calidadAgua ?? 0)],
    ],
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    headStyles: { fillColor: [70, 70, 70], textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 120 }, 1: { halign: 'center' } },
  });
  y = doc.lastAutoTable.finalY + 8;

  const footerY = Math.min(y, 265);
  doc.setDrawColor(160, 160, 160);
  doc.rect(margin, footerY, pageW - margin * 2, 22);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Validado por: ${datos.validadoPor || '—'}`, margin + 3, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Coordinador de Macrorregión Lima y Oriente', margin + 3, footerY + 11);
  doc.text('Oficina de Evaluación Control e Inteligencia Sanitaria', margin + 3, footerY + 16);
  const fechaVal = formatFechaHoraDDMMAAAA(datos.conformidadEn) || formatFechaHoraDDMMAAAA(new Date().toISOString());
  doc.text(String(fechaVal), pageW - margin - 3, footerY + 11, { align: 'right' });

  const stamp = datos.periodoTexto || 'periodo';
  const unidad = (datos.unidad || 'ipress').replace(/[^\w\-]+/g, '_').slice(0, 40);
  doc.save(`constancia_cumplimiento_${stamp}_${unidad}.pdf`);
}
