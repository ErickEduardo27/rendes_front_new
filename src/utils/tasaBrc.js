import { parseFechaAISO } from '@/utils/fechaFormat';
import {
  esAccesoUsableComoActual,
  fechaReferenciaVigenciaAcceso,
} from '@/utils/accesoVascularValidacion';
import { tipoAccesoDesdeDb } from '@/utils/unidadesActualesPayload';

const FECHA_MIN = '0000-01-01';
const FECHA_MAX = '9999-12-31';

function sumarDias(iso, dias) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + dias));
  return dt.toISOString().slice(0, 10);
}

export function diasInclusivos(inicio, fin) {
  if (!inicio || !fin || fin < inicio) return 0;
  const a = Date.parse(`${inicio}T00:00:00Z`);
  const b = Date.parse(`${fin}T00:00:00Z`);
  return Math.round((b - a) / 86400000) + 1;
}

export function esCateterLargaPermanencia(tipo) {
  const raw = String(tipo || '').trim();
  if (!raw) return false;
  if (/^CVCLP$/i.test(raw)) return true;
  const etiqueta = String(tipoAccesoDesdeDb(raw) || raw).toUpperCase();
  return etiqueta.includes('LARGA PERMANENCIA') || /\bPERMANENTE\b/.test(etiqueta);
}

export function esEventoBrc(evento) {
  const tipo = String(evento?.tipo_infeccion ?? evento?.tpInfeccion ?? '').trim();
  return tipo === '1' || /bacter/i.test(tipo);
}

function esEgresoAtencion(row) {
  return String(row?.tipo_atencion || '').toUpperCase() === 'EGRESO';
}

/**
 * Tramos de permanencia del paciente dentro del periodo, reconstruidos desde la
 * línea de tiempo de ingresos/egresos. Un reingreso en el mismo periodo reactiva
 * la atención cerrada (sobrescribe su fecha_inicio), por eso un egreso sin ingreso
 * previo en el periodo se interpreta como permanencia desde el inicio del mes.
 */
export function tramosAtencionEnPeriodo(atenciones, rango) {
  const eventos = [];
  for (const row of atenciones || []) {
    const estado = String(row?.estado || '').toUpperCase();
    if (estado === 'HISTORICO') continue;
    if (esEgresoAtencion(row)) {
      const fecha = parseFechaAISO(row.fecha_atencion) || parseFechaAISO(row.fecha_fin);
      if (fecha) eventos.push({ fecha, tipo: 'fin' });
      continue;
    }
    const inicio = parseFechaAISO(row.fecha_atencion) || parseFechaAISO(row.fecha_inicio);
    if (inicio) eventos.push({ fecha: inicio, tipo: 'inicio' });
    const fin = parseFechaAISO(row.fecha_fin);
    if (fin && (estado === 'CERRADO' || estado === 'EGRESADO')) {
      eventos.push({ fecha: fin, tipo: 'fin' });
    }
  }

  const vistos = new Set();
  const unicos = eventos.filter((e) => {
    const k = `${e.tipo}|${e.fecha}`;
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  unicos.sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.tipo === 'inicio' ? -1 : 1));

  const tramos = [];
  let activo = false;
  let desde = null;
  for (const e of unicos) {
    if (e.tipo === 'inicio') {
      if (!activo) {
        activo = true;
        desde = e.fecha;
      }
    } else if (activo) {
      tramos.push({ inicio: desde, fin: e.fecha });
      activo = false;
    } else if (!tramos.length) {
      tramos.push({ inicio: rango.min, fin: e.fecha });
    }
  }
  if (activo) tramos.push({ inicio: desde, fin: rango.max });

  return tramos
    .map((t) => ({
      inicio: t.inicio < rango.min ? rango.min : t.inicio,
      fin: t.fin > rango.max ? rango.max : t.fin,
    }))
    .filter((t) => t.inicio <= t.fin);
}

/**
 * Intervalos en que el paciente usó catéter de larga permanencia, según el historial
 * de accesos. Cada acceso rige desde su fecha de vigencia hasta el día previo al siguiente.
 */
export function intervalosCateterPermanente(unidades) {
  const lista = (unidades || [])
    .filter(esAccesoUsableComoActual)
    .map((u) => ({
      tipo: u.tipo_acceso || u.tipo_acceso_actual || '',
      desde: parseFechaAISO(fechaReferenciaVigenciaAcceso(u)) || FECHA_MIN,
      id: Number(u.id_unidad_actual) || 0,
    }))
    .sort((a, b) => a.desde.localeCompare(b.desde) || a.id - b.id);

  const intervalos = [];
  lista.forEach((u, i) => {
    if (!esCateterLargaPermanencia(u.tipo)) return;
    const siguiente = lista.slice(i + 1).find((s) => s.desde > u.desde);
    const hasta = siguiente ? sumarDias(siguiente.desde, -1) : FECHA_MAX;
    if (hasta < u.desde) return;
    const previo = intervalos[intervalos.length - 1];
    if (previo && previo.hasta >= sumarDias(u.desde, -1)) {
      if (hasta > previo.hasta) previo.hasta = hasta;
    } else {
      intervalos.push({ desde: u.desde, hasta });
    }
  });
  return intervalos;
}

/**
 * Filas de la tabla BRC de un paciente: intersección de sus tramos de atención
 * con los intervalos de catéter permanente. Un paciente que egresa y reingresa
 * en el periodo genera una fila por tramo.
 */
export function filasBrcPaciente({ atenciones, unidades, eventos, rango }) {
  const tramos = tramosAtencionEnPeriodo(atenciones, rango);
  const cateter = intervalosCateterPermanente(unidades);
  const filas = [];
  for (const t of tramos) {
    for (const c of cateter) {
      const inicio = t.inicio > c.desde ? t.inicio : c.desde;
      const fin = t.fin < c.hasta ? t.fin : c.hasta;
      if (inicio <= fin) filas.push({ inicio, fin, dias: diasInclusivos(inicio, fin), eventos: 0 });
    }
  }
  filas.sort((a, b) => a.inicio.localeCompare(b.inicio));

  for (const ev of eventos || []) {
    if (!esEventoBrc(ev)) continue;
    const fecha = parseFechaAISO(ev.fecha_evento ?? ev.fe_evento);
    if (!fecha) continue;
    const fila = filas.find((f) => fecha >= f.inicio && fecha <= f.fin);
    if (fila) fila.eventos += 1;
  }
  return filas;
}

export function tasaBrcPorMilDias(eventos, dias) {
  if (!dias) return null;
  return (eventos / dias) * 1000;
}
