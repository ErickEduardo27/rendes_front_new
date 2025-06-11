<template>
    <div class="p-6 bg-white shadow rounded">
        <h2 class="text-xl font-semibold mb-4">Lista de IPRESS</h2>

        <!-- Filtros -->
        <div class="flex gap-4 mb-4">
            <input v-model="filters.ipress" placeholder="Buscar IPRESS" class="border p-2 rounded flex-1" />
            <input v-model="filters.red" placeholder="Buscar Red" class="border p-2 rounded flex-1" />
            <button @click="fetchPacientes" class="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
            <button @click="clearFilters" class="bg-gray-300 px-4 py-2 rounded">Limpiar</button>
        </div>

        <button @click="showCreateModal" class="mb-4 bg-green-500 text-white px-4 py-2 rounded">Nuevo IPRESS</button>

        <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-100">
                <tr>
                    <th class="border p-2">ID</th>
                    <th class="border p-2">IPRESS</th>
                    <th class="border p-2">Red</th>
                    <th class="border p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="paciente in pacientes" :key="paciente.id">
                    <td class="border p-2">{{ paciente.id }}</td>
                    <td class="border p-2">{{ paciente.ipress }}</td>
                    <td class="border p-2">{{ paciente.red }}</td>
                    <td class="border p-2 space-x-2">
                        <button @click="showEditModal(paciente)" class="bg-yellow-400 px-2 py-1 rounded">Editar</button>
                        <button @click="deletePaciente(paciente.id)"
                            class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal para Crear/Editar -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded w-96">
                <h3 class="text-lg font-semibold mb-4">{{ editingPaciente ? 'Editar' : 'Nuevo' }} IPRESS</h3>

                <input v-model="form.ipress" placeholder="IPRESS" class="w-full border p-2 mb-2 rounded" />
                <input v-model="form.red" placeholder="Red" class="w-full border p-2 mb-2 rounded" />

                <div class="flex justify-end space-x-2">
                    <button @click="closeModal" class="px-3 py-1 border rounded">Cancelar</button>
                    <button @click="savePaciente" class="px-3 py-1 bg-green-500 text-white rounded">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiGetAutenticado } from '@/services/apiService/apiMethodService';

export default {
    name: 'PatientTable',
    data() {
        return {
            pacientes: [],
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
        };
    },
    mounted() {
        this.fetchIpress();
    },
    methods: {
        async fetchIpress() {
            try {
                const respuesta = await apiGetAutenticado('/ipress/');
                this.pacientes = respuesta;
            } catch (error) {
                console.error('Error al enviar POST:', error);
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
    },
};
</script>

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>