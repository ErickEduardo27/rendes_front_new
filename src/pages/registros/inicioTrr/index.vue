<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-[100rem] mx-auto w-full">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-[#008f9c] rounded-full"></span>
          Inicio de TRR
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Pacientes en atención por periodo, IPRESS y modalidad. Use los filtros del encabezado para cargar la lista.
        </p>
      </div>

      <div class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
          <div class="sm:min-w-[200px]">
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              N° de Atenciones
            </label>
            <input
              v-model="numeroAtenciones"
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              placeholder="Ej. 120"
              class="w-full sm:w-40 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              :disabled="!filtroListo || guardando || cargando"
            />
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#008f9c] hover:bg-[#007a86] disabled:opacity-50"
              :disabled="!filtroListo || guardando || cargando || !puedeGuardar"
              @click="guardarNumeroAtenciones"
            >
              {{ guardando ? 'Guardando…' : 'Guardar' }}
            </button>
            <p v-if="cargando" class="text-xs text-slate-500">Cargando valor guardado…</p>
            <p v-else-if="ultimaActualizacion" class="text-xs text-slate-500">
              Última actualización: {{ ultimaActualizacion }}
            </p>
          </div>
        </div>
        <p v-if="!filtroListo" class="text-xs text-amber-700 mt-3">
          Seleccione periodo, clínica (IPRESS) y modalidad en la barra superior.
        </p>
        <p v-else-if="totalPacientesSistema != null" class="text-xs text-slate-500 mt-3">
          Pacientes registrados en el sistema para este filtro: <strong>{{ totalPacientesSistema }}</strong>
        </p>
      </div>

      <TablaPacientesAtencion />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import TablaPacientesAtencion from '@/components/pacientes/TablaPacientesAtencion.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const numeroAtenciones = ref('');
const cargando = ref(false);
const guardando = ref(false);
const ultimaActualizacion = ref('');
const totalPacientesSistema = ref(null);

const filtroListo = computed(() => {
  return (
    periodoGlobal.value != null && periodoGlobal.value !== '' &&
    clinicaGlobal.value != null && clinicaGlobal.value !== '' &&
    modalidadGlobal.value != null && modalidadGlobal.value !== ''
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
  params.set('id_periodo', String(periodoGlobal.value));
  params.set('id_ipress', String(clinicaGlobal.value));
  params.set('id_modalidad', String(modalidadGlobal.value));
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
    totalPacientesSistema.value = Number(resStats?.total) || 0;
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
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      numero_atenciones: Number(numeroAtenciones.value),
    });
    ultimaActualizacion.value = formatearFecha(res?.actualizado_en);
    ElMessage.success('N° de atenciones guardado correctamente.');
  } catch (e) {
    const msg = e?.detail || e?.error || e?.response?.data?.detail || e?.message || 'No se pudo guardar.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo guardar.');
  } finally {
    guardando.value = false;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  cargarNumeroAtenciones();
}, { deep: true, immediate: true });
</script>
