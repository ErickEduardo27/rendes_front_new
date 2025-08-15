<template>
  <div class="space-y-2 max-h-[500px] overflow-y-auto pr-2 mt-2 m-10">
    <h2 class="text-xl font-semibold">Datos Iniciales</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block font-semibold text-sm text-gray-700">Se realizó Controles</label>
        <select v-model="control" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
          <option value="1">Sí</option>
          <option value="2">No</option>
        </select>
      </div>
      <div class="space-y-2">
        <label class="block font-semibold text-sm text-gray-700">Periodo</label>
        <input v-model="periodo" type="date" class="w-full border rounded p-2 text-sm" />
      </div>
    </div>

    <h2 class="text-lg font-semibold mt-6">Recuento Bacteriano en Agua Tratada (UFC/ML)</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <input v-model="bacSaOsmosis" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
      <input v-model="bacAniCirculacion" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
    </div>

    <h2 class="text-lg font-semibold mt-6">Nivel de Endotoxinas en Agua Tratada (UE/ML)</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
        <select v-model="endoAguaTrata" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
      </div>
      <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
        <select v-model="rtnAnilloCir" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
      </div>
    </div>

    <h2 class="text-lg font-semibold mt-6">Recuento Bacteriano en Líquido de Diálisis (UFC/ML)</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <input v-model="bacMaquiHemodi" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
      <input v-model="bacMaquiHemodi2" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
    </div>

    <h2 class="text-lg font-semibold mt-6">Nivel de Endotoxinas en Agua Tratada (UE/ML)</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
        <select v-model="endMaquiHemodi" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
      </div>
      <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
        <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
      </div>
    </div>

    <div class="flex justify-between mt-8">
      <button class="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
      <div class="flex gap-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
        <button class="bg-blue-400 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const control = ref('');
const periodo = ref('');
const bacSaOsmosis = ref('');
const bacAniCirculacion = ref('');
const endoAguaTrata = ref('');
const rtnAnilloCir = ref('');
const bacMaquiHemodi = ref('');
const bacMaquiHemodi2 = ref('');
const endMaquiHemodi = ref('');
const endMaquiHemodi2 = ref('');
</script>
