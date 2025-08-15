<template>
    <div class="p-6 bg-[#F9FCFF] min-h-full">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-semibold text-gray-800">Lista de IPRESS</h2>
                <p class="text-sm text-gray-500">Gestiona y visualiza la información de todos los establecimientos</p>
            </div>
            <div class="flex gap-3">
        <button @click="exportToExcel" class="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-blue-50">
          Exportar
        </button>
                <button @click="showCreateModal()" class="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0066cc]">
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
                    <tr v-for="ipress in filteredIpress" :key="ipress.id_ipress" class="hover:bg-gray-50">
                        <td class="border p-3 font-medium">{{ ipress.id_ipress }}</td>
                        <td class="border p-3">{{ ipress.ipress }}</td>
                        <td class="border p-3">{{ ipress.datosRed.red }}</td>
                        <td class="flex border p-3 gap-5">
                            <button @click="showEditModal(ipress)" class="text-[#007BFF] hover:underline">Editar</button>
                            <button @click="deletePaciente(ipress.id_ipress)" class="text-[#007BFF] hover:underline">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal flotante para crear/editar IPRESS -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <h3 class="text-lg font-bold mb-4">{{ editingPaciente ? 'Editar IPRESS' : 'Registrar nueva IPRESS' }}</h3>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Nombre IPRESS</label>
                <input v-model="form.ipress" required class="w-full border px-2 py-1 rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Nombre Corto</label>
                <input v-model="form.nombre_corto" required class="w-full border px-2 py-1 rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Tipo de Unidad</label>
                <input v-model="form.tipo_unidad" required class="w-full border px-2 py-1 rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Estado</label>
                <select v-model="form.estado" required class="w-full border px-2 py-1 rounded">
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Redes</label>
                <select v-model="form.id_red" required class="w-full border px-2 py-1 rounded">
                  <option value="" disabled>Seleccione una red</option>
                  <option v-for="red in redes" :key="red.id_red" :value="red.id_red">
                    {{ red.red }}
                  </option>
                </select>
              </div>
             <!--  <div class="mb-3">
                <label class="block text-sm font-medium mb-1">ID Modalidad</label>
                <input v-model="form.id_modalidad" required class="w-full border px-2 py-1 rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">ID Ubigeo</label>
                <input v-model="form.id_ubigeo" required class="w-full border px-2 py-1 rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">ID Red</label>
                <input v-model="form.id_red" required class="w-full border px-2 py-1 rounded" />
              </div> -->
              <div class="flex justify-end gap-2 mt-6">
                <button type="button" @click="showModal = false" class="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancelar</button>
                <button type="submit" class="px-4 py-2 rounded bg-[#007BFF] text-white">{{ editingPaciente ? 'Guardar Cambios' : 'Registrar' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 text-sm text-[#6C7A91]">
      <div>Mostrando {{ filteredIpress.length }} de {{ pacientes.count }} IPRESS</div>
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
import { ref, reactive, onMounted, computed } from 'vue';
import * as XLSX from 'xlsx';
// El filtrado ahora lo hace el backend, solo mostramos los resultados de la página
const filteredIpress = computed(() => pacientes.results);
import axios from 'axios';
import { getAllIpress, postAllIpress, putAllIpress } from "@/services/ipress/Ipress.service";
import UserTable from "../ipress/table.vue";

// Estado
// Exportar todos los registros a Excel
const exportToExcel = async () => {
  try {
    let endpoint = '/ipress/';
    const respuesta = await getAllIpress(endpoint);
    const data = (respuesta || []).map(ipress => ({
      ID: ipress.id_ipress,
      IPRESS: ipress.ipress,
      Red: ipress.datosRed?.red || '',
      Estado: ipress.estado || '',
      NombreCorto: ipress.nombre_corto || '',
      TipoUnidad: ipress.tipo_unidad || ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'IPRESS');
    XLSX.writeFile(wb, 'ipress_lista.xlsx');
  } catch (error) {
    alert('Error al exportar a Excel');
    console.error(error);
  }
};

const pacientes = reactive({
  results: [],
  count: 0,
  next: null,
  previous: null,
});
const redes = ref([]);
const currentPage = ref(1);
const showModal = ref(false);
const editingPaciente = ref(null);

const form = reactive({
  ipress: '',
  nombre_corto: '',
  tipo_unidad: '',
  estado: 'ACTIVO',
  id_modalidad: '1',
  id_ubigeo: '1',
  id_red: '1',
});

const filters = reactive({
  ipress: '',
  red: '',
});

const search = ref('');


const fetchIpress = async (url = null) => {
  try {
    let endpoint = url ?? "/indexIpress/";
    // Si hay término de búsqueda, agrégalo como query param
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
    console.error('Error al obtener IPRESS:', error);
  }
};
import { watch } from 'vue';

// Ejecutar búsqueda automáticamente al escribir
watch(search, () => {
  fetchIpress();
});

const fetchRedes = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/redes/"); 
    redes.value=respuesta;
    console.log('Redes obtenidas:', redes.value);

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const clearFilters = () => {
  filters.ipress = '';
  filters.red = '';
  fetchIpress();
};

const showCreateModal = () => {
  editingPaciente.value = null;
  form.ipress = '';
  form.nombre_corto = '';
  form.tipo_unidad = '';
  form.estado = 'ACTIVO';
  form.id_modalidad = '1';
  form.id_ubigeo = '1';
  form.id_red = '';
  showModal.value = true;
};

const showEditModal = (ipress) => {
  editingPaciente.value = ipress;
  form.ipress = ipress.ipress;
  form.nombre_corto = ipress.nombre_corto;
  form.tipo_unidad = ipress.tipo_unidad;
  form.estado = ipress.estado;
  form.id_modalidad = ipress.id_modalidad;
  form.id_ubigeo = ipress.id_ubigeo;
  form.id_red = ipress.id_red;
  showModal.value = true;
};

const submitForm = async () => {
  try {
    if (editingPaciente.value) {
      // Editar IPRESS existente
      await putAllIpress(`/ipress/${editingPaciente.value.id_ipress}/`, {
        ipress: form.ipress,
        nombre_corto: form.nombre_corto,
        tipo_unidad: form.tipo_unidad,
        estado: form.estado,
        id_modalidad: form.id_modalidad,
        id_ubigeo: form.id_ubigeo,
        id_red: form.id_red,
      });
    } else {
      // Crear nueva IPRESS
      await postAllIpress('/ipress/', {
        ipress: form.ipress,
        nombre_corto: form.nombre_corto,
        tipo_unidad: form.tipo_unidad,
        estado: form.estado,
        id_modalidad: form.id_modalidad,
        id_ubigeo: form.id_ubigeo,
        id_red: form.id_red,
      });
    }
    showModal.value = false;
    fetchIpress();
  } catch (error) {
    alert('Error al guardar IPRESS');
    console.error(error);
  }
};

const deletePaciente = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta IPRESS?')) {
    try {
      await axios.delete(`http://10.0.54.88:8010/api/ipress/${id}/`);
      fetchIpress();
    } catch (error) {
      console.error('Error al eliminar IPRESS:', error);
    }
  }
};

const goToNextPage = () => {
  if (pacientes.next) {
    fetchIpress(pacientes.next);
  }
};

const goToPreviousPage = () => {
  if (pacientes.previous) {
    fetchIpress(pacientes.previous);
  }
};

onMounted(() => {
  fetchIpress();
  fetchRedes();
});
</script>

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>