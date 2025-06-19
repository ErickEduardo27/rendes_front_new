<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">

        <h2 class="text-xl font-semibold mb-1">Datos Iniciales </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Red Asistencial *</label>
                <select v-model="red" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Red Prestacional Almenara</option>
                    <option value="2">Red Prestacional Rebagliati</option>
                    <option value="3">Red Prestacional Sabogal</option>
                    <option value="4">Red Asistencial Amazonas</option>
                    <option value="5">Red Asistencial Ancash</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Turno *</label>
                <select v-model="turno" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> No corresponde </option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Frecuencia *</label>
                <select v-model="frecuencia" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> LMV </option>
                    <option value="2"> MJS </option>
                    <option value="3"> 2_veces_por_semana </option>
                    <option value="4"> Otros </option>
                    <option value="5"> No corresponde </option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Vacunación Contra Hepatitis B</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Última dosis Administrada *</label>
                <select v-model="ultimaDosisAdm" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> 1ra. Dosis </option>
                    <option value="2"> 2da. Dosis </option>
                    <option value="3"> 3ra. Dosis </option>
                    <option value="4"> Refuerzo </option>
                </select>       
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de última dosis *</label>
                    <input v-model="fechaUltimaDosis" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Motivo de no Vacunación *</label>
                <select v-model="movNoVacunación" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1"> No aceptó la vacunación </option>
                    <option value="2"> Fallecio </option>
                    <option value="3"> Está hospitalizado </option>
                    <option value="4"> Cursa con proceso infeccioso</option>
                    <option value="5"> Tiene diagnóstico covid-19 </option>
                    <option value="6"> Tiene antecedente de vanucación reciente </option>
                    <option value="7"> Cambió de unidad </option>
                    <option value="8"> No corresponde </option>
                </select>
            </div>
        </div>

        <hr />

        <h2 class="text-xl font-semibold mb-1">Vacunación contra Neumococo </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Vacunación *</label>
                    <input v-model="fcVacunacion" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Motivo de no Vacunación *</label>
                <select v-model="mtvNoVacunacion" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">No aceptó la vacunación</option>
                    <option value="2">Falleció</option>
                    <option value="3">Está hospitalizado</option>
                    <option value="4">Cursa con proceso infeccioso</option>
                    <option value="5">Tiene diagnostico COVID-19</option>
                    <option value="6">Tiene antecedente de vacunación reciente</option>
                    <option value="7">Cambio de unidad</option>
                    <option value="8">No corresponde </option>
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

const red = ref('');
const turno = ref('');
const frecuencia = ref('');
const ultimaDosisAdm = ref('')
const movNoVacunación = ref('');
const mtvNoVacunacion = ref('')
const fechaUltimaDosis = ref(''); 
const fcVacunacion = ref('')


</script>