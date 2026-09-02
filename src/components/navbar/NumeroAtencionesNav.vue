<template>
  <div class="flex flex-wrap items-center gap-2 border-l border-gray-200 pl-4 min-w-0">
    <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide shrink-0">N° Sesiones:</h2>
    <div
      class="min-w-[4.5rem] border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-800 tabular-nums"
      :title="tituloValor"
    >
      {{ textoSesiones }}
    </div>
    <span v-if="cargando" class="text-[11px] text-slate-500 shrink-0">Cargando…</span>
    <span
      v-else-if="!filtroListo"
      class="text-[11px] text-amber-700 shrink-0"
    >
      Complete los filtros
    </span>
    <span
      v-else-if="!tieneImportacion"
      class="text-[11px] text-slate-500 shrink-0 hidden lg:inline"
      title="Importe el reporte de producción HD para ver el N° de sesiones"
    >
      Sin importación
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { leerImportacionLocal, esErrorEndpointNoDisponible } from '@/utils/importacionProduccionHdStorage';

const props = defineProps({
  periodo: { type: [Number, String], default: null },
  clinica: { type: [Number, String], default: null },
  modalidad: { type: [Number, String], default: null },
});

const cargando = ref(false);
const atencionesEjecutadas = ref(null);
const tieneImportacion = ref(false);

const filtroListo = computed(() => (
  props.periodo != null && props.periodo !== ''
  && props.clinica != null && props.clinica !== ''
  && props.modalidad != null && props.modalidad !== ''
));

const textoSesiones = computed(() => {
  if (!filtroListo.value) return '—';
  if (cargando.value) return '…';
  if (atencionesEjecutadas.value == null || atencionesEjecutadas.value === '') return '—';
  return String(atencionesEjecutadas.value);
});

const tituloValor = computed(() => {
  if (!tieneImportacion.value) {
    return 'Valor de atenciones ejecutadas de la importación de tiempo de diálisis';
  }
  return 'Atenciones ejecutadas (importación de producción HD)';
});

function buildQs() {
  const params = new URLSearchParams();
  params.set('id_periodo', String(props.periodo));
  params.set('id_ipress', String(props.clinica));
  params.set('id_modalidad', String(props.modalidad));
  return params.toString();
}

function aplicarPayload(data) {
  if (!data?.importado) {
    atencionesEjecutadas.value = null;
    tieneImportacion.value = false;
    return;
  }
  tieneImportacion.value = true;
  atencionesEjecutadas.value =
    data.atenciones_ejecutadas != null && data.atenciones_ejecutadas !== ''
      ? data.atenciones_ejecutadas
      : null;
}

async function cargarSesionesDesdeImportacion() {
  if (!filtroListo.value) {
    atencionesEjecutadas.value = null;
    tieneImportacion.value = false;
    return;
  }
  cargando.value = true;
  let encontrado = false;
  try {
    const data = await getAllIpress(`/consulta_importacion_produccion_hd/?${buildQs()}`);
    if (data?.importado) {
      aplicarPayload(data);
      encontrado = true;
    }
  } catch (e) {
    if (!esErrorEndpointNoDisponible(e)) {
      console.warn('N° Sesiones (importación):', e);
    }
  }

  if (!encontrado) {
    const local = leerImportacionLocal(props.periodo, props.clinica, props.modalidad);
    aplicarPayload(local);
  }
  cargando.value = false;
}

watch(
  () => [props.periodo, props.clinica, props.modalidad],
  () => {
    cargarSesionesDesdeImportacion();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  window.addEventListener('importacion-produccion-hd:actualizar', cargarSesionesDesdeImportacion);
});

onUnmounted(() => {
  window.removeEventListener('importacion-produccion-hd:actualizar', cargarSesionesDesdeImportacion);
});
</script>
