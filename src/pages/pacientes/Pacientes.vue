<template>
    <div class="p-6 bg-[#F9FCFF] min-h-full">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-semibold text-gray-800">Lista de Pacientes</h2>
                <p class="text-sm text-gray-500">Gestiona y visualiza la información de todos los pacientes</p>
            </div>
            <div class="flex gap-3">
                <button class="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-blue-50">
                    Exportar
                </button>
                <button @click="showCreateModal()" class="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0066cc]">
                    Nuevo Paciente
                </button>
            </div>
        </div>

        <!-- Filtro y búsqueda -->
        <div class="flex items-center gap-4 mb-4">
            <div class="relative w-full max-w-md">
                <input v-model="search" type="text" placeholder="Buscar por id, documento o paciente..."
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
                        <th class="border p-3">Documento</th>
                        <th class="border p-3">Paciente</th>
                        <th class="border p-3">Fecha Nacimiento</th>
                        <th class="border p-3">Genero</th>
                        <th class="border p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="paciente in pacientes.results" :key="paciente.id_paciente" class="hover:bg-gray-50">
                        <td class="border p-3 font-medium">{{ paciente.id_paciente }}</td>
                        <td class="border p-3">{{ paciente.documento }}</td>
                        <td class="border p-3">{{ paciente.paciente }}</td>
                        <td class="border p-3">{{ paciente.fecha_nacimiento }}</td>
                        <td class="border p-3">{{ paciente.genero =='F'?'Masculino':'Femenino' }}</td>
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { getAllIpress } from "@/services/ipress/Ipress.service";
import UserTable from "../ipress/table.vue";

// Estado
const pacientes = reactive({
  results: [],
  count: 0,
  next: null,
  previous: null,
});

const currentPage = ref(1);
const showModal = ref(false);
const editingPaciente = ref(null);

const form = reactive({
  ipress: '',
  red: '',
});

const filters = reactive({
  ipress: '',
  red: '',
});

const search = ref('');


const fetchPacientes = async (url = null) => {
  try {
    let endpoint = url ?? "/indexPacientes/";
    if (!url && search.value.trim()) {
      endpoint += `?search=${encodeURIComponent(search.value.trim())}`;
    }
    const respuesta = await getAllIpress(endpoint);
    pacientes.results = respuesta.results;
    pacientes.count = respuesta.count;
    pacientes.next = respuesta.next;
    pacientes.previous = respuesta.previous;

    if (respuesta.next || respuesta.previous) {
      const nextUrl = new URL(respuesta.next ?? respuesta.previous);
      const pageParam = nextUrl.searchParams.get("page");
      currentPage.value = pageParam ? parseInt(pageParam) - (respuesta.next ? 1 : -1) : 1;
    } else {
      currentPage.value = 1;
    }

  } catch (error) {
    console.error('Error al obtener pacientes:', error);
  }
};
import { watch } from 'vue';

// Ejecutar búsqueda automáticamente al escribir
watch(search, () => {
  fetchPacientes();
});

const clearFilters = () => {
  filters.ipress = '';
  filters.red = '';
  fetchPacientes();
};

const showCreateModal = () => {
  editingPaciente.value = null;
  form.ipress = '';
  form.red = '';
  showModal.value = true;
};

const showEditModal = (paciente) => {
  editingPaciente.value = paciente;
  form.ipress = paciente.ipress;
  form.red = paciente.red;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePaciente = async () => {
  try {
    if (editingPaciente.value) {
      await axios.put(`http://10.0.54.88:8010/api/ipress/${editingPaciente.value.id}/`, form);
    } else {
      await axios.post('http://10.0.54.88:8010/api/ipress/', form);
    }
    showModal.value = false;
    fetchPacientes();
  } catch (error) {
    console.error('Error al guardar IPRESS:', error);
  }
};

const deletePaciente = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta IPRESS?')) {
    try {
      await axios.delete(`http://10.0.54.88:8010/api/ipress/${id}/`);
      fetchPacientes();
    } catch (error) {
      console.error('Error al eliminar IPRESS:', error);
    }
  }
};

const goToNextPage = () => {
  if (pacientes.next) {
    fetchPacientes(pacientes.next);
  }
};

const goToPreviousPage = () => {
  if (pacientes.previous) {
    fetchPacientes(pacientes.previous);
  }
};

onMounted(() => {
  fetchPacientes();
});
</script>

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>