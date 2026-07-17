<template>
  <div class="fecha-input" :class="{ 'fecha-input--disabled': disabled || readonly }">
    <input
      ref="textRef"
      type="text"
      class="fecha-input__text"
      :class="[inputClass, { 'fecha-input__text--error': hasError }]"
      :value="texto"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      maxlength="10"
      inputmode="numeric"
      autocomplete="off"
      @input="onInput"
      @blur="onBlur"
      @keydown.enter.prevent="onBlur"
    />
    <button
      v-if="mostrarCalendario && !readonly && !disabled"
      type="button"
      class="fecha-input__btn"
      title="Abrir calendario"
      tabindex="-1"
      @click="abrirCalendario"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
    <input
      v-if="mostrarCalendario"
      ref="pickerRef"
      type="date"
      class="fecha-input__native"
      tabindex="-1"
      aria-hidden="true"
      :value="isoActual || ''"
      :min="min || undefined"
      :max="max || undefined"
      @change="onPickerChange"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  parseFechaAISO,
  formatFechaDDMMAAAA,
  formatearFechaEscrita,
} from '@/utils/fechaFormat'

const props = defineProps({
  modelValue: { type: [String, Date, null], default: '' },
  /** 'iso' → v-model yyyy-mm-dd | 'display' → v-model dd/mm/aaaa */
  valueFormat: { type: String, default: 'iso' },
  placeholder: { type: String, default: 'dd/mm/aaaa' },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  mostrarCalendario: { type: Boolean, default: true },
  inputClass: { type: [String, Array, Object], default: '' },
  hasError: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

const textRef = ref(null)
const pickerRef = ref(null)
const texto = ref('')

const isoActual = computed(() => parseFechaAISO(props.modelValue) || parseFechaAISO(texto.value) || '')

function valorDesdeModelo(v) {
  if (v == null || v === '') return ''
  if (props.valueFormat === 'display') {
    return formatFechaDDMMAAAA(v) || String(v)
  }
  // iso: mostrar siempre en dd/mm/aaaa
  return formatFechaDDMMAAAA(v) || ''
}

function emitirDesdeTexto(raw) {
  const formateada = formatearFechaEscrita(raw)
  const iso = parseFechaAISO(formateada)
  if (!iso) {
    // Mantener lo escrito si aún no es válido (p. ej. mientras escribe)
    if (props.valueFormat === 'display') {
      emit('update:modelValue', formateada || '')
    } else {
      emit('update:modelValue', '')
    }
    return { formateada, iso: null }
  }
  if (props.min && iso < props.min) {
    /* se deja el valor; la validación de rango la hace el padre */
  }
  if (props.max && iso > props.max) {
    /* idem */
  }
  const out = props.valueFormat === 'display' ? formatFechaDDMMAAAA(iso) : iso
  emit('update:modelValue', out)
  emit('change', out)
  return { formateada: formatFechaDDMMAAAA(iso), iso }
}

function onInput(e) {
  let v = String(e.target.value || '')
  // Permitir solo dígitos y separadores mientras escribe
  v = v.replace(/[^\d/\-.]/g, '')
  const digitos = v.replace(/\D/g, '')
  // 8 dígitos seguidos (27031997) → formatear al instante
  if (/^\d{8}$/.test(v) || (digitos.length === 8 && !/[/\-.]/.test(v))) {
    const r = emitirDesdeTexto(digitos)
    texto.value = r.formateada || v
    return
  }
  texto.value = v
}

function onBlur(e) {
  const raw = String(texto.value || '').trim()
  if (!raw) {
    texto.value = ''
    emit('update:modelValue', '')
    emit('blur', e)
    return
  }
  const r = emitirDesdeTexto(raw)
  texto.value = r.formateada || raw
  emit('blur', e)
}

function onPickerChange(e) {
  const iso = e.target.value || ''
  if (!iso) {
    texto.value = ''
    emit('update:modelValue', '')
    emit('change', '')
    return
  }
  texto.value = formatFechaDDMMAAAA(iso) || ''
  const out = props.valueFormat === 'display' ? texto.value : iso
  emit('update:modelValue', out)
  emit('change', out)
}

function abrirCalendario() {
  const el = pickerRef.value
  if (!el) return
  if (typeof el.showPicker === 'function') {
    el.showPicker()
  } else {
    el.click()
  }
}

watch(
  () => props.modelValue,
  (v) => {
    const display = valorDesdeModelo(v)
    // No pisar mientras el usuario escribe un valor intermedio
    if (document.activeElement === textRef.value) return
    texto.value = display
  },
  { immediate: true },
)
</script>

<style scoped>
.fecha-input {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
}
.fecha-input__text {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  padding: 0.5rem 2.25rem 0.5rem 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  background: #fff;
}
.fecha-input__text:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 1px #06b6d4;
}
.fecha-input__text--error {
  border-color: #ef4444;
}
.fecha-input__text--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}
.fecha-input__btn {
  position: absolute;
  right: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: transparent;
}
.fecha-input__btn:hover {
  color: #0e7490;
  background: #f1f5f9;
}
.fecha-input__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.fecha-input--disabled .fecha-input__text {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.85;
}
</style>
