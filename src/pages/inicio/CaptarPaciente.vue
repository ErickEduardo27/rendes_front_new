<template>
  <div class="space-y-6">
    <!-- Botón Regresar -->
     <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>
    <!-- Filtros Superiores -->
    <!--  <div class="flex items-center gap-2">
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
    </div> -->

    <!-- Modalidad de Diálisis -->
    <!-- <div>
      <label class="text-sm">Modalidad de Diálisis</label>
      <select class="w-full border px-2 py-1 rounded" v-model="modalidad">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
    </div> -->

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

      <!-- <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="$emit('ingreso-extra')">INGRESO EXTRAORDINARIO</button> -->
    </div>

    <div class="text-center mt-2">
      <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="buscarPaciente">Buscar</button>
    </div>

    <!-- Resultado de búsqueda -->
    <!-- <div v-if="busquedaRealizada && pacienteEncontrado" class="mt-4">
      <div class="border p-3 rounded shadow">
        <strong>{{ pacienteEncontrado.paciente }}</strong>
      
      </div>

    </div> -->

    <!-- <div v-else-if="busquedaRealizada && !pacienteEncontrado" class="mt-4 text-center">
      <p class="text-gray-600">El paciente no ha sido encontrado en la base de Datos del Sistema</p>
      <p class="text-sm font-medium text-gray-700">Le recomendamos enviar correo o llamar a los Administradores</p>
      
    </div> -->

    <!-- Lista de Pacientes -->
    <div class="mt-4 space-y-2">
      <div v-for="p in pacientesFiltrados" :key="p.documento"
        class="border px-3 py-2 rounded hover:bg-gray-100 cursor-pointer" @click="seleccionarPaciente(p)">
        <p class="font-semibold">{{ p.paciente }}</p><!-- 
        <p class="text-xs">ESTADO: {{ p.estado }}</p> -->
      </div>
    </div>
    <div v-if="pacienteSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-[400px] space-y-4 shadow">
        <h4 class="text-lg font-bold">Paciente: {{ pacienteSeleccionado.paciente }}</h4>
        <p class="text-sm text-gray-500">Seleccione</p>
        <select v-model="periodoSeleccionado" class="border p-1 rounded" @change="searchPeriodoIpress">
          <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">{{ periodo.periodo
            }}
          </option>
        </select>
        <div class="d-flex align-items-center">
          <label>Clínica</label>
          <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearch" clearable
            placeholder="Ingrese algo" @select="handleSelect" :value-key="'ipress'"
            style="margin: 0 1rem;width: 200px;" />
        </div>




        <div class="text-right pt-2">
          <!-- <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="close">
            Cerrar
          </button>
          <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="egresarPaciente">
            Egresar Paciente
          </button> -->
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm" @click="close">Cancelar</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm" @click="patchPacienteDialisis(pacienteSeleccionado)">Captar</button>


        </div>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Home from './Home.vue'
import { useRouter } from 'vue-router'
import { getAllIpress, patchAllIpress, putAllIpress } from '@/services/ipress/Ipress.service'
const pacienteSeleccionado = ref(null)
const router = useRouter()
const idPeriodoIpress = ref(17)
const tipoDocumento = ref('DNI')
const numeroDocumento = ref('')
const modalidad = ref('')
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL')
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const mes = ref('JULIO')
const anio = ref('2025')

const pacientes = ref([])

const busquedaRealizada = ref(false)
const pacienteEncontrado = ref(null)
const mostrarFormularioIngreso = ref(false)
const mostrarRegistroFecha = ref(false)
const fechaIngreso = ref('')
const nuevoPaciente = ref({ nombre: '', modalidad: '', hospitalEsSalud: '' })
const periodos = ref()
const ipress = ref()
const idClinicaSeleccionada = ref(62877)
const idPerido = ref(55)
const idIpress = ref(62877)
const periodoIpress = ref([])
const periodoSeleccionado = ref(55)

const pacientesFiltrados = computed(() => {
  return pacientes.value
})

function seleccionarPaciente(paciente) {
  pacienteEncontrado.value = paciente
  busquedaRealizada.value = true
  pacienteSeleccionado.value = paciente
}
function pushHome() {
  router.push('/calidad-agua')
}

function buscarPaciente() {
  const encontrado = pacientes.value.find(p => p.documento === numeroDocumento.value)
  pacienteEncontrado.value = encontrado || null
  busquedaRealizada.value = true
}
function close() {
  pacienteSeleccionado.value = null
}
const patchPacienteDialisis = async (paciente) => {
  try {
    const respuesta = await patchAllIpress("/pacientesDialisis/"+paciente.id_paciente_dialisis+"/",{id_periodo_ipress:idPeriodoIpress.value});
    /* periodoIpress.value = respuesta; */

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPeriodoIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodoIpress/");
    periodoIpress.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const handleSelect = (item) => {
  idClinicaSeleccionada.value = item.id_ipress; // ID u otros datos
  searchPeriodoIpress();
};
function searchPeriodoIpress() {
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo === periodoSeleccionado.value
  );
  if (resultado) {
    idPeriodoIpress.value = resultado.id_periodo_ipress;

  }
  console.log("imprimiendo valor de id periodo ipress", idPeriodoIpress.value)
  idIpress.value = idClinicaSeleccionada.value
  idPerido.value = periodoSeleccionado.value
}

const querySearch = (queryString, cb) => {
  const results = queryString
    ? ipress.value.filter(r =>
      r.ipress?.toLowerCase().includes(queryString.toLowerCase())
    )
    : ipress.value;
  cb(results);
};
const fetchPacientes = async (url = null) => {
  /* try {
    const respuesta = await getAllIpress(url ?? "/pacientesDialisis/?id_periodo_ipress=null");
    pacientes.value = respuesta;
    console.log("paientes seleccionado", respuesta)

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  } */
 try {
    const respuesta = await getAllIpress("/pacientes/?estado=EGRESADO");
    pacientes.value = respuesta;
    console.log("paientes seleccionado", respuesta)

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/ipress/");
    ipress.value = respuesta

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

onMounted(() => {
  fetchPacientes();
  fetchIpress();
  fetchPeriodo();
  fetchPeriodoIpress();
});
</script>

<style scoped>
select,
input[type="text"],
input[type="date"] {
  font-size: 14px;
}
</style>
