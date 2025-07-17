<template>
  <div class="p-6 max-w-xl mx-auto space-y-4">
    <h2 class="text-lg font-bold">Mes de Reporte: JUNIO</h2>
    <h3 class="text-md font-semibold">Captación de Paciente:</h3>

    <!-- Formulario -->
    <div class="grid grid-cols-2 gap-4 items-center">
      <div>
        <label for="tipoDocumento" class="text-sm font-medium">Tipo de Documento*</label>
        <select id="tipoDocumento" v-model="tipoDocumento" class="w-full border px-2 py-1 rounded">
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="PASAPORTE">Pasaporte</option>
        </select>
      </div>

      <div>
        <label for="numeroDocumento" class="text-sm font-medium invisible block">Número de Documento*</label>
        <input
          id="numeroDocumento"
          v-model="numeroDocumento"
          class="w-full border px-2 py-1 rounded"
          :class="{ 'border-red-500': busquedaRealizada }"
          placeholder="74456747"
        />
      </div>
    </div>

    <!-- Resultado de la búsqueda -->
    <div v-if="busquedaRealizada" class="mt-6 space-y-4">
      <!-- Si se encontró -->
      <div v-if="pacienteEncontrado">
        <div class="border p-4 rounded bg-gray-50">
          <h4 class="font-semibold">{{ pacienteEncontrado.nombre }}</h4>
          <p class="text-sm text-gray-600">
            ESTADO: {{ pacienteEncontrado.estado }} &nbsp;&nbsp;
            Clínica: {{ pacienteEncontrado.clinica }}
          </p>
        </div>
        <p class="text-sm italic text-gray-500 mt-2">
          El paciente ya ha sido captado por la clínica {{ pacienteEncontrado.clinica }}.
        </p>
      </div>

      <!-- Si NO se encontró -->
      <div v-else>
        <p class="text-sm italic text-gray-500">
          El paciente no ha sido encontrado en la base de Datos del Sistema
        </p>
        <p class="text-md font-medium text-gray-700">
          Le recomendamos enviar correo o llamar a los Administradores
        </p>
      </div>
    </div>

    <!-- Botón Aceptar -->
    <div class="text-center mt-4">
      <button
        class="bg-sky-500 text-white px-4 py-2 rounded"
        @click="buscarPaciente"
      >
        Aceptar
      </button>
      <button
        class="bg-gray-400 text-white px-4 py-2 rounded"
        @click="$emit('cancelar')"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Inputs del formulario
const tipoDocumento = ref('DNI')
const numeroDocumento = ref('')

// Estado de búsqueda
const busquedaRealizada = ref(false)
const pacienteEncontrado = ref(null) // objeto o null

// Lista simulada de pacientes (puede ser una API)
const basePacientes = [
  {
    documento: '74456747',
    tipo: 'DNI',
    nombre: 'Alejandro Antony Cerpa de la Cruz',
    estado: 'CONTINUATION',
    clinica: 'Nefrología S.A.C.'
  }
]

// Lógica al hacer clic en "Aceptar"
const buscarPaciente = () => {
  const paciente = basePacientes.find(
    p => p.documento === numeroDocumento.value && p.tipo === tipoDocumento.value
  )
  pacienteEncontrado.value = paciente || null
  busquedaRealizada.value = true
}
</script>