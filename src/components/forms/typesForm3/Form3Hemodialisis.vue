<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Registro para Hemodialisis</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">FAV</option>
                    <option value="4">CVCT</option>
                    <option value="5">CVCLP</option>
                    <option value="6">Injerto autólogo</option>
                    <option value="7">Injerto protésico</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de evento</label>
                <input v-model="feEvento" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Inicio de Tratamiento antmicrobial IV</label>
                <select v-model="inicTrataMicrobial" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">FAV</option>
                    <option value="4">CVCT</option> 
                    <option value="5">CVCLP</option>
                    <option value="6">Injerto autólogo</option>
                    <option value="7">Injerto protésico</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hemocultivo positivo</label>
                <select v-model="hemoPositivo" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option> 
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Pus, enrojecimiento o aumento de volumen en lugar de AV</label>
                <select v-model="aumentoVolumenAV" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option> 
                </select>
            </div>
            <div class="space-y-2">
                <span class="block font-semibold text-sm text-gray-700">Observaciones</span>
                <textarea class="w-full border rounded p-2 text-sm"
                    placeholder="Información adicional..."></textarea>
            </div>
        </div>


        <hr />
        

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const feEvento = ref('')
const accActual = ref('')
const inicTrataMicrobial = ref('')
const hemoPositivo = ref('')
const aumentoVolumenAV = ref('')
</script>