<template>
  <div class="bg-white border rounded-lg p-5 shadow-sm my-6">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
          Bandeja de avisos
          <span
            v-if="noLeidas > 0"
            class="inline-flex min-w-[1.25rem] h-5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
          >
            {{ noLeidas > 99 ? '99+' : noLeidas }}
          </span>
        </p>
        <p class="text-xs text-gray-400">
          Correcciones del supervisor, formularios abiertos/cerrados y otros avisos del periodo.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          :disabled="cargando || lista.length === 0"
          @click="marcarTodasLeidas"
        >
          Marcar todas leídas
        </button>
        <router-link
          to="/notificaciones"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg text-cyan-700 border border-cyan-200 hover:bg-cyan-50"
        >
          Ver todas
        </router-link>
      </div>
    </div>

    <div v-if="cargando && lista.length === 0" class="text-sm text-slate-500 py-6 text-center">
      Cargando avisos…
    </div>
    <div
      v-else-if="lista.length === 0"
      class="text-sm text-slate-500 italic py-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50"
    >
      No tiene avisos pendientes.
    </div>
    <ul v-else class="space-y-2 max-h-[22rem] overflow-y-auto pr-1">
      <li
        v-for="n in lista"
        :key="n.id_notificacion"
        class="rounded-lg border p-3 transition-colors"
        :class="n.leida ? 'border-slate-200 bg-slate-50/40 opacity-80' : 'border-cyan-200 bg-cyan-50/30'"
      >
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <span
              class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
              :class="chipClass(n.tipo)"
            >
              {{ etiquetaTipo(n.tipo) }}
            </span>
            <span v-if="!n.leida" class="text-[10px] font-semibold text-cyan-700">Nueva</span>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">{{ formatearFecha(n.creado_en) }}</span>
        </div>
        <h3 class="font-semibold text-slate-800 text-sm mt-1.5">{{ n.titulo }}</h3>
        <p class="text-xs text-slate-600 mt-1 whitespace-pre-wrap line-clamp-3">{{ n.mensaje }}</p>
        <div class="mt-2 flex justify-end">
          <button
            v-if="!n.leida"
            type="button"
            class="text-xs font-semibold text-cyan-700 hover:text-cyan-900"
            @click="marcarLeida(n)"
          >
            Marcar como leída
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getAllIpress, patchAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';

const lista = ref([]);
const cargando = ref(false);
const noLeidas = ref(0);
let pollTimer = null;

function etiquetaTipo(tipo) {
  const m = {
    FORMULARIO_ABIERTO: 'Formulario abierto',
    FORMULARIO_CERRADO: 'Formulario cerrado',
    REGISTRO_DESAPROBADO: 'Desaprobado',
    SUPERVISOR_EDITO_REGISTRO: 'Corrección supervisor',
  };
  return m[tipo] || tipo || 'Aviso';
}

function chipClass(tipo) {
  if (tipo === 'FORMULARIO_ABIERTO') return 'bg-emerald-100 text-emerald-800';
  if (tipo === 'FORMULARIO_CERRADO') return 'bg-amber-100 text-amber-900';
  if (tipo === 'REGISTRO_DESAPROBADO') return 'bg-rose-100 text-rose-800';
  if (tipo === 'SUPERVISOR_EDITO_REGISTRO') return 'bg-violet-100 text-violet-800';
  return 'bg-slate-100 text-slate-700';
}

function formatearFecha(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

async function fetchNoLeidas() {
  try {
    const r = await getAllIpress('/notificaciones/no-leidas/');
    noLeidas.value = Number(r?.count) || 0;
  } catch {
    noLeidas.value = 0;
  }
}

async function cargar() {
  cargando.value = true;
  try {
    const res = await getAllIpress('/notificaciones/');
    const items = Array.isArray(res) ? res : res?.results || [];
    lista.value = items.slice(0, 8);
    await fetchNoLeidas();
  } catch (e) {
    console.error(e);
    lista.value = [];
  } finally {
    cargando.value = false;
  }
}

async function marcarLeida(n) {
  try {
    await patchAllIpress(`/notificaciones/${n.id_notificacion}/`, { leida: true });
    n.leida = true;
    await fetchNoLeidas();
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'));
  } catch (e) {
    console.error(e);
  }
}

async function marcarTodasLeidas() {
  try {
    await postAllIpress('/notificaciones/marcar-todas-leidas/', {});
    await cargar();
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'));
  } catch (e) {
    console.error(e);
  }
}

function onActualizar() {
  cargar();
}

onMounted(() => {
  cargar();
  pollTimer = setInterval(fetchNoLeidas, 60000);
  window.addEventListener('notificaciones:actualizar', onActualizar);
  window.addEventListener('focus', onActualizar);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
  window.removeEventListener('notificaciones:actualizar', onActualizar);
  window.removeEventListener('focus', onActualizar);
});
</script>
