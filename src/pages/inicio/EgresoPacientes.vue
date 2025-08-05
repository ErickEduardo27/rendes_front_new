<template>
  <div class="p-6 max-w-2xl mx-auto">
     <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>
   <!--  <h2 class="text-lg font-bold">Mes de Reporte: JUNIO</h2> -->
    <h3 class="text-md font-semibold mt-4">Egresar Pacientes:</h3>

    <!-- Búsqueda -->
    <div class="my-4 flex items-center gap-4">
      <label class="text-sm font-medium">Tipo de Documento*</label>
      <select v-model="tipoDocumento" class="border px-2 py-1 rounded">
        <option value="DNI">DNI</option>
        <option value="CE">CE</option>
        <option value="PASAPORTE">Pasaporte</option>
      </select>
      <input
        v-model="filtroDocumento"
        placeholder="Buscar número"
        class="border px-2 py-1 rounded w-full"
      />
    </div>

    <!-- Lista de pacientes filtrada -->
    <div v-for="paciente in pacientesFiltrados" :key="paciente.id_paciente_dialisis" class="border p-4 rounded mb-2 cursor-pointer hover:border-sky-400"
         @click="seleccionarPaciente(paciente)">
      <p class="font-medium">{{ paciente.paciente }}</p>
      <p class="text-sm text-gray-500">ESTADO: {{ paciente.estado }}</p>
    </div>

    <!-- Modal de egreso -->
    <div v-if="pacienteSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-[400px] space-y-4 shadow">
        <h4 class="text-lg font-bold">{{ pacienteSeleccionado.nombre }}</h4>
        <p class="text-sm text-gray-500">ESTADO: {{ pacienteSeleccionado.estado }}</p>

        <div>
          <label class="block text-sm font-medium mb-1">Fecha de Egreso</label>
          <input type="date" v-model="formEgreso.fecha" class="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Egreso</label>
          <select v-model="formEgreso.tipo" class="w-full border px-2 py-1 rounded">
            <option disabled value="">Seleccione</option>
            <option>Alta</option>
            <option>Transferencia</option>
            <option>Fallecimiento</option>
            <option>Otro</option>
          </select>
        </div>

        <div class="text-right pt-2">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm" @click="close">Cancelar</button>
          <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="egresarPaciente(pacienteSeleccionado)">
            Egresar Paciente
          </button>
          
        </div>
      </div>
    </div>

    <!-- Botón Final -->
    <div class="text-center mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">Terminar Egresos</button>
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
import { getAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service'
import { ref, computed, onMounted } from 'vue'

const tipoDocumento = ref('DNI')
const filtroDocumento = ref('')
const pacienteSeleccionado = ref(null)

const formEgreso = ref({
  fecha: '',
  tipo: ''
})

const pacientes = ref([])

// Búsqueda por número y tipo de documento
const pacientesFiltrados = computed(() => {
  return pacientes.value.filter(
    p =>
      p.documento.includes(filtroDocumento.value.trim())
  )
})

const seleccionarPaciente = paciente => {
  pacienteSeleccionado.value = paciente
  formEgreso.value = { fecha: '', tipo: '' }
}
function close (){
   pacienteSeleccionado.value = null
}
const egresarPaciente = async (paciente) => {
  try {
    const respuesta = await patchAllIpress("/pacientes/"+paciente.id_paciente+"/",{estado:'EGRESADO'});
    /* periodoIpress.value = respuesta; */

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
  // Aquí podrías emitir un evento, guardar en backend, o marcar como egresado
  console.log('Egresado:', pacienteSeleccionado.value, formEgreso.value)
  pacienteSeleccionado.value = null
}

const fetchPacientes = async (url = null) => {
  try {
    const respuesta = await getAllIpress("/pacientes/?estado=NUEVO");
    pacientes.value = respuesta;
    console.log("paientes seleccionado", respuesta)

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
onMounted(() => {
  fetchPacientes();
});
</script>