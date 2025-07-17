<template>
  <div>
    <div class="flex items-center gap-4 mb-4">
      <h2 class="text-lg font-semibold">Mes de Reporte:</h2>
      <select v-model="mes" class="border px-2 py-1 rounded">
        <option v-for="(nombre, index) in meses" :key="index" :value="nombre">
          {{ nombre }}
        </option>
      </select>
      <select v-model="ano" class="border px-2 py-1 rounded">
        <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>

    <div class="flex items-center gap-4 my-4">
      <label>Modalidad de Diálisis</label>
      <select class="border p-1 rounded">
        <option>Seleccione</option>
      </select>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="aplicaTodos" />
        Aplica a todos los pacientes
      </label>
      <button
        class="bg-sky-500 text-white px-4 py-1 rounded"
        @click="$emit('nuevo-registro')"
      >
        Nuevo Registro
      </button>
      <button
        class="bg-sky-500 text-white px-4 py-1 rounded"
        @click="$emit('captar-paciente')"
      >
        Captar Paciente
      </button>
      <button
        class="bg-sky-500 text-white px-4 py-1 rounded"
        @click="$emit('egresar-paciente')"
      >
        Egresar Paciente
      </button>
    </div>

    <h3 class="text-md font-bold my-2">Pacientes Ingresados:</h3>
    <div class="grid grid-cols-9 font-semibold border-b pb-1 mb-1">
      <span class="col-span-2">Nombre</span>
      <span v-for="n in 7" :key="n">Formato {{ n }}</span>
    </div>

    <div
      v-for="paciente in pacientes"
      :key="paciente.nombre"
      class="border rounded mb-3 p-3"
    >
      <div class="grid grid-cols-9 items-center">
        <div class="col-span-2 font-medium">
          {{ paciente.nombre }}
          <div class="text-sm text-gray-500 uppercase">
            {{ paciente.condicionLabel }}: {{ paciente.condicion }}
          </div>
        </div>
        <div v-for="n in 7" :key="n" class="text-center">2</div>
      </div>
    </div>

    <div class="text-right mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">
        Terminar Registro General
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const aplicaTodos = ref(true)

const pacientes = ref([
  { nombre: 'Alejandro Antony Cerpa de la Cruz', condicion: 'CONTINUADOR', condicionLabel: 'CONDICIÓN' },
  { nombre: 'Maria Magdalena de la Cruz Ugarte', condicion: 'REINGRESO', condicionLabel: 'ESTADO' },
  { nombre: 'Jorge Luis Chavez Gomez', condicion: 'CONTINUADOR', condicionLabel: 'ESTADO' }
])

const fechaActual = new Date()
const meses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
]
const anios = Array.from({ length: 10 }, (_, i) => fechaActual.getFullYear() - i)
const mes = ref(meses[fechaActual.getMonth()])
const ano = ref(fechaActual.getFullYear())
</script>