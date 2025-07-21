
<template>
  <div>
    <div class="flex items-center gap-4 mb-4 flex-wrap">
      <h2 class="text-lg font-semibold">Mes de Reporte:</h2>
      <select v-model="mes" class="border px-2 py-1 rounded">
        <option v-for="(nombre, index) in meses" :key="index" :value="nombre">
          {{ nombre }}
        </option>
      </select>
      <select v-model="ano" class="border px-2 py-1 rounded">
        <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
      </select>

      <label>Clínica</label>
      <select v-model="clinicaSeleccionada" class="border p-1 rounded">
        <option value="todas">Todas</option>
        <option value="clinica san pablo">Clínica San Pablo</option>
        <option value="clinica internacional">Clínica Internacional</option>
        <option value="clinica delgado">Clínica Delgado</option>
      </select>

      <label>Modalidad de Diálisis</label>
      <select v-model="modalidadSeleccionada" class="border p-1 rounded">
        <option value="todos">Todos</option>
        <option value="hemodialisis">Hemodiálisis</option>
        <option value="dialisis peritoneal">Diálisis Peritoneal</option>
      </select>
    </div>

    <div class="flex items-center gap-4 my-4">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="aplicaTodos" />
        Aplica a todos los pacientes
      </label>
      <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('nuevo-registro')">
        Nuevo Registro
      </button>
      <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('captar-paciente')">
        Captar Paciente
      </button>
      <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('egresar-paciente')">
        Egresar Paciente
      </button>
    </div>

    <h3 class="text-md font-bold my-2">Pacientes Ingresados:</h3>
    <div class="grid grid-cols-9 font-semibold border-b pb-1 mb-1">
      <span class="col-span-2">Nombre</span>
      <span v-for="n in 7" :key="n">Formato {{ n }}</span>
    </div>

    <div
      v-for="paciente in pacientesFiltrados"
      :key="paciente.nombre"
      class="border rounded mb-3 p-3"
    >
      <div class="grid grid-cols-9 items-center">
        <div class="col-span-2 font-medium">
          {{ paciente.nombre }}
          <div class="text-sm text-gray-500 uppercase">
            {{ paciente.condicionLabel }}: {{ paciente.condicion }}<br />
            Modalidad: {{ paciente.modalidad }}<br />
            Clínica: {{ paciente.clinica }}
          </div>
        </div>
        <div v-for="n in 7" :key="n" class="text-center">
          <button
            @click="abrirFormulario(paciente, n)"
            class="text-lg hover:scale-110"
            title="Abrir Formulario"
          >
            <span :class="colorClase(n)">📝</span>
          </button>
        </div>
      </div>
    </div>

    <div class="text-right mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">
        Terminar Registro General
      </button>
    </div>

    <!-- Modal para formularios -->
    <teleport to="body">
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-4xl p-6 rounded shadow relative overflow-y-auto max-h-[90vh]">
          <button class="absolute top-2 right-3 text-xl text-gray-500 hover:text-black" @click="cerrarFormulario">✖</button>
          <component :is="componenteFormulario" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Form1 from '@/components/forms/typesForm2/Form2Hemodialisis.vue'
import Form2 from '@/components/forms/typesForm3/Form3Hemodialisis.vue'
import Form3 from '@/components/forms/Form4.vue'

const aplicaTodos = ref(true)
const modalidadSeleccionada = ref('todos')
const clinicaSeleccionada = ref('todas')
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)

const abrirFormulario = (paciente, numeroFormulario) => {
  switch (numeroFormulario) {
    case 1: componenteFormulario.value = Form1; break
    case 2: componenteFormulario.value = Form2; break
    case 3: componenteFormulario.value = Form3; break
    default: componenteFormulario.value = Form1
  }
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
}

const colorClase = (n) => {
  if (n === 1) return 'text-red-600'
  if (n === 2) return 'text-orange-500'
  if (n === 3) return 'text-yellow-500'
  if (n >= 4) return 'text-green-600'
  return 'text-gray-500'
}

const pacientes = ref([
  { nombre: 'Alejandro Antony Cerpa de la Cruz', condicion: 'CONTINUADOR', condicionLabel: 'CONDICIÓN', modalidad: 'hemodialisis', clinica: 'clinica san pablo' },
  { nombre: 'Maria Magdalena de la Cruz Ugarte', condicion: 'REINGRESO', condicionLabel: 'ESTADO', modalidad: 'dialisis peritoneal', clinica: 'clinica internacional' },
  { nombre: 'Jorge Luis Chavez Gomez', condicion: 'CONTINUADOR', condicionLabel: 'ESTADO', modalidad: 'hemodialisis', clinica: 'clinica delgado' },
  { nombre: 'Carmen Ramos', condicion: 'NUEVO', condicionLabel: 'ESTADO', modalidad: 'dialisis peritoneal', clinica: 'clinica san pablo' },
  { nombre: 'Luis Rojas', condicion: 'REINGRESO', condicionLabel: 'ESTADO', modalidad: 'hemodialisis', clinica: 'clinica internacional' },
  { nombre: 'Marina Castro', condicion: 'CONTINUADOR', condicionLabel: 'CONDICIÓN', modalidad: 'dialisis peritoneal', clinica: 'clinica san pablo' },
  { nombre: 'Pedro García', condicion: 'NUEVO', condicionLabel: 'ESTADO', modalidad: 'hemodialisis', clinica: 'clinica delgado' },
  { nombre: 'Julio Mendoza', condicion: 'REINGRESO', condicionLabel: 'ESTADO', modalidad: 'dialisis peritoneal', clinica: 'clinica internacional' },
  { nombre: 'Natalia Quispe', condicion: 'CONTINUADOR', condicionLabel: 'CONDICIÓN', modalidad: 'hemodialisis', clinica: 'clinica delgado' },
  { nombre: 'Sandra Torres', condicion: 'NUEVO', condicionLabel: 'ESTADO', modalidad: 'dialisis peritoneal', clinica: 'clinica san pablo' }
])

const pacientesFiltrados = computed(() => {
  return pacientes.value.filter(p => {
    const modalidadMatch = modalidadSeleccionada.value === 'todos' || p.modalidad === modalidadSeleccionada.value
    const clinicaMatch = clinicaSeleccionada.value === 'todas' || p.clinica === clinicaSeleccionada.value
    return modalidadMatch && clinicaMatch
  })
})

const fechaActual = new Date()
const meses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
]
const anios = Array.from({ length: 10 }, (_, i) => fechaActual.getFullYear() - i)
const mes = ref(meses[fechaActual.getMonth()])
const ano = ref(fechaActual.getFullYear())
</script>

<style scoped>
.text-red-600 {
  color: #dc2626;
}
.text-orange-500 {
  color: #f97316;
}
.text-yellow-500 {
  color: #eab308;
}
.text-green-600 {
  color: #16a34a;
}
</style>
