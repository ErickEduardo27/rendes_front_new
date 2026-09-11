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
import { obtenerAtencionesTotalesImportacion } from '@/utils/importacionProduccionHdStorage';

const props = defineProps({
  periodo: { type: [Number, String], default: null },
  clinica: { type: [Number, String], default: null },
  modalidad: { type: [Number, String], default: null },
});

const cargando = ref(false);
const atencionesTotales = ref(null);
const tieneImportacion = ref(false);

const filtroListo = computed(() => (
  props.periodo != null && props.periodo !== ''
  && props.clinica != null && props.clinica !== ''
  && props.modalidad != null && props.modalidad !== ''
));

const textoSesiones = computed(() => {
  if (!filtroListo.value) return '—';
  if (cargando.value) return '…';
  if (atencionesTotales.value == null || atencionesTotales.value === '') return '—';
  return String(atencionesTotales.value);
});

const tituloValor = computed(() => {
  if (!tieneImportacion.value) {
    return 'Atenciones totales de la importación de tiempo de diálisis (ejecutadas + adicionales)';
  }
  return 'Atenciones totales (importación de producción HD)';
});

async function cargarSesionesDesdeImportacion() {
  if (!filtroListo.value) {
    atencionesTotales.value = null;
    tieneImportacion.value = false;
    return;
  }
  cargando.value = true;
  try {
    const total = await obtenerAtencionesTotalesImportacion(
      getAllIpress,
      props.periodo,
      props.clinica,
      props.modalidad,
    );
    atencionesTotales.value = total;
    tieneImportacion.value = total != null;
  } catch (e) {
    console.warn('N° Sesiones (importación):', e);
    atencionesTotales.value = null;
    tieneImportacion.value = false;
  } finally {
    cargando.value = false;
  }
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
