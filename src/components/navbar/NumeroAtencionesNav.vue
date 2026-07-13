<template>
  <div class="flex flex-wrap items-center gap-2 border-l border-gray-200 pl-4 min-w-0">
    <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide shrink-0">N° Sesiones:</h2>
    <input
      v-model="numeroAtenciones"
      type="number"
      min="0"
      step="1"
      inputmode="numeric"
      placeholder="Ej. 120"
      class="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
      :disabled="!filtroListo || guardando || cargando"
    />
    <button
      type="button"
      class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#008f9c] hover:bg-[#007a86] disabled:opacity-50 shrink-0"
      :disabled="!filtroListo || guardando || cargando || !puedeGuardar"
      @click="guardarNumeroAtenciones"
    >
      {{ guardando ? 'Guardando…' : 'Guardar' }}
    </button>
    <span v-if="cargando" class="text-[11px] text-slate-500 shrink-0">Cargando…</span>
    <span
      v-else-if="filtroListo && totalPacientesSistema != null"
      class="text-[11px] text-slate-500 shrink-0 hidden lg:inline"
      :title="ultimaActualizacion ? `Última actualización: ${ultimaActualizacion}` : undefined"
    >
      <!-- Pacientes: <strong>{{ totalPacientesSistema }}</strong> -->
    </span>
    <span
      v-else-if="!filtroListo"
      class="text-[11px] text-amber-700 shrink-0"
    >
      Complete los filtros
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';

const props = defineProps({
  periodo: { type: [Number, String], default: null },
  clinica: { type: [Number, String], default: null },
  modalidad: { type: [Number, String], default: null },
});

const numeroAtenciones = ref('');
const cargando = ref(false);
const guardando = ref(false);
const ultimaActualizacion = ref('');
const totalPacientesSistema = ref(null);

const filtroListo = computed(() => {
  return (
    props.periodo != null && props.periodo !== '' &&
    props.clinica != null && props.clinica !== '' &&
    props.modalidad != null && props.modalidad !== ''
  );
});

const puedeGuardar = computed(() => {
  const texto = String(numeroAtenciones.value ?? '').trim();
  if (!texto) return false;
  const n = Number(texto);
  return Number.isInteger(n) && n >= 0;
});

function buildQs() {
  const params = new URLSearchParams();
  params.set('id_periodo', String(props.periodo));
  params.set('id_ipress', String(props.clinica));
  params.set('id_modalidad', String(props.modalidad));
  return params.toString();
}

function formatearFecha(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

async function cargarNumeroAtenciones() {
  if (!filtroListo.value) {
    numeroAtenciones.value = '';
    ultimaActualizacion.value = '';
    totalPacientesSistema.value = null;
    return;
  }
  cargando.value = true;
  try {
    const qs = buildQs();
    const [resInicio, resStats] = await Promise.all([
      getAllIpress(`/consulta_inicio_trr_periodo/?${qs}`),
      getAllIpress(`/pacienteAtencion/estadisticas/?${qs}`),
    ]);
    numeroAtenciones.value =
      resInicio?.numero_atenciones != null && resInicio?.numero_atenciones !== ''
        ? String(resInicio.numero_atenciones)
        : '';
    ultimaActualizacion.value = formatearFecha(resInicio?.actualizado_en);
    const stats = resStats || {};
    totalPacientesSistema.value =
      Number(stats.nuevos || 0)
      + Number(stats.reingresos || 0)
      + Number(stats.continuadores || 0)
      + Number(stats.egresados || 0);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo cargar el N° de atenciones.');
  } finally {
    cargando.value = false;
  }
}

async function guardarNumeroAtenciones() {
  if (!filtroListo.value || !puedeGuardar.value) return;
  guardando.value = true;
  try {
    const res = await postAllIpress('/guardar_inicio_trr_periodo/', {
      id_periodo: Number(props.periodo),
      id_ipress: Number(props.clinica),
      id_modalidad: Number(props.modalidad),
      numero_atenciones: Number(numeroAtenciones.value),
    });
    ultimaActualizacion.value = formatearFecha(res?.actualizado_en);
    ElMessage.success('N° de atenciones guardado correctamente.');
    window.dispatchEvent(new CustomEvent('registros-formularios:actualizar'));
  } catch (e) {
    const msg = e?.detail || e?.error || e?.response?.data?.detail || e?.message || 'No se pudo guardar.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo guardar.');
  } finally {
    guardando.value = false;
  }
}

watch(
  () => [props.periodo, props.clinica, props.modalidad],
  () => {
    cargarNumeroAtenciones();
  },
  { deep: true, immediate: true },
);
</script>
