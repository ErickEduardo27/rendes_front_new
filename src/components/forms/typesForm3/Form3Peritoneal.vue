<template>
    <div v-if="habilitado" class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">ACCESO PARA DIÁLISIS</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Colocación</label>
                <input v-model="feColocación" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                    <option value="1">Catéter peritoneal</option>
                </select>
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
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">EVENTOS INFECCIOSOS ASOCIADOS AL ACCESO DE DIÁLISIS</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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



        <hr />


        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
    <div v-else class="text-gray-500 italic text-sm">
        Este formulario está deshabilitado porque el paciente no presenta infecciones.
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  habilitado: Boolean,
});

const feColocación = ref('')
const accActual = ref('')
const mvtCambio = ref('')
const accDialisis = ref('')
const tpGermen = ref('')
</script>