<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-4"
      @click.self="cerrar"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        <div class="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-rose-50/40 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <ChartBarIcon class="w-5 h-5 text-rose-600 shrink-0" />
              Tendencia de infecciones
            </h3>
            <p class="text-sm text-slate-600 mt-0.5 truncate">
              {{ nombre || 'Paciente' }}
              <span v-if="documento" class="text-slate-400"> · DNI {{ documento }}</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">Línea de tiempo por periodo — recurrencias e historial completo</p>
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
            Cargando historial de infecciones…
          </div>

          <template v-else-if="eventos.length === 0">
            <div class="py-14 text-center text-sm text-slate-400 italic">
              Este paciente no tiene eventos infecciosos registrados en el sistema.
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Total eventos</p>
                <p class="text-2xl font-bold text-slate-800">{{ resumen.total }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Periodos con evento</p>
                <p class="text-2xl font-bold text-indigo-700">{{ resumen.periodos }}</p>
              </div>
              <div class="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-amber-700">Recurrencias</p>
                <p class="text-2xl font-bold text-amber-800">{{ resumen.recurrencias }}</p>
                <p class="text-[10px] text-amber-600 mt-0.5">≥ 2 eventos en un periodo</p>
              </div>
              <div class="rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wide text-rose-700">Hemocultivo (+)</p>
                <p class="text-2xl font-bold text-rose-800">{{ resumen.hemocultivoPositivo }}</p>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Eventos por periodo</p>
              <svg
                :viewBox="`0 0 ${chartGeom.width} ${chartGeom.height}`"
                class="w-full h-auto"
                role="img"
                aria-label="Gráfico de eventos infecciosos por periodo"
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
                  {{ chartGeom.yMax }}
                </text>
                <g v-for="(barra, idx) in chartGeom.barras" :key="idx">
                  <rect
                    :x="barra.x"
                    :y="barra.y"
                    :width="barra.w"
                    :height="barra.h"
                    :fill="barra.recurrente ? '#f59e0b' : '#e11d48'"
                    rx="3"
                    opacity="0.85"
                  />
                  <text
                    :x="barra.x + barra.w / 2"
                    :y="barra.y - 4"
                    text-anchor="middle"
                    class="fill-slate-700 font-semibold"
                    font-size="9"
                  >
                    {{ barra.cantidad }}
                  </text>
                  <text
                    :x="barra.x + barra.w / 2"
                    :y="chartGeom.padT + chartGeom.plotH + 14"
                    text-anchor="middle"
                    class="fill-slate-500"
                    font-size="8"
                  >
                    {{ barra.periodoCorto }}
                  </text>
                </g>
              </svg>
              <p class="text-[11px] text-slate-400 mt-2 text-center">
                Barras ámbar: periodos con recurrencia (más de un evento)
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 overflow-hidden">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 px-4 py-3 bg-slate-50 border-b border-slate-100">
                Línea de tiempo detallada
              </p>
              <div class="relative px-4 py-5">
                <div class="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200" aria-hidden="true" />
                <ul class="space-y-4">
                  <li
                    v-for="(ev, idx) in eventosOrdenados"
                    :key="ev.id_evento_acceso_vascular || idx"
                    class="relative pl-10"
                  >
                    <span
                      class="absolute left-4 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                      :style="{ backgroundColor: colorTipo(ev.tipo_infeccion) }"
                      :title="ev.tipo_infeccion || 'Evento'"
                    />
                    <div class="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                      <div class="flex flex-wrap items-center gap-2 text-sm">
                        <span class="font-semibold text-slate-800">{{ ev.periodoLabel }}</span>
                        <span class="text-slate-400">·</span>
                        <span class="text-slate-600">{{ ev.fecha_evento || 'Sin fecha' }}</span>
                        <span
                          class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          :style="{ backgroundColor: colorTipo(ev.tipo_infeccion) + '22', color: colorTipo(ev.tipo_infeccion) }"
                        >
                          {{ ev.tipo_infeccion || 'Sin tipo' }}
                        </span>
                      </div>
                      <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                        <span>Antimicrobiano: {{ ev.antmicrobial || '—' }}</span>
                        <span>Vancomicina: {{ ev.vancomicina || '—' }}</span>
                        <span>Hemocultivo: {{ ev.hemocultivo_positivo || '—' }}</span>
                        <span v-if="ev.germen">Germen: {{ ev.germen }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
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
});

const emit = defineEmits(['update:visible']);

const cargando = ref(false);
const eventos = ref([]);

const COLORES_TIPO = {
  bacteriemia: '#dc2626',
  'infección de catéter': '#ea580c',
  'infeccion de cateter': '#ea580c',
  peritonitis: '#7c3aed',
  'infección de fístula': '#0891b2',
  'infeccion de fistula': '#0891b2',
  'infección de injerto': '#0d9488',
  'infeccion de injerto': '#0d9488',
  default: '#64748b',
};

const CHART_W = 520;
const CHART_H = 200;
const PAD = { top: 20, right: 12, bottom: 40, left: 28 };

function colorTipo(tipo) {
  const k = String(tipo || '').trim().toLowerCase();
  return COLORES_TIPO[k] || COLORES_TIPO.default;
}

function etiquetaPeriodo(item) {
  const p = item?.datosPacienteAtencion?.datosPeriodo?.periodo;
  if (p) return String(p);
  const id = item?.datosPacienteAtencion?.id_periodo;
  return id != null ? `Periodo ${id}` : '—';
}

function periodoCorto(label) {
  const t = String(label ?? '—');
  if (t.length <= 7) return t;
  const partes = t.split('-');
  if (partes.length >= 2) return `${partes[1]}/${partes[0].slice(-2)}`;
  return t.slice(0, 7);
}

function parseFechaOrden(fecha) {
  const s = String(fecha || '').trim();
  if (!s) return 0;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])).getTime();
  return 0;
}

function esHemocultivoPositivo(valor) {
  const v = String(valor || '').trim().toUpperCase();
  return v === 'SÍ' || v === 'SI' || v === 'S' || v === '1' || v === 'TRUE';
}

const eventosOrdenados = computed(() => {
  return [...eventos.value]
    .map((ev) => ({
      ...ev,
      periodoLabel: etiquetaPeriodo(ev),
      _orden: parseFechaOrden(ev.fecha_evento),
    }))
    .sort((a, b) => b._orden - a._orden);
});

const resumen = computed(() => {
  const lista = eventos.value;
  const porPeriodo = {};
  let hemocultivoPositivo = 0;
  lista.forEach((ev) => {
    const pl = etiquetaPeriodo(ev);
    porPeriodo[pl] = (porPeriodo[pl] || 0) + 1;
    if (esHemocultivoPositivo(ev.hemocultivo_positivo)) hemocultivoPositivo += 1;
  });
  const conteos = Object.values(porPeriodo);
  const recurrencias = conteos.filter((n) => n >= 2).length;
  return {
    total: lista.length,
    periodos: Object.keys(porPeriodo).length,
    recurrencias,
    hemocultivoPositivo,
  };
});

const chartGeom = computed(() => {
  const agrupado = {};
  eventos.value.forEach((ev) => {
    const pl = etiquetaPeriodo(ev);
    if (!agrupado[pl]) agrupado[pl] = { periodo: pl, cantidad: 0 };
    agrupado[pl].cantidad += 1;
  });
  const serie = Object.values(agrupado).sort((a, b) => {
    const pa = a.periodo;
    const pb = b.periodo;
    return pa.localeCompare(pb);
  });

  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const yMax = Math.max(1, ...serie.map((s) => s.cantidad));
  const n = Math.max(serie.length, 1);
  const gap = 8;
  const barW = Math.max(12, (plotW - gap * (n - 1)) / n);

  const barras = serie.map((s, i) => {
    const h = (s.cantidad / yMax) * plotH;
    return {
      x: PAD.left + i * (barW + gap),
      y: PAD.top + plotH - h,
      w: barW,
      h,
      cantidad: s.cantidad,
      periodoCorto: periodoCorto(s.periodo),
      recurrente: s.cantidad >= 2,
    };
  });

  return {
    width: CHART_W,
    height: CHART_H,
    padL: PAD.left,
    padT: PAD.top,
    plotW,
    plotH,
    yMax,
    barras,
  };
});

function cerrar() {
  emit('update:visible', false);
}

async function cargarHistorial() {
  const id = props.idPaciente;
  if (id == null || id === '') {
    eventos.value = [];
    return;
  }
  cargando.value = true;
  try {
    const res = await getAllIpress(`/eventosAccesosVasculares/?id_paciente=${id}`);
    eventos.value = Array.isArray(res) ? res : res?.results || [];
  } catch (e) {
    console.error('Error al cargar historial de infecciones:', e);
    eventos.value = [];
  } finally {
    cargando.value = false;
  }
}

watch(
  () => [props.visible, props.idPaciente],
  ([vis, id]) => {
    if (vis && id != null && id !== '') cargarHistorial();
    if (!vis) eventos.value = [];
  },
);
</script>
