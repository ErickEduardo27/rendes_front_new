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
            <select v-model="estadoFilter" class="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 bg-white">
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
            </select>
        </div>  

        <!-- Tabla -->
        <div class="overflow-x-auto rounded border border-cyan-100 bg-white">
            <table class="min-w-full text-sm text-left text-gray-700">
                <thead class="bg-cyan-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th class="border p-3">ID</th>
                        <th class="border p-3">IPRESS</th>
                        <th class="border p-3">Nombre corto</th>
                        <th class="border p-3">Modalidad</th>
                        <th class="border p-3">Red</th>
                        <th class="border p-3">Estado</th>
                        <th class="border p-3 min-w-[180px]">Responsables LIC</th>
                        <th class="border p-3 min-w-[200px]">Supervisores asignados</th>
                        <th class="border p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ipress in filteredIpress" :key="ipress.id_ipress" class="hover:bg-gray-50">
                        <td class="border p-3 font-medium">{{ ipress.id_ipress }}</td>
                        <td class="border p-3">{{ ipress.ipress }}</td>
                        <td class="border p-3">{{ ipress.nombre_corto || '—' }}</td>
                        <td class="border p-3 text-xs">{{ ipress.datosModalidad?.modalidad ?? '—' }}</td>
                        <td class="border p-3">{{ ipress.datosRed?.red ?? '' }}</td>
                        <td class="border p-3 text-xs">{{ ipress.estado || '—' }}</td>
                        <td class="border p-3 text-xs align-top text-gray-700">
                          <div v-if="ipress.responsable_lic1_nombre" class="mb-1">
                            <span class="font-medium">LIC 1:</span> {{ ipress.responsable_lic1_nombre }}
                            <span v-if="ipress.responsable_lic1_correo" class="block text-gray-500">{{ ipress.responsable_lic1_correo }}</span>
                            <span v-if="ipress.responsable_lic1_telefono" class="block text-gray-500">{{ ipress.responsable_lic1_telefono }}</span>
                          </div>
                          <div v-if="ipress.responsable_lic2_nombre">
                            <span class="font-medium">LIC 2:</span> {{ ipress.responsable_lic2_nombre }}
                            <span v-if="ipress.responsable_lic2_correo" class="block text-gray-500">{{ ipress.responsable_lic2_correo }}</span>
                            <span v-if="ipress.responsable_lic2_telefono" class="block text-gray-500">{{ ipress.responsable_lic2_telefono }}</span>
                          </div>
                          <span v-if="!ipress.responsable_lic1_nombre && !ipress.responsable_lic2_nombre" class="text-gray-400">—</span>
                        </td>
                        <td class="border p-3 text-gray-700 align-top">
                            <template v-if="cargandoSupervisores && !supervisoresPorIdIpress[String(ipress.id_ipress)]?.length">
                                <span class="text-gray-400 text-xs">…</span>
                            </template>
                            <template v-else-if="supervisoresPorIdIpress[String(ipress.id_ipress)]?.length">
                                <ul class="list-disc list-inside space-y-0.5 text-xs">
                                    <li v-for="(u, idx) in supervisoresPorIdIpress[String(ipress.id_ipress)]" :key="idx">
                                        <span class="font-medium">{{ u.nombre }}</span>
                                        <span v-if="u.usuario" class="text-gray-500"> ({{ u.usuario }})</span>
                                    </li>
                                </ul>
                            </template>
                            <span v-else class="text-gray-400 text-xs">—</span>
                        </td>
                        <td class="flex border p-3 gap-3 flex-wrap">
                            <button type="button" @click="showDetailModal(ipress)" class="text-slate-600 hover:underline text-sm">Ver</button>
                            <button @click="showEditModal(ipress)" class="text-[#007BFF] hover:underline text-sm">Editar</button>
                            <button @click="deletePaciente(ipress.id_ipress)" class="text-[#007BFF] hover:underline text-sm">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal flotante para crear/editar IPRESS -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative my-4">
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
             <!--  <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Tipo de Unidad</label>
                <input v-model="form.tipo_unidad" required class="w-full border px-2 py-1 rounded" />
              </div> -->
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Estado</label>
                <select v-model="form.estado" required class="w-full border px-2 py-1 rounded">
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Modalidad</label>
                <select v-model="form.id_modalidad" required class="w-full border px-2 py-1 rounded">
                  <option value="" disabled>Seleccione una modalidad</option>
                  <option v-for="m in modalidades" :key="m.id_modalidad" :value="m.id_modalidad">
                    {{ m.modalidad }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Ubigeo</label>
                <select v-model="form.id_ubigeo" required class="w-full border px-2 py-1 rounded">
                  <option value="" disabled>Seleccione un ubigeo</option>
                  <option v-for="u in ubigeos" :key="u.id_ubigeo" :value="u.id_ubigeo">
                    {{ u.ubigeo_reniec }} {{ u.ubigeo_inei ? `(${u.ubigeo_inei})` : '' }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Red</label>
                <select v-model="form.id_red" required class="w-full border px-2 py-1 rounded">
                  <option value="" disabled>Seleccione una red</option>
                  <option v-for="red in redes" :key="red.id_red" :value="red.id_red">
                    {{ red.red }}
                  </option>
                </select>
              </div>
              <div class="border-t border-gray-200 pt-4 mt-2">
                <h4 class="text-sm font-bold text-gray-800 mb-3">Responsable LIC 1</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label class="block text-xs font-medium mb-1">Nombre</label>
                    <input v-model="form.responsable_lic1_nombre" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1">Correo</label>
                    <input v-model="form.responsable_lic1_correo" type="email" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1">Teléfono</label>
                    <input v-model="form.responsable_lic1_telefono" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                </div>
                <h4 class="text-sm font-bold text-gray-800 mb-3">Responsable LIC 2</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-medium mb-1">Nombre</label>
                    <input v-model="form.responsable_lic2_nombre" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1">Correo</label>
                    <input v-model="form.responsable_lic2_correo" type="email" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1">Teléfono</label>
                    <input v-model="form.responsable_lic2_telefono" class="w-full border px-2 py-1 rounded text-sm" />
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-6">
                <button type="button" @click="showModal = false" class="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancelar</button>
                <button type="submit" class="px-4 py-2 rounded bg-[#007BFF] text-white">{{ editingPaciente ? 'Guardar Cambios' : 'Registrar' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal detalle IPRESS -->
        <div v-if="detalleIpress" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto" @click.self="detalleIpress = null">
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl my-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-bold text-gray-800">Datos de la clínica</h3>
              <button type="button" class="text-gray-500 hover:text-gray-800" @click="detalleIpress = null">✕</button>
            </div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div><dt class="text-gray-500">ID</dt><dd class="font-medium">{{ detalleIpress.id_ipress }}</dd></div>
              <div><dt class="text-gray-500">Estado</dt><dd>{{ detalleIpress.estado || '—' }}</dd></div>
              <div class="sm:col-span-2"><dt class="text-gray-500">IPRESS</dt><dd class="font-medium">{{ detalleIpress.ipress }}</dd></div>
              <div><dt class="text-gray-500">Nombre corto</dt><dd>{{ detalleIpress.nombre_corto || '—' }}</dd></div>
              <div><dt class="text-gray-500">Modalidad</dt><dd>{{ detalleIpress.datosModalidad?.modalidad || '—' }}</dd></div>
              <div><dt class="text-gray-500">Red</dt><dd>{{ detalleIpress.datosRed?.red || '—' }}</dd></div>
              <div class="sm:col-span-2"><dt class="text-gray-500">Ubigeo</dt><dd>{{ detalleIpress.datosUbigeo?.ubigeo_reniec || '—' }}</dd></div>
              <div class="sm:col-span-2 border-t pt-2 mt-1"><dt class="font-semibold text-gray-700">Responsable LIC 1</dt>
                <dd>{{ detalleIpress.responsable_lic1_nombre || '—' }} · {{ detalleIpress.responsable_lic1_correo || '—' }} · {{ detalleIpress.responsable_lic1_telefono || '—' }}</dd></div>
              <div class="sm:col-span-2"><dt class="font-semibold text-gray-700">Responsable LIC 2</dt>
                <dd>{{ detalleIpress.responsable_lic2_nombre || '—' }} · {{ detalleIpress.responsable_lic2_correo || '—' }} · {{ detalleIpress.responsable_lic2_telefono || '—' }}</dd></div>
            </dl>
            <div class="mt-4 flex justify-end">
              <button type="button" class="px-4 py-2 rounded bg-gray-200 text-gray-700" @click="detalleIpress = null">Cerrar</button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 text-sm text-[#6C7A91]">
      <div>Mostrando {{ pacientes.count ? ((currentPage - 1) * pageSize + 1) : 0 }}-{{ Math.min(currentPage * pageSize, pacientes.count) }} de {{ pacientes.count }} IPRESS</div>
            <div class="flex items-center gap-2">
                <button @click="goToPreviousPage" :disabled="!hasPrevious" class="px-3 py-1 border rounded"
                    :class="hasPrevious ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
                    Anterior
                </button>

                <span class="px-3 py-1 border rounded bg-[#007BFF] text-white">
                    {{ currentPage }} / {{ totalPages }}
                </span>

                <button @click="goToNextPage" :disabled="!hasNext" class="px-3 py-1 border rounded"
                    :class="hasNext ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
                    Siguiente
                </button>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import * as XLSX from 'xlsx';
const pageSize = 10;
const totalPages = computed(() => Math.max(1, Math.ceil(pacientes.count / pageSize)));
const filteredIpress = computed(() => {
  const list = pacientes.results;
  const start = (currentPage.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});
import { getAllIpress, postAllIpress, putAllIpress, deleteAllIpress } from "@/services/ipress/Ipress.service";

const pacientes = reactive({
  results: [],
  count: 0,
  next: null,
  previous: null,
});
const redes = ref([]);
const ubigeos = ref([]);
const modalidades = ref([]);
const currentPage = ref(1);
const showModal = ref(false);
const editingPaciente = ref(null);
const detalleIpress = ref(null);

const form = reactive({
  ipress: '',
  nombre_corto: '',
  tipo_unidad: '',
  estado: 'ACTIVO',
  id_modalidad: '',
  id_ubigeo: '',
  id_red: '',
  responsable_lic1_nombre: '',
  responsable_lic1_correo: '',
  responsable_lic1_telefono: '',
  responsable_lic2_nombre: '',
  responsable_lic2_correo: '',
  responsable_lic2_telefono: '',
});

const filters = reactive({
  ipress: '',
  red: '',
});

const search = ref('');
const estadoFilter = ref('');

/** id_ipress (string) -> { nombre, usuario }[] solo perfil supervisor */
const supervisoresPorIdIpress = ref({});
const cargandoSupervisores = ref(false);

function esPerfilSupervisorNombre(perfilNombre) {
  return String(perfilNombre || '').toLowerCase().includes('supervisor');
}

async function fetchAsignacionesSupervisores() {
  cargandoSupervisores.value = true;
  try {
    const r = await getAllIpress('/usuarioIpressFilter/');
    const list = Array.isArray(r) ? r : r?.results || [];
    const map = {};
    for (const row of list) {
      const perfil = row.datosUsuario?.datosPerfil?.perfil;
      if (!esPerfilSupervisorNombre(perfil)) continue;
      const idI = row.id_ipress;
      if (idI == null) continue;
      const key = String(idI);
      if (!map[key]) map[key] = [];
      const nombre = row.datosUsuario?.nombre || row.datosUsuario?.usuario || '—';
      const usuario = row.datosUsuario?.usuario || '';
      map[key].push({ nombre, usuario });
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es'));
    }
    supervisoresPorIdIpress.value = map;
  } catch (e) {
    console.error('Error al cargar supervisores por IPRESS:', e);
    supervisoresPorIdIpress.value = {};
  } finally {
    cargandoSupervisores.value = false;
  }
}

function textoSupervisoresParaExport(idIpress) {
  const arr = supervisoresPorIdIpress.value[String(idIpress)] || [];
  if (!arr.length) return '';
  return arr.map((u) => (u.usuario ? `${u.nombre} (${u.usuario})` : u.nombre)).join('; ');
}

const exportToExcel = async () => {
  try {
    await fetchAsignacionesSupervisores();
    const respuesta = await getAllIpress('/ipress/');
    const list = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    const data = (list || []).map((ip) => ({
      ID: ip.id_ipress,
      IPRESS: ip.ipress,
      Red: ip.datosRed?.red || '',
      Supervisores: textoSupervisoresParaExport(ip.id_ipress),
      Estado: ip.estado || '',
      NombreCorto: ip.nombre_corto || '',
      TipoUnidad: ip.tipo_unidad || '',
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

const fetchIpress = async (url = null) => {
  try {
    let endpoint = url ?? "/indexIpress/";
    if (!url) {
      const params = new URLSearchParams();
      if (search.value.trim()) params.set('search', search.value.trim());
      if (estadoFilter.value) params.set('estado', estadoFilter.value);
      const qs = params.toString();
      if (qs) endpoint += `?${qs}`;
    }
    const respuesta = await getAllIpress(endpoint);
    const isArray = Array.isArray(respuesta);
    pacientes.results = isArray ? respuesta : (respuesta.results || []);
    pacientes.count = isArray ? respuesta.length : (respuesta.count ?? pacientes.results.length);
    pacientes.next = isArray ? null : (respuesta.next ?? null);
    pacientes.previous = isArray ? null : (respuesta.previous ?? null);
    if (isArray || !respuesta.next) currentPage.value = 1;
    else if (respuesta.next || respuesta.previous) {
      const nextUrl = new URL(respuesta.next ?? respuesta.previous);
      const pageParam = nextUrl.searchParams.get("page");
      currentPage.value = pageParam ? parseInt(pageParam, 10) - (respuesta.next ? 1 : -1) : 1;
    }
    await fetchAsignacionesSupervisores();
  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

// Ejecutar búsqueda automáticamente al escribir
watch([search, estadoFilter], () => {
  fetchIpress();
});

const fetchRedes = async () => {
  try {
    const respuesta = await getAllIpress("/red/");
    redes.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || respuesta || []);
  } catch (error) {
    console.error('Error al obtener redes:', error);
  }
};

const fetchUbigeos = async () => {
  try {
    const respuesta = await getAllIpress("/ubigeo/");
    ubigeos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || respuesta || []);
  } catch (error) {
    console.error('Error al obtener ubigeos:', error);
  }
};

const fetchModalidades = async () => {
  try {
    const respuesta = await getAllIpress("/modalidades/");
    modalidades.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || respuesta || []);
  } catch (error) {
    console.error('Error al obtener modalidades:', error);
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
  form.id_modalidad = modalidades.value.length ? modalidades.value[0].id_modalidad : '';
  form.id_ubigeo = '';
  form.id_red = '';
  form.responsable_lic1_nombre = '';
  form.responsable_lic1_correo = '';
  form.responsable_lic1_telefono = '';
  form.responsable_lic2_nombre = '';
  form.responsable_lic2_correo = '';
  form.responsable_lic2_telefono = '';
  showModal.value = true;
};

function showDetailModal(row) {
  detalleIpress.value = row;
}

const showEditModal = (ipress) => {
  editingPaciente.value = ipress;
  form.ipress = ipress.ipress;
  form.nombre_corto = ipress.nombre_corto;
  form.tipo_unidad = ipress.tipo_unidad;
  form.estado = ipress.estado;
  form.id_modalidad = ipress.id_modalidad ?? (modalidades.value[0]?.id_modalidad ?? '');
  form.id_ubigeo = ipress.id_ubigeo ?? '';
  form.id_red = ipress.id_red ?? '';
  form.responsable_lic1_nombre = ipress.responsable_lic1_nombre || '';
  form.responsable_lic1_correo = ipress.responsable_lic1_correo || '';
  form.responsable_lic1_telefono = ipress.responsable_lic1_telefono || '';
  form.responsable_lic2_nombre = ipress.responsable_lic2_nombre || '';
  form.responsable_lic2_correo = ipress.responsable_lic2_correo || '';
  form.responsable_lic2_telefono = ipress.responsable_lic2_telefono || '';
  showModal.value = true;
};

const payloadFromForm = () => ({
  ipress: form.ipress,
  nombre_corto: form.nombre_corto,
  tipo_unidad: form.tipo_unidad,
  estado: form.estado,
  id_modalidad: form.id_modalidad != null && form.id_modalidad !== '' ? parseInt(form.id_modalidad, 10) : (modalidades.value[0]?.id_modalidad ?? null),
  id_ubigeo: parseInt(form.id_ubigeo, 10) || (ubigeos.value[0]?.id_ubigeo ?? 1),
  id_red: parseInt(form.id_red, 10) || (redes.value[0]?.id_red ?? 1),
  responsable_lic1_nombre: form.responsable_lic1_nombre || null,
  responsable_lic1_correo: form.responsable_lic1_correo || null,
  responsable_lic1_telefono: form.responsable_lic1_telefono || null,
  responsable_lic2_nombre: form.responsable_lic2_nombre || null,
  responsable_lic2_correo: form.responsable_lic2_correo || null,
  responsable_lic2_telefono: form.responsable_lic2_telefono || null,
});

const submitForm = async () => {
  try {
    const payload = payloadFromForm();
    if (editingPaciente.value) {
      await putAllIpress(`/ipress/${editingPaciente.value.id_ipress}/`, payload);
    } else {
      await postAllIpress('/ipress/', payload);
    }
    showModal.value = false;
    await fetchIpress();
  } catch (error) {
    alert('Error al guardar IPRESS');
    console.error(error);
  }
};

const deletePaciente = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta IPRESS?')) return;
  try {
    await deleteAllIpress(`/ipress/${id}/`);
    fetchIpress();
  } catch (error) {
    console.error('Error al eliminar IPRESS:', error);
    alert('Error al eliminar IPRESS');
  }
};

const goToNextPage = () => {
  if (pacientes.next) fetchIpress(pacientes.next);
  else if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPreviousPage = () => {
  if (pacientes.previous) fetchIpress(pacientes.previous);
  else if (currentPage.value > 1) currentPage.value--;
};

const hasNext = computed(() => pacientes.next || currentPage.value < totalPages.value);
const hasPrevious = computed(() => pacientes.previous || currentPage.value > 1);

onMounted(async () => {
  await fetchIpress();
  fetchRedes();
  fetchUbigeos();
  fetchModalidades();
});
</script>

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>