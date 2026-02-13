<template>
  <div class="p-6 space-y-6">
    <!-- Botón de regreso -->
    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>

    <!-- Filtros superiores -->
    <div class="flex items-center gap-2 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
        <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">
          {{ per.periodo }}
        </option>
      </select>

      <label>Clínica:</label>
      <label>{{ paciente.ipress }}</label>

      <label>Modalidad de Diálisis:</label>
      <label>{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 mt-4">
      <!-- Formulario principal -->
      <div class="flex-1 bg-white border rounded shadow p-6">
        <h2 class="text-xl font-semibold mb-1">Resultados Clínicos</h2>
        <p class="text-sm text-gray-600 mb-4">
          Complete la información médica del paciente
        </p>

        <!-- Resultados -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="campo in camposResultados" :key="campo.key">
            <label class="block font-semibold text-sm text-gray-700">
              {{ campo.label }}
            </label>

            <input
              v-model.number="form[campo.key]"
              type="number"
              :min="0"
              :step="campo.allowDecimals ? '0.01' : '1'"
              class="w-full border rounded p-2 text-sm"
              :readonly="campo.readonly"
              :class="{ 'bg-gray-100': campo.readonly }"
              @keydown="campo.allowDecimals ? permitirDecimal : bloquearDecimal"
            />
          </div>
        </div>

        <!-- Tiempo de diálisis -->
        <div class="mt-6 space-y-1">
          <label class="block font-semibold text-sm text-gray-700">Tiempo de Diálisis</label>
          <select v-model="form.tmpDialisis" class="w-full border rounded p-2 text-sm">
            <option value="">Seleccione una opción</option>
            <option value="1">2.00</option>
            <option value="2">2.25</option>
            <option value="3">2.50</option>
            <option value="4">2.75</option>
            <option value="5">3.00</option>
            <option value="6">3.25</option>
            <option value="7">3.50</option>
            <option value="8">3.75</option>
            <option value="9">4.00</option>
            <option value="10">4.25</option>
            <option value="11">4.50</option>
          </select>
        </div>

        <!-- 🔴 TRATAMIENTO ADMINISTRATIVO (SIN MODIFICAR) -->
        <h2 class="text-xl font-semibold mt-6 mb-2">Tratamiento Administrativo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Eritropoyetina</label>
            <select v-model="form.eritropoyetina" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Hierro</label>
            <select v-model="form.hierro" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Calcitriol</label>
            <select v-model="form.hiperparatiroidismo" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>
        </div>

        <!-- Botones -->
        <div class="mt-6 flex gap-4 justify-end">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
          <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            @click="postForm">
            Registrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

const { paciente, periodo } = defineProps({
  paciente: Object,
  periodo: Number
})

const pacienteSeleccionado = ref(paciente)
const periodoSeleccionado = ref(periodo)
const periodos = ref([])

const form = ref({
  tmpDialisis: null,
  eritropoyetina: null,
  hierro: null,
  hiperparatiroidismo: null,
  hb: null,
  calcio: null,
  fosforo: null,
  pthi: null,
  alb: null,
  calcioCorregido: null,
  kt: null,
  id_periodo_ipress: 17,
  id_red: 1,
  id_paciente: paciente.id_paciente
})

/* CAMPOS */
const camposResultados = [
  { label: 'Hb (gr/dl)', key: 'hb', allowDecimals: true },
  { label: 'Calcio (mg/dl)', key: 'calcio', allowDecimals: true },
  { label: 'Fosforo (mg/dl)', key: 'fosforo', allowDecimals: true },
  { label: 'PTHi (pg/ml)', key: 'pthi', allowDecimals: false },
  { label: 'Alb (gr/dl)', key: 'alb', allowDecimals: true },
  { label: 'Calcio corregido (mg/dl)', key: 'calcioCorregido', allowDecimals: true, readonly: true },
  { label: 'Kt/v', key: 'kt', allowDecimals: true }
]

/* ✅ CALCIO CORREGIDO SOLO SI Ca > 0 y Alb > 0 */
const calcioCorregidoCalculado = computed(() => {
  const calcio = Number(form.value.calcio)
  const alb = Number(form.value.alb)

  if (calcio > 0 && alb > 0) {
    return Math.round((calcio + 0.8 * (4 - alb)) * 100) / 100
  }

  return null
})

watch(calcioCorregidoCalculado, (nuevoValor) => {
  form.value.calcioCorregido = nuevoValor
})

/* VALIDACIONES */
function bloquearDecimal(e) {
  if (['.', ',', 'e', '-'].includes(e.key)) e.preventDefault()
}
function permitirDecimal(e) {
  if ([',', 'e', '-'].includes(e.key)) e.preventDefault()
}

/* DATA */
const fetchPeriodo = async () => {
  periodos.value = await getAllIpress("/periodos/")
}

const postForm = async () => {
  await postAllIpress("/resultadosClinicos/", form.value)
  alert("Se registró con éxito")
  window.location.reload()
}

onMounted(fetchPeriodo)
</script>
