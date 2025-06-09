<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Etiologia</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Etiología general -->
            <div class="space-y-2">
                <span class="block font-semibold text-sm text-gray-700">Etiología general</span>
                <select v-model="etologiaGeneral" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option v-for="(label, key) in etologiasGenerales" :key="key" :value="key">
                        {{ label }}
                    </option>
                </select>
            </div>

            <!-- Etiología específica -->
            <div class="space-y-2 relative">
                <span class="block font-semibold text-sm text-gray-700">Etiología específica</span>

                <div class="w-full">
                    <button class="w-full border rounded p-2 text-sm text-left bg-white" @click="toggleDropdown"
                        :disabled="!etologiaGeneral">
                        <span v-if="seleccionadas.length">
                            {{ seleccionadas.join(', ') }}
                        </span>
                        <span v-else class="text-gray-400">Selecciona una o varias</span>
                    </button>

                    <!-- Dropdown -->
                    <div v-if="dropdownAbierto && etologiaGeneral"
                        class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        <label v-for="(item, index) in etologiasEspecificas[etologiaGeneral] || []" :key="index"
                            class="flex items-center p-2 text-sm hover:bg-gray-100">
                            <input type="checkbox" :value="item" v-model="seleccionadas" class="mr-2 accent-cyan-600" />
                            <span>{{ item }}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Comorbilidad</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Enfermedades Ateroescleróticas
                    cardicas?</label>
                <select v-model="comorbilidad1" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Insuficiencia cardíaca congestiva?</label>
                <select v-model="comorbilidad2" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Enfermedad vascular periférica?</label>
                <select v-model="comorbilidad3" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Accidente cerebrovascular / Accidente
                    isquémico transitorio?</label>
                <select v-model="comorbilidad4" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Cancer?</label>
                <select v-model="comorbilidad5" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Diabetes?</label>
                <select v-model="comorbilidad6" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Hipertensión?</label>
                <select v-model="comorbilidad7" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tuberculosis?</label>
                <select v-model="comorbilidad8" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="nose">No se sabe</option>
                </select>
            </div>

        </div>

        <div class="space-y-2">
            <span class="block font-semibold text-sm text-gray-700">Otros</span>
            <textarea class="w-full border rounded p-2 text-sm"
                placeholder="Describa la enfermedad actual del paciente..."></textarea>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Datos Adicionales</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Modalidad de Inicio de TRR</label>
                <select v-model="trr" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Hemodialisis</option>
                    <option value="2">Dialisis Peritoneal</option>
                    <option value="3">Trasplante Renal</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Inicio TRR</label>
                <input v-model="fechaDiagnostico" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">SubSistema de Salud de Inicio de TRR</label>
                <select v-model="subsist" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Essalud</option>
                    <option value="2">Minsa</option>
                    <option value="3">EPS</option>
                    <option value="4">FFAA</option>
                    <option value="5">FFPP</option>
                    <option value="6">Extranjero</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Tipo de Acceso de Inicio</label>
                <select v-model="tyacc" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">(FAV) Fistula Arteriovenosa</option>
                    <option value="2">Autoinjerto </option>
                    <option value="3">Injerto</option>
                    <option value="5">(CVCP) Cateter Venoso Central Permanente</option>
                    <option value="6">(CVCT) Cateter Venosos Central Temporal</option>
                    <option value="7">(Cperitoneal) Cateter Peritoneal</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Creacion Acceso de Inicio</label>
                <input v-model="fechaCreacionInicio" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Primer ingreso a la Unidad</label>
                <input v-model="fechaIngresoUnidad" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

        </div>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Historia Clínica
        </button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'


const etologiaGeneral = ref('')
const seleccionadas = ref([])
const dropdownAbierto = ref(false)

const etologiasGenerales = {
  1: 'DIABETES',
  2: 'GLOMERULONEFRITIS',
  3: 'GLOMERULONEFRITIS SECUNDARIA VASCULITIS',
  4: 'NEFRITIS INTERSTICIAL PIELONEFRITIS',
  5: 'HIPERTENSION ENFERMEDAD DE VASOS GRANDES',
  6: 'ENFERMEDAD QUISTICA HEREDITARIA CONGÉNITA',
  7: 'NEOPLASIAS TUMORES',
  8: 'OTRAS CONDICIONES'
}

const etologiasEspecificas = {
  1: ['Diabetes con manifestaciones renales tipo 1', 'Diabetes con manifestaciones renales tipo 2'],
  2: ['Glomerulonefritis aguda', 'Glomerulonefritis crónica'],
  3: ['Vasculitis asociada a ANCA', 'Lupus eritematoso sistémico'],
  4: ['Pielonefritis aguda', 'Pielonefritis crónica'],
  5: ['Hipertensión maligna', 'Estenosis de arteria renal'],
  6: ['Riñón poliquístico autosómico dominante', 'Síndrome de Alport'],
  7: ['Carcinoma de células renales', 'Linfoma renal'],
  8: ['Nefropatía por analgésicos', 'Amiloidosis renal']
}


const toggleDropdown = () => {
  dropdownAbierto.value = !dropdownAbierto.value
}

const comorbilidad1 = ref('')
const comorbilidad2 = ref('')
const comorbilidad3 = ref('')
const comorbilidad4 = ref('')
const comorbilidad5 = ref('')
const comorbilidad6 = ref('')
const comorbilidad7 = ref('')
const comorbilidad8 = ref('')

const trr = ref('')
const fechaDiagnostico = ref('')
const tyacc = ref('')
const subsist = ref('')
const fechaCreacionInicio = ref('')
const fechaIngresoUnidad = ref('')


watch(etologiaGeneral, () => {
  seleccionadas.value = []
  dropdownAbierto.value = false
})


const onClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    dropdownAbierto.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', onClickOutside)
})


</script>