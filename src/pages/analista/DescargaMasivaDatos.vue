<template>
  <div class="min-h-screen bg-slate-50/80 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-violet-500 rounded-full"></span>
            Descarga masiva de datos
          </h1>
          <p class="text-slate-500 mt-1 text-sm max-w-2xl">
            Los cortes se arman según <strong>rf_paciente_atencion</strong>: solo se consideran combinaciones reales de
            periodo, clínica (IPRESS) y modalidad que existan en esa tabla. Opcionalmente puede filtrar por modalidad.
            Los reportes SQL usan el mismo vínculo periodo–IPRESS que el resto del sistema.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">IPRESS</label>
          <input
            v-model="busquedaIpress"
            type="text"
            placeholder="Filtrar por nombre o ID..."
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
          />
          <div class="flex gap-2 mb-2">
            <button type="button" class="text-xs font-semibold text-violet-600 hover:underline" @click="seleccionarTodasIpress">
              Seleccionar todas (visibles)
            </button>
            <span class="text-slate-300">|</span>
            <button type="button" class="text-xs font-semibold text-slate-600 hover:underline" @click="limpiarIpress">Limpiar</button>
          </div>
          <div class="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
            <label
              v-for="c in ipressFiltradas"
              :key="c.id_ipress"
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input v-model="idsIpressSeleccionados" type="checkbox" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" :value="c.id_ipress" />
              <span class="text-slate-400 font-mono text-xs w-14 shrink-0">{{ c.id_ipress }}</span>
              <span class="text-slate-800 truncate">{{ c.nombre_corto || c.ipress }}</span>
            </label>
          </div>
          <p class="text-xs text-slate-500 mt-2">{{ idsIpressSeleccionados.length }} IPRESS seleccionada(s)</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Periodos</label>
          <div class="flex gap-2 mb-2">
            <button type="button" class="text-xs font-semibold text-violet-600 hover:underline" @click="seleccionarTodosPeriodos">Seleccionar todos</button>
            <span class="text-slate-300">|</span>
            <button type="button" class="text-xs font-semibold text-slate-600 hover:underline" @click="limpiarPeriodos">Limpiar</button>
          </div>
          <div class="max-h-40 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
            <label
              v-for="p in periodos"
              :key="p.id_periodo"
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input v-model="idsPeriodoSeleccionados" type="checkbox" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" :value="p.id_periodo" />
              <span>{{ p.periodo }}</span>
            </label>
          </div>
          <p class="text-xs text-slate-500 mt-2">{{ idsPeriodoSeleccionados.length }} periodo(s) seleccionado(s)</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Modalidad (opcional)</label>
          <p class="text-xs text-slate-500 mb-2">Si no marca ninguna, se incluyen todas las modalidades presentes en atenciones.</p>
          <div class="flex gap-2 mb-2">
            <button type="button" class="text-xs font-semibold text-violet-600 hover:underline" @click="seleccionarTodasModalidades">Todas</button>
            <span class="text-slate-300">|</span>
            <button type="button" class="text-xs font-semibold text-slate-600 hover:underline" @click="limpiarModalidades">Ninguna (usar todas)</button>
          </div>
          <div class="max-h-32 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
            <label
              v-for="m in modalidades"
              :key="m.id_modalidad"
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input v-model="idsModalidadSeleccionados" type="checkbox" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" :value="m.id_modalidad" />
              <span>{{ m.modalidad }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contenido del Excel (hojas)</label>
          <div class="grid sm:grid-cols-2 gap-2">
            <label v-for="opt in opcionesReporte" :key="opt.key" class="flex items-center gap-2 text-sm text-slate-700">
              <input v-model="tiposReporte" type="checkbox" class="rounded border-slate-300 text-violet-600" :value="opt.key" />
              {{ opt.label }}
            </label>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-lg shadow-sm hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="generando || !puedeGenerar"
            @click="generarExcel"
          >
            <ArrowDownTrayIcon class="w-5 h-5" />
            {{ generando ? 'Generando…' : 'Descargar Excel' }}
          </button>
          <span v-if="generando" class="text-sm text-slate-600">{{ mensajeProgreso }}</span>
        </div>
        <p v-if="avisos.length" class="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
          <span class="font-semibold">Avisos:</span>
          <ul class="list-disc pl-5 mt-1 space-y-0.5">
            <li v-for="(a, i) in avisos" :key="i">{{ a }}</li>
          </ul>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';

const REPORT_ENDPOINTS = [
  { key: 'pacientes_dialisis', path: '/reporte_pacientes_dialisis/', label: 'Pacientes diálisis', sheet: 'Pacientes dialisis' },
  { key: 'unidades_actuales', path: '/reporte_unidades_actuales/', label: 'Unidad actual', sheet: 'Unidad actual' },
  { key: 'eventos_accesos', path: '/reporte_eventos_accesos_vasculares/', label: 'Eventos acceso vascular', sheet: 'Eventos acceso' },
  { key: 'morbilidad', path: '/reporte_morbilidades_hospitalarias/', label: 'Morbilidad hospitalaria', sheet: 'Morbilidad' },
  { key: 'resultados_clinicos', path: '/reporte_resultados_clinicos/', label: 'Resultados clínicos', sheet: 'Resultados clinicos' },
  { key: 'calidad_micro', path: '/reporte_calidad_microbiologicas/', label: 'Calidad microbiológica', sheet: 'Calidad micro' },
  { key: 'vacunaciones', path: '/reporte_vacunaciones/', label: 'Vacunaciones', sheet: 'Vacunaciones' },
];

const opcionesReporte = REPORT_ENDPOINTS.map(({ key, label }) => ({ key, label }));

const ipressLista = ref([]);
const periodos = ref([]);
const modalidades = ref([]);
const busquedaIpress = ref('');
const idsIpressSeleccionados = ref([]);
const idsPeriodoSeleccionados = ref([]);
const idsModalidadSeleccionados = ref([]);
const tiposReporte = ref(REPORT_ENDPOINTS.map((r) => r.key));

const generando = ref(false);
const mensajeProgreso = ref('');
const avisos = ref([]);

const ipressFiltradas = computed(() => {
  const q = busquedaIpress.value.trim().toLowerCase();
  const list = Array.isArray(ipressLista.value) ? ipressLista.value : [];
  if (!q) return list;
  return list.filter((c) => {
    const nombre = String(c.nombre_corto || c.ipress || '').toLowerCase();
    const id = String(c.id_ipress ?? '');
    return nombre.includes(q) || id.includes(q);
  });
});

const puedeGenerar = computed(
  () =>
    idsIpressSeleccionados.value.length > 0 &&
    idsPeriodoSeleccionados.value.length > 0 &&
    tiposReporte.value.length > 0
);

function nombreHojaSeguro(nombre) {
  const s = String(nombre || 'Hoja').replace(/[:\\/?*[\]]/g, '_');
  return s.length > 31 ? s.slice(0, 31) : s;
}

function seleccionarTodasIpress() {
  idsIpressSeleccionados.value = ipressFiltradas.value.map((c) => c.id_ipress);
}
function limpiarIpress() {
  idsIpressSeleccionados.value = [];
}
function seleccionarTodosPeriodos() {
  idsPeriodoSeleccionados.value = periodos.value.map((p) => p.id_periodo);
}
function limpiarPeriodos() {
  idsPeriodoSeleccionados.value = [];
}

function seleccionarTodasModalidades() {
  idsModalidadSeleccionados.value = modalidades.value.map((m) => m.id_modalidad);
}
function limpiarModalidades() {
  idsModalidadSeleccionados.value = [];
}

async function fetchReporte(path, idUsuarioIpress, idPeriodoIpress) {
  const data = await postAllIpress(path, {
    id_usuario_ipress: Number(idUsuarioIpress),
    id_periodo_ipress: Number(idPeriodoIpress),
  });
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.error) throw new Error(data.error);
  return [];
}

async function generarExcel() {
  avisos.value = [];
  generando.value = true;

  const porHoja = {};
  for (const rep of REPORT_ENDPOINTS) {
    if (!tiposReporte.value.includes(rep.key)) continue;
    porHoja[rep.key] = [];
  }

  try {
    const params = new URLSearchParams();
    params.set('id_ipress', idsIpressSeleccionados.value.join(','));
    params.set('id_periodo', idsPeriodoSeleccionados.value.join(','));
    if (idsModalidadSeleccionados.value.length > 0) {
      params.set('id_modalidad', idsModalidadSeleccionados.value.join(','));
    }

    mensajeProgreso.value = 'Consultando combinaciones en paciente atención…';
    const res = await getAllIpress(`/pacienteAtencion/combinaciones_descarga/?${params.toString()}`);
    const combinaciones = res?.results || [];

    if (!combinaciones.length) {
      ElMessage.warning(
        'No hay registros en paciente atención para los filtros elegidos. Verifique periodo, IPRESS y modalidad.',
      );
      return;
    }

    const seenPairs = new Set();
    const cola = [];
    for (const row of combinaciones) {
      if (row.id_periodo_ipress == null || row.id_usuario_ipress == null) {
        avisos.value.push(
          `No se resolvieron datos de reporte para ${row.nombre_ipress} / ${row.periodo} (modalidad ${row.modalidad}): falta vínculo periodo–IPRESS en tablas de reporte o usuario asignado a la IPRESS.`,
        );
        continue;
      }
      const pk = `${row.id_periodo_ipress}|${row.id_usuario_ipress}`;
      if (seenPairs.has(pk)) continue;
      seenPairs.add(pk);
      cola.push(row);
    }

    if (!cola.length) {
      ElMessage.warning('Ninguna combinación alcanzó los reportes. Revise los avisos.');
      return;
    }

    let idx = 0;
    for (const row of cola) {
      idx += 1;
      mensajeProgreso.value = `Generando reportes ${idx} de ${cola.length} (${row.nombre_ipress} · ${row.periodo})…`;

      const meta = {
        id_ipress: row.id_ipress,
        nombre_ipress: row.nombre_ipress,
        id_periodo: row.id_periodo,
        periodo: row.periodo,
        id_modalidad: row.id_modalidad,
        modalidad: row.modalidad,
        id_periodo_ipress: row.id_periodo_ipress,
      };

      for (const rep of REPORT_ENDPOINTS) {
        if (!tiposReporte.value.includes(rep.key)) continue;
        try {
          const filas = await fetchReporte(rep.path, row.id_usuario_ipress, row.id_periodo_ipress);
          const conMeta = (filas || []).map((r) => ({
            ...meta,
            ...r,
          }));
          porHoja[rep.key].push(...conMeta);
        } catch (e) {
          console.error(rep.key, e);
          avisos.value.push(`Error en «${rep.label}» (${row.nombre_ipress}, ${row.periodo}): ${e?.message || e}`);
        }
      }
    }

    const wb = XLSX.utils.book_new();
    let algunaHoja = false;
    for (const rep of REPORT_ENDPOINTS) {
      if (!tiposReporte.value.includes(rep.key)) continue;
      const rows = porHoja[rep.key] || [];
      if (!rows.length) {
        avisos.value.push(`Sin filas devueltas por el servidor para «${rep.label}» (puede no haber datos en ese reporte).`);
        continue;
      }
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, nombreHojaSeguro(rep.sheet));
      algunaHoja = true;
    }

    if (!algunaHoja) {
      ElMessage.warning('No se generaron datos para exportar. Revise los avisos.');
      return;
    }

    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    XLSX.writeFile(wb, `rendes_descarga_analista_${stamp}.xlsx`);
    ElMessage.success('Archivo Excel generado.');
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.message || e?.error || 'Error al generar el archivo.');
  } finally {
    generando.value = false;
    mensajeProgreso.value = '';
  }
}

onMounted(async () => {
  try {
    const [ip, per, mod] = await Promise.all([
      getAllIpress('/ipress/'),
      getAllIpress('/periodos/'),
      getAllIpress('/modalidades/'),
    ]);
    ipressLista.value = Array.isArray(ip) ? ip : ip?.results || [];
    periodos.value = Array.isArray(per) ? per : per?.results || [];
    modalidades.value = Array.isArray(mod) ? mod : mod?.results || [];
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudieron cargar IPRESS, periodos o modalidades.');
  }
});
</script>
