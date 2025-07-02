<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Registro para Diálisis Peritoneal</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Ingreso/Reingreso a Unidad</label>
                <input v-model="feIngresoReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Modalidad de Diálisis Peritoneal ?</label>
                <select v-model="modDialPeri" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">DPAC</option>
                    <option value="2">DPA</option>
                </select>
            </div>

            <div class="space-y-2 col-span-1 lg:col-span-2">
                <label class="block font-semibold text-sm text-gray-700">Hospital de Precedencia</label>
                <input v-model="busqueda" type="text" placeholder="Escribe al menos 3 letras..."
                    class="w-full border rounded p-2 text-sm" />

                <!-- Lista filtrada -->
                <ul v-if="busqueda.length >= 3 && mostrarResultados" class="mt-2 space-y-1">
                    <li v-for="item in resultadosFiltrados" :key="item.id"
                        class="border p-2 rounded text-sm cursor-pointer hover:bg-gray-100"
                        @click="seleccionarHospital(item)">
                        {{ item.nombre }}
                    </li>
                    <li v-if="resultadosFiltrados.length === 0" class="text-gray-500 text-sm italic">
                        No se encontraron resultados.
                    </li>
                </ul>
            </div>
        </div>

        <hr />
        <div class="col-span-1 lg:col-span-2">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Serología Actual</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="serologia in serologiasLabels" :key="serologia"
                        class="bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-black transition-all duration-200">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium text-gray-800">{{ serologia }}</span>
                            <div class="flex items-center gap-2">
                                <select v-model="estadoSerologias[serologia].resultado"
                                    class="w-full border rounded p-2 text-sm">
                                    <option value="Desconocido">Desconocido</option>
                                    <option value="Positivo">Positivo</option>
                                    <option value="Negativo">Negativo</option>
                                </select>
                            </div>
                        </div>
                        </div>
                </div>
            </div>
        <hr />
        <div class="col-span-1 lg:col-span-2">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                    <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="">Seleccione una opción</option>
                        <option value="1">FAV</option>
                        <option value="2">Injerto autólogo</option>
                        <option value="3">Injerto protésico</option>
                        <option value="4">CVCLP</option>
                        <option value="5">CVCT</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Ubicación</label>
                    <select v-model="ubicacion" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option v-for="ubi in ubicacionesFiltradas" :key="ubi.value" :value="ubi.value">
                            {{ ubi.label }}
                        </option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Motivo Cambio de Acceso?</label>
                    <select v-model="motivCambioAcc" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Complicación mecánica</option>
                        <option value="2">Complicación infecciosa</option>
                        <option value="3">Prescripción Médica</option>
                    </select>
                </div>
            </div>
        </div>
        <hr>
        <div class="space-y-4">
            <h3 class="text-base font-semibold">Eventos de Egreso/Reingreso</h3>

            <div v-for="(evento, index) in eventos" :key="index"
                class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div class="space-y-2 lg:col-span-4">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Egreso de la Unidad</label>
                    <input v-model="evento.feEgreUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="space-y-2 lg:col-span-4">
                    <label class="block font-semibold text-sm text-gray-700">Tipo de Egreso</label>
                    <select v-model="evento.tyEgreso" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Fallecimiento</option>
                        <option value="2">Hospitalización</option>
                        <option value="3">Trasplante</option>
                        <option value="4">Cambio de modalidad</option>
                        <option value="5">Cambio de unidad</option>
                        <option value="6">Otros</option>
                    </select>
                    <input v-if="evento.tyEgreso === '6'" v-model="evento.otroEgreso" type="text"
                        placeholder="Especifique el tipo de egreso" class="w-full border rounded p-2 text-sm mt-2" />
                </div>

                <div class="space-y-2 lg:col-span-3">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Reingreso a la Unidad</label>
                    <input v-model="evento.feReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="flex justify-end lg:col-span-1" v-if="eventos.length > 1">
                    <button @click="eliminarEvento(index)" type="button"
                        class="text-red-600 border border-red-500 p-2 rounded-full hover:bg-red-100 transition"
                        title="Eliminar evento">
                        🗑️
                    </button>
                </div>
            </div>

            <button @click="agregarEvento" type="button" class="text-blue-600 text-sm mt-2 hover:underline">
                ➕ Agregar otro evento
            </button>
        </div>

        <div class="mt-4 space-y-2">
            <label class="block font-semibold text-sm text-gray-700">¿Presenta infecciones?</label>
            <select v-model="localInfeccion" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
        </div>

        <hr />



        <button @click="verFormData" class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const feIngresoReingresoUni = ref('')
const busqueda = ref('')
const modDialPeri = ref('')
const accActual = ref('')
const motivCambioAcc = ref('')
const ubicacion = ref('');

const eventos = ref([
    { feEgreUni: '', tyEgreso: '', otroEgreso: '', feReingresoUni: '' }
])

function agregarEvento() {
    eventos.value.push({ feEgreUni: '', tyEgreso: '', otroEgreso: '', feReingresoUni: '' })
}

const eliminarEvento = (index) => {
    eventos.value.splice(index, 1);
};

const serologiasLabels = ['VHB', 'VHC', 'VHI'];


const estadoSerologias = ref({
    VHB: { resultado: 'Desconocido' },
    VHC: { resultado: 'Desconocido' },
    VHI: { resultado: 'Desconocido' },
});


const toggleSerologia = (serologia) => {
    estadoSerologias.value[serologia].presente = !estadoSerologias.value[serologia].presente;
    if (!estadoSerologias.value[serologia].presente) {
        estadoSerologias.value[serologia].resultado = 'Desconocido';
    }
};

const datosUbicaciones = {
    '1': [ // FAV
        { value: 'izq_radial', label: 'Izquierda Radial' },
        { value: 'der_radial', label: 'Derecha Radial' },
        { value: 'der_braquial_cubi', label: 'Braquial o cubital derecha' },
        { value: 'izq_braquial_cubi', label: 'Braquial o cubital izquierdo' },
    ],
    '2': [ // Injerto autólogo
        { value: 'injer_autologo', label: 'Injerto autólogo' },
    ],
    '3': [ // Injerto protésico
        { value: 'injer_protesico', label: 'Injerto protésico' },

    ],
    '4': [ // CVCLP (Catéter Venoso Central Permanente)
        { value: 'yugular_izq', label: 'Yugular Izquierda' },
        { value: 'yugular_der', label: 'Yugular Derecha' },
        { value: 'subclavia_izq', label: 'Subclavia Izquierda' },
        { value: 'subclavia_der', label: 'Subclavia Derecha' },
        { value: 'femoral_izq', label: 'Femoral Izquierda' },
        { value: 'femoral_der', label: 'Femoral Derecha' },
        { value: 'otra_cvcp', label: 'Otra CVCP' },
    ],
    '5': [ // CVCT  (Catéter Venoso Central Temporal)
        { value: 'yugular_izq_temp', label: 'Yugular Izquierda' },
        { value: 'yugular_der_temp', label: 'Yugular Derecha' },
        { value: 'subclavia_izq_temp', label: 'Subclavia Izquierda' },
        { value: 'subclavia_der_temp', label: 'Subclavia Derecha' },
        { value: 'femoral_izq_temp', label: 'Femoral Izquierda' },
        { value: 'femoral_der_temp', label: 'Femoral Derecha' },
        { value: 'otra_cvct', label: 'Otra CVCT' },
    ]
};

const hospitales = ref([
    { id: 1, nombre: 'Centro Nefrológico Integral Renal Care SAC' },
    { id: 2, nombre: 'Hospital IV "Augusto Hernández Mendoza"' },
    { id: 3, nombre: 'Centro Médico Especializado Chincha' },
    { id: 4, nombre: 'Centro Nefrourológico del Sur SAC' },
    { id: 5, nombre: 'Hospital Nacional "Ramiro Prialé Prialé"' },
    { id: 6, nombre: 'Centro Renal San Martin de Porres S.A.C. - Centro Renal Alto Mayo' },
    { id: 7, nombre: 'Centro Renal Habich SAC' },
    { id: 8, nombre: 'Hospital II "Jorge Reátegui delgado"' },
])

const ubicacionesFiltradas = computed(() => {
    ubicacion.value = '';
    return datosUbicaciones[accActual.value] || [];
});


const mostrarResultados = ref(true)
const hospitalSeleccionado = ref(null)

const resultadosFiltrados = computed(() => {
    return hospitales.value.filter(h =>
        h.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    )
})

const seleccionarHospital = (hospital) => {
    hospitalSeleccionado.value = hospital
    busqueda.value = hospital.nombre
    mostrarResultados.value = false
}

const props = defineProps({
  presentaInfeccion: String
})

const emit = defineEmits(['update:presentaInfeccion'])

const localInfeccion = ref(props.presentaInfeccion ?? '')

watch(localInfeccion, (val) => {
  emit('update:presentaInfeccion', val)
})


const generarFormData = () => {

    const formData = {
        serologiaActual: Object.keys(estadoSerologias.value).map(key => ({
            nombre: key,
            resultado: estadoSerologias.value[key].resultado
        })),
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