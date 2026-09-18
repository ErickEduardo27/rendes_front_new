<template>
  <div class="p-4 sm:p-6 space-y-4 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-white min-h-full">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-lg sm:text-xl font-bold text-slate-800 uppercase tracking-wide">
          Cobertura de reportes RENDES
        </h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Macrorregión Norte y Lima · {{ anio }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label class="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-sm">
          <span class="text-xs font-semibold text-slate-600 uppercase">Año</span>
          <select
            v-model.number="anio"
            class="border-0 bg-transparent outline-none font-semibold text-slate-800"
            @change="cargarCobertura"
          >
            <option v-for="y in aniosDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <button
          type="button"
          class="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-50"
          :disabled="cargando"
          @click="cargarCobertura"
        >
          {{ cargando ? 'Actualizando…' : 'Actualizar' }}
        </button>
      </div>
    </header>

    <div class="flex flex-wrap gap-3 text-[11px] text-slate-600">
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3.5 h-3.5 rounded-sm bg-emerald-500 border border-emerald-600" /> VALIDO
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-amber-500" /> OBSERVADO
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3.5 h-3.5 rounded-sm bg-sky-400 border border-sky-500" /> ENVIADO
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3.5 h-3.5 rounded-sm bg-rose-500 border border-rose-600" /> NR
      </span>
    </div>

    <div v-if="cargando" class="text-center py-16 text-slate-500 text-sm">Cargando cobertura…</div>
    <div v-else-if="error" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ error }}</div>

    <template v-else>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 bg-slate-800 text-white">
          <h2 class="text-sm font-bold uppercase tracking-wide text-center">
            Cobertura de reportes RENDES — {{ anio }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-[11px] border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="sticky left-0 z-10 bg-slate-100 px-3 py-2 text-left font-bold border border-slate-200 min-w-[220px]">
                  Unidad / clínica
                </th>
                <th
                  v-for="m in mesesVisibles"
                  :key="m.clave"
                  class="px-2 py-2 text-center font-bold border border-slate-200 whitespace-nowrap min-w-[72px]"
                >
                  {{ m.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="grupo in gruposClinicas" :key="grupo.key">
                <tr class="bg-cyan-50/80">
                  <td
                    class="sticky left-0 z-10 bg-cyan-50 px-3 py-1.5 font-bold text-cyan-900 border border-slate-200 uppercase"
                    :colspan="1 + mesesVisibles.length"
                  >
                    {{ grupo.label }} ({{ grupo.clinicas.length }})
                  </td>
                </tr>
                <tr
                  v-for="c in grupo.clinicas"
                  :key="c.id_ipress"
                  class="hover:bg-slate-50/80"
                >
                  <td
                    class="sticky left-0 z-10 bg-white px-3 py-1 border border-slate-200 font-medium text-slate-800 max-w-[280px]"
                    :title="c.ipress"
                  >
                    <span class="block truncate">{{ c.nombre_corto || c.ipress }}</span>
                    <span v-if="c.nombre_corto && c.ipress && c.nombre_corto !== c.ipress" class="block text-[10px] text-slate-400 truncate">
                      {{ c.ipress }}
                    </span>
                  </td>
                  <td
                    v-for="m in mesesVisibles"
                    :key="`${c.id_ipress}-${m.clave}`"
                    class="px-1 py-1 border border-slate-200 text-center align-middle"
                    :class="claseCelda(estadoMes(c, m.clave))"
                    :title="tituloCelda(c, m)"
                  >
                    <span v-if="estadoMes(c, m.clave)" class="font-bold tracking-wide">
                      {{ estadoMes(c, m.clave) }}
                    </span>
                  </td>
                </tr>
              </template>
              <tr v-if="!clinicas.length">
                <td :colspan="1 + mesesVisibles.length" class="px-4 py-10 text-center text-slate-500 italic">
                  No hay clínicas asignadas para mostrar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Resumen de cobertura % -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
          <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Cobertura por red y modalidad</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="sticky left-0 z-10 bg-slate-100 px-3 py-2 text-left font-bold border border-slate-200 min-w-[220px]">
                  Indicador
                </th>
                <th
                  v-for="m in mesesVisibles"
                  :key="'cov-' + m.clave"
                  class="px-2 py-2 text-center font-bold border border-slate-200 whitespace-nowrap min-w-[72px]"
                >
                  {{ m.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cov in coberturas"
                :key="cov.label"
                class="hover:bg-slate-50"
              >
                <td class="sticky left-0 z-10 bg-white px-3 py-2 font-bold text-slate-800 border border-slate-200 uppercase whitespace-nowrap">
                  {{ cov.label }}
                </td>
                <td
                  v-for="m in mesesVisibles"
                  :key="`${cov.label}-${m.clave}`"
                  class="px-2 py-2 text-center border border-slate-200 font-semibold tabular-nums"
                  :class="clasePorcentaje(porcentajeMes(cov, m.clave))"
                >
                  {{ formatoPorcentaje(porcentajeMes(cov, m.clave)) }}
                </td>
              </tr>
              <tr v-if="!coberturas.length">
                <td :colspan="1 + mesesVisibles.length" class="px-4 py-6 text-center text-slate-500 italic">
                  Sin datos de cobertura.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
/**
 * Panel de cobertura de reportes (estilo Excel RENDES).
 * El panel anterior (gráficos + tabla por periodo) quedó comentado al final del archivo.
 */
import { ref, computed, onMounted } from 'vue';
import { getAllIpress } from '@/services/ipress/Ipress.service';

const anioActual = new Date().getFullYear();
const anio = ref(anioActual);
const aniosDisponibles = [anioActual - 1, anioActual, anioActual + 1];
const cargando = ref(false);
const error = ref('');
const meses = ref([]);
const clinicas = ref([]);
const coberturas = ref([]);

/** Hasta el mes actual inclusive; años pasados muestran los 12 meses. */
const mesesVisibles = computed(() => {
  const lista = Array.isArray(meses.value) ? meses.value : [];
  if (anio.value < anioActual) return lista;
  if (anio.value > anioActual) return [];
  const mesHoy = new Date().getMonth() + 1;
  return lista.filter((m) => m.mes <= mesHoy);
});

const gruposClinicas = computed(() => {
  const map = new Map();
  for (const c of clinicas.value) {
    const red = (c.red || 'Sin red').trim();
    const mid = c.id_modalidad;
    const mod = mid === 1 ? 'HD' : mid === 2 ? 'DP' : (c.modalidad || 'OTRO');
    const key = `${red}|${mid}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: `${mod} · ${red}`,
        clinicas: [],
      });
    }
    map.get(key).clinicas.push(c);
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'es'));
});

function estadoMes(c, clave) {
  return String(c?.meses?.[clave]?.estado || '').toUpperCase();
}

function porcentajeMes(cov, clave) {
  const v = cov?.meses?.[clave]?.porcentaje;
  return v == null || v === '' ? null : Number(v);
}

function formatoPorcentaje(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return `${v.toFixed(1)}%`;
}

function claseCelda(estado) {
  switch (estado) {
    case 'VALIDO':
      return 'bg-emerald-500 text-white';
    case 'OBSERVADO':
      return 'bg-amber-400 text-amber-950';
    case 'ENVIADO':
      return 'bg-sky-400 text-sky-950';
    case 'NR':
      return 'bg-rose-500 text-white';
    default:
      return 'bg-slate-100 text-slate-400';
  }
}

function clasePorcentaje(v) {
  if (v == null) return 'text-slate-400 bg-slate-50';
  if (v >= 90) return 'text-emerald-800 bg-emerald-50';
  if (v >= 70) return 'text-amber-800 bg-amber-50';
  return 'text-rose-800 bg-rose-50';
}

function tituloCelda(c, m) {
  const cel = c?.meses?.[m.clave] || {};
  const est = cel.estado || 'Sin dato';
  const partes = [`${c.nombre_corto || c.ipress} · ${m.label}: ${est}`];
  if (cel.conformidad_en) partes.push(`Conformidad: ${cel.conformidad_en}`);
  if (cel.notificado_en) partes.push(`Notificado: ${cel.notificado_en}`);
  return partes.join('\n');
}

async function cargarCobertura() {
  cargando.value = true;
  error.value = '';
  try {
    const res = await getAllIpress(`/cobertura_reportes_rendes/?anio=${anio.value}`);
    meses.value = Array.isArray(res?.meses) ? res.meses : [];
    clinicas.value = Array.isArray(res?.clinicas) ? res.clinicas : [];
    coberturas.value = Array.isArray(res?.coberturas) ? res.coberturas : [];
  } catch (e) {
    console.error(e);
    error.value = e?.detail || e?.response?.data?.detail || e?.message || 'No se pudo cargar la cobertura.';
    meses.value = [];
    clinicas.value = [];
    coberturas.value = [];
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarCobertura);
</script>

<!--
=============================================================================
LEGACY HomeSupervisor (comentado) — panel anterior con gráficos y tabla
por periodo. Se reemplazó por la matriz de cobertura VALIDO / NR / OBSERVADO.
=============================================================================

<template>
  <div class="p-4 sm:p-6 space-y-6 ...">
    ... Panel de supervisión con tarjetas, gráficos y tabla por IPRESS ...
    ... Usaba GET /panel_supervisor/?id_periodo= ...
  </div>
</template>

<script setup>
  // fetchPeriodos + cargarPanel → /panel_supervisor/
  // exportarReporteSupervisor con XLSX
  // filtros por IPRESS y periodo (month picker)
</script>
-->
