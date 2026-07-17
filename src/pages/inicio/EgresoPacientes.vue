<template>
  <div class="space-y-6">
     <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>
   <!--  <h2 class="text-lg font-bold">Mes de Reporte: JUNIO</h2> -->
    <h3 class="text-md font-semibold mt-4">Egresar Pacientes:</h3>

    <!-- Búsqueda -->
    <div class="flex items-center gap-4 mb-4 flex-wrap">
      <div class="flex items-center gap-4">
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
      <div class="flex items-center gap-4 mt-2">
        <label class="text-sm font-medium">Nombre</label>
        <input
          v-model="filtroNombre"
          placeholder="Buscar por nombre"
          class="border px-2 py-1 rounded w-full"
        />
      </div>
    </div>


    <!-- Lista de pacientes filtrada con paginación -->
    <div v-for="paciente in pacientesPaginados" :key="paciente.id_paciente_dialisis" class="border p-4 rounded mb-2 cursor-pointer hover:border-sky-400"
         @click="seleccionarPaciente(paciente)">
      <p class="font-medium">{{ paciente.paciente }}</p>
      <p class="text-sm text-gray-500">DOCUMENTO: {{ paciente.documento }}</p>
      <p class="text-sm text-gray-500">ESTADO: {{ paciente.estado }}</p>
    </div>

    <!-- Controles de paginación -->
    <div v-if="totalPaginas > 1" class="flex justify-center items-center gap-2 my-4">
      <button class="px-2 py-1 rounded bg-gray-200" :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
      <span class="mx-2">Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button class="px-2 py-1 rounded bg-gray-200" :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
    </div>

    <!-- Modal de egreso -->
    <div v-if="pacienteSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-[400px] space-y-4 shadow">
        <h4 class="text-lg font-bold">{{ pacienteSeleccionado.paciente }}</h4>
        <p class="text-sm text-gray-500">ESTADO: {{ pacienteSeleccionado.estado }}</p>

        <div>
          <label class="block text-sm font-medium mb-1">Fecha de Egreso</label>
          <FechaInput v-model="formEgreso.fecha" input-class="w-full border px-2 py-1 rounded" />
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
          <button 
            class="bg-sky-500 text-white px-4 py-1 rounded" 
            :disabled="!formEgreso.fecha || !formEgreso.tipo"
            @click="egresarPaciente(pacienteSeleccionado)">
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

import { getAllIpress, patchAllIpress, postAllIpress } from '@/services/ipress/Ipress.service'
import { ref, computed, onMounted } from 'vue'

const tipoDocumento = ref('DNI')
const filtroDocumento = ref('')
const filtroNombre = ref('')
const pacienteSeleccionado = ref(null)

const formEgreso = ref({
  fecha: '',
  tipo: ''
})


const pacientes = ref([])

// Paginación
const paginaActual = ref(1)
const pacientesPorPagina = 5

const totalPaginas = computed(() => {
  return Math.ceil(pacientesFiltrados.value.length / pacientesPorPagina)
})

const pacientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * pacientesPorPagina
  return pacientesFiltrados.value.slice(inicio, inicio + pacientesPorPagina)
})

const periodos = ref([]);
const idPeriodo = ref(null);
// Búsqueda por número, tipo de documento y nombre
const pacientesFiltrados = computed(() => {
  const doc = filtroDocumento.value.trim().toLowerCase();
  const nombre = filtroNombre.value.trim().toLowerCase();
  const filtrados = pacientes.value.filter(
    p =>
      (!doc || (p.documento && p.documento.toLowerCase().includes(doc))) &&
      (!nombre || (p.paciente && p.paciente.toLowerCase().includes(nombre)))
  )
  // Reiniciar página si el filtro cambia y la página actual queda fuera de rango
  if ((paginaActual.value - 1) * pacientesPorPagina >= filtrados.length && paginaActual.value !== 1) {
    paginaActual.value = 1
  }
  return filtrados
})

const seleccionarPaciente = paciente => {
  pacienteSeleccionado.value = paciente
  formEgreso.value = { fecha: '', tipo: '' }
}
function close (){
   pacienteSeleccionado.value = null
}
const egresarPaciente = async (paciente) => {
  // Validar campos requeridos
  if (!formEgreso.value.fecha || !formEgreso.value.tipo) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  try {
    await patchAllIpress("/pacientes/"+paciente.id_paciente+"/",{
      estado: 'EGRESADO',
      fecha_egreso: formEgreso.value.fecha,
      tipo_egreso: formEgreso.value.tipo
    });
    
    // Refrescar lista de pacientes
    await registroPacienteHistorial(paciente);
    
  } catch (error) {
    console.error('Error al egresar paciente:', error);
    alert('Error al egresar paciente. Intente nuevamente.');
  }
}

const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;
    setPeriodoActual();
  } catch (error) {
    console.error('Error al obtener periodos:', error);
  }
};

function setPeriodoActual() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const periodoActual = `${year}-${month}`;
  const periodoEncontrado = periodos.value.find(p => p.periodo === periodoActual);
  idPeriodo.value = periodoEncontrado ? periodoEncontrado.id_periodo : null;
}

const registroPacienteHistorial = async (paciente) => {
  const payload = {
    paciente: paciente.id_paciente,
    periodo: idPeriodo.value,
    condicion: 'EGRESADO',
  };
  try {
    await postAllIpress("/PacienteRegistro/", payload);
    // Refrescar lista de pacientes
    // Cerrar modal
    pacienteSeleccionado.value = null;
    await fetchPacientes();
  } catch (error) {
    console.error('Error al registrar historial de paciente:', error);
  }
}
const fetchPacientes = async (url = null) => {
  try {
    const respuesta = await getAllIpress("/pacientes/?estado=NUEVO,REINGRESO");
    pacientes.value = respuesta;
    paginaActual.value = 1;
    console.log("paientes seleccionado", respuesta)
  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
onMounted(() => {
  fetchPacientes();
  fetchPeriodo();
});
</script>