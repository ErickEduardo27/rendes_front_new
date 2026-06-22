<template>
  <div class="mt-4 pt-4 border-t border-violet-100">
    <label class="block text-xs font-semibold text-slate-600 mb-1">Comentario para la clínica (supervisor)</label>
    <textarea
      :value="modelValue"
      rows="3"
      class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
      placeholder="Observaciones visibles en la vista de registros de la clínica…"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>
