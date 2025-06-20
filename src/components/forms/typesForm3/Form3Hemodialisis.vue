<template>
    <div v-if="habilitado" class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">ACCESO PARA DIÁLISIS</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Colocación</label>
                <input v-model="feColocación" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Motivo de Cambio</label>
                <select v-model="mvtCambio" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Positivo</option>
                    <option value="2">Negativo</option>
                    <option value="3">Desconocido</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">FAV</option>
                    <option value="2">CVCT</option>
                    <option value="3">CVCLP</option>
                    <option value="4">Injerto autólogo</option>
                    <option value="5">Injerto protésico</option>
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
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">EVENTOS INFECCIOSOS ASOCIADOS AL ACCESO DE DIÁLISIS</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Evento</label>
                <input v-model="feEvento" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                <select v-model="accDialisis" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">FAV</option>
                    <option value="2">CVCT</option>
                    <option value="3">CVCLP</option>
                    <option value="4">Injerto autólogo</option>
                    <option value="5">Injerto protésico</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Infección?</label>
                <select v-model="tpInfeccion" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Bacteriana asociada a CVC</option>
                    <option value="2">Infección de orificio de salida</option>
                    <option value="3">Infección del túnel</option>
                    <option value="4">Peritonitis</option>

                </select>
            </div>
            
            <div class="flex flex-col lg:flex-row gap-4 w-full col-span-1 lg:col-span-2">
                <div class="flex-1 space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">
                        Tratamiento antimicrobial IV
                    </label>
                    <div class="flex items-center gap-2">
                        <span :class="!tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                        <button @click="tratamientoIV = !tratamientoIV"
                            class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                            :class="tratamientoIV ? 'bg-black' : 'bg-gray-300'">
                            <span
                                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                :class="tratamientoIV ? 'translate-x-6' : 'translate-x-1'" />
                        </button>
                        <span :class="tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                    </div>
                </div>

                <div class="flex-1 space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">
                        Vancomicina IV
                    </label>
                    <div class="flex items-center gap-2">
                        <span :class="!vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                        <button @click="vancomicinaIV = !vancomicinaIV"
                            class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                            :class="vancomicinaIV ? 'bg-black' : 'bg-gray-300'">
                            <span
                                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                :class="vancomicinaIV ? 'translate-x-6' : 'translate-x-1'" />
                        </button>
                        <span :class="vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                    </div>
                </div>

                <div class="flex-1 space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">
                        Hemocultivo positivo
                    </label>
                    <div class="flex items-center gap-2">
                        <span :class="!hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                        <button @click="hemocultivoPositivo = !hemocultivoPositivo"
                            class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                            :class="hemocultivoPositivo ? 'bg-black' : 'bg-gray-300'">
                            <span
                                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                :class="hemocultivoPositivo ? 'translate-x-6' : 'translate-x-1'" />
                        </button>
                        <span :class="hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                    </div>
                </div>
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Bacteria?</label>
                <select v-model="bacteria" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"></option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Infección?</label>
                <select v-model="tpInfeccion2" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Pus</option>
                    <option value="2">Enrojecimiento</option>
                    <option value="3">Aumento de volumen en el lugar de AV</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Germen?</label>
                <select v-model="tpGermen" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Staphylococcus aureus</option>
                    <option value="2">Staphylococcus epidermidis</option>
                    <option value="3">Escherichia coli</option>
                    <option value="4">Enterobacter cloacae</option>
                    <option value="5">Pseudomonas aeruginosa</option>
                    <option value="6">Klebsiella oxytoca</option>
                    <option value="7">Enterobacter aerogenes</option>
                    <option value="8">Proteus mirabilis</option>
                    <option value="9">Enterobacter hormaechei</option>
                    <option value="10">Staphylococcus haemolyticus	</option>
                    <option value="11">Staphylococcus especies</option>
                    <option value="12">Stenotrophomona maltophilia	</option>
                    <option value="13">Acinetobacter baumannii	</option>
                </select>
            </div>
            
            

        </div>
        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
    <div v-else class="text-gray-500 italic text-sm">
        Este formulario está deshabilitado porque el paciente no presenta infecciones.
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  habilitado: Boolean,
});

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

const data = ['Inicio de vancomicina IV', 'Hemocultivo positivo', 'Bacteri'];

const tratamientoIV = ref(false)
const vancomicinaIV = ref(false)
const hemocultivoPositivo = ref(false)
const feEvento = ref('')
const feColocación = ref('')
const accActual = ref('')
const mvtCambio = ref('')
const ubicacion = ref('')
const accDialisis = ref('')
const tpInfeccion = ref('')
const tpInfeccion2 = ref('')
const bacteria = ref('')
const tpGermen = ref('')



const ubicacionesFiltradas = computed(() => {
    ubicacion.value = '';
    return datosUbicaciones[accActual.value] || [];
});

</script>