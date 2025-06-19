<template>
    <div class="space-y-4 max-h-[490px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Comorbilidad</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="(label, index) in comorbilidadesLabels" :key="index"
                class="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-black transition-all duration-200">
                <span class="font-medium text-gray-800">{{ label }}</span>
                <div class="flex items-center gap-2">
                    <span :class="!estadoComorbilidades[index] ? 'text-black font-semibold' : 'text-gray-400'">
                        No
                    </span>

                    <button @click="toggleComorbilidad(index)"
                        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                        :class="estadoComorbilidades[index] ? 'bg-black' : 'bg-gray-300'">
                        <span
                            class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                            :class="estadoComorbilidades[index] ? 'translate-x-6' : 'translate-x-1'" />
                    </button>

                    <span :class="estadoComorbilidades[index] ? 'text-black font-semibold' : 'text-gray-400'">
                        Sí
                    </span>
                </div>
            </div>
        </div>

        <div v-if="estadoComorbilidades[comorbilidadesLabels.length - 1]" class="space-y-2 mt-4">
            <span class="block font-semibold text-sm text-gray-700">Describa Otra Comorbilidad</span>
            <textarea v-model="otraComorbilidadTexto"
                class="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describa la otra comorbilidad aquí..."></textarea>
        </div>

        <hr />
        <h2 class="text-xl font-semibold mb-1">Etiologia</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Etiología general -->
            <div class="space-y-2">
                <span class="block font-semibold text-sm text-gray-700">Etiología general</span>
                <select v-model="etologiaGeneral" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option v-for="(label, key) in filteredEtologiasGenerales" :key="key" :value="key">
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
                <input v-model="fechaDiagnostico" type="date" class="w-full border rounded p-2 text-sm"
                    :min="minFechaDependiente" />
                <p v-if="!isFechaDiagnosticoValid" class="text-red-500 text-xs mt-1">La fecha debe ser igual o posterior
                    a la Fecha de Creacion Acceso de Inicio.</p>
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
                <label class="block font-semibold text-sm text-gray -700">Tipo de Acceso de Inicio</label>
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
                <input v-model="fechaCreacionInicio" type="date" class="w-full border rounded p-2 text-sm"
                    :min="today" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Primer ingreso a la Unidad</label>
                <input v-model="fechaIngresoUnidad" type="date" class="w-full border rounded p-2 text-sm"
                    :min="minFechaDependiente" />
                <p v-if="!isFechaIngresoUnidadValid" class="text-red-500 text-xs mt-1">La fecha debe ser igual o
                    posterior a la Fecha de Creacion Acceso de Inicio.</p>
            </div>
        </div>
        <button @click="verFormData" class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Historia Clínica
        </button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useDateValidation } from '@/composables/useDateValidation'

const etologiasGenerales = {
    1: 'DIABETES',
    2: 'GLOMERULONEFRITIS',
    3: 'GLOMERULONEFRITIS SECUNDARIA/VASCULITIS',
    4: 'NEFRITIS INTERSTICIAL/PIELONEFRITIS',
    5: 'HIPERTENSION/ENFERMEDAD DE VASOS GRANDES',
    6: 'ENFERMEDAD QUISTICA/HEREDITARIA CONGÉNITA',
    7: 'NEOPLASIAS/TUMORES',
    8: 'COMPLICACIONES DE ÓRGANO TRASPLANTADO',
    9: 'OTRAS CONDICIONES'
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

const comorbilidadesLabels = [
    "Enfermedades Ateroescleróticas Cardiacas",
    "Insuficiencia Cardíaca Congestiva",
    "Enfermedad Vascular Periférica",
    "Accidente Cerebrovascular",
    "Cáncer",
    "Diabetes",
    "Hipertensión",
    "Tuberculosis",
    "Otra"
]

const estadoComorbilidades = ref(
    comorbilidadesLabels.map(() => false)
);

const otraComorbilidadTexto = ref('');

const otraComorbilidadIndex = comorbilidadesLabels.length - 1;

const isOtraComorbilidadSelected = computed(() => {
    return estadoComorbilidades.value[otraComorbilidadIndex];
});

const diabetesComorbilidadIndex = computed(() => {
    return comorbilidadesLabels.indexOf("Diabetes");
});

const toggleComorbilidad = (index) => {
    estadoComorbilidades.value[index] = !estadoComorbilidades.value[index];
    if (index === otraComorbilidadIndex && !estadoComorbilidades.value[index]) {
        otraComorbilidadTexto.value = '';
    }

    if (index === diabetesComorbilidadIndex.value && !estadoComorbilidades.value[index]) {
        if (etologiaGeneral.value === '1') {
            etologiaGeneral.value = '';
            seleccionadas.value = [];
        }
    }
};

const etologiaGeneral = ref('')
const seleccionadas = ref([])
const dropdownAbierto = ref(false)

const toggleDropdown = () => {
    dropdownAbierto.value = !dropdownAbierto.value
}

const trr = ref('')
const fechaDiagnostico = ref('')
const tyacc = ref('')
const subsist = ref('')
const fechaCreacionInicio = ref('')
const fechaIngresoUnidad = ref('')

// --- Lógica de validación de fechas ---
const {
  today,
  minFechaDependiente,
  isFechaDiagnosticoValid,
  isFechaIngresoUnidadValid,
  validateDates // La función de validación general
} = useDateValidation(fechaCreacionInicio, fechaDiagnostico, fechaIngresoUnidad);


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


const filteredEtologiasGenerales = computed(() => {
    if (estadoComorbilidades.value[diabetesComorbilidadIndex.value]) {
        const filtered = {};
        for (const key in etologiasGenerales) {
            if (etologiasGenerales[key] !== 'DIABETES') {
                filtered[key] = etologiasGenerales[key];
            }
        }
        return filtered;
    }
    return etologiasGenerales;
});


const generarFormData = () => {
    
    if (!validateDates()) {
        console.error("Formulario inválido. No se generó el FormData.");
        return null;
    }

    const formData = {
        comorbilidades: comorbilidadesLabels.map((label, index) => ({
            nombre: label,
            presente: estadoComorbilidades.value[index]
        })),
        otraComorbilidadTexto: isOtraComorbilidadSelected.value && otraComorbilidadTexto.value.trim() !== ''
            ? otraComorbilidadTexto.value.trim()
            : null,

        etologiaGeneral: etologiaGeneral.value || null,
        etologiasEspecificasSeleccionadas: seleccionadas.value.length > 0 ? seleccionadas.value : null,

        modalidadTRR: trr.value || null,
        fechaInicioTRR: fechaDiagnostico.value || null,
        subsistemaSaludInicioTRR: subsist.value || null,
        tipoAccesoInicio: tyacc.value || null,
        fechaCreacionAccesoInicio: fechaCreacionInicio.value || null,
        fechaPrimerIngresoUnidad: fechaIngresoUnidad.value || null,
    };

    return formData;
};

const verFormData = () => {
    const datosListos = generarFormData();
    console.log('--- FormData Generado ---');
    console.log(datosListos);
    console.log('-------------------------');
};
</script>