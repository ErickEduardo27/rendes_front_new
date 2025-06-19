<template>
    <div class="p-6 bg-[#F9FCFF] min-h-full">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-semibold text-gray-800">Lista de IPRESS</h2>
                <p class="text-sm text-gray-500">Gestiona y visualiza la información de todos los establecimientos</p>
            </div>
            <div class="flex gap-3">
                <button class="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-blue-50">
                    Exportar
                </button>
                <button class="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0066cc]">
                    Nuevo IPRESS
                </button>
            </div>
        </div>

        <!-- Filtro y búsqueda -->
        <div class="flex items-center gap-4 mb-4">
            <div class="relative w-full max-w-md">
                <input v-model="search" type="text" placeholder="Buscar por ID, IPRESS o Red..."
                    class="w-full border border-gray-300 bg-white rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor"
                    stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 3 10a7.5 7.5 0 0 0 13.65 6.65Z" />
                </svg>
            </div>
            <select class="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 bg-white">
                <option>Todos los estados</option>
                <option>Activo</option>
                <option>Inactivo</option>
            </select>
        </div>

        <!-- Tabla -->
        <div class="overflow-x-auto rounded border border-cyan-100 bg-white">
            <table class="min-w-full text-sm text-left text-gray-700">
                <thead class="bg-cyan-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th class="border p-3">ID</th>
                        <th class="border p-3">IPRESS</th>
                        <th class="border p-3">Red</th>
                        <th class="border p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ipress in pacientes.results" :key="ipress.id_ipress" class="hover:bg-gray-50">
                        <td class="border p-3 font-medium">{{ ipress.id_ipress }}</td>
                        <td class="border p-3">{{ ipress.ipress }}</td>
                        <td class="border p-3">{{ ipress.datosRed.red }}</td>
                        <td class="flex border p-3 gap-5">
                            <button @click="showEditModal(pacientes)" class="text-[#007BFF] hover:underline">Editar</button>
                            <button @click="deletePaciente(ipress.id_ipress)" class="text-[#007BFF] hover:underline">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div class="flex justify-between items-center mt-4 text-sm text-[#6C7A91]">
            <div>Mostrando {{ pacientes.results.length }} de {{ pacientes.count }} IPRESS</div>
            <div class="flex items-center gap-2">
                <button @click="goToPreviousPage" :disabled="!pacientes.previous" class="px-3 py-1 border rounded"
                    :class="pacientes.previous ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
                    Anterior
                </button>

                <span class="px-3 py-1 border rounded bg-[#007BFF] text-white">
                    {{ currentPage }}
                </span>

                <button @click="goToNextPage" :disabled="!pacientes.next" class="px-3 py-1 border rounded"
                    :class="pacientes.next ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
                    Siguiente
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import { apiGetAutenticado } from '@/services/apiService/apiMethodService';
import { apiGetPaginado } from '@/services/ipress/Ipress.service';

export default {
    name: 'PatientTable',
    data() {
        return {
            pacientes: {
                results: [],
                count: 0,
                next: null,
                previous: null,
            },
            currentPage: 1,
            showModal: false,
            editingPaciente: null,
            form: {
                ipress: '',
                red: '',
            },
            filters: {
                ipress: '',
                red: '',
            },
            search: ''
        };
    },
    mounted() {
        this.fetchIpress();
    },
    methods: {
        /* TODO 
            Arreglar el axios
        */
        async fetchIpress(url = '/ipress/?page=1') {
            try {
                const respuesta = url.startsWith('http')  
                    ? await apiGetPaginado(url)
                    : await apiGetAutenticado(url);
                this.pacientes = respuesta;
                const urlParams = new URLSearchParams(url.split('?')[1]);
                this.currentPage = Number(urlParams.get('page')) || 1;
            } catch (error) {
                console.error('Error al obtener IPRESS:', error);
            }
        },
        clearFilters() {
            this.filters.ipress = '';
            this.filters.red = '';
            this.fetchPacientes();
        },
        showCreateModal() {
            this.editingPaciente = null;
            this.form = { ipress: '', red: '' };
            this.showModal = true;
        },
        showEditModal(paciente) {
            this.editingPaciente = paciente;
            this.form = { ...paciente };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async savePaciente() {
            try {
                if (this.editingPaciente) {
                    await axios.put(`http://10.0.54.88:8010/api/ipress/${this.editingPaciente.id}/`, this.form);
                } else {
                    await axios.post('http://10.0.54.88:8010/api/ipress/', this.form);
                }
                this.showModal = false;
                this.fetchPacientes();
            } catch (error) {
                console.error('Error al guardar IPRESS:', error);
            }
        },
        async deletePaciente(id) {
            if (confirm('¿Estás seguro de que quieres eliminar esta IPRESS?')) {
                try {
                    await axios.delete(`http://10.0.54.88:8010/api/ipress/${id}/`);
                    this.fetchPacientes();
                } catch (error) {
                    console.error('Error al eliminar IPRESS:', error);
                }
            }
        },
        goToNextPage() {
            if (this.pacientes.next) {
                this.fetchIpress(this.pacientes.next);
            }
        },
        goToPreviousPage() {
            if (this.pacientes.previous) {
                this.fetchIpress(this.pacientes.previous);
            }
        }
    },
};
</script>

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>