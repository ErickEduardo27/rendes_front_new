<template>
  
    <div class="mb-4 flex items-center gap-4">
      <label class="font-semibold">Filtrar por IPRESS:</label>
      <select v-model="ipressSeleccionada" class="border rounded p-2">
        <option v-for="ip in listaIpress" :key="ip.id_ipress" :value="ip.id_ipress">{{ ip.nombre_corto }}</option>
      </select>
    </div>
    <h2 class="text-lg font-semibold mt-8">Registros de Calidad Microbiológica</h2>
    <table class="min-w-full bg-white border mt-2">
      <thead>
        <tr>
          <th class="border px-2 py-1">Periodo</th>
          <th class="border px-2 py-1">Control</th>
          <th class="border px-2 py-1">Bac. Osmosis</th>
          <th class="border px-2 py-1">Bac. Circulación</th>
          <th class="border px-2 py-1">Endo. Agua</th>
          <th class="border px-2 py-1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="registro in registrosFiltrados" :key="registro.id">
          <td class="border px-2 py-1">{{ registro.periodo }}</td>
          <td class="border px-2 py-1">{{ registro.control }}</td>
          <td class="border px-2 py-1">{{ registro.bacSaOsmosis }}</td>
          <td class="border px-2 py-1">{{ registro.bacAniCirculacion }}</td>
          <td class="border px-2 py-1">{{ registro.endoAguaTrata }}</td>
          <td class="border px-2 py-1">
            <button class="bg-blue-500 text-white px-2 py-1 rounded" @click="abrirModal(registro)">Ver/Editar</button>
          </td>
        </tr>
        <tr v-if="registrosFiltrados.length === 0">
          <td colspan="6" class="text-center py-2">No hay registros para esta IPRESS</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="cerrarModal">✕</button>
        <h3 class="text-lg font-bold mb-4">Ver/Editar Registro</h3>
        <div class="space-y-2">
          <div><b>Periodo:</b> {{ registroActual.periodo }}</div>
          <div><b>Control:</b> {{ registroActual.control }}</div>
          <div><b>Bac. Osmosis:</b> {{ registroActual.bacSaOsmosis }}</div>
          <div><b>Bac. Circulación:</b> {{ registroActual.bacAniCirculacion }}</div>
          <div><b>Endo. Agua:</b> {{ registroActual.endoAguaTrata }}</div>
          <!-- Aquí puedes agregar más campos o inputs para edición -->
        </div>
        <div class="flex justify-end mt-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>
    <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" @click="abrirModalNuevo">Registrar nuevo</button>
    <!-- Tabla y modal de edición aquí (ya implementados) -->
    <!-- Modal para nuevo registro -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="cerrarModalNuevo">✕</button>
        <h2 class="text-xl font-semibold mb-4">Registrar Calidad Microbiológica</h2>
        <form @submit.prevent="registrarNuevo">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block font-semibold text-sm text-gray-700">Se realizó Controles</label>
              <select v-model="control" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>
            <!-- <div class="space-y-2">
              <label class="block font-semibold text-sm text-gray-700">Periodo</label>
              <input v-model="periodo" type="date" class="w-full border rounded p-2 text-sm" />
            </div> -->
          </div>

          <h2 class="text-lg font-semibold mt-6">Recuento Bacteriano en Agua Tratada (UFC/ML)</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <input v-model="bacSaOsmosis" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
            <input v-model="bacAniCirculacion" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
          </div>

          <h2 class="text-lg font-semibold mt-6">Nivel de Endotoxinas en Agua Tratada (UE/ML)</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
              <select v-model="endMaquiHemodi" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="Normal">Normal (&le;0.25 UE/ML)</option>
                <option value="Alto">Alto (&gt;0.25 UE/ML)</option>
              </select>
              <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
            </div>
            <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
              <h6>Salida de la Ósmosis</h6>
              <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="Normal">Normal (&le;0.25 UE/ML)</option>
                <option value="Alto">Alto (&gt;0.25 UE/ML)</option>
              </select>
              <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
            </div>
            <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
              <h6>Retorno del anillo de circulación</h6>
              <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="Normal">Normal (&le;0.25 UE/ML)</option>
                <option value="Alto">Alto (&gt;0.25 UE/ML)</option>
              </select>
              <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
            </div>
          </div>

          <h2 class="text-lg font-semibold mt-6">Nivel de Endotoxinas en Agua Tratada (UE/ML)</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
              <h6>Salida de la Ósmosis</h6>
              <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="Normal">Normal (&le;0.25 UE/ML)</option>
                <option value="Alto">Alto (&gt;0.25 UE/ML)</option>
              </select>
              <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
            </div>
            <div class="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
              <h6>Retorno del anillo de circulación</h6>
              <select v-model="endMaquiHemodi2" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="Normal">Normal (&le;0.25 UE/ML)</option>
                <option value="Alto">Alto (&gt;0.25 UE/ML)</option>
              </select>
              <input disabled class="w-full border rounded p-2 text-sm bg-gray-200" placeholder="Estado" />
            </div>
          </div>

          <h2 class="text-lg font-semibold mt-6">Recuento Bacteriano en Líquido de Diálisis (UFC/ML)</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <input v-model="bacMaquiHemodi" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
            <input v-model="bacMaquiHemodi2" type="number" placeholder="Escriba solo valores numéricos" class="w-full border rounded p-2 text-sm" />
          </div>

          

          <div class="flex justify-between mt-8">
            <button type="button" class="bg-gray-300 text-black px-4 py-2 rounded" @click="cerrarModalNuevo">Cancelar</button>
            <div class="flex gap-4">
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
              <button type="button" class="bg-blue-400 text-white px-4 py-2 rounded" @click="registrarYVolver">Registrar y Volver a Llenar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
// Simulación de IPRESS (reemplaza por fetch real de la API)
const listaIpress = ref([
  { id_ipress: 1, nombre_corto: 'Centro Nacional de Salud Renal' },
  { id_ipress: 2, nombre_corto: 'Clínica Vida' },
  { id_ipress: 3, nombre_corto: 'Sanar' },
]);
const ipressSeleccionada = ref(listaIpress.value[0]?.id_ipress || null);
// Modal para nuevo registro
const mostrarModalNuevo = ref(false);
function abrirModalNuevo() {
  mostrarModalNuevo.value = true;
}
function cerrarModalNuevo() {
  mostrarModalNuevo.value = false;
}

function registrarNuevo() {
  // Aquí deberías guardar el registro en la base de datos o API
  // Por ahora solo cierra el modal
  cerrarModalNuevo();
}
function registrarYVolver() {
  // Aquí deberías guardar el registro y limpiar los campos
  // Por ahora solo limpia y deja el modal abierto
  control.value = '';
  periodo.value = '';
  bacSaOsmosis.value = '';
  bacAniCirculacion.value = '';
  endoAguaTrata.value = '';
  rtnAnilloCir.value = '';
  bacMaquiHemodi.value = '';
  bacMaquiHemodi2.value = '';
  endMaquiHemodi.value = '';
  endMaquiHemodi2.value = '';
}
import { ref, computed } from 'vue';

// Simulación de registros (reemplaza por fetch real de la API)
const registros = ref([
  { id: 1, periodo: '2025-09-01', control: 'Sí', bacSaOsmosis: 10, bacAniCirculacion: 5, endoAguaTrata: 'Normal' },
  { id: 2, periodo: '2025-08-01', control: 'No', bacSaOsmosis: 20, bacAniCirculacion: 8, endoAguaTrata: 'Alto' },
]);

// Filtrar registros por IPRESS seleccionada
const registrosFiltrados = computed(() => registros.value.filter(r => !r.id_ipress || r.id_ipress === ipressSeleccionada.value));

const mostrarModal = ref(false);
const registroActual = ref({});
function abrirModal(registro) {
  registroActual.value = { ...registro };
  mostrarModal.value = true;
}
function cerrarModal() {
  mostrarModal.value = false;
}

const control = ref('');
const periodo = ref('');
const bacSaOsmosis = ref('');
const bacAniCirculacion = ref('');
const endoAguaTrata = ref('');
const rtnAnilloCir = ref('');
const bacMaquiHemodi = ref('');
const bacMaquiHemodi2 = ref('');
const endMaquiHemodi = ref('');
const endMaquiHemodi2 = ref('');
</script>
