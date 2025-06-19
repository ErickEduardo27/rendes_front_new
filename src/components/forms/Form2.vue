<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Datos Iniciales</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Ingreso / Reingreso a Unidad</label>
                <input v-model="ingreso" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

            <!-- Lista filtrada F2 ambas  -->
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Condición del Paciente en Unidad?</label>
                <select v-model="condicion" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Nuevo</option>
                    <option value="2">Reingreso</option>
                    <option value="3">Continuador</option>
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
        <hr />
        <h2 class="text-xl font-semibold mb-1">Condición Serológico Actual</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿VHB?</label>
                <select v-model="vhb" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Positivo</option>
                    <option value="2">Negativo</option>
                    <option value="3">Desconocido</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿VHC?</label>
                <select v-model="vhc" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Positivo</option>
                    <option value="2">Negativo</option>
                    <option value="3">Desconocido</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿VHI?</label>
                <select v-model="vhi" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Positivo</option>
                    <option value="2">Negativo</option>
                    <option value="3">Desconocido</option>
                </select>
            </div>

        </div>

        <hr />
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
                <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">FAV</option>
                    <option value="2">Autoinjerto</option>
                    <option value="3">Injerto</option>
                    <option value="4">CVCP</option>
                    <option value="5">CVCT</option>
                    <option value="6">Cperitoneal</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">¿Motivo Cambio de Acceso?</label>
                <select v-model="cambioAcc" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Complicación mecánica</option>
                    <option value="2">Complicación infecciosa</option>
                    <option value="3">Prescripción Médica</option>
                </select>
            </div>
        </div>

        <hr />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha Creacion de Acceso Actual</label>
                <input v-model="feCrea" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha Egreso de la Unidad</label>
                <input v-model="feEgre" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
        </div>


        <hr />

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';


const ingreso = ref('');
const condicion = ref('');
const busqueda = ref('')
const vhb = ref('');
const vhc = ref('');
const vhi = ref('');
const AcHBs = ref('');
const accActual = ref('');
const cambioAcc = ref('');
const feCrea = ref('');
const feEgre = ref('');

// Lista de ejemplo
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

</script>