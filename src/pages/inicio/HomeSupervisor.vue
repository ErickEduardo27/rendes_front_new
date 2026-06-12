<template>
  <div class="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-white min-h-full">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-800">Panel de supervisión</h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Resumen de clínicas asignadas · {{ authStore.user?.nombre || authStore.user?.usuario || 'Supervisor' }}
        </p>
      </div>
      <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
        <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Periodo</span>
        <el-config-provider :locale="locale">
          <el-date-picker
            v-model="fechaVisual"
            type="month"
            placeholder="Mes"
            format="YYYY-MM"
            value-format="YYYY-MM"
            :editable="false"
            :clearable="false"
            style="width: 130px"
            :disabled-date="esFechaDeshabilitada"
            @change="procesarCambioPeriodo"
          />
        </el-config-provider>
      </div>
    </header>

    <div v-if="cargando" class="text-center py-16 text-slate-500 text-sm">Cargando estadísticas…</div>
    <div v-else-if="error" class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{{ error }}</div>

    <template v-else-if="datos">
      <!-- Tarjetas resumen -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Clínicas</p>
          <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{{ datos.resumen.total_clinicas }}</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Pacientes</p>
          <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{{ datos.resumen.total_pacientes }}</p>
          <p class="text-[10px] text-slate-400 mt-0.5">Periodo {{ datos.periodo }}</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Registros</p>
          <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{{ datos.resumen.total_registros }}</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Notificadas</p>
          <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            {{ datos.resumen.total_notificados }}<span class="text-base font-normal text-slate-400">/{{ datos.resumen.total_clinicas }}</span>
          </p>
          <p class="text-[10px] text-slate-400 mt-0.5">Enviaron a revisión</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Pacientes por clínica -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 class="text-sm font-bold text-slate-700 mb-4">Pacientes por clínica</h2>
          <div v-if="!datos.clinicas.length" class="text-xs text-slate-400 py-6 text-center">Sin clínicas asignadas</div>
          <div v-else class="space-y-2.5">
            <div v-for="c in datos.clinicas" :key="'p-' + c.id_ipress" class="flex items-center gap-2">
              <span class="text-[11px] text-slate-600 w-28 sm:w-36 truncate shrink-0" :title="c.nombre_corto || c.ipress">
                {{ c.nombre_corto || c.ipress }}
              </span>
              <div class="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                <div
                  class="h-full bg-cyan-600 rounded transition-all duration-500"
                  :style="{ width: barWidth(c.total_pacientes, maxPacientes) }"
                />
              </div>
              <span class="text-xs font-semibold text-slate-700 w-8 text-right">{{ c.total_pacientes }}</span>
            </div>
          </div>
        </div>

        <!-- Registros por formulario -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 class="text-sm font-bold text-slate-700 mb-4">Registros por formulario (todas las clínicas)</h2>
          <div class="space-y-2.5">
            <div v-for="f in formulariosChart" :key="f.key" class="flex items-center gap-2">
              <span class="text-[11px] text-slate-600 w-28 sm:w-36 truncate shrink-0">{{ f.label }}</span>
              <div class="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                <div
                  class="h-full rounded transition-all duration-500 bg-cyan-600"
                  :style="{ width: barWidth(f.valor, maxFormularios), opacity: f.opacity }"
                />
              </div>
              <span class="text-xs font-semibold text-slate-700 w-8 text-right">{{ f.valor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Registros por clínica (stacked bars simplified) -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
        <h2 class="text-sm font-bold text-slate-700 mb-4">Registros por clínica</h2>
        <div v-if="!datos.clinicas.length" class="text-xs text-slate-400 py-4 text-center">Sin datos</div>
        <div v-else class="space-y-3 min-w-[320px]">
          <div v-for="c in datos.clinicas" :key="'r-' + c.id_ipress">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-slate-700 truncate max-w-[60%]" :title="c.ipress">
                {{ c.nombre_corto || c.ipress }}
              </span>
              <span class="text-[10px] text-slate-500">{{ c.registros.total }} registros</span>
            </div>
            <div class="flex h-4 rounded overflow-hidden bg-slate-100">
              <div
                v-for="seg in segmentosClinica(c)"
                :key="seg.key"
                class="h-full transition-all duration-500 bg-cyan-600"
                :style="{ width: barWidth(seg.valor, c.registros.total || 1), opacity: seg.opacity }"
                :title="`${seg.label}: ${seg.valor}`"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100">
          <span v-for="f in formulariosChart" :key="'leg-' + f.key" class="inline-flex items-center gap-1 text-[10px] text-slate-600">
            <span class="w-2.5 h-2.5 rounded-sm bg-cyan-600" :style="{ opacity: f.opacity }" />
            {{ f.label }}
          </span>
        </div>
      </div>

      <!-- Tabla detalle -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <h2 class="text-sm font-bold text-slate-700">Detalle por clínica — {{ datos.periodo }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wide">
              <tr>
                <th class="px-3 py-2 font-semibold">Clínica</th>
                <th class="px-3 py-2 font-semibold">Modalidad</th>
                <th class="px-3 py-2 font-semibold text-center">Pacientes</th>
                <th class="px-3 py-2 font-semibold text-center">Activos</th>
                <th class="px-3 py-2 font-semibold text-center">Acc. Vasc.</th>
                <th class="px-3 py-2 font-semibold text-center">Infecc.</th>
                <th class="px-3 py-2 font-semibold text-center">Morb.</th>
                <th class="px-3 py-2 font-semibold text-center">Res. Clín.</th>
                <th class="px-3 py-2 font-semibold text-center">Vacun.</th>
                <th class="px-3 py-2 font-semibold text-center">Revisión</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="c in datos.clinicas" :key="c.id_ipress" class="hover:bg-cyan-50/40">
                <td class="px-3 py-2 font-medium text-slate-800 max-w-[140px] truncate" :title="c.ipress">
                  {{ c.nombre_corto || c.ipress }}
                </td>
                <td class="px-3 py-2 text-slate-600">{{ c.modalidad || '—' }}</td>
                <td class="px-3 py-2 text-center font-semibold text-slate-800">{{ c.total_pacientes }}</td>
                <td class="px-3 py-2 text-center">{{ c.pacientes_activos }}</td>
                <td class="px-3 py-2 text-center">{{ c.registros.acceso_vascular }}</td>
                <td class="px-3 py-2 text-center">{{ c.registros.infecciones }}</td>
                <td class="px-3 py-2 text-center">{{ c.registros.morbilidad }}</td>
                <td class="px-3 py-2 text-center">{{ c.registros.resultados }}</td>
                <td class="px-3 py-2 text-center">{{ c.registros.vacunacion }}</td>
                <td class="px-3 py-2 text-center">
                  <span
                    class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    :class="c.notificado ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'"
                  >
                    {{ c.notificado ? 'Notificado' : 'Pendiente' }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="datos.clinicas.length" class="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <td class="px-3 py-2" colspan="2">Total</td>
                <td class="px-3 py-2 text-center">{{ datos.resumen.total_pacientes }}</td>
                <td class="px-3 py-2 text-center">—</td>
                <td class="px-3 py-2 text-center">{{ datos.por_formulario.acceso_vascular }}</td>
                <td class="px-3 py-2 text-center">{{ datos.por_formulario.infecciones }}</td>
                <td class="px-3 py-2 text-center">{{ datos.por_formulario.morbilidad }}</td>
                <td class="px-3 py-2 text-center">{{ datos.por_formulario.resultados }}</td>
                <td class="px-3 py-2 text-center">{{ datos.por_formulario.vacunacion }}</td>
                <td class="px-3 py-2 text-center">{{ datos.resumen.total_notificados }}/{{ datos.resumen.total_clinicas }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { useAuthStore } from '@/store/auth';
import { ElConfigProvider } from 'element-plus';
import es from 'element-plus/dist/locale/es.mjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const authStore = useAuthStore();
const locale = ref(es);
const periodos = ref([]);
const fechaVisual = ref('');
const idPeriodo = ref(null);
const datos = ref(null);
const cargando = ref(false);
const error = ref('');

const FORMULARIOS_META = [
  { key: 'acceso_vascular', label: 'Acceso vascular', opacity: 1 },
  { key: 'infecciones', label: 'Infecciones', opacity: 0.85 },
  { key: 'morbilidad', label: 'Morbilidad', opacity: 0.7 },
  { key: 'resultados', label: 'Resultados clínicos', opacity: 0.55 },
  { key: 'vacunacion', label: 'Vacunación', opacity: 0.4 },
];

const formulariosChart = computed(() => {
  if (!datos.value?.por_formulario) return [];
  return FORMULARIOS_META.map((f) => ({
    ...f,
    valor: datos.value.por_formulario[f.key] ?? 0,
  }));
});

const maxPacientes = computed(() => {
  if (!datos.value?.clinicas?.length) return 1;
  return Math.max(1, ...datos.value.clinicas.map((c) => c.total_pacientes));
});

const maxFormularios = computed(() => {
  if (!formulariosChart.value.length) return 1;
  return Math.max(1, ...formulariosChart.value.map((f) => f.valor));
});

function barWidth(valor, max) {
  const pct = max > 0 ? Math.round((valor / max) * 100) : 0;
  return `${Math.max(valor > 0 ? 4 : 0, pct)}%`;
}

function segmentosClinica(c) {
  const r = c.registros || {};
  return FORMULARIOS_META.map((f) => ({
    key: f.key,
    label: f.label,
    valor: r[f.key] ?? 0,
    opacity: f.opacity,
  })).filter((s) => s.valor > 0);
}

const esFechaDeshabilitada = (time) => {
  if (periodos.value.length === 0) return true;
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, '0');
  const fechaCalendario = `${year}-${month}`;
  return !periodos.value.some((p) => p.periodo === fechaCalendario);
};

async function fetchPeriodos() {
  const respuesta = await getAllIpress('/periodos/');
  periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  if (periodos.value.length) {
    const primero = periodos.value[0];
    fechaVisual.value = primero.periodo;
    idPeriodo.value = primero.id_periodo;
  }
}

function procesarCambioPeriodo(fecha) {
  if (!fecha) return;
  const encontrado = periodos.value.find((p) => p.periodo === fecha);
  if (encontrado) {
    idPeriodo.value = encontrado.id_periodo;
    cargarPanel();
  }
}

async function cargarPanel() {
  if (idPeriodo.value == null) return;
  cargando.value = true;
  error.value = '';
  datos.value = null;
  try {
    datos.value = await getAllIpress(`/panel_supervisor/?id_periodo=${idPeriodo.value}`);
  } catch (e) {
    error.value = e?.detail || e?.response?.data?.detail || e?.message || 'No se pudo cargar el panel.';
  } finally {
    cargando.value = false;
  }
}

onMounted(async () => {
  try {
    await fetchPeriodos();
    await cargarPanel();
  } catch (e) {
    error.value = 'Error al cargar periodos.';
  }
});
</script>
