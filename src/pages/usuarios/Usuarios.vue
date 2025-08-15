<template>
  <div class="p-6 bg-[#F9FCFF] min-h-full">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Lista de Usuarios</h2>
        <p class="text-sm text-gray-500">Gestiona y visualiza la información de todos los usuarios</p>
      </div>
      <div class="flex gap-3">
        <!-- <button class="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-blue-50">
          Exportar
        </button> -->
        <button @click="showCreateModal()" class="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0066cc]">
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Filtro y búsqueda -->
    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <input v-model="search" type="text" placeholder="Buscar por usuario o documento..."
          class="w-full border border-gray-300 bg-white rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor"
          stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 3 10a7.5 7.5 0 0 0 13.65 6.65Z" />
        </svg>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto rounded border border-cyan-100 bg-white">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="bg-cyan-50 text-xs text-gray-500 uppercase">
          <tr>
            <th class="border p-3">ID</th>
            <th class="border p-3">Nombre</th>
            <th class="border p-3">Usuario</th>
            <th class="border p-3">Documento</th>
            <th class="border p-3">Perfil</th>
            <th class="border p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios.results" :key="usuario.id_usuario" class="hover:bg-gray-50">
            <td class="border p-3 font-medium">{{ usuario.id_usuario }}</td>
            <td class="border p-3">{{ usuario.nombre }}</td>
            <td class="border p-3">{{ usuario.usuario }}</td>
            <td class="border p-3">{{ usuario.documento }}</td>
            <td class="border p-3">{{ usuario.datosPerfil?.perfil }}</td>
            <td class="flex border p-3 gap-5">
              <button @click="showEditModal(usuario)" class="text-[#007BFF] hover:underline">Editar</button>
              <button @click="deleteUsuario(usuario.id_usuario)" class="text-[#007BFF] hover:underline">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 text-sm text-[#6C7A91]">
      <div>Mostrando {{ usuarios.results.length }} de {{ usuarios.count }} Usuarios</div>
      <div class="flex items-center gap-2">
        <button @click="goToPreviousPage" :disabled="!usuarios.previous" class="px-3 py-1 border rounded"
          :class="usuarios.previous ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
          Anterior
        </button>

        <span class="px-3 py-1 border rounded bg-[#007BFF] text-white">
          {{ currentPage }}
        </span>

        <button @click="goToNextPage" :disabled="!usuarios.next" class="px-3 py-1 border rounded"
          :class="usuarios.next ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal flotante para crear/editar usuario -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <h3 class="text-lg font-bold mb-4">{{ editingUsuario ? 'Editar Usuario' : 'Registrar nuevo Usuario' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Usuario</label>
            <input v-model="form.usuario" required class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input v-model="form.nombre" required class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Documento</label>
            <input v-model="form.documento" required class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Contraseña</label>
            <input v-model="form.password" :required="!editingUsuario" type="password" class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Estado</label>
            <select v-model="form.estado" required class="w-full border px-2 py-1 rounded">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Perfil</label>
            <select v-model="form.id_perfil" required class="w-full border px-2 py-1 rounded">
                  <option value="" disabled>Seleccione un perfil</option>
                  <option v-for="perfil in perfiles" :key="perfil.id_perfil" :value="perfil.id_perfil">
                    {{ perfil.perfil }}
                  </option>
                </select>
            <!-- <input v-model="form.id_perfil" required class="w-full border px-2 py-1 rounded" /> -->
          </div>
          <div class="mb-3 flex gap-2">
            <label class="block text-sm font-medium mb-1">Activo</label>
            <input type="checkbox" v-model="form.is_active" />
            <label class="block text-sm font-medium mb-1">Staff</label>
            <input type="checkbox" v-model="form.is_staff" />
            <label class="block text-sm font-medium mb-1">Superusuario</label>
            <input type="checkbox" v-model="form.is_superuser" />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded bg-[#007BFF] text-white">{{ editingUsuario ? 'Guardar Cambios' : 'Registrar' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { deleteAllIpress, getAllIpress, postAllIpress, putAllIpress } from '@/services/ipress/Ipress.service';

const usuarios = reactive({
  results: [],
  count: 0,
  next: null,
  previous: null,
});

const currentPage = ref(1);
const showModal = ref(false);
const editingUsuario = ref(null);

const form = reactive({
  password: '',
  documento: '',
  nombre: '',
  usuario: '',
  estado: 'Activo',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  id_perfil: '',
});
const perfiles = ref([]);
const search = ref('');

const fetchUsuarios = async (url = null) => {
  try {
    let endpoint = url ?? '/usuarios/';
    if (!url && search.value.trim()) {
      endpoint += `?search=${encodeURIComponent(search.value.trim())}`;
    }
    const respuesta  = await getAllIpress(endpoint);
    usuarios.results = respuesta.results ?? [];
    usuarios.count = respuesta.count ?? 0;
    usuarios.next = respuesta.next;
    usuarios.previous = respuesta.previous;
    if (respuesta.next || respuesta.previous) {
      const nextUrl = new URL(respuesta.next ?? respuesta.previous);
      const pageParam = nextUrl.searchParams.get('page');
      currentPage.value = pageParam ? parseInt(pageParam) - (respuesta.next ? 1 : -1) : 1;
    } else {
      currentPage.value = 1;
    }
  } catch (error) {
    usuarios.results = [];
    usuarios.count = 0;
    usuarios.next = null;
    usuarios.previous = null;
    console.error('Error al obtener usuarios:', error);
  }
};

const fetchPerfiles = async (url = null) => {
  try {
    let endpoint = url ?? '/perfiles/';
    const respuesta  = await getAllIpress(endpoint);
    perfiles.value = respuesta;
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
  }
};

watch(search, () => {
  fetchUsuarios();
});

const showCreateModal = () => {
  editingUsuario.value = null;
  form.password = '';
  form.documento = '';
  form.nombre = '';
  form.usuario = '';
  form.estado = 'Activo';
  form.is_active = true;
  form.is_staff = false;
  form.is_superuser = false;
  form.id_perfil = '';
  showModal.value = true;
};

const showEditModal = (usuario) => {
  editingUsuario.value = usuario;
  form.password = '';
  form.documento = usuario.documento;
  form.nombre = usuario.nombre;
  form.usuario = usuario.usuario;
  form.estado = usuario.estado;
  form.is_active = usuario.is_active;
  form.is_staff = usuario.is_staff;
  form.is_superuser = usuario.is_superuser;
  form.id_perfil = usuario.id_perfil;
  showModal.value = true;
};

const submitForm = async () => {
  try {
    if (editingUsuario.value) {
      await putAllIpress(`/usuarios/${editingUsuario.value.id_usuario}/`, {
        password: form.password,
        documento: form.documento,
        nombre: form.nombre,
        usuario: form.usuario,
        estado: form.estado,
        is_active: form.is_active,
        is_staff: form.is_staff,
        is_superuser: form.is_superuser,
        id_perfil: form.id_perfil,
      });
    } else {
      await postAllIpress('/usuarios/', {
        password: form.password,
        documento: form.documento,
        nombre: form.nombre,
        usuario: form.usuario,
        estado: form.estado,
        is_active: form.is_active,
        is_staff: form.is_staff,
        is_superuser: form.is_superuser,
        id_perfil: form.id_perfil,
      });
    }
    showModal.value = false;
    fetchUsuarios();
  } catch (error) {
    alert('Error al guardar usuario');
    console.error(error);
  }
};

const deleteUsuario = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await deleteAllIpress(`/usuarios/${id}/`);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }
};

const goToNextPage = () => {
  if (usuarios.next) {
    fetchUsuarios(usuarios.next);
  }
};

const goToPreviousPage = () => {
  if (usuarios.previous) {
    fetchUsuarios(usuarios.previous);
  }
};

onMounted(() => {
  fetchUsuarios();
  fetchPerfiles();
});
</script>