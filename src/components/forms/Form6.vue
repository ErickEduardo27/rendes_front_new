<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">

        <h2 class="text-xl font-semibold mb-1">Datos Iniciales </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Se realizó Controles *</label>
                <select v-model="control" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Periodo *</label>
                <select v-model="periodo" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">2025_10</option>
                    <option value="2">2025_9</option>
                    <option value="3">2025_8</option>
                    <option value="4">2025_7</option>
                    <option value="5">2024_6</option>
                    <option value="6">2024_5</option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Recuento Bacteriano en Agua Tratada (UFC/ML)</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Salida de la Ósmosis *</label>
                <input v-model="bacSaOsmosis" type="number" placeholder="Sólo se aceptan valores numéricos..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Retorno del Anillo de Circulación *</label>
                <input v-model="bacAniCirculacion" type="number" placeholder="Sólo se aceptan valores numéricos..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Nivel de endotoxinas en Agua Tratada (UE/ML)</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Salida de la Ósmosis *</label>
                <select v-model="endoAguaTrata" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> <= 0.25  </option>
                    <option value="2"> > 0.25 </option>
                    <option value="3"> <= 0.03 </option>
                    <option value="4"> > 0.03 </option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Retorno del Anillo de Circulación *</label>
                <select v-model="rtnAnilloCir" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> <= 0.25  </option>
                    <option value="2"> > 0.25 </option>
                    <option value="3"> <= 0.03 </option>
                    <option value="4"> > 0.03 </option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Recuento Bacteriano en Líquido de Diálisis (UFC/ML)</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Máquina de Hemodiálisis 1 *</label>
                <input v-model="bacMaquiHemodi" type="number" placeholder="Sólo se aceptan valores numéricos..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Máquina de Hemodiálisis 2 *</label>
                <input v-model="bacMaquiHemodi2" type="number" placeholder="Sólo se aceptan valores numéricos..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Recuento endotoxinas en Líquido de Diálisis (UE/ML)</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Máquina de Hemodiálisis 1 *</label>
                <select v-model="endMaquiHemodi" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> <= 0.25 (Normal) </option>
                    <option value="2"> > 0.25 (Anormal) </option>
                    <option value="1"> <= 0.03 (Normal) </option>
                    <option value="2"> > 0.03 (Anormal) </option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Máquina de Hemodiálisis 2 *</label>
                <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> <= 0.25 (Normal) </option>
                    <option value="2"> > 0.25 (Anormal) </option>
                    <option value="1"> <= 0.03 (Normal) </option>
                    <option value="2"> > 0.03 (Anormal) </option>
                </select>
            </div>
        </div>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const control = ref('');
const periodo = ref('');
const bacSaOsmosis = ref('');
const bacAniCirculacion = ref('');
const endSaOsmosis = ref('');
const endAniCirculacion = ref('');
const bacMaquiHemodi = ref('');
const bacMaquiHemodi2 = ref('');
const endMaquiHemodi = ref('');
const endMaquiHemodi2 = ref('');

const endoAguaTrata = ref('')
const rtnAnilloCir = ref('')

</script>