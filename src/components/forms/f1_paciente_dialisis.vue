<template>
    <div class="space-y-4 max-h-[490px] overflow-y-auto pr-2 mt-2">
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
        <h2 class="text-xl font-semibold mb-1">Comorbilidad</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="(item, index) in visibleComorbilidades" :key="item.originalIndex"
                class="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-black transition-all duration-200">
                <span class="font-medium text-gray-800">{{ item.label }}</span>
                <div class="flex items-center gap-2">
                    <span
                        :class="!estadoComorbilidades[item.originalIndex] ? 'text-black font-semibold' : 'text-gray-400'">
                        No
                    </span>

                    <button @click="toggleComorbilidad(item.originalIndex)"
                        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                        :class="estadoComorbilidades[item.originalIndex] ? 'bg-black' : 'bg-gray-300'">
                        <span
                            class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                            :class="estadoComorbilidades[item.originalIndex] ? 'translate-x-6' : 'translate-x-1'" />
                    </button>

                    <span
                        :class="estadoComorbilidades[item.originalIndex] ? 'text-black font-semibold' : 'text-gray-400'">
                        Sí
                    </span>
                </div>
            </div>
        </div>

        <div v-if="estadoComorbilidades[comorbilidadesLabels.indexOf('Otra')]" class="space-y-2 mt-4">
            <span class="block font-semibold text-sm text-gray-700">Describa Otra Comorbilidad</span>
            <textarea v-model="otraComorbilidadTexto"
                class="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describa la otra comorbilidad aquí..."></textarea>
        </div>


        <hr />
        <h2 class="text-xl font-semibold mb-1">Inicio de Terapia de Reemplazo Renal</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <FechaInput v-model="fechaCreacionInicio" input-class="w-full border rounded p-2 text-sm"
                    :min="today" />
            </div>
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
                <FechaInput v-model="fechaDiagnostico" input-class="w-full border rounded p-2 text-sm"
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
        </div>
        <button @click="verFormData" class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Historia Clínica
        </button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useDateValidation } from '@/composables/useDateValidation'
import { toast } from 'vue-sonner';

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
    2: ['Glomerulonefritis GN (Histológicamente no examinada)', 'Glomeruloesclerosis focal, Esclerosante focal', 'Nefropatía membranosa', 'GN Membranoproliferativa tipo I, GN Membranoproliferativa Difusa', 'Enfermedad por depósitos densos, GN membranoproliferativa tipo II', 'Nefropatía IgA, Enfermedad de Berger (demostrado por inmunofluorescencia)', 'Nefropatía IgM, (demostrado por inmunofluorescencia)', 'GN rápidamente progresiva', 'Gn post infecciosa', 'Otras GN proliferativas'],
    3: ['Lupus eritematoso', 'Síndrome de Henoch-Schonlein', 'Esclerodermia', 'Síndrome urémico hemolítico', 'Poliarteritis', 'Granulomatosis de Wegener', 'Nefropatía por abuso de heroína y relacionado a drogas', 'Otras vasculitis y sus derivadas', 'Síndrome de Goodpasture', 'Otras GN secundarias'],
    4: ['Abuso de analgésicos', 'Nefritis por radiación', 'Nefropatía por plomo', 'Nefropatía causada por otros agentes', 'Nefropatía por gota', 'Nefrolitiasis', 'Uropatía obstructiva adquirida', 'Pielonefritis crónica, nefropatía por reflujo', 'Nefritis intersticial crónica', 'Nefritis intersticial aguda', 'Urolitiasis', 'Otros desórdenes del metabolismo de calcio'],
    5: ['Hipertensión no especificada con falla renal', 'Estenosis de la arteria renal', 'Oclusión de la arteria renal', 'Embolia causada por coleterol, embolia renal'],
    6: ['Riñón poliquístico del adulto tipo dominante',
        'Riñón poliquistico infantil recesivo',
        'Enfermedad quística medular, incluye nefronoptisis',
        'Esclerosis tubular',
        'Nefritis hereditaria, síndrome de Alport',
        'Cistinosis',
        'Oxalosis primaria',
        'Enfermedad de Fabry',
        'Síndrome nefrótico congénito',
        'Síndrome Drash, esclerosis mesangial',
        'Obstrucción congénita de la unión ureteropélvica',
        'Obstrucción congénita de la unión ureterovesical',
        'Otras uropatías obstructivas congénitas',
        'Hipoplasia renal, displasia, oligonefronía',
        'Síndrome del abdomen en ciruela pasa',
        'Otros (Síndromes de malformaciones congénitas)'],
    7: ['Tumor renal maligno',
        'Tumor maligno del tracto urinario',
        'Tumor renal benigno',
        'Tumor benigno del tracto urinario',
        'Tumor renal no especificado',
        'Tumor de tracto urinario no especificado',
        'Linfoma de riñón',
        'Mieloma múltiple',
        'Otras neoplasias inmunoproliferativas (Incluye nefropatía de cadena ligera)',
        'Amiloidosis'],
    8: ['Complicaciones de órgano trasplantado no especificado',
        'Complicaciones por trasplante de riñón',
        'Complicaciones por trasplante de hígado',
        'Complicaciones por trasplante de corazón',
        'Complicaciones por trasplante de pulmón',
        'Complicaciones por trasplante de médula ósea',
        'Complicaciones por trasplante de páncreas',
        'Complicaciones por trasplante de intestino',
        'Complicaciones de otro órgano trasplantado especificado'],
    9: ['Enfermedad de células falciformes/anemia',
        'Rasgo de células falciformes y otras células falciformes (Hbs/Hb otras)',
        'Falla renal post parto',
        'Nefropatía por SIDA',
        'Pérdida traumática o quirúrgica de riñón',
        'Síndrome hepatorenal',
        'Necrosis tubular (sin recuperación)',
        'Otros desórdenes renales',
        'Etiología incierta',
        'Otras no especificadas (mencionar)']
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


const diabetesComorbilidadIndex = comorbilidadesLabels.indexOf("Diabetes");
const hipertensionComorbilidadIndex = comorbilidadesLabels.indexOf("Hipertensión");
const otraComorbilidadIndex = comorbilidadesLabels.indexOf("Otra");

const isOtraComorbilidadSelected = computed(() => {
    return estadoComorbilidades.value[otraComorbilidadIndex];
});

const toggleComorbilidad = (index) => {
    estadoComorbilidades.value[index] = !estadoComorbilidades.value[index];
    if (index === otraComorbilidadIndex && !estadoComorbilidades.value[index]) {
        otraComorbilidadTexto.value = '';
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

const {
    today,
    minFechaDependiente,
    isFechaDiagnosticoValid,
    validateDates
} = useDateValidation(fechaCreacionInicio, fechaDiagnostico);


watch(etologiaGeneral, (newValue) => {
    seleccionadas.value = []
    dropdownAbierto.value = false

    if (newValue === '1') {
        if (estadoComorbilidades.value[diabetesComorbilidadIndex]) {
            estadoComorbilidades.value[diabetesComorbilidadIndex] = false;
        }
    } else if (newValue === '5') {
        if (estadoComorbilidades.value[hipertensionComorbilidadIndex]) {
            estadoComorbilidades.value[hipertensionComorbilidadIndex] = false;
        }
    }
});

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

const visibleComorbilidades = computed(() => {
    const hiddenComorbilidades = [];

    if (etologiaGeneral.value === '1') {
        hiddenComorbilidades.push("Diabetes");
    }

    if (etologiaGeneral.value === '5') {
        hiddenComorbilidades.push("Hipertensión");
    }

    return comorbilidadesLabels
        .map((label, originalIndex) => ({ label, originalIndex }))
        .filter(item => !hiddenComorbilidades.includes(item.label));
});


const generarFormData = () => {

    if (!validateDates()) {
        toast.error("Formulario inválido. No se generó el FormData.");
        return null;
    }

    const finalComorbilidades = comorbilidadesLabels.map((label, index) => {
        let presente = estadoComorbilidades.value[index];

        // Si Etiología General es DIABETES y esta comorbilidad es Diabetes, forzar a false
        if (etologiaGeneral.value === '1' && label === 'Diabetes') {
            presente = false;
        }
        // Si Etiología General es HIPERTENSION y esta comorbilidad es Hipertensión, forzar a false
        if (etologiaGeneral.value === '5' && label === 'Hipertensión') {
            presente = false;
        }
        return {
            nombre: label,
            presente: presente
        };
    })

    const formData = {
        comorbilidades: finalComorbilidades,
        otraComorbilidadTexto: isOtraComorbilidadSelected.value && otraComorbilidadTexto.value.trim() !== ''
            ? otraComorbilidadTexto.value.trim()
            : null,

        etologiaGeneral: etologiaGeneral.value || null,
        etologiasEspecificasSeleccionadas: seleccionadas.value.length > 0 ? seleccionadas.value : null,

        modalidadTRR: trr.value || null,
        fechaInicioTRR: fechaDiagnostico.value || null,
        subsistemaSaludInicioTRR: subsist.value || null,
        tipoAccesoInicio: tyacc.value || null,
        fechaCreacionAccesoInicio: fechaCreacionInicio.value || null
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