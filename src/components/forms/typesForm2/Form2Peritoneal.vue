<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Registro para Diálisis Peritoneal</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Ingreso/Reingreso a Unidad</label>
                <input v-model="feIngresoReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

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
                    <select v-model="evento.tyEgreso" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Fallecimiento</option>
                        <option value="2">hospitalización</option>
                        <option value="3">Trasplante</option>
                        <option value="4">Cambio de modalidad</option>
                        <option value="5">Cambio de unidad</option>
                        <option value="6">Otros</option>
                    </select>
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
import { computed, ref } from 'vue';

const condicion = ref('')
const feIngresoReingresoUni = ref('')
const busqueda = ref('')

const eventos = ref([
    { feEgreUni: '', tyEgreso: '', feReingresoUni: '' }
])

function agregarEvento() {
    eventos.value.push({ feEgreUni: '', tyEgreso: '', feReingresoUni: '' })
}


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