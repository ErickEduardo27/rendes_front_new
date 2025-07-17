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
<template>
  <div class="space-y-6 max-h-[600px] overflow-y-auto pr-2 mt-2">

    <!-- DATOS DE TURNO -->
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

    <!-- CONDICIÓN SEROLÓGICA -->
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

    <!-- VACUNACIÓN CONTRA HEPATITIS -->
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

    <!-- VACUNACIÓN CONTRA HEPATITIS B -->
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

    <!-- VACUNACIÓN CONTRA COVID-19 -->
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

    <!-- VACUNACIÓN CONTRA INFLUENZA -->
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

    <!-- VACUNACIÓN CONTRA NEUMOCOCO -->
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

    <!-- BOTONES -->
    <div class="flex justify-end gap-4 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
      <button class="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
      <button class="bg-cyan-500 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button>
    </div>
  </div>
</template>
<!-- <script setup>
import { ref } from 'vue';

const red = ref('');
const turno = ref('');
const frecuencia = ref('');
const ultimaDosisAdm = ref('')
const movNoVacunación = ref('');
const mtvNoVacunacion = ref('')
const fechaUltimaDosis = ref(''); 
const fcVacunacion = ref('')


</script> -->

<script setup>
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
</script>