<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Diagnóstico de Alta de Hospitalización (CIE10)</h2>
        <!-- Inputs lado a lado -->
        <!-- Filtros lado a lado -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Por Código:</label>
                <input v-model="filtroCodigo" type="text" placeholder="Buscar por código..."
                    class="w-full border rounded p-2 text-sm" />
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Por Descripción:</label>
                <input v-model="filtroDescripcion" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <!-- Lista filtrada con checkbox -->
        <div v-if="mostrarLista" class="space-y-1 mt-3">
            <ul>
                <li v-for="item in resultadosFiltrados" :key="item.id"
                    class="border p-2 rounded text-sm flex items-center gap-2">
                    <input type="checkbox" :value="item" v-model="seleccionados" />
                    <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                </li>
            </ul>
        </div>

        <!-- Mensaje si no hay resultados -->
        <div v-else-if="hayBusqueda" class="text-gray-500 text-sm italic mt-2">
            No se encontraron resultados.
        </div>

        <!-- Resultados seleccionados -->
        <div v-if="seleccionados.length > 0" class="mt-4">
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Seleccionados:</h3>
            <ul class="space-y-1 text-sm">
                <li v-for="item in seleccionados" :key="item.id"
                    class="bg-gray-100 p-2 rounded flex justify-between items-center">
                    <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                    <button @click="quitarSeleccion(item)" class="text-red-500 hover:underline text-xs">Quitar</button>
                </li>
            </ul>
        </div>

        <hr />
        <h2 class="text-xl font-semibold mb-1">Datos Adicionales</h2>
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Inicio de Hospitalización</label>
                <input v-model="fIniHos" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Alta de Hospitalización</label>
                <input v-model="fAltHos" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fuente *</label>
                <select v-model="fuente" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Epicrisis</option>
                    <option value="2">Informe de Alta</option>
                    <option value="3">Otro</option>
                </select>
            </div>
        </div>



        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>


<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const filtroCodigo = ref('');
        const filtroDescripcion = ref('');
        const seleccionados = ref([]);
        const fIniHos = ref('');
        const fAltHos = ref('');
        const fuente = ref('');

        const items = ref([
            { id: 1, codigo: 'A123', descripcion: 'Hipertensión esencial' },
            { id: 2, codigo: 'B456', descripcion: 'Diabetes tipo 2' },
            { id: 3, codigo: 'C789', descripcion: 'Asma bronquial' },
            // Agrega más diagnósticos según lo necesites
        ]);

        const resultadosFiltrados = computed(() => {
            return items.value.filter((item) => {
                const coincideCodigo = filtroCodigo.value
                    ? item.codigo.toLowerCase().includes(filtroCodigo.value.toLowerCase())
                    : true;

                const coincideDescripcion = filtroDescripcion.value.length >= 3
                    ? item.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase())
                    : true;

                return coincideCodigo && coincideDescripcion;
            });
        });

        const hayBusqueda = computed(() => {
            return filtroCodigo.value.length > 0 || filtroDescripcion.value.length >= 3;
        });

        const mostrarLista = computed(() => {
            return hayBusqueda.value && resultadosFiltrados.value.length > 0;
        });

        const quitarSeleccion = (item) => {
            seleccionados.value = seleccionados.value.filter(sel => sel.id !== item.id);
        };


        return {
            filtroCodigo,
            filtroDescripcion,
            resultadosFiltrados,
            seleccionados,
            mostrarLista,
            hayBusqueda,
            quitarSeleccion,
            fIniHos,
            fAltHos,
            fuente,
        };
    },
};
</script>