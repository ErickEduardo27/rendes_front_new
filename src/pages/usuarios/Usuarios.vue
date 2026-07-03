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
              <button @click="openAsignacionModal(usuario)" class="text-[#007BFF] hover:underline">Asignación</button>
            </td>
    <!-- Modal flotante para asignar IPRESS -->
    <div v-if="showAsignacionModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <h3 class="text-lg font-bold mb-4">Asignar IPRESS a {{ usuarioAsignacion?.nombre }}</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Selecciona las IPRESS a asignar</label>
          <input v-model="filtroIpress" placeholder="Buscar IPRESS por nombre..." class="border px-2 py-1 rounded w-full mb-2" />
          <div class="max-h-48 overflow-y-auto border rounded p-2">
            <div v-for="ipress in listaIpressFiltrada" :key="ipress.id_ipress" class="flex items-center gap-2 py-1">
              <input type="checkbox" :id="'ipress-' + ipress.id_ipress" :value="ipress.id_ipress" v-model="ipressSeleccionadas" />
              <label :for="'ipress-' + ipress.id_ipress" class="cursor-pointer select-none">
                {{ ipress.nombre_corto }} ({{ ipress.ipress }})
              </label>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="showAsignacionModal = false" class="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancelar</button>
          <button type="button" @click="guardarAsignacion" class="px-4 py-2 rounded bg-[#007BFF] text-white">Guardar Asignación</button>
        </div>
      </div>
    </div>
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
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ editingUsuario ? 'Editar Usuario' : 'Registrar nuevo Usuario' }}
          </h3>
          <p class="text-sm text-gray-500 mt-0.5">Complete los datos del usuario</p>
        </div>
        <form @submit.prevent="submitForm" class="flex flex-col min-h-0 overflow-hidden">
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input v-model="form.usuario" required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input v-model="form.nombre" required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                <input v-model="form.documento" required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input v-model="form.password" :required="!editingUsuario" type="password"
                  :placeholder="editingUsuario ? 'Dejar en blanco para no cambiar' : ''"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select v-model="form.estado" required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select v-model="form.id_perfil" required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>Seleccione un perfil</option>
                  <option v-for="p in perfiles" :key="p.id_perfil" :value="p.id_perfil">{{ p.perfil }}</option>
                </select>
              </div>
            </div>

            <!-- IPRESS: Clínicas, Hospitales (una o varias) y Supervisor (una o varias; es lo que verá en el selector del sistema) -->
            <div v-if="muestraSelectIpress" class="mt-5 pt-4 border-t border-gray-100">
              <label class="block text-sm font-medium text-gray-700 mb-2">IPRESS asignadas al usuario</label>
              <p class="text-xs text-gray-500 mb-2">
                <template v-if="esPerfilSupervisorForm">
                  Seleccione al menos una IPRESS. El supervisor solo verá en la barra superior estas clínicas/hospitales.
                </template>
                <template v-else>
                  Busque y seleccione las IPRESS que tendrá asignadas este usuario.
                </template>
              </p>
              <input v-model="busquedaIpressModal" type="text" placeholder="Buscar por nombre o código..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <div class="border border-gray-200 rounded-lg max-h-44 overflow-y-auto bg-gray-50/50">
                <div v-for="ipress in ipressFiltradasModal" :key="ipress.id_ipress"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-white border-b border-gray-100 last:border-0">
                  <input :id="'ipress-modal-' + ipress.id_ipress" type="checkbox" :value="ipress.id_ipress"
                    v-model="form.ipress_ids" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label :for="'ipress-modal-' + ipress.id_ipress" class="cursor-pointer select-none text-sm text-gray-700 flex-1">
                    {{ ipress.nombre_corto || ipress.ipress }} <span class="text-gray-400">({{ ipress.ipress }})</span>
                  </label>
                </div>
                <p v-if="ipressFiltradasModal.length === 0" class="px-3 py-4 text-sm text-gray-500 text-center">Sin resultados</p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-6">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_active" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Activo</span>
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_staff" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Staff</span>
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_superuser" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Superusuario</span>
              </label>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button type="button" @click="showModal = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit"
              class="px-5 py-2 rounded-lg bg-[#007BFF] text-white text-sm font-medium hover:bg-[#0066cc]">
              {{ editingUsuario ? 'Guardar Cambios' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { deleteAllIpress, getAllIpress, postAllIpress, putAllIpress } from '@/services/ipress/Ipress.service';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const filtroIpress = ref("");
const listaIpressFiltrada = computed(() => {
  const texto = filtroIpress.value.trim().toLowerCase();
  if (!texto) return listaIpress.value;
  return listaIpress.value.filter(i =>
    (i.nombre_corto && i.nombre_corto.toLowerCase().includes(texto)) ||
    (i.ipress && i.ipress.toLowerCase().includes(texto))
  );
});
const showAsignacionModal = ref(false);
const usuarioAsignacion = ref(null);
const ipressSeleccionadas = ref([]);
const listaIpress = ref([]);

const openAsignacionModal = async (usuario) => {
  usuarioAsignacion.value = usuario;
  showAsignacionModal.value = true;
  // Obtener todas las IPRESS
  try {
    listaIpress.value = await getAllIpress('/ipress/');
    // Obtener asignaciones actuales del usuario
    const asignaciones = await getAllIpress(`/asignaciones/?usuario=${usuario.id_usuario}`);
    ipressSeleccionadas.value = asignaciones.map(a => a.ipress);
  } catch (e) {
    listaIpress.value = [];
    ipressSeleccionadas.value = [];
  }
};

const guardarAsignacion = async () => {
  try {
    // Eliminar asignaciones actuales del usuario
    const asignacionesActuales = await getAllIpress(`/asignaciones/?usuario=${usuarioAsignacion.value.id_usuario}`);
    for (const asignacion of asignacionesActuales) {
      await deleteAllIpress(`/asignaciones/${asignacion.id_asignacion}/`);
    }
    // Crear nuevas asignaciones
    for (const id_ipress of ipressSeleccionadas.value) {
      await postAllIpress('/asignaciones/', {
        usuario: usuarioAsignacion.value.id_usuario,
        ipress: id_ipress
      });
    }
    showAsignacionModal.value = false;
    alert('Asignación guardada correctamente');
  } catch (e) {
    alert('Error al guardar asignación');
  }
};
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
  ipress_ids: [],
});
const perfiles = ref([]);
const search = ref('');
const listaIpressModal = ref([]);
const busquedaIpressModal = ref('');

const perfilSeleccionado = computed(() => {
  if (!form.id_perfil) return null;
  return perfiles.value.find((p) => p.id_perfil === form.id_perfil) || null;
});
const muestraSelectIpress = computed(() => {
  const p = perfilSeleccionado.value;
  if (!p || !p.perfil) return false;
  const nombre = String(p.perfil).toLowerCase();
  return (
    nombre.includes('clínica') ||
    nombre.includes('clinica') ||
    nombre.includes('hospital') ||
    nombre.includes('supervisor')
  );
});

const esPerfilSupervisorForm = computed(() => {
  const p = perfilSeleccionado.value;
  if (!p?.perfil) return false;
  return String(p.perfil).toLowerCase().includes('supervisor');
});
const ipressFiltradasModal = computed(() => {
  const texto = busquedaIpressModal.value.trim().toLowerCase();
  const lista = listaIpressModal.value;
  if (!texto) return lista;
  return lista.filter(
    (i) =>
      (i.nombre_corto && i.nombre_corto.toLowerCase().includes(texto)) ||
      (i.ipress && i.ipress.toLowerCase().includes(texto))
  );
});

const fetchUsuarios = async (url = null) => {
  try {
    let endpoint = url ?? '/usuarios/';
    if (!url && search.value.trim()) {
      endpoint += `?search=${encodeURIComponent(search.value.trim())}`;
    }
    const respuesta  = await getAllIpress(endpoint);
    console.log("respuesta", respuesta);
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
    let endpoint = url ?? '/perfilesListar/';
    const respuesta  = await getAllIpress(endpoint);
    perfiles.value = respuesta;
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
  }
};

watch(search, () => {
  fetchUsuarios();
});

const cargarIpressParaModal = async () => {
  try {
    const res = await getAllIpress('/ipress/');
    listaIpressModal.value = Array.isArray(res) ? res : res.results || [];
  } catch {
    listaIpressModal.value = [];
  }
};

const showCreateModal = async () => {
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
  form.ipress_ids = [];
  busquedaIpressModal.value = '';
  await cargarIpressParaModal();
  showModal.value = true;
};

const showEditModal = async (usuario) => {
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
  form.ipress_ids = [];
  busquedaIpressModal.value = '';
  await cargarIpressParaModal();
  if (usuario.id_usuario) {
    try {
      const asignaciones = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${usuario.id_usuario}`);
      const lista = Array.isArray(asignaciones) ? asignaciones : asignaciones.results || [];
      form.ipress_ids = lista.map((a) => a.id_ipress).filter(Boolean);
    } catch {
      form.ipress_ids = [];
    }
  }
  showModal.value = true;
};

const guardarAsignacionesIpress = async (idUsuario) => {
  if (!idUsuario || !muestraSelectIpress.value) return;
  const idsSolicitados = new Set(
    (Array.isArray(form.ipress_ids) ? form.ipress_ids : []).map((id) => String(id)),
  );
  try {
    const existentes = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
    const lista = Array.isArray(existentes) ? existentes : existentes.results || [];
    const existentesPorIpress = new Map(
      lista
        .filter((a) => a.id_ipress != null && a.id_usuario_ipress != null)
        .map((a) => [String(a.id_ipress), a]),
    );

    for (const [idIpress, asignacion] of existentesPorIpress.entries()) {
      if (!idsSolicitados.has(idIpress)) {
        await deleteAllIpress(`/usuarioIpress/${asignacion.id_usuario_ipress}/`);
      } else {
        idsSolicitados.delete(idIpress);
      }
    }

    for (const idIpress of idsSolicitados) {
      await postAllIpress('/usuarioIpress/', {
        id_usuario: idUsuario,
        id_ipress: Number(idIpress) || idIpress,
        estado: true,
      });
    }
  } catch (e) {
    console.error('Error al guardar IPRESS:', e);
    const msg =
      e?.data?.detail
      || e?.detail
      || e?.error
      || 'No se pudo actualizar las asignaciones de IPRESS.';
    alert(msg);
    throw e;
  }
};

const submitForm = async () => {
  try {
    if (esPerfilSupervisorForm.value) {
      const n = Array.isArray(form.ipress_ids) ? form.ipress_ids.length : 0;
      if (n < 1) {
        alert('El perfil supervisor debe tener al menos una IPRESS asignada.');
        return;
      }
    }
    let idUsuarioGuardado = null;
    if (editingUsuario.value) {
      idUsuarioGuardado = editingUsuario.value.id_usuario;
      const payload = {
        documento: form.documento,
        nombre: form.nombre,
        usuario: form.usuario,
        estado: form.estado,
        is_active: form.is_active,
        is_staff: form.is_staff,
        is_superuser: form.is_superuser,
        id_perfil: form.id_perfil,
      };
      if (form.password && form.password.trim() !== '') {
        payload.password = form.password;
      }
      await putAllIpress(`/usuarios/${editingUsuario.value.id_usuario}/`, payload);
      if (muestraSelectIpress.value) {
        await guardarAsignacionesIpress(editingUsuario.value.id_usuario);
      }
    } else {
      const res = await postAllIpress('/usuarios/', {
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
      idUsuarioGuardado = res?.id_usuario ?? res?.id ?? null;
      if (idUsuarioGuardado && muestraSelectIpress.value) {
        await guardarAsignacionesIpress(idUsuarioGuardado);
      }
    }
    showModal.value = false;
    fetchUsuarios();
    if (idUsuarioGuardado != null && authStore.user?.id_usuario === idUsuarioGuardado) {
      await authStore.fetchUser();
    }
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