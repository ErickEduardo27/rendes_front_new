<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-4"
      @click.self="cerrar"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        <div class="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50/50 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <ChartBarIcon class="w-5 h-5 text-cyan-600 shrink-0" />
              Historial de resultados clínicos
            </h3>
            <p class="text-sm text-slate-600 mt-0.5 truncate">
              {{ nombre || 'Paciente' }}
              <span v-if="documento" class="text-slate-400"> · DNI {{ documento }}</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">Tendencia por periodo de los valores de laboratorio</p>
          </div>
          <button
            type="button"
            class="shrink-0 text-slate-400 hover:text-slate-700 text-xl leading-none px-1"
            aria-label="Cerrar"
            @click="cerrar"
          >
            ×
          </button>
        </div>

        <div class="p-5 overflow-y-auto flex-1 space-y-5">
          <div v-if="cargando" class="py-14 text-center text-sm text-slate-400">
            Cargando historial de resultados clínicos…
          </div>

          <template v-else-if="puntos.length === 0">
            <div class="py-14 text-center text-sm text-slate-400 italic">
              Este paciente no tiene resultados clínicos registrados.
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Registros</p>
                <p class="text-2xl font-bold text-slate-800">{{ puntos.length }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Periodos</p>
                <p class="text-2xl font-bold text-cyan-700">{{ resumen.periodos }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Último Hb</p>
                <p class="text-2xl font-bold text-rose-700">{{ resumen.ultimoHb }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Último Kt/V</p>
                <p class="text-2xl font-bold text-indigo-700">{{ resumen.ultimoKtv }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="serie in seriesDisponibles"
                :key="serie.key"
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                :class="serieActiva === serie.key
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                @click="serieActiva = serie.key"
              >
                {{ serie.label }}
              </button>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                {{ etiquetaSerieActiva }} por periodo
              </p>
              <svg
                :viewBox="`0 0 ${chartGeom.width} ${chartGeom.height}`"
                class="w-full h-auto"
                role="img"
                :aria-label="`Gráfico de ${etiquetaSerieActiva}`"
              >
                <line
                  :x1="chartGeom.padL"
                  :y1="chartGeom.padT + chartGeom.plotH"
                  :x2="chartGeom.padL + chartGeom.plotW"
                  :y2="chartGeom.padT + chartGeom.plotH"
                  stroke="#cbd5e1"
                  stroke-width="1"
                />
                <line
                  :x1="chartGeom.padL"
                  :y1="chartGeom.padT"
                  :x2="chartGeom.padL"
                  :y2="chartGeom.padT + chartGeom.plotH"
                  stroke="#cbd5e1"
                  stroke-width="1"
                />
                <text
                  :x="chartGeom.padL - 4"
                  :y="chartGeom.padT + 4"
                  text-anchor="end"
                  class="fill-slate-400"
                  font-size="9"
                >
                  {{ chartGeom.yMaxLabel }}
                </text>
                <text
                  :x="chartGeom.padL - 4"
                  :y="chartGeom.padT + chartGeom.plotH"
                  text-anchor="end"
                  class="fill-slate-400"
                  font-size="9"
                >
                  {{ chartGeom.yMinLabel }}
                </text>
                <polyline
                  v-if="chartGeom.pointsAttr"
                  fill="none"
                  :stroke="chartGeom.color"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  :points="chartGeom.pointsAttr"
                />
                <g v-for="(pt, idx) in chartGeom.puntos" :key="idx">
                  <circle
                    :cx="pt.x"
                    :cy="pt.y"
                    r="4"
                    :fill="chartGeom.color"
                    stroke="#fff"
                    stroke-width="1.5"
                  />
                  <text
                    :x="pt.x"
                    :y="pt.y - 8"
                    text-anchor="middle"
                    class="fill-slate-700 font-semibold"
                    font-size="9"
                  >
                    {{ pt.label }}
                  </text>
                  <text
                    :x="pt.x"
                    :y="chartGeom.padT + chartGeom.plotH + 14"
                    text-anchor="middle"
                    class="fill-slate-500"
                    font-size="8"
                  >
                    {{ pt.periodoCorto }}
                  </text>
                </g>
              </svg>
              <p v-if="!chartGeom.puntos.length" class="text-sm text-slate-400 italic text-center py-6">
                Sin valores numéricos de {{ etiquetaSerieActiva }} en el historial.
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 overflow-hidden">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 px-4 py-3 bg-slate-50 border-b border-slate-100">
                Detalle por periodo
              </p>
              <div class="overflow-x-auto">
                <table class="min-w-full text-xs">
                  <thead class="bg-slate-50 text-slate-600">
                    <tr>
                      <th class="px-3 py-2 text-left font-semibold">Periodo</th>
                      <th class="px-3 py-2 text-right font-semibold">Hb</th>
                      <th class="px-3 py-2 text-right font-semibold">Calcio</th>
                      <th class="px-3 py-2 text-right font-semibold">Fósforo</th>
                      <th class="px-3 py-2 text-right font-semibold">PTHi</th>
                      <th class="px-3 py-2 text-right font-semibold">Alb</th>
                      <th class="px-3 py-2 text-right font-semibold">Kt/V</th>
                      <th class="px-3 py-2 text-left font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="(p, idx) in puntosOrdenadosDesc" :key="p.id || idx" class="hover:bg-slate-50">
                      <td class="px-3 py-2 font-medium text-slate-800">{{ p.periodoLabel }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.hb) }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.calcio) }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.fosforo) }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.pthi) }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.alb) }}</td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ fmt(p.ktv) }}</td>
                      <td class="px-3 py-2 text-slate-600">{{ p.estado || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import { getAllIpress } from '@/services/ipress/Ipress.service';

const props = defineProps({
  visible: { type: Boolean, default: false },
  idPaciente: { type: [Number, String], default: null },
  nombre: { type: String, default: '' },
  documento: { type: String, default: '' },
  idIpress: { type: [Number, String], default: null },
});

const emit = defineEmits(['update:visible']);

const cargando = ref(false);
const puntos = ref([]);
const serieActiva = ref('hb');

const SERIES = [
  { key: 'hb', label: 'Hb', color: '#e11d48' },
  { key: 'calcio', label: 'Calcio', color: '#0891b2' },
  { key: 'fosforo', label: 'Fósforo', color: '#7c3aed' },
  { key: 'pthi', label: 'PTHi', color: '#ea580c' },
  { key: 'alb', label: 'Alb', color: '#0d9488' },
  { key: 'ktv', label: 'Kt/V', color: '#4f46e5' },
];

const CHART_W = 640;
const CHART_H = 220;
const PAD = { top: 24, right: 16, bottom: 40, left: 36 };

const seriesDisponibles = SERIES;
const etiquetaSerieActiva = computed(() => SERIES.find((s) => s.key === serieActiva.value)?.label || '');

function asList(res) {
  return Array.isArray(res) ? res : (res?.results || []);
}

function num(val) {
  if (val == null || val === '') return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function fmt(val) {
  if (val == null || val === '') return '—';
  const n = Number(val);
  if (!Number.isFinite(n)) return String(val);
  return n.toLocaleString('es-PE', { maximumFractionDigits: 2 });
}

function etiquetaPeriodo(item) {
  const p = item?.datosPacienteAtencion?.datosPeriodo?.periodo;
  if (p) return String(p);
  const id = item?.datosPacienteAtencion?.id_periodo ?? item?.id_periodo;
  return id != null ? `Periodo ${id}` : '—';
}

function periodoCorto(label) {
  const t = String(label ?? '—');
  if (t.length <= 7) return t;
  const partes = t.split('-');
  if (partes.length >= 2) return `${partes[1]}/${partes[0].slice(-2)}`;
  return t.slice(0, 7);
}

function ordenPeriodo(label) {
  const t = String(label || '');
  const m = t.match(/^(\d{4})-(\d{1,2})/);
  if (m) return Number(m[1]) * 100 + Number(m[2]);
  return 0;
}

const puntosOrdenadosAsc = computed(() => (
  [...puntos.value].sort((a, b) => ordenPeriodo(a.periodoLabel) - ordenPeriodo(b.periodoLabel)
    || (Number(a.id) || 0) - (Number(b.id) || 0))
));

const puntosOrdenadosDesc = computed(() => [...puntosOrdenadosAsc.value].reverse());

const resumen = computed(() => {
  const lista = puntosOrdenadosAsc.value;
  const periodos = new Set(lista.map((p) => p.periodoLabel).filter(Boolean));
  const ultimo = lista[lista.length - 1];
  return {
    periodos: periodos.size,
    ultimoHb: fmt(ultimo?.hb),
    ultimoKtv: fmt(ultimo?.ktv),
  };
});

const chartGeom = computed(() => {
  const key = serieActiva.value;
  const color = SERIES.find((s) => s.key === key)?.color || '#0891b2';
  const serie = puntosOrdenadosAsc.value
    .map((p) => ({
      periodoLabel: p.periodoLabel,
      periodoCorto: periodoCorto(p.periodoLabel),
      valor: p[key],
    }))
    .filter((p) => p.valor != null);

  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  if (!serie.length) {
    return {
      width: CHART_W,
      height: CHART_H,
      padL: PAD.left,
      padT: PAD.top,
      plotW,
      plotH,
      yMaxLabel: '—',
      yMinLabel: '—',
      color,
      pointsAttr: '',
      puntos: [],
    };
  }

  const vals = serie.map((s) => s.valor);
  let yMin = Math.min(...vals);
  let yMax = Math.max(...vals);
  if (yMin === yMax) {
    yMin = yMin - 1;
    yMax = yMax + 1;
  }
  const padY = (yMax - yMin) * 0.08;
  yMin -= padY;
  yMax += padY;
  const n = serie.length;
  const step = n > 1 ? plotW / (n - 1) : 0;

  const puntosGeom = serie.map((s, i) => {
    const x = PAD.left + (n > 1 ? i * step : plotW / 2);
    const y = PAD.top + plotH - ((s.valor - yMin) / (yMax - yMin)) * plotH;
    return {
      x,
      y,
      label: fmt(s.valor),
      periodoCorto: s.periodoCorto,
    };
  });

  return {
    width: CHART_W,
    height: CHART_H,
    padL: PAD.left,
    padT: PAD.top,
    plotW,
    plotH,
    yMaxLabel: fmt(yMax),
    yMinLabel: fmt(yMin),
    color,
    pointsAttr: puntosGeom.map((p) => `${p.x},${p.y}`).join(' '),
    puntos: puntosGeom,
  };
});

function cerrar() {
  emit('update:visible', false);
}

function mapResultado(r) {
  return {
    id: r.id_resultado_clinico,
    periodoLabel: etiquetaPeriodo(r),
    hb: num(r.Hb ?? r.hb),
    calcio: num(r.calcio),
    fosforo: num(r.fosforo),
    pthi: num(r.PTHi ?? r.pthi),
    alb: num(r.Alb ?? r.alb),
    ktv: num(r.ktv),
    estado: r.estado_aprobacion || 'PENDIENTE',
  };
}

async function cargarHistorial() {
  const id = props.idPaciente;
  if (id == null || id === '') {
    puntos.value = [];
    return;
  }
  cargando.value = true;
  try {
    const paramsAt = new URLSearchParams({ id_paciente: String(id) });
    if (props.idIpress != null && props.idIpress !== '') {
      paramsAt.set('id_ipress', String(props.idIpress));
    }
    const resAt = await getAllIpress(`/pacienteAtencion/?${paramsAt.toString()}`);
    const atenciones = asList(resAt);
    const idsAtencion = [...new Set(
      atenciones.map((a) => a.id_paciente_atencion).filter((x) => x != null && x !== ''),
    )];
    if (!idsAtencion.length) {
      puntos.value = [];
      return;
    }
    const respuestas = await Promise.all(
      idsAtencion.map((idAt) =>
        getAllIpress(`/resultadosClinicos/?id_paciente_atencion=${idAt}`).catch(() => []),
      ),
    );
    const lista = respuestas.flatMap((r) => asList(r)).map(mapResultado);
    // Un registro por periodo (el de mayor id)
    const porPeriodo = new Map();
    lista.forEach((item) => {
      const key = item.periodoLabel || String(item.id);
      const prev = porPeriodo.get(key);
      if (!prev || (Number(item.id) || 0) > (Number(prev.id) || 0)) {
        porPeriodo.set(key, item);
      }
    });
    puntos.value = [...porPeriodo.values()];
  } catch (e) {
    console.error('Error al cargar historial de resultados clínicos:', e);
    puntos.value = [];
  } finally {
    cargando.value = false;
  }
}

watch(
  () => [props.visible, props.idPaciente, props.idIpress],
  ([vis, id]) => {
    if (vis && id != null && id !== '') cargarHistorial();
    if (!vis) puntos.value = [];
  },
);
</script>
