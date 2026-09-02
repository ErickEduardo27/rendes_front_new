<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-[100rem] mx-auto w-full">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
            Importación de tiempo de diálisis
          </h1>
          <p class="text-slate-500 mt-1 text-sm">
            Carga el reporte de producción mensual (RptProdAtenHDA) y visualiza sesiones y tiempos por paciente.
          </p>
        </div>
        <button
          type="button"
          class="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-cyan-700 transition disabled:opacity-50"
          :disabled="!filtroListo || importando"
          @click="abrirModalImportar"
        >
          {{ importando ? 'Importando…' : 'Importar Excel' }}
        </button>
      </div>

      <div
        v-if="!filtroListo"
        class="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        Seleccione <strong>periodo</strong>, <strong>clínica (IPRESS)</strong> y <strong>modalidad</strong> en el encabezado para importar o consultar datos.
      </div>

      <div
        v-else
        class="mb-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4"
      >
        <p class="text-xs font-bold uppercase tracking-wide text-sky-700 mb-2">Contexto de importación</p>
        <p class="text-sm text-sky-900 mb-3">
          El archivo se asociará al <strong>periodo</strong>, <strong>clínica</strong> y <strong>modalidad</strong> actualmente seleccionados en el sistema.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div class="rounded-lg bg-white border border-sky-100 px-3 py-2">
            <p class="text-[10px] uppercase font-bold text-slate-500">Periodo</p>
            <p class="font-semibold text-slate-800">{{ etiquetaPeriodo }}</p>
          </div>
          <div class="rounded-lg bg-white border border-sky-100 px-3 py-2">
            <p class="text-[10px] uppercase font-bold text-slate-500">Clínica (IPRESS)</p>
            <p class="font-semibold text-slate-800">{{ etiquetaClinica }}</p>
          </div>
          <div class="rounded-lg bg-white border border-sky-100 px-3 py-2">
            <p class="text-[10px] uppercase font-bold text-slate-500">Modalidad</p>
            <p class="font-semibold text-slate-800">{{ etiquetaModalidad }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="filtroListo && importacion.importado && importacion.almacenamiento_local"
        class="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        Los datos se guardaron <strong>localmente en este navegador</strong> porque el servidor aún no tiene el endpoint de importación desplegado.
        Cuando se actualice QA, vuelva a importar para persistir en el servidor.
      </div>

      <div v-if="filtroListo && importacion.importado" class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div class="rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p class="text-[10px] uppercase font-bold text-slate-500">Pacientes</p>
          <p class="text-2xl font-bold text-slate-800 tabular-nums">{{ resumenVista.total_pacientes }}</p>
        </div>
        <div class="rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p class="text-[10px] uppercase font-bold text-slate-500">Atenciones programadas</p>
          <p class="text-2xl font-bold text-slate-800 tabular-nums">{{ resumenVista.atenciones_programadas ?? '—' }}</p>
        </div>
        <div class="rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p class="text-[10px] uppercase font-bold text-emerald-600">Atenciones ejecutadas</p>
          <p class="text-2xl font-bold text-emerald-700 tabular-nums">{{ resumenVista.atenciones_ejecutadas ?? '—' }}</p>
        </div>
        <div class="rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p class="text-[10px] uppercase font-bold text-amber-600">Atenciones adicionales</p>
          <p class="text-2xl font-bold text-amber-700 tabular-nums">{{ resumenVista.atenciones_adicionales ?? '—' }}</p>
        </div>
        <div class="rounded-xl border bg-white px-4 py-3 shadow-sm">
          <p class="text-[10px] uppercase font-bold text-violet-600">Sesiones con tiempo HD</p>
          <p class="text-2xl font-bold text-violet-700 tabular-nums">{{ resumenVista.total_sesiones_tiempo }}</p>
        </div>
      </div>

      <div
        v-if="filtroListo && importacion.importado"
        class="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
      >
        <p>
          Archivo: <strong>{{ importacion.archivo_nombre || '—' }}</strong>
          · Mes en Excel: <strong>{{ importacion.mes_consulta_excel || '—' }}</strong>
          · IPRESS en Excel: <strong>{{ importacion.ipress_excel || '—' }}</strong>
        </p>
        <p class="mt-1 text-xs text-slate-400">
          Importado por {{ importacion.usuario_nombre || '—' }}
          <span v-if="importacion.creado_en"> · {{ formatearFecha(importacion.creado_en) }}</span>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="!filtroListo" class="p-12 text-center text-slate-500 italic">
          Seleccione los filtros del encabezado para ver los datos importados.
        </div>
        <div v-else-if="cargando" class="p-12 text-center text-slate-500">Cargando importación…</div>
        <div v-else-if="!importacion.importado" class="p-12 text-center text-slate-500 italic">
          No hay importación registrada para este periodo, clínica y modalidad.
        </div>
        <template v-else>
          <div class="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm font-semibold text-slate-700">
              Detalle importado ({{ detalleFiltrado.length }} pacientes)
            </p>
            <input
              v-model="busqueda"
              type="search"
              placeholder="Buscar por DNI o nombre…"
              class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-full md:w-72"
            />
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600">DNI</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600">Paciente</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Prog.</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Ejec.</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Adic.</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Sesiones c/ tiempo</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Tiempo total HD</th>
                  <th class="px-3 py-2 text-center font-semibold text-slate-600">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="row in detallePaginado" :key="row.id_detalle || row.numero_documento" class="hover:bg-slate-50">
                  <td class="px-3 py-2 text-slate-600 tabular-nums">{{ row.numero_documento }}</td>
                  <td class="px-3 py-2 font-medium text-slate-800">{{ row.apellidos_nombres }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ row.atenciones_programadas }}</td>
                  <td class="px-3 py-2 text-center tabular-nums text-emerald-700 font-semibold">{{ row.atenciones_ejecutadas }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ row.atenciones_adicionales }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ row.sesiones_con_tiempo }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ row.tiempo_total_hhmm || formatMinutosAHhmm(row.tiempo_total_minutos) }}</td>
                  <td class="px-3 py-2 text-center">
                    <button
                      type="button"
                      class="text-cyan-600 hover:text-cyan-800 font-semibold text-xs"
                      @click="verDetallePaciente(row)"
                    >
                      Ver días
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>Página {{ pagina }} de {{ totalPaginas }}</span>
            <div class="flex gap-2">
              <button type="button" class="px-3 py-1 border rounded disabled:opacity-40" :disabled="pagina <= 1" @click="pagina -= 1">Anterior</button>
              <button type="button" class="px-3 py-1 border rounded disabled:opacity-40" :disabled="pagina >= totalPaginas" @click="pagina += 1">Siguiente</button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal importar -->
    <div v-if="mostrarModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40" @click.self="cerrarModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-800">Importar reporte de producción HD</h2>
        </div>
        <div class="px-5 py-4 space-y-4">
          <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p class="font-bold mb-1">Advertencia</p>
            <p>
              El archivo se importará y quedará asociado al contexto seleccionado en el encabezado.
              Si ya existe una importación para esta combinación, será <strong>reemplazada</strong>.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div class="rounded border px-3 py-2 bg-slate-50"><span class="text-slate-500 text-xs block">Periodo</span>{{ etiquetaPeriodo }}</div>
            <div class="rounded border px-3 py-2 bg-slate-50"><span class="text-slate-500 text-xs block">Clínica</span>{{ etiquetaClinica }}</div>
            <div class="rounded border px-3 py-2 bg-slate-50"><span class="text-slate-500 text-xs block">Modalidad</span>{{ etiquetaModalidad }}</div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Archivo Excel (.xls / .xlsx)</label>
            <input
              ref="inputArchivo"
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              class="block w-full text-sm"
              @change="onSeleccionarArchivo"
            />
          </div>
          <div v-if="preview" class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p class="font-semibold text-slate-700 mb-2">Vista previa del archivo</p>
            <p>Mes en Excel: <strong>{{ preview.resumen.mes_consulta_excel || '—' }}</strong></p>
            <p>IPRESS en Excel: <strong>{{ preview.resumen.ipress_excel || '—' }}</strong></p>
            <p>Pacientes detectados: <strong>{{ preview.resumen.total_pacientes }}</strong></p>
            <p>Atenciones ejecutadas (pie de Excel): <strong>{{ preview.resumen.atenciones_ejecutadas ?? '—' }}</strong></p>
            <p>Sesiones con tiempo HD: <strong>{{ preview.resumen.total_sesiones_tiempo }}</strong></p>
          </div>
          <p v-if="errorArchivo" class="text-sm text-rose-600">{{ errorArchivo }}</p>
        </div>
        <div class="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" class="px-4 py-2 rounded border text-slate-600" :disabled="importando" @click="cerrarModal">Cancelar</button>
          <button
            type="button"
            class="px-4 py-2 rounded bg-cyan-600 text-white font-semibold disabled:opacity-50"
            :disabled="!archivoSeleccionado || importando"
            @click="confirmarImportacion"
          >
            {{ importando ? 'Importando…' : 'Confirmar importación' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal detalle días -->
    <div v-if="pacienteDetalle" class="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/40" @click.self="pacienteDetalle = null">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="px-5 py-4 border-b">
          <h3 class="font-bold text-slate-800">{{ pacienteDetalle.apellidos_nombres }}</h3>
          <p class="text-sm text-slate-500">DNI {{ pacienteDetalle.numero_documento }}</p>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            <div
              v-for="item in diasPacienteDetalle"
              :key="item.dia"
              class="rounded border border-slate-100 bg-slate-50 px-2 py-2 text-center"
            >
              <p class="text-[10px] font-bold text-slate-500 uppercase">Día {{ item.dia }}</p>
              <p v-if="item.hora_inicio" class="text-xs text-sky-700 mt-1">
                Inicio <span class="font-semibold tabular-nums">{{ item.hora_inicio }}</span>
              </p>
              <p v-if="item.tiempo" class="text-xs text-violet-700" :class="{ 'mt-1': item.hora_inicio }">
                Duración <span class="font-semibold tabular-nums">{{ item.tiempo }}</span>
              </p>
              <p v-if="!item.hora_inicio && !item.tiempo" class="text-slate-400 text-xs mt-1">—</p>
            </div>
          </div>
          <p v-if="!diasPacienteDetalle.length" class="text-slate-500 italic text-sm">
            Sin sesiones registradas por día.
          </p>
        </div>
        <div class="px-5 py-3 border-t text-right">
          <button type="button" class="px-4 py-2 rounded border" @click="pacienteDetalle = null">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllIpress, postArchivoIpress } from '@/services/ipress/Ipress.service';
import { parseProduccionHdExcel, formatMinutosAHhmm, diasDetallePaciente } from '@/utils/parseProduccionHdExcel';
import {
  guardarImportacionLocal,
  leerImportacionLocal,
  esErrorEndpointNoDisponible,
} from '@/utils/importacionProduccionHdStorage';
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat';

const MODALIDADES_NOMBRE = {
  1: 'Hemodiálisis',
  2: 'Diálisis Peritoneal',
  3: 'Trasplante',
};

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const periodos = ref([]);
const ipressList = ref([]);
const cargando = ref(false);
const importando = ref(false);
const mostrarModal = ref(false);
const archivoSeleccionado = ref(null);
const preview = ref(null);
const errorArchivo = ref('');
const busqueda = ref('');
const pagina = ref(1);
const pageSize = 20;
const pacienteDetalle = ref(null);
const inputArchivo = ref(null);

const importacion = ref({
  importado: false,
  detalle: [],
});

const filtroListo = computed(() => (
  periodoGlobal.value != null && periodoGlobal.value !== ''
  && clinicaGlobal.value != null && clinicaGlobal.value !== ''
  && modalidadGlobal.value != null && modalidadGlobal.value !== ''
));

const etiquetaPeriodo = computed(() => {
  const item = periodos.value.find((p) => String(p.id_periodo) === String(periodoGlobal.value));
  return item?.periodo || String(periodoGlobal.value || '—');
});

const etiquetaClinica = computed(() => {
  const item = ipressList.value.find((i) => String(i.id_ipress) === String(clinicaGlobal.value));
  return item?.nombre_corto || item?.ipress || String(clinicaGlobal.value || '—');
});

const etiquetaModalidad = computed(() => {
  const clinica = ipressList.value.find((i) => String(i.id_ipress) === String(clinicaGlobal.value));
  return clinica?.datosModalidad?.modalidad
    || MODALIDADES_NOMBRE[Number(modalidadGlobal.value)]
    || String(modalidadGlobal.value || '—');
});

const resumenVista = computed(() => ({
  total_pacientes: importacion.value.total_pacientes ?? importacion.value.detalle?.length ?? 0,
  atenciones_programadas: importacion.value.atenciones_programadas,
  atenciones_ejecutadas: importacion.value.atenciones_ejecutadas,
  atenciones_adicionales: importacion.value.atenciones_adicionales,
  total_sesiones_tiempo: importacion.value.total_sesiones_tiempo ?? 0,
}));

const detalleFiltrado = computed(() => {
  const lista = Array.isArray(importacion.value.detalle) ? importacion.value.detalle : [];
  const q = busqueda.value.trim().toLowerCase();
  if (!q) return lista;
  return lista.filter((row) => (
    String(row.numero_documento || '').toLowerCase().includes(q)
    || String(row.apellidos_nombres || '').toLowerCase().includes(q)
  ));
});

const totalPaginas = computed(() => Math.max(1, Math.ceil(detalleFiltrado.value.length / pageSize)));

const detallePaginado = computed(() => {
  const start = (pagina.value - 1) * pageSize;
  return detalleFiltrado.value.slice(start, start + pageSize);
});

const diasPacienteDetalle = computed(() => diasDetallePaciente(pacienteDetalle.value));

function formatearFecha(iso) {
  return formatFechaHoraDDMMAAAA(iso) || iso;
}

async function cargarCatalogos() {
  try {
    const [per, ips] = await Promise.all([
      getAllIpress('/periodos/'),
      getAllIpress('/ipress/'),
    ]);
    periodos.value = Array.isArray(per) ? per : per?.results || [];
    ipressList.value = Array.isArray(ips) ? ips : ips?.results || [];
  } catch {
    periodos.value = [];
    ipressList.value = [];
  }
}

async function cargarImportacion() {
  if (!filtroListo.value) {
    importacion.value = { importado: false, detalle: [] };
    return;
  }
  cargando.value = true;
  let encontrado = false;
  try {
    const params = new URLSearchParams({
      id_periodo: String(periodoGlobal.value),
      id_ipress: String(clinicaGlobal.value),
      id_modalidad: String(modalidadGlobal.value),
    });
    const data = await getAllIpress(`/consulta_importacion_produccion_hd/?${params.toString()}`);
    if (data?.importado) {
      importacion.value = {
        importado: true,
        ...data,
        detalle: Array.isArray(data?.detalle) ? data.detalle : [],
      };
      encontrado = true;
    }
  } catch (e) {
    if (!esErrorEndpointNoDisponible(e)) {
      console.warn('Consulta importación:', e);
    }
  }

  if (!encontrado) {
    const local = leerImportacionLocal(
      periodoGlobal.value,
      clinicaGlobal.value,
      modalidadGlobal.value,
    );
    importacion.value = local || { importado: false, detalle: [] };
  }
  cargando.value = false;
}

function abrirModalImportar() {
  if (!filtroListo.value) {
    ElMessage.warning('Seleccione periodo, clínica y modalidad.');
    return;
  }
  archivoSeleccionado.value = null;
  preview.value = null;
  errorArchivo.value = '';
  mostrarModal.value = true;
  if (inputArchivo.value) inputArchivo.value.value = '';
}

function cerrarModal() {
  if (importando.value) return;
  mostrarModal.value = false;
}

async function onSeleccionarArchivo(event) {
  errorArchivo.value = '';
  preview.value = null;
  const file = event.target.files?.[0];
  archivoSeleccionado.value = file || null;
  if (!file) return;
  const nombre = (file.name || '').toLowerCase();
  if (!nombre.endsWith('.xls') && !nombre.endsWith('.xlsx')) {
    errorArchivo.value = 'Seleccione un archivo Excel (.xls o .xlsx).';
    archivoSeleccionado.value = null;
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    preview.value = parseProduccionHdExcel(buffer);
    if (!preview.value.detalle?.length) {
      errorArchivo.value = 'No se encontraron pacientes en el archivo.';
    }
  } catch (e) {
    console.error(e);
    errorArchivo.value = 'No se pudo leer el archivo. Verifique que sea el formato RptProdAtenHDA.';
    preview.value = null;
  }
}

async function confirmarImportacion() {
  if (!archivoSeleccionado.value || !filtroListo.value || !preview.value?.detalle?.length) {
    ElMessage.warning('Seleccione un archivo válido con pacientes.');
    return;
  }
  importando.value = true;
  try {
    const formData = new FormData();
    formData.append('archivo', archivoSeleccionado.value);
    formData.append('id_periodo', String(periodoGlobal.value));
    formData.append('id_ipress', String(clinicaGlobal.value));
    formData.append('id_modalidad', String(modalidadGlobal.value));
    const data = await postArchivoIpress('/importar_produccion_hd/', formData);
    importacion.value = {
      importado: true,
      ...data,
      detalle: Array.isArray(data?.detalle) ? data.detalle : [],
    };
    ElMessage.success('Importación registrada en el servidor.');
    mostrarModal.value = false;
    pagina.value = 1;
  } catch (e) {
    if (esErrorEndpointNoDisponible(e)) {
      const payload = guardarImportacionLocal(
        periodoGlobal.value,
        clinicaGlobal.value,
        modalidadGlobal.value,
        {
          archivo_nombre: archivoSeleccionado.value.name,
          mes_consulta_excel: preview.value.resumen.mes_consulta_excel,
          ipress_excel: preview.value.resumen.ipress_excel,
          total_pacientes: preview.value.resumen.total_pacientes,
          atenciones_programadas: preview.value.resumen.atenciones_programadas,
          atenciones_ejecutadas: preview.value.resumen.atenciones_ejecutadas,
          atenciones_adicionales: preview.value.resumen.atenciones_adicionales,
          total_sesiones_tiempo: preview.value.resumen.total_sesiones_tiempo,
          detalle: preview.value.detalle,
          usuario_nombre: 'Importación local',
        },
      );
      importacion.value = payload;
      ElMessage.warning('El servidor aún no tiene este módulo. Los datos se guardaron localmente en su navegador.');
      mostrarModal.value = false;
      pagina.value = 1;
      return;
    }
    const detalleError = e?.response?.data?.detail || e?.error || e?.message;
    ElMessage.error(detalleError || 'No se pudo importar el archivo.');
  } finally {
    importando.value = false;
  }
}

function verDetallePaciente(row) {
  pacienteDetalle.value = row;
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  pagina.value = 1;
  busqueda.value = '';
  cargarImportacion();
});

watch(busqueda, () => {
  pagina.value = 1;
});

onMounted(async () => {
  await cargarCatalogos();
  await cargarImportacion();
});
</script>
