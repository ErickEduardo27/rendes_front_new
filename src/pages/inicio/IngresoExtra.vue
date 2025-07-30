<template>
  <div class="p-6 max-w-xl mx-auto space-y-4">
    <!-- Filtros Superiores -->
    <div class="flex items-center gap-2">
      <label>Mes de Reporte:</label>
      <select v-model="mes" class="border px-2 py-1 rounded">
        <option value="JULIO">JULIO</option>
        <option value="AGOSTO">AGOSTO</option>
      </select>

      <select v-model="anio" class="border px-2 py-1 rounded">
        <option value="2025">2025</option>
      </select>

      <label>Clínica:</label>
      <select v-model="clinicaSeleccionada" class="border px-2 py-1 rounded">
        <option v-for="c in clinicas" :key="c">{{ c }}</option>
      </select>
    </div>

    <!-- Modalidad de Diálisis -->
    <div>
      <label class="text-sm">Modalidad de Diálisis</label>
      <select class="w-full border px-2 py-1 rounded" v-model="modalidad">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
    </div>

    <!-- Formulario de Ingreso Extraordinario -->
    <h3 class="text-md font-bold">INGRESO EXTRAORDINARIO</h3>
    <p class="text-sm mb-2">Complete los respectivos datos del paciente para la creación del expediente médico.</p>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="text-sm font-medium">Tipo de Documento*</label>
        <select v-model="nuevoPaciente.tipoDocumento" class="w-full border px-2 py-1 rounded">
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="PASAPORTE">Pasaporte</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Número de Documento*</label>
        <input v-model="nuevoPaciente.numeroDocumento" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Apellidos y Nombres*</label>
        <input v-model="nuevoPaciente.nombre" class="w-full border px-2 py-1 rounded" />
      </div>
    </div>

    <div class="mt-4">
      <label class="text-sm font-medium">Modalidad de Diálisis</label>
      <select v-model="nuevoPaciente.modalidad" class="w-full border px-2 py-1 rounded mb-2">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>

      <label class="text-sm font-medium">Hospital de Procedencia de TTR en EsSalud: Modalidad</label>
      <input type="date" v-model="nuevoPaciente.hospitalEsSalud" class="w-full border px-2 py-1 rounded mb-2" placeholder="DD/MM/YY" />
    </div>

    <div class="flex justify-end gap-2">
      <button class="bg-gray-400 text-white px-4 py-1 rounded" @click="$emit('cancelar')">Cancelar</button>
      <button class="bg-sky-500 text-white px-4 py-1 rounded">Aceptar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mes = ref('JULIO')
const anio = ref('2025')
const clinicaSeleccionada = ref('DA VIDA SAC.')
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const modalidad = ref('')

const nuevoPaciente = ref({
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombre: '',
  modalidad: '',
  hospitalEsSalud: ''
})
</script>

<style scoped>
select, input[type="text"], input[type="date"] {
  font-size: 14px;
}
</style>
