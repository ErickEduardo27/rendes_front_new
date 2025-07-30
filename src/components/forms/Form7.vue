<!-- <template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">

        <h2 class="text-xl font-semibold mb-1">Datos Iniciales </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Red Asistencial *</label>
                <select v-model="red" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Red Prestacional Almenara</option>
                    <option value="2">Red Prestacional Rebagliati</option>
                    <option value="3">Red Prestacional Sabogal</option>
                    <option value="4">Red Asistencial Amazonas</option>
                    <option value="5">Red Asistencial Ancash</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Turno *</label>
                <select v-model="turno" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> No corresponde </option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Frecuencia *</label>
                <select v-model="frecuencia" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> LMV </option>
                    <option value="2"> MJS </option>
                    <option value="3"> 2_veces_por_semana </option>
                    <option value="4"> Otros </option>
                    <option value="5"> No corresponde </option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Vacunación Contra Hepatitis B</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Última dosis Administrada *</label>
                <select v-model="ultimaDosisAdm" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> 1ra. Dosis </option>
                    <option value="2"> 2da. Dosis </option>
                    <option value="3"> 3ra. Dosis </option>
                    <option value="4"> Refuerzo </option>
                </select>       
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de última dosis *</label>
                    <input v-model="fechaUltimaDosis" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Motivo de no Vacunación *</label>
                <select v-model="movNoVacunación" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> No aceptó la vacunación </option>
                    <option value="2"> Fallecio </option>
                    <option value="3"> Está hospitalizado </option>
                    <option value="4"> Cursa con proceso infeccioso</option>
                    <option value="5"> Tiene diagnóstico covid-19 </option>
                    <option value="6"> Tiene antecedente de vanucación reciente </option>
                    <option value="7"> Cambió de unidad </option>
                    <option value="8"> No corresponde </option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Vacunación contra Neumococo </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Vacunación *</label>
                    <input v-model="fcVacunacion" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Motivo de no Vacunación *</label>
                <select v-model="mtvNoVacunacion" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">No aceptó la vacunación</option>
                    <option value="2">Falleció</option>
                    <option value="3">Está hospitalizado</option>
                    <option value="4">Cursa con proceso infeccioso</option>
                    <option value="5">Tiene diagnostico COVID-19</option>
                    <option value="6">Tiene antecedente de vacunación reciente</option>
                    <option value="7">Cambio de unidad</option>
                    <option value="8">No corresponde </option>
                </select>
            </div>
        </div>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template> -->
<!-- <template>


<div class="p-6 space-y-6">

    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>

    
    <div class="flex items-center gap-2 flex-wrap">
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

      <label>Modalidad de Diálisis:</label>
      <select v-model="modalidad" class="border px-2 py-1 rounded">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
    </div>


    <div class="flex gap-6 mt-6">
     
      <div class="flex-1 space-y-6">
        <div class="space-y-6 max-h-[600px] overflow-y-auto pr-2 mt-2">

    
    <h2 class="text-xl font-semibold">Datos de Turno</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Turno</label>
        <select v-model="turno" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">No corresponde</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold">Frecuencia</label>
        <select v-model="frecuencia" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
          <option value="1">LMV</option>
          <option value="2">MJS</option>
          <option value="3">2 veces por semana</option>
          <option value="4">Otros</option>
          <option value="5">No corresponde</option>
        </select>
      </div>
    </div>

  
    <h2 class="text-xl font-semibold">Condición Serológica Actual</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label class="block text-sm font-semibold">VHB</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input type="date" class="w-full mt-2 border rounded p-2 text-sm" placeholder="Fecha de Vacunación" />
      </div>
      <div>
        <label class="block text-sm font-semibold">VHC</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input type="date" class="w-full mt-2 border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">VHI</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
        <input type="date" class="w-full mt-2 border rounded p-2 text-sm" />
      </div>
    </div>


    <h2 class="text-xl font-semibold">Vacunación Contra Hepatitis</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Tipo de AcHBs</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold">Estado según AcHBs</label>
        <input type="text" readonly class="w-full border rounded p-2 text-sm bg-gray-100" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Fecha de Vacunación</label>
        <input type="date" class="w-full border rounded p-2 text-sm" />
      </div>
    </div>


    <h2 class="text-xl font-semibold">Vacunación Contra Hepatitis B</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Última Dosis Administrada</label>
        <input type="text" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Fecha de Última Dosis</label>
        <input type="date" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Motivo de No Vacunación</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>

    <h2 class="text-xl font-semibold">Vacunación Contra COVID-19</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Última Dosis Administrada</label>
        <input type="text" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Fecha de Última Dosis</label>
        <input type="date" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Motivo de No Vacunación</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>

    
    <h2 class="text-xl font-semibold">Vacunación Contra Influenza</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Fecha de Vacunación</label>
        <input type="date" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Motivo de No Vacunación</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>

    
    <h2 class="text-xl font-semibold">Vacunación Contra Neumococo</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold">Fecha de Vacunación</label>
        <input type="date" class="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-semibold">Motivo de No Vacunación</label>
        <select class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>

   
    <div class="flex justify-end gap-4 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
      <button class="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
      <button class="bg-cyan-500 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button>
    </div>
  </div>
      </div>

   
      <div class="w-80 p-4 border rounded shadow">
        <div class="flex items-center justify-center mb-2">
          <div class="bg-gray-300 rounded-full h-16 w-16"></div>
        </div>
        <p class="text-center font-bold">Alejandro Antony Cerpa de la Cruz</p>
        <p class="text-center text-sm text-gray-600">DNI: 74456747</p>
        <ul class="text-sm text-gray-700 mt-4 space-y-1">
          <li><strong>Edad:</strong> 38</li>
          <li><strong>Sexo:</strong> Masculino</li>
          <li><strong>Tipo de Registro:</strong> Hemodiálisis</li>
          <li><strong>Estado:</strong> Nuevo</li>
          <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
        </ul>
        <div class="mt-4">
          <label class="text-sm font-medium">Historial de Registros</label>
          <select class="w-full border px-2 py-1 rounded">
            <option>Registro 1</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  
</template> -->

<template>
  <div class="p-6 space-y-6">
    <!-- Botón de regreso -->
    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>

    <!-- Filtros Superiores -->
    <div class="flex items-center gap-2 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
        <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
      </select>

      <label>Clínica:</label>
      <label>{{ paciente.ipress }}</label>

      <label>Modalidad de Diálisis:</label>
      <label>{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
    </div>

    <div class="flex gap-6 mt-6">
      <!-- Sección Izquierda (Formulario) -->
      <!-- Datos de Turno -->
      <div class="flex-1 space-y-6">
        <h2 class="text-xl font-semibold">Vacunación</h2>
        <p class="text-sm text-gray-500">Complete la información médica del paciente en las diferentes secciones</p>

        <!-- Datos de Turno -->
        <div>
          <h3 class="font-medium">Datos de Turno</h3>
          <div class="grid grid-cols-2 gap-4">
            <select class="border rounded px-2 py-1" v-model="form.turno">
              <option disabled selected>Seleccione una opción</option>
              <option>Mañana</option>
              <option>Tarde</option>
            </select>
            <select class="border rounded px-2 py-1" v-model="form.frecuencia">
              <option disabled selected>Seleccione una opción</option>
              <option>3 veces por semana</option>
              <option>2 veces por semana</option>
            </select>
          </div>
        </div>

        <!-- Condición Serológica -->
        <div>
          <h3 class="font-medium">Condición Serológica Actual</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-sm">VHB</label>
              <select class="w-full border rounded px-2 py-1" v-model="form.vhbEstado">
                <option>Seleccione una opción</option>
              </select>
              <input type="date" class="w-full border rounded px-2 py-1 mt-1" v-model="form.vhbFecha" />
            </div>
            <div>
              <label class="text-sm">VHC</label>
              <select class="w-full border rounded px-2 py-1" v-model="form.vhcEstado">
                <option>Seleccione una opción</option>
              </select>
              <input type="date" class="w-full border rounded px-2 py-1 mt-1" v-model="form.vhcFecha" />
            </div>
            <div>
              <label class="text-sm">VIH</label>
              <select class="w-full border rounded px-2 py-1" v-model="form.vihEstado">
                <option>Seleccione una opción</option>
              </select>
              <input type="date" class="w-full border rounded px-2 py-1 mt-1" v-model="form.vihFecha" />
            </div>
          </div>
        </div>

        <!-- Vacunación Contra Hepatitis -->
        <div>
          <h3 class="font-medium">Vacunación Contra Hepatitis</h3>
          <div class="grid grid-cols-3 gap-4">
            <select class="border rounded px-2 py-1" v-model="form.vacunaHepatitis">
              <option>Seleccione una opción</option>
            </select>
            <input type="text" class="border rounded px-2 py-1" placeholder="Estado según AcHBs"
              v-model="form.estadoAcHBs" disabled />
            <input type="date" class="border rounded px-2 py-1" v-model="form.fechaVacHepatitis" />
          </div>
        </div>

        <!-- Vacunación Contra Hepatitis B -->
        <div>
          <h3 class="font-medium">Vacunación Contra Hepatitis B</h3>
          <div class="grid grid-cols-3 gap-4">
            <input type="text" class="border rounded px-2 py-1" placeholder="Última Dosis Administrada"
              v-model="form.dosisHepatitisB" />
            <input type="date" class="border rounded px-2 py-1" placeholder="Fecha de Última Dosis"
              v-model="form.fechaHepatitisB" />
            <select class="border rounded px-2 py-1" v-model="form.motivoNoHepatitisB">
              <option>Motivo de No Vacunación</option>
            </select>
          </div>
        </div>

        <!-- Vacunación Contra Covid-19 -->
        <div>
          <h3 class="font-medium">Vacunación Contra Covid-19</h3>
          <div class="grid grid-cols-3 gap-4">
            <input type="text" class="border rounded px-2 py-1" placeholder="Última Dosis Administrada"
              v-model="form.dosisCovid" />
            <input type="date" class="border rounded px-2 py-1" placeholder="Fecha de Última Dosis"
              v-model="form.fechaCovid" />
            <select class="border rounded px-2 py-1" v-model="form.motivoNoCovid">
              <option>Motivo de No Vacunación</option>
            </select>
          </div>
        </div>

        <!-- Vacunación Contra Influenza -->
        <div>
          <h3 class="font-medium">Vacunación Contra Influenza</h3>
          <div class="grid grid-cols-2 gap-4">
            <input type="date" class="border rounded px-2 py-1" placeholder="Fecha de Vacunación"
              v-model="form.fechaInfluenza" />
            <select class="border rounded px-2 py-1" v-model="form.motivoNoInfluenza">
              <option>Motivo de No Vacunación</option>
            </select>
          </div>
        </div>

        <!-- Vacunación Contra Neumococo -->
        <div>
          <h3 class="font-medium">Vacunación Contra Neumococo</h3>
          <div class="grid grid-cols-2 gap-4">
            <input type="date" class="border rounded px-2 py-1" placeholder="Fecha de Vacunación"
              v-model="form.fechaNeumococo" />
            <select class="border rounded px-2 py-1" v-model="form.motivoNoNeumococo">
              <option>Motivo de No Vacunación</option>
            </select>
          </div>
        </div>


        <!-- Botones -->
        <div class="flex gap-2 mt-4">
          <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          <button class="bg-sky-500 text-white px-4 py-2 rounded">Registrar</button>
          <button class="bg-blue-700 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button>
        </div>
      </div>

      <!-- Perfil paciente -->
      <div class="w-80 p-4 border rounded shadow">
        <div class="flex items-center justify-center mb-2">
          <div class="bg-gray-300 rounded-full h-16 w-16"></div>
        </div>
        <p class="text-center font-bold">{{ pacienteSeleccionado.paciente }}</p>
        <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.documento }}</p>
        <ul class="text-sm text-gray-700 mt-4 space-y-1">
          <li><strong>Edad:</strong> {{ pacienteSeleccionado.fecha_nacimiento }}</li>
          <li><strong>Sexo:</strong> {{ pacienteSeleccionado.genero == "M" ? "Masculino" : "Femenino" }}</li>
          <li><strong>Tipo de Registro:</strong> {{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" :
            "Peritonial" }}
          </li>
          <li><strong>Estado:</strong> Nuevo</li>
          <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
        </ul>
        <div class="mt-4">
          <label class="text-sm font-medium">Historial de Registros</label>
          <select class="w-full border px-2 py-1 rounded">
            <option>Registro 1</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

// 👇 defineProps debe estar fuera de cualquier función
const { paciente, periodo } = defineProps({
  paciente: {
    type: Object,
    required: true
  },
  periodo: {
    type: Number,
    required: true
  }
})

const clinicaSeleccionada = ref('');
const clinicas = ref(['DA VIDA SAC.']);
const modalidad = ref('');

const form = {
  turno: null,
  frecuencia: null,
  // Condición Serológica
  vhbEstado: null,
  vhbFecha: null,
  vhcEstado: null,
  vhcFecha: null,
  vihEstado: null,
  vihFecha: null,
  // Vacunación Hepatitis
  vacunaHepatitis: null,
  estadoAcHBs: null,
  fechaVacHepatitis: null,
  // Vacunación Hepatitis B
  dosisHepatitisB: null,
  fechaHepatitisB: null,
  motivoNoHepatitisB: null,
  // Vacunación Covid-19
  dosisCovid: null,
  fechaCovid: null,
  motivoNoCovid: null,
  // Vacunación Influenza
  fechaInfluenza: null,
  motivoNoInfluenza: null,
  // Vacunación Neumococo
  fechaNeumococo: null,
  motivoNoNeumococo: null
}


const router = useRouter()
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo
// Puedes usar props.paciente o hacer destructuring:

console.log("Paciente recibido:", periodo)  // ✅ No lanzará error
const postForm = async (url = null) => {
  try {
    const respuesta = await postAllIpress(url ?? "/resultadosClinicos/", form);
    pacienteSeleccionado.value = respuesta;
    alert("Se registro con exito")
    window.location.reload()

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPaciente = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/pacientes/" + paciente.id_paciente);
    pacienteSeleccionado.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const periodos = ref([])
// Otros datos
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

onMounted(() => {
  fetchPaciente();
  fetchPeriodo();
});


const mes = ref('JULIO')
const anio = ref('2025')
const clinica = ref('DA VIDA S.A.C.')
const turno = ref('')
const frecuencia = ref('')


</script>

<!-- <script setup>
import { ref } from 'vue'

// Datos de Turno
const turno = ref('')
const frecuencia = ref('')

// Condición Serológica
const vhb = ref('')
const vhbFechaVacunacion = ref('')
const vhc = ref('')
const vhcFechaVacunacion = ref('')
const vhi = ref('')
const vhiFechaVacunacion = ref('')

// AcHBs
const tipoAcHBs = ref('')
const estadoAcHBs = ref('')
const fechaVacAcHBs = ref('')

// Vacunación Hepatitis B
const ultimaDosisHepB = ref('')
const fechaUltimaDosisHepB = ref('')
const motivoNoVacHepB = ref('')

// Vacunación COVID-19
const ultimaDosisCovid = ref('')
const fechaUltimaDosisCovid = ref('')
const motivoNoVacCovid = ref('')

// Vacunación Influenza
const fechaVacInfluenza = ref('')
const motivoNoVacInfluenza = ref('')

// Vacunación Neumococo
const fechaVacNeumococo = ref('')
const motivoNoVacNeumococo = ref('')

// Opciones sugeridas
const opcionesTurno = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: 'No corresponde' }
]

const opcionesFrecuencia = [
  { value: 'LMV', label: 'Lunes-Miércoles-Viernes' },
  { value: 'MJS', label: 'Martes-Jueves-Sábado' },
  { value: '2x', label: '2 veces por semana' },
  { value: 'otros', label: 'Otros' },
  { value: 'nc', label: 'No corresponde' }
]

const opcionesCondicion = [
  { value: 'negativo', label: 'Negativo' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'no se realizó', label: 'No se realizó' }
]

const opcionesTipoAcHBs = [
  { value: 'positivo', label: 'Positivo (>10 mUI/mL)' },
  { value: 'negativo', label: 'Negativo (<10 mUI/mL)' },
  { value: 'no evaluado', label: 'No evaluado' }
]

const opcionesDosis = [
  { value: '1ra', label: '1ra. Dosis' },
  { value: '2da', label: '2da. Dosis' },
  { value: '3ra', label: '3ra. Dosis' },
  { value: 'refuerzo', label: 'Refuerzo' }
]

const motivosNoVacunacion = [
  { value: 'rechazo', label: 'No aceptó la vacunación' },
  { value: 'fallecido', label: 'Falleció' },
  { value: 'hospitalizado', label: 'Está hospitalizado' },
  { value: 'proceso infeccioso', label: 'Cursa con proceso infeccioso' },
  { value: 'diagnóstico covid', label: 'Tiene diagnóstico COVID-19' },
  { value: 'vacuna reciente', label: 'Tiene antecedente de vacunación reciente' },
  { value: 'cambio unidad', label: 'Cambio de unidad' },
  { value: 'no corresponde', label: 'No corresponde' }
]
</script> -->