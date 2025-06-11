<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Registro para Hemodiálisis</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Titulo de AcHBs?</label>
                <select v-model="AcHBs" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">
                        < 10 No Responde </option>
                    <option value="2"> 10-99 = Respuesta pobre </option>
                    <option value="3"> 100-999 = Óptimo </option>
                    <option value="4"> 1000+ = Excelente </option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Ubicación?</label>
                <select v-model="ubicacion" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> </option>
                    <option value="2"> </option>
                    <option value="3"> </option>
                    <option value="4"> </option>
                </select>
            </div>
        </div>

        <hr />

        <div class="space-y-4">
            <h3 class="text-base font-semibold">Eventos de Egreso/Reingreso</h3>

            <div v-for="(evento, index) in eventos" :key="index"
                class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Egreso de la Unidad</label>
                    <input v-model="evento.feEgreUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Tipo de Egreso</label>
                    <input v-model="evento.tyEgreso" type="text" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Reingreso a la Unidad</label>
                    <input v-model="evento.feReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>
            </div>

            <button @click="agregarEvento" type="button" class="text-blue-600 text-sm mt-2 hover:underline">
                ➕ Agregar otro evento
            </button>
        </div>

        <hr />


        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const AcHBs = ref('');
const ubicacion = ref('')

const eventos = ref([
    { feEgreUni: '', tyEgreso: '', feReingresoUni: '' }
])

function agregarEvento() {
    eventos.value.push({ feEgreUni: '', tyEgreso: '', feReingresoUni: '' })
}

</script>