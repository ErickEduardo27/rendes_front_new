<template>
  <div
    v-if="total > 0"
    class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/90 text-sm text-slate-600"
  >
    <span>
      Mostrando <strong class="text-slate-800">{{ desde }}</strong>–<strong class="text-slate-800">{{ hasta }}</strong>
      de <strong class="text-slate-800">{{ total }}</strong>
    </span>
    <div class="flex items-center gap-2">
      <label class="flex items-center gap-1.5 text-xs text-slate-500">
        <span>Por página</span>
        <select
          :value="pageSize"
          class="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800"
          @change="onPageSizeChange"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <button
        type="button"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        Anterior
      </button>
      <span class="text-xs tabular-nums text-slate-500">Pág. {{ page }} / {{ totalPages }}</span>
      <button
        type="button"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, default: 15 },
  total: { type: Number, required: true },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 15, 25, 50],
  },
});

const emit = defineEmits(['update:page', 'update:pageSize']);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const desde = computed(() => {
  if (props.total === 0) return 0;
  return (props.page - 1) * props.pageSize + 1;
});

const hasta = computed(() => Math.min(props.page * props.pageSize, props.total));

function go(p) {
  const clamped = Math.min(Math.max(1, p), totalPages.value);
  emit('update:page', clamped);
}

function onPageSizeChange(e) {
  const n = Number(e.target.value);
  if (!Number.isFinite(n) || n < 1) return;
  emit('update:pageSize', n);
  emit('update:page', 1);
}
</script>
