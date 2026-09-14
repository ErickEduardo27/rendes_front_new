<template>
  <div class="min-h-screen bg-gray-50/50 p-4">
    <div class="w-full max-w-full mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-violet-500 rounded-full"></span>
          Notificación clínicas
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Listado de IPRESS según el <strong>periodo</strong> y la <strong>modalidad</strong> de la barra superior.
          Indica si la clínica usó «Notificar» en los módulos de registros.
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="!filtroListo" class="p-12 text-center text-slate-500">
          Seleccione <strong>periodo</strong> y <strong>modalidad</strong> en la barra superior (la clínica del selector no filtra esta lista).
        </div>
        <div v-else-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <div v-else class="overflow-x-auto">
          <p v-if="errorResumen" class="m-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ errorResumen }}</p>
          <template v-else>
            <div class="px-4 py-3 text-sm text-slate-600 border-b border-slate-100 bg-slate-50/80">
              <span v-if="soloIpressAsignadas" class="block text-xs text-violet-800 font-medium">
                Solo se muestran las clínicas (IPRESS) asignadas a su usuario.
              </span>
              <span v-if="resumenTotales.total_ipress > 0" class="block mt-2 font-semibold text-slate-800">
                Notificaron {{ resumenTotales.total_notificados }} de {{ resumenTotales.total_ipress }} establecimientos.
              </span>
              <p class="mt-2 text-xs text-slate-500 max-w-4xl">
                La acción <strong>Dar conformidad</strong> solo se habilita cuando la clínica ha usado <strong>Notificar</strong>, todos los formularios con datos están <strong>cerrados</strong> y aún no se registró conformidad. Traslada pacientes activos al periodo siguiente con fecha de ingreso = primer día de ese mes (nuevos y reingresantes como continuador; egresados no pasan).
                Use <strong>Marcar observación</strong> para avisar a la clínica que debe corregir o completar datos; se deshabilita tras dar conformidad.
              </p>
            </div>
            <div v-if="listaIpress.length" class="px-4 py-3 border-b border-slate-100 flex flex-wrap gap-3">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-medium text-slate-600 mb-1">Buscar por nombre</label>
                <input
                  v-model="filtroNombre"
                  type="text"
                  placeholder="IPRESS o nombre corto…"
                  class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div class="min-w-[160px]">
                <label class="block text-xs font-medium text-slate-600 mb-1">Estado notificado</label>
                <select
                  v-model="filtroNotificado"
                  class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Todos</option>
                  <option value="si">Sí — notificó</option>
                  <option value="no">No — sin notificar</option>
                </select>
              </div>
            </div>
            <div v-if="listaIpress.length === 0" class="p-12 text-center text-slate-500 italic">
              {{ soloIpressAsignadas ? 'No hay clínicas asignadas a su usuario para este periodo y modalidad.' : 'No hay IPRESS registradas.' }}
            </div>
            <div v-else-if="listaFiltrada.length === 0" class="p-12 text-center text-slate-500 italic">
              No hay IPRESS con el filtro actual.
            </div>
            <template v-else>
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">IPRESS</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Nombre corto</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Notificado</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Fecha / hora notif.</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Usuario notif.</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Conformidad</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="row in listaPaginada"
                    :key="row.id_ipress"
                    class="hover:bg-slate-50"
                    :class="Number(clinicaGlobal) === Number(row.id_ipress) ? 'bg-sky-50/60' : ''"
                  >
                    <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ row.ipress || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">{{ row.nombre_corto || '—' }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span
                        v-if="row.notificado"
                        class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800"
                      >Sí</span>
                      <span
                        v-else
                        class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                      >No</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-600">{{ formatoFecha(row.notificado_en) }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">{{ row.usuario_nombre || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">
                      <template v-if="row.conformidad_en">
                        <span class="block">{{ formatoFecha(row.conformidad_en) }}</span>
                        <span v-if="row.conformidad_usuario_nombre" class="block text-xs text-slate-500 mt-0.5">{{ row.conformidad_usuario_nombre }}</span>
                      </template>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex flex-wrap gap-1.5">
                        <button
                          v-if="!row.conformidad_en"
                          type="button"
                          class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                          :class="puedeActivarBotonDarConformidad(row)
                            ? 'border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100'
                            : 'border-slate-200 bg-slate-50 text-slate-500'"
                          :disabled="pasandoPacientesIpress === Number(row.id_ipress) || marcandoObservacionIpress === Number(row.id_ipress) || !puedeActivarBotonDarConformidad(row)"
                          :title="tituloBotonDarConformidad(row)"
                          @click="confirmarDarConformidad(row)"
                        >
                          {{ pasandoPacientesIpress === Number(row.id_ipress) ? 'Procesando…' : 'Dar Conformidad' }}
                        </button>
                        <button
                          v-if="!row.conformidad_en"
                          type="button"
                          class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                          :class="puedeActivarBotonMarcarObservacion(row)
                            ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                            : 'border-slate-200 bg-slate-50 text-slate-500'"
                          :disabled="marcandoObservacionIpress === Number(row.id_ipress) || pasandoPacientesIpress === Number(row.id_ipress) || !puedeActivarBotonMarcarObservacion(row)"
                          :title="tituloBotonMarcarObservacion(row)"
                          @click="confirmarMarcarObservacion(row)"
                        >
                          {{ marcandoObservacionIpress === Number(row.id_ipress) ? 'Enviando…' : 'Marcar observación' }}
                        </button>
                        <span
                          v-if="row.conformidad_en"
                          class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 self-center"
                        >Conforme</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <TablaPaginacion v-model:page="pagina" v-model:page-size="pageSize" :total="listaFiltrada.length" />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import { ElMessage, ElMessageBox } from 'element-plus';
import TablaPaginacion from '@/components/TablaPaginacion.vue';
import { useAuthStore } from '@/store/auth';
import { debeLimitarClinicasAlUsuario } from '@/utils/perfil';
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const authStore = useAuthStore();

const idsIpressAsignadas = ref(null);
const cargando = ref(false);
const listaIpress = ref([]);
const errorResumen = ref('');
const resumenTotales = ref({ total_ipress: 0, total_notificados: 0 });
const estadoPasarPorIpress = ref({});
const cargandoEstadoPasar = ref(false);
const pasandoPacientesIpress = ref(null);
const marcandoObservacionIpress = ref(null);
const pagina = ref(1);
const pageSize = ref(15);
const filtroNombre = ref('');
const filtroNotificado = ref('');

const filtroListo = computed(() => (
  periodoGlobal.value != null && periodoGlobal.value !== ''
  && modalidadGlobal.value != null && modalidadGlobal.value !== ''
));

const soloIpressAsignadas = computed(() => idsIpressAsignadas.value != null);

const listaFiltrada = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase();
  const estado = filtroNotificado.value;
  return listaIpress.value.filter((row) => {
    if (estado === 'si' && !row.notificado) return false;
    if (estado === 'no' && row.notificado) return false;
    if (!nombre) return true;
    const ipress = String(row.ipress || '').toLowerCase();
    const corto = String(row.nombre_corto || '').toLowerCase();
    return ipress.includes(nombre) || corto.includes(nombre);
  });
});

const listaPaginada = computed(() => {
  const all = listaFiltrada.value;
  const size = pageSize.value;
  const start = (pagina.value - 1) * size;
  return all.slice(start, start + size);
});

function formatoFecha(iso) {
  return formatFechaHoraDDMMAAAA(iso);
}

async function cargarIpressAsignadasUsuario() {
  if (!debeLimitarClinicasAlUsuario()) {
    idsIpressAsignadas.value = null;
    return;
  }
  const idUsuario = authStore.user?.id_usuario;
  if (!idUsuario) {
    idsIpressAsignadas.value = new Set();
    return;
  }
  try {
    const res = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
    const lista = Array.isArray(res) ? res : (res?.results || []);
    idsIpressAsignadas.value = new Set(
      lista.map((a) => Number(a.id_ipress)).filter((id) => !Number.isNaN(id) && id > 0),
    );
  } catch (e) {
    console.error(e);
    idsIpressAsignadas.value = new Set();
  }
}

function aplicarFiltroIpressAsignadas(lista) {
  const ids = idsIpressAsignadas.value;
  if (ids == null) return lista;
  return lista.filter((row) => ids.has(Number(row.id_ipress)));
}

async function fetchEstadoPasarPacientesPeriodo() {
  if (!filtroListo.value) {
    estadoPasarPorIpress.value = {};
    return;
  }
  cargandoEstadoPasar.value = true;
  try {
    const params = new URLSearchParams();
    params.set('id_periodo', String(periodoGlobal.value));
    params.set('id_modalidad', String(modalidadGlobal.value));
    const r = await getAllIpress(`/consulta_estado_pasar_pacientes_periodo/?${params.toString()}`);
    estadoPasarPorIpress.value = r?.por_ipress && typeof r.por_ipress === 'object' ? { ...r.por_ipress } : {};
  } catch (e) {
    console.error(e);
    estadoPasarPorIpress.value = {};
    ElMessage.warning('No se pudo consultar si se pueden pasar pacientes al periodo siguiente.');
  } finally {
    cargandoEstadoPasar.value = false;
  }
}

async function fetchLista() {
  errorResumen.value = '';
  if (!filtroListo.value) {
    listaIpress.value = [];
    resumenTotales.value = { total_ipress: 0, total_notificados: 0 };
    estadoPasarPorIpress.value = {};
    return;
  }
  cargando.value = true;
  try {
    await cargarIpressAsignadasUsuario();
    const params = new URLSearchParams();
    params.set('id_periodo', String(periodoGlobal.value));
    params.set('id_modalidad', String(modalidadGlobal.value));
    const r = await getAllIpress(`/lista_notificacion_envio_revision_por_periodo/?${params.toString()}`);
    const raw = Array.isArray(r?.results) ? r.results : [];
    const filtrada = aplicarFiltroIpressAsignadas(raw);
    listaIpress.value = filtrada;
    resumenTotales.value = {
      total_ipress: filtrada.length,
      total_notificados: filtrada.filter((row) => row.notificado).length,
    };
    await fetchEstadoPasarPacientesPeriodo();
  } catch (e) {
    console.error(e);
    listaIpress.value = [];
    resumenTotales.value = { total_ipress: 0, total_notificados: 0 };
    estadoPasarPorIpress.value = {};
    const msg = e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo cargar el resumen.';
    errorResumen.value = typeof msg === 'string' ? msg : 'No se pudo cargar el resumen.';
  } finally {
    cargando.value = false;
  }
}

function infoDarConformidad(idIpress) {
  const key = String(idIpress);
  const raw = estadoPasarPorIpress.value[key];
  if (raw && typeof raw === 'object') {
    return {
      puede_pasar: !!raw.puede_pasar,
      motivo: raw.motivo || '',
      periodo_destino_label: raw.periodo_destino_label || '',
      formularios_con_datos_abiertos: Array.isArray(raw.formularios_con_datos_abiertos) ? raw.formularios_con_datos_abiertos : [],
      ya_dio_conformidad: !!raw.ya_dio_conformidad,
    };
  }
  return {
    puede_pasar: false,
    motivo: cargandoEstadoPasar.value ? 'Consultando permisos…' : 'Sin información de estado.',
    periodo_destino_label: '',
    formularios_con_datos_abiertos: [],
    ya_dio_conformidad: false,
  };
}

function puedeActivarBotonDarConformidad(row) {
  if (!row?.notificado) return false;
  if (row?.conformidad_en || row?.ya_dio_conformidad) return false;
  if (cargandoEstadoPasar.value) return false;
  return !!infoDarConformidad(row.id_ipress).puede_pasar;
}

function tituloBotonDarConformidad(row) {
  if (row?.conformidad_en || row?.ya_dio_conformidad) {
    return 'Ya se registró la conformidad para este periodo.';
  }
  if (!row?.notificado) {
    return 'La clínica debe usar «Notificar» en registros antes de dar conformidad.';
  }
  if (cargandoEstadoPasar.value) return 'Consultando permisos y periodo destino…';
  const info = infoDarConformidad(row.id_ipress);
  if (!info.puede_pasar) return info.motivo || 'No se puede dar conformidad en este momento.';
  if (info.periodo_destino_label) {
    return `Dar conformidad y trasladar pacientes activos al periodo ${info.periodo_destino_label} (fecha de ingreso = 1.º del mes destino; nuevos y reingresantes como continuador; egresados no se trasladan).`;
  }
  return 'Dar conformidad y pasar pacientes al periodo siguiente';
}

async function confirmarDarConformidad(row) {
  const idIpress = row?.id_ipress;
  if (idIpress == null) return;
  if (!row?.notificado) return;
  if (row?.conformidad_en) return;
  const info = infoDarConformidad(idIpress);
  if (!info.puede_pasar || cargandoEstadoPasar.value) return;
  const nombre = row.nombre_corto || row.ipress || 'esta clínica';
  const destino = info.periodo_destino_label || 'el periodo siguiente';
  try {
    await ElMessageBox.confirm(
      `¿Dar conformidad y cargar los pacientes del periodo actual al periodo posterior (${destino}) para «${nombre}»? ` +
        'Se crearán registros de atención en el nuevo periodo solo para pacientes activos (no egresados) que aún no existan allí. ' +
        'La fecha de ingreso/registro será el primer día del mes del periodo destino. ' +
        'Los pacientes nuevos y reingresantes pasarán como «Continuador».',
      'Dar conformidad',
      {
        type: 'warning',
        confirmButtonText: 'Sí, dar conformidad',
        cancelButtonText: 'Cancelar',
      },
    );
  } catch {
    return;
  }
  pasandoPacientesIpress.value = Number(idIpress);
  try {
    const res = await postAllIpress('/pasar_pacientes_siguiente_periodo/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(idIpress),
      id_modalidad: Number(modalidadGlobal.value),
    });
    const data = res?.data ?? res;
    const creados = data?.creados ?? 0;
    const omitidosEgresados = data?.omitidos_egresados ?? 0;
    let msg = `Conformidad registrada. ${creados} paciente(s) pasado(s) al periodo siguiente.`;
    if (omitidosEgresados > 0) {
      msg += ` ${omitidosEgresados} egresado(s) no se trasladaron.`;
    }
    ElMessage.success(msg);
    await fetchLista();
  } catch (e) {
    console.error(e);
    const msg =
      e?.response?.data?.detail ||
      e?.detail ||
      e?.error ||
      e?.message ||
      'No se pudo completar la conformidad.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo completar la conformidad.');
  } finally {
    pasandoPacientesIpress.value = null;
  }
}

function puedeActivarBotonMarcarObservacion(row) {
  if (!row) return false;
  if (row.conformidad_en || row.ya_dio_conformidad) return false;
  return true;
}

function tituloBotonMarcarObservacion(row) {
  if (row?.conformidad_en || row?.ya_dio_conformidad) {
    return 'Ya se registró la conformidad; no se pueden marcar más observaciones.';
  }
  return 'Envía una observación a los usuarios de esta clínica para el periodo y modalidad actuales.';
}

async function confirmarMarcarObservacion(row) {
  const idIpress = row?.id_ipress;
  if (idIpress == null || !puedeActivarBotonMarcarObservacion(row)) return;
  if (!periodoGlobal.value || !modalidadGlobal.value) {
    ElMessage.warning('Seleccione periodo y modalidad en la barra superior.');
    return;
  }
  const nombre = row.nombre_corto || row.ipress || 'esta clínica';
  let mensaje = '';
  try {
    const { value } = await ElMessageBox.prompt(
      `Escriba la observación para «${nombre}». Se notificará a los usuarios de la clínica.`,
      'Marcar observación',
      {
        type: 'warning',
        confirmButtonText: 'Enviar observación',
        cancelButtonText: 'Cancelar',
        inputType: 'textarea',
        inputPlaceholder: 'Ej.: Revisar resultados clínicos y vacunación del periodo…',
        inputValidator: (val) => {
          if (!val || !String(val).trim()) return 'Ingrese el texto de la observación.';
          if (String(val).trim().length < 5) return 'La observación debe tener al menos 5 caracteres.';
          return true;
        },
      },
    );
    mensaje = String(value || '').trim();
  } catch {
    return;
  }

  marcandoObservacionIpress.value = Number(idIpress);
  try {
    await postAllIpress('/marcar_observacion_clinica/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(idIpress),
      id_modalidad: Number(modalidadGlobal.value),
      mensaje,
    });
    ElMessage.success('Observación enviada a la clínica.');
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'));
    window.dispatchEvent(new CustomEvent('notificacion-revision:actualizar'));
  } catch (e) {
    console.error(e);
    const msg =
      e?.response?.data?.detail ||
      e?.detail ||
      e?.error ||
      e?.message ||
      'No se pudo marcar la observación.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo marcar la observación.');
  } finally {
    marcandoObservacionIpress.value = null;
  }
}

function clampPagina() {
  const total = listaFiltrada.value.length;
  const size = pageSize.value;
  const maxP = Math.max(1, Math.ceil(total / size) || 1);
  if (pagina.value > maxP) pagina.value = maxP;
}

watch(listaFiltrada, clampPagina, { deep: true });
watch(pageSize, clampPagina);
watch([filtroNombre, filtroNotificado], () => {
  pagina.value = 1;
});

watch([periodoGlobal, modalidadGlobal], () => {
  pagina.value = 1;
  fetchLista();
}, { deep: true });

function onNotificacionRevisionEvent() {
  fetchLista();
}

onMounted(() => {
  cargarIpressAsignadasUsuario();
  fetchLista();
  window.addEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});

onUnmounted(() => {
  window.removeEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});
</script>
