


<template>
  <div class="space-y-6">
    <!-- Botón Regresar -->
    <div class="flex justify-start">
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        @click="pushHome()"
      >
        ← Regresar
      </button>
    </div>
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

    <!-- Captación -->
    <h3 class="text-md font-semibold">Captación de Paciente:</h3>
    <div class="grid grid-cols-3 gap-4 items-center">
      <div>
        <label class="text-sm font-medium">Tipo de Documento*</label>
        <select v-model="tipoDocumento" class="w-full border px-2 py-1 rounded">
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="PASAPORTE">Pasaporte</option>
        </select>
      </div>

      <div>
        <label class="invisible block">Número*</label>
        <input v-model="numeroDocumento" class="w-full border px-2 py-1 rounded" />
      </div>

      <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="$emit('ingreso-extra')">INGRESO EXTRAORDINARIO</button>
    </div>

    <div class="text-center mt-2">
      <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="buscarPaciente">Buscar</button>
    </div>

    <!-- Resultado de búsqueda -->
    <div v-if="busquedaRealizada && pacienteEncontrado" class="mt-4">
      <div class="border p-3 rounded shadow">
        <strong>{{ pacienteEncontrado.nombre }}</strong>
        <p class="text-sm">ESTADO: {{ pacienteEncontrado.estado }}<br/>Clínica: {{ pacienteEncontrado.clinica || 'No Registrado' }}</p>
      </div>
      <div v-if="pacienteEncontrado.estado === 'CONTINUATION'">
        <p class="text-sm text-gray-500">El paciente ya ha sido captado por la clínica {{ pacienteEncontrado.clinica }}.</p>
      </div>
      <div v-else-if="!pacienteEncontrado.clinica">
        <div class="text-center mt-2">
          <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="mostrarRegistroFecha = true">Aceptar</button>
        </div>
      </div>
    </div>

    <div v-else-if="busquedaRealizada && !pacienteEncontrado" class="mt-4 text-center">
      <p class="text-gray-600">El paciente no ha sido encontrado en la base de Datos del Sistema</p>
      <p class="text-sm font-medium text-gray-700">Le recomendamos enviar correo o llamar a los Administradores</p>
      
    </div>

    <!-- Lista de Pacientes -->
    <div class="mt-4 space-y-2">
      <div v-for="p in pacientesFiltrados" :key="p.documento" class="border px-3 py-2 rounded hover:bg-gray-100 cursor-pointer" @click="seleccionarPaciente(p)">
        <p class="font-semibold">{{ p.nombre }}</p>
        <p class="text-xs">ESTADO: {{ p.estado }}</p>
      </div>
    </div>

    <!-- Formulario ingreso extraordinario como bloque fijo -->
   <!--  <div v-if="mostrarFormularioIngreso" class="mt-6 border p-4 bg-gray-100 rounded">
      <h3 class="text-md font-bold">INGRESO EXTRAORDINARIO</h3>
      <p class="text-sm mb-2">Complete los datos del paciente</p>

      <input type="text" placeholder="Apellidos y Nombres*" class="w-full border px-2 py-1 rounded mb-2" v-model="nuevoPaciente.nombre" />
      <select v-model="nuevoPaciente.modalidad" class="w-full border px-2 py-1 rounded mb-2">
        <option disabled value="">Modalidad de Diálisis</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
      <input type="date" class="w-full border px-2 py-1 rounded mb-2" v-model="nuevoPaciente.hospitalEsSalud" placeholder="Hospital EsSalud" />

      <div class="flex justify-end gap-2">
        <button class="bg-gray-400 text-white px-4 py-1 rounded" @click="mostrarFormularioIngreso = false">Cancelar</button>
        <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="registrarNuevoPaciente">Aceptar</button>
      </div>
    </div> -->

    <!-- Registro de Fecha de Ingreso como bloque fijo -->
    <div v-if="mostrarRegistroFecha" class="mt-6 border p-4 bg-gray-100 rounded">
      <h3 class="text-md font-bold">{{ pacienteEncontrado.nombre }}</h3>
      <p>ESTADO: {{ pacienteEncontrado.estado }}</p>
      <input type="date" class="w-full border px-2 py-1 rounded mb-2" v-model="fechaIngreso" />
      <div class="flex justify-end gap-2">
        <button class="bg-gray-400 text-white px-4 py-1 rounded" @click="mostrarRegistroFecha = false">Cancelar</button>
        <button class="bg-sky-500 text-white px-4 py-1 rounded">Ingresar Paciente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tipoDocumento = ref('DNI')
const numeroDocumento = ref('')
const modalidad = ref('')
const clinicaSeleccionada = ref('DA VIDA SAC.')
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const mes = ref('JULIO')
const anio = ref('2025')

const pacientes = ref([
  { documento: '74456747', tipo: 'DNI', nombre: 'Alejandro Antony Cerpa de la Cruz', estado: 'CONTINUATION', clinica: 'Nefrología S.A.C.' },
  { documento: '12345678', tipo: 'DNI', nombre: 'Maria Magdalena de la Cruz Ugarte', estado: 'REINGRESO', clinica: 'DA VIDA SAC.' },
  { documento: '87654321', tipo: 'DNI', nombre: 'Jorge Luis Chavez Gomez', estado: 'NUEVO', clinica: '' }
])

const busquedaRealizada = ref(false)
const pacienteEncontrado = ref(null)
const mostrarFormularioIngreso = ref(false)
const mostrarRegistroFecha = ref(false)
const fechaIngreso = ref('')
const nuevoPaciente = ref({ nombre: '', modalidad: '', hospitalEsSalud: '' })

const pacientesFiltrados = computed(() => {
  return pacientes.value.filter(p => p.clinica === clinicaSeleccionada.value || clinicaSeleccionada.value === '')
})

function seleccionarPaciente(paciente) {
  pacienteEncontrado.value = paciente
  busquedaRealizada.value = true
}
function pushHome(){
  router.push('/calidad-agua')
}
function buscarPaciente() {
  const encontrado = pacientes.value.find(p => p.documento === numeroDocumento.value && p.tipo === tipoDocumento.value)
  pacienteEncontrado.value = encontrado || null
  busquedaRealizada.value = true
}

function registrarNuevoPaciente() {
  pacientes.value.push({
    documento: numeroDocumento.value,
    tipo: tipoDocumento.value,
    nombre: nuevoPaciente.value.nombre,
    estado: 'NUEVO',
    clinica: ''
  })
  mostrarFormularioIngreso.value = false
  pacienteEncontrado.value = pacientes.value[pacientes.value.length - 1]
  busquedaRealizada.value = true
}
</script>

<style scoped>
select, input[type="text"], input[type="date"] {
  font-size: 14px;
}
</style>


