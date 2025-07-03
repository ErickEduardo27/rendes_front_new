<template>
    <div v-if="habilitado" class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">ACCESO PARA DIÁLISIS</h2>
        <div v-for="(acceso, index) in accesosDialisis" :key="acceso.id" class="border p-4 mb-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-4">Acceso #{{ index + 1 }}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Fecha de Colocación</label>
                    <input v-model="acceso.feColocacion" type="date" class="w-full border rounded p-2 text-sm" />
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                    <select v-model="acceso.accActual" class="w-full border rounded p-2 text-sm">
                        <option value="1">Catéter peritoneal</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Motivo de Cambio</label>
                    <select v-model="acceso.mvtCambio" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Positivo</option>
                        <option value="2">Negativo</option>
                        <option value="3">Desconocido</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end mt-4" v-if="accesosDialisis.length > 1">
                <button @click="removeAcceso(index)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Eliminar Acceso
                </button>
            </div>
        </div>
        <button @click="addAcceso" class="bg-white border border-black hover:text-white px-4 py-2 rounded hover:bg-black mt-4 ml-4 transform transition duration-300 hover:scale-105">
            + Agregar Otro Acceso
        </button>

        <hr class="my-8 border-gray-300" />

        <h2 class="text-xl font-semibold mb-1">EVENTOS INFECCIOSOS ASOCIADOS AL ACCESO DE DIÁLISIS</h2>
        <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="border p-4 mb-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-4">Evento Infeccioso #{{ index + 1 }}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                    <select v-model="evento.accDialisis" class="w-full border rounded p-2 text-sm">
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
                    <select v-model="evento.tpGermen" class="w-full border rounded p-2 text-sm">
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
                        <option value="10">Staphylococcus haemolyticus </option>
                        <option value="11">Staphylococcus especies</option>
                        <option value="12">Stenotrophomona maltophilia </option>
                        <option value="13">Acinetobacter baumannii </option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end mt-4" v-if="eventosInfecciosos.length > 1">
                <button @click="removeEvento(index)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Eliminar Evento
                </button>
            </div>
        </div>
        <button @click="addEvento" class="bg-white border border-black hover:text-white px-4 py-2 rounded hover:bg-black mt-4 ml-4 transform transition duration-300 hover:scale-105">
            + Agregar Otro Evento Infeccioso
        </button>


        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900 mt-8">
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

const accesosDialisis = ref([
    {
        id: Date.now(),
        feColocacion: '',
        accActual: '',
        mvtCambio: '',
    }
]);

const eventosInfecciosos = ref([
    {
        id: Date.now() + 1, 
        accDialisis: '',
        tpGermen: '',
    }
]);


const addAcceso = () => {
    accesosDialisis.value.push({
        id: Date.now(),
        feColocacion: '',
        accActual: '',
        mvtCambio: '',
    });
};

const removeAcceso = (index) => {
    accesosDialisis.value.splice(index, 1);
};


const addEvento = () => {
    eventosInfecciosos.value.push({
        id: Date.now(),
        accDialisis: '',
        tpGermen: '',
    });
};

const removeEvento = (index) => {
    eventosInfecciosos.value.splice(index, 1);
};

</script>