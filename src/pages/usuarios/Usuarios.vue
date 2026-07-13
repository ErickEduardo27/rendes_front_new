<template>
  <div class="p-6 bg-[#F9FCFF] min-h-full">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Lista de Usuarios</h2>
        <p class="text-sm text-gray-500">Gestiona y visualiza la información de todos los usuarios</p>
      </div>
      <div class="flex gap-3">
        <button
          type="button"
          class="bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:bg-[#0066cc] transition-colors shadow-sm"
          @click="showCreateModal()"
        >
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Filtro y búsqueda -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="relative w-full max-w-md">
        <input
          v-model="search"
          type="search"
          placeholder="Buscar por usuario, nombre o documento..."
          class="w-full border border-gray-300 bg-white rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#007BFF] transition-shadow"
          @keydown.enter.prevent="aplicarBusqueda"
        />
        <svg
          class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 3 10a7.5 7.5 0 0 0 13.65 6.65Z"
          />
        </svg>
        <button
          v-if="search.trim()"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Limpiar búsqueda"
          @click="limpiarBusqueda"
        >
          ✕
        </button>
      </div>
      <button
        type="button"
        class="px-4 py-2.5 rounded-lg border border-[#007BFF] text-[#007BFF] text-sm font-medium hover:bg-blue-50 transition-colors"
        @click="aplicarBusqueda"
      >
        Buscar
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left text-gray-700">
          <thead class="bg-cyan-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="border-b border-cyan-100 p-3 font-semibold w-12 text-center">#</th>
              <th class="border-b border-cyan-100 p-3 font-semibold">Nombre</th>
              <th class="border-b border-cyan-100 p-3 font-semibold">Usuario</th>
              <th class="border-b border-cyan-100 p-3 font-semibold">Documento</th>
              <th class="border-b border-cyan-100 p-3 font-semibold">Perfil</th>
              <th class="border-b border-cyan-100 p-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="p-10 text-center text-gray-500">Cargando usuarios…</td>
            </tr>
            <tr v-else-if="usuarios.results.length === 0">
              <td colspan="6" class="p-10 text-center text-gray-500 italic">
                {{ searchAplicada ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados.' }}
              </td>
            </tr>
            <tr
              v-for="(usuario, index) in usuarios.results"
              v-else
              :key="usuario.id_usuario"
              class="hover:bg-cyan-50/40 transition-colors border-b border-gray-50 last:border-0"
            >
              <td class="p-3 font-medium tabular-nums text-center text-gray-500">
                {{ indiceFila(index) }}
              </td>
              <td class="p-3">{{ usuario.nombre }}</td>
              <td class="p-3">{{ usuario.usuario }}</td>
              <td class="p-3">{{ usuario.documento }}</td>
              <td class="p-3">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-100">
                  {{ usuario.datosPerfil?.perfil || '—' }}
                </span>
              </td>
              <td class="p-3">
                <div class="flex flex-wrap gap-3">
                  <button type="button" class="text-[#007BFF] hover:underline font-medium" @click="showEditModal(usuario)">
                    Editar
                  </button>
                  <button type="button" class="text-[#007BFF] hover:underline font-medium" @click="deleteUsuario(usuario.id_usuario)">
                    Eliminar
                  </button>
                  <button type="button" class="text-[#007BFF] hover:underline font-medium" @click="openAsignacionModal(usuario)">
                    Asignación
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div
        v-if="usuarios.count > 0"
        class="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-white text-sm text-[#6C7A91]"
      >
        <div class="flex flex-wrap items-center gap-3">
          <span>
            Mostrando
            <strong class="text-gray-800 tabular-nums">{{ rangoDesde }}</strong>–<strong class="text-gray-800 tabular-nums">{{ rangoHasta }}</strong>
            de <strong class="text-gray-800 tabular-nums">{{ usuarios.count }}</strong> usuarios
          </span>
          <label class="inline-flex items-center gap-2 text-xs text-[#6C7A91]">
            <span>Por página</span>
            <select
              v-model.number="pageSize"
              class="rounded-lg border border-cyan-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              @change="onPageSizeChange"
            >
              <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
        </div>

        <nav class="flex items-center gap-1" aria-label="Paginación de usuarios">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :class="currentPage > 1 ? 'border-cyan-200 bg-white text-[#007BFF] hover:bg-blue-50' : 'border-gray-200 bg-gray-50 text-gray-400'"
            :disabled="currentPage <= 1 || cargando"
            @click="irAPagina(1)"
          >
            «
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :class="currentPage > 1 ? 'border-cyan-200 bg-white text-[#007BFF] hover:bg-blue-50' : 'border-gray-200 bg-gray-50 text-gray-400'"
            :disabled="currentPage <= 1 || cargando"
            @click="irAPagina(currentPage - 1)"
          >
            Anterior
          </button>

          <button
            v-for="p in paginasVisibles"
            :key="p"
            type="button"
            class="min-w-[2.25rem] px-2.5 py-1.5 rounded-lg border text-xs font-semibold tabular-nums transition-colors"
            :class="p === currentPage
              ? 'border-[#007BFF] bg-[#007BFF] text-white shadow-sm'
              : 'border-cyan-200 bg-white text-[#007BFF] hover:bg-blue-50'"
            :disabled="cargando"
            @click="irAPagina(p)"
          >
            {{ p }}
          </button>

          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :class="currentPage < totalPaginas ? 'border-cyan-200 bg-white text-[#007BFF] hover:bg-blue-50' : 'border-gray-200 bg-gray-50 text-gray-400'"
            :disabled="currentPage >= totalPaginas || cargando"
            @click="irAPagina(currentPage + 1)"
          >
            Siguiente
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :class="currentPage < totalPaginas ? 'border-cyan-200 bg-white text-[#007BFF] hover:bg-blue-50' : 'border-gray-200 bg-gray-50 text-gray-400'"
            :disabled="currentPage >= totalPaginas || cargando"
            @click="irAPagina(totalPaginas)"
          >
            »
          </button>
        </nav>
      </div>
    </div>

    <!-- Modal asignación IPRESS -->
    <div
      v-if="showAsignacionModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="showAsignacionModal = false"
    >
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <h3 class="text-lg font-bold mb-4">Asignar IPRESS a {{ usuarioAsignacion?.nombre }}</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Selecciona las IPRESS a asignar</label>
          <input
            v-model="filtroIpress"
            placeholder="Buscar IPRESS por nombre..."
            class="border border-gray-300 px-3 py-2 rounded-lg w-full mb-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50/50">
            <div v-for="ipress in listaIpressFiltrada" :key="ipress.id_ipress" class="flex items-center gap-2 py-1.5 px-1">
              <input :id="'ipress-' + ipress.id_ipress" v-model="ipressSeleccionadas" type="checkbox" :value="ipress.id_ipress" />
              <label :for="'ipress-' + ipress.id_ipress" class="cursor-pointer select-none text-sm">
                {{ ipress.nombre_corto }} ({{ ipress.ipress }})
              </label>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" @click="showAsignacionModal = false">
            Cancelar
          </button>
          <button type="button" class="px-4 py-2 rounded-lg bg-[#007BFF] text-white hover:bg-[#0066cc]" @click="guardarAsignacion">
            Guardar Asignación
          </button>
        </div>
      </div>
    </div>

    <!-- Modal crear/editar usuario -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ editingUsuario ? 'Editar Usuario' : 'Registrar nuevo Usuario' }}
          </h3>
          <p class="text-sm text-gray-500 mt-0.5">Complete los datos del usuario</p>
        </div>
        <form class="flex flex-col min-h-0 overflow-hidden" @submit.prevent="submitForm">
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  v-model="form.usuario"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  v-model="form.nombre"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                <input
                  v-model="form.documento"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  v-model="form.password"
                  :required="!editingUsuario"
                  type="password"
                  :placeholder="editingUsuario ? 'Dejar en blanco para no cambiar' : ''"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  v-model="form.estado"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  v-model="form.id_perfil"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>Seleccione un perfil</option>
                  <option v-for="p in perfiles" :key="p.id_perfil" :value="p.id_perfil">{{ p.perfil }}</option>
                </select>
              </div>
            </div>

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
              <input
                v-model="busquedaIpressModal"
                type="text"
                placeholder="Buscar por nombre o código..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="border border-gray-200 rounded-lg max-h-44 overflow-y-auto bg-gray-50/50">
                <div
                  v-for="ipress in ipressFiltradasModal"
                  :key="ipress.id_ipress"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-white border-b border-gray-100 last:border-0"
                >
                  <input
                    :id="'ipress-modal-' + ipress.id_ipress"
                    v-model="form.ipress_ids"
                    type="checkbox"
                    :value="ipress.id_ipress"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label :for="'ipress-modal-' + ipress.id_ipress" class="cursor-pointer select-none text-sm text-gray-700 flex-1">
                    {{ ipress.nombre_corto || ipress.ipress }}
                    <span class="text-gray-400">({{ ipress.ipress }})</span>
                  </label>
                </div>
                <p v-if="ipressFiltradasModal.length === 0" class="px-3 py-4 text-sm text-gray-500 text-center">Sin resultados</p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-6">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_active" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Activo</span>
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_staff" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Staff</span>
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_superuser" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm font-medium text-gray-700">Superusuario</span>
              </label>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
              @click="showModal = false"
            >
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-[#007BFF] text-white text-sm font-medium hover:bg-[#0066cc]">
              {{ editingUsuario ? 'Guardar Cambios' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { deleteAllIpress, getAllIpress, postAllIpress, putAllIpress } from '@/services/ipress/Ipress.service';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const filtroIpress = ref('');
const listaIpressFiltrada = computed(() => {
  const texto = filtroIpress.value.trim().toLowerCase();
  if (!texto) return listaIpress.value;
  return listaIpress.value.filter(
    (i) =>
      (i.nombre_corto && i.nombre_corto.toLowerCase().includes(texto))
      || (i.ipress && i.ipress.toLowerCase().includes(texto)),
  );
});
const showAsignacionModal = ref(false);
const usuarioAsignacion = ref(null);
const ipressSeleccionadas = ref([]);
const listaIpress = ref([]);

const openAsignacionModal = async (usuario) => {
  usuarioAsignacion.value = usuario;
  showAsignacionModal.value = true;
  try {
    const res = await getAllIpress('/ipress/');
    listaIpress.value = Array.isArray(res) ? res : res.results || [];
    const asignaciones = await getAllIpress(`/asignaciones/?usuario=${usuario.id_usuario}`);
    const listaAsig = Array.isArray(asignaciones) ? asignaciones : asignaciones.results || [];
    ipressSeleccionadas.value = listaAsig.map((a) => a.ipress);
  } catch {
    listaIpress.value = [];
    ipressSeleccionadas.value = [];
  }
};

const guardarAsignacion = async () => {
  try {
    const asignacionesActuales = await getAllIpress(`/asignaciones/?usuario=${usuarioAsignacion.value.id_usuario}`);
    const listaAsig = Array.isArray(asignacionesActuales) ? asignacionesActuales : asignacionesActuales.results || [];
    for (const asignacion of listaAsig) {
      await deleteAllIpress(`/asignaciones/${asignacion.id_asignacion}/`);
    }
    for (const id_ipress of ipressSeleccionadas.value) {
      await postAllIpress('/asignaciones/', {
        usuario: usuarioAsignacion.value.id_usuario,
        ipress: id_ipress,
      });
    }
    showAsignacionModal.value = false;
    alert('Asignación guardada correctamente');
  } catch {
    alert('Error al guardar asignación');
  }
};

const usuarios = reactive({
  results: [],
  count: 0,
});

const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 15, 25, 50];
const search = ref('');
const searchAplicada = ref('');
const cargando = ref(false);

const totalPaginas = computed(() => Math.max(1, Math.ceil(usuarios.count / pageSize.value)));

const rangoDesde = computed(() => {
  if (usuarios.count === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const rangoHasta = computed(() => Math.min(currentPage.value * pageSize.value, usuarios.count));

function indiceFila(index) {
  return (currentPage.value - 1) * pageSize.value + index + 1;
}

const paginasVisibles = computed(() => {
  const total = totalPaginas.value;
  const actual = currentPage.value;
  const ventana = 5;
  let inicio = Math.max(1, actual - Math.floor(ventana / 2));
  let fin = Math.min(total, inicio + ventana - 1);
  if (fin - inicio + 1 < ventana) {
    inicio = Math.max(1, fin - ventana + 1);
  }
  const paginas = [];
  for (let i = inicio; i <= fin; i += 1) paginas.push(i);
  return paginas;
});

function buildUsuariosEndpoint() {
  const params = new URLSearchParams();
  params.set('page', String(currentPage.value));
  params.set('page_size', String(pageSize.value));
  const termino = searchAplicada.value.trim();
  if (termino) params.set('search', termino);
  return `/usuarios/?${params.toString()}`;
}

const fetchUsuarios = async () => {
  cargando.value = true;
  try {
    const respuesta = await getAllIpress(buildUsuariosEndpoint());
    usuarios.results = respuesta.results ?? [];
    usuarios.count = respuesta.count ?? 0;
    const maxPag = Math.max(1, Math.ceil(usuarios.count / pageSize.value) || 1);
    if (currentPage.value > maxPag) {
      currentPage.value = maxPag;
      const ajustado = await getAllIpress(buildUsuariosEndpoint());
      usuarios.results = ajustado.results ?? [];
      usuarios.count = ajustado.count ?? 0;
    }
  } catch (error) {
    usuarios.results = [];
    usuarios.count = 0;
    console.error('Error al obtener usuarios:', error);
  } finally {
    cargando.value = false;
  }
};

const fetchPerfiles = async () => {
  try {
    const respuesta = await getAllIpress('/perfilesListar/');
    perfiles.value = respuesta;
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
  }
};

function irAPagina(pagina) {
  const p = Math.min(Math.max(1, pagina), totalPaginas.value);
  if (p === currentPage.value) return;
  currentPage.value = p;
  fetchUsuarios();
}

function onPageSizeChange() {
  currentPage.value = 1;
  fetchUsuarios();
}

function aplicarBusqueda() {
  searchAplicada.value = search.value.trim();
  currentPage.value = 1;
  fetchUsuarios();
}

function limpiarBusqueda() {
  search.value = '';
  searchAplicada.value = '';
  currentPage.value = 1;
  fetchUsuarios();
}

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
    nombre.includes('clínica')
    || nombre.includes('clinica')
    || nombre.includes('hospital')
    || nombre.includes('supervisor')
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
      (i.nombre_corto && i.nombre_corto.toLowerCase().includes(texto))
      || (i.ipress && i.ipress.toLowerCase().includes(texto)),
  );
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
    const msg = e?.data?.detail || e?.detail || e?.error || 'No se pudo actualizar las asignaciones de IPRESS.';
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

onMounted(() => {
  fetchUsuarios();
  fetchPerfiles();
});
</script>
