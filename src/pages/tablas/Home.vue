<template>
  <div class="tablas-page p-4 md:p-6 bg-slate-50 min-h-screen space-y-6 w-full min-w-0 max-w-full overflow-hidden box-border flex flex-col">
    
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-md w-full min-w-0">
      <div class="flex flex-wrap items-center gap-6 w-full md:w-auto">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Periodo:</label>
          <select v-model="periodoSeleccionado" class="w-full sm:w-auto border border-slate-200 px-4 py-2 rounded-xl text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium" @change="searchPeriodoIpress">
            <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">
              {{ periodo.periodo }}
            </option>
          </select>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Clínica:</label>
          <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearch" clearable
            placeholder="Buscar clínica..." @select="handleSelect" :value-key="'ipress'" class="w-full sm:w-[350px] !rounded-xl custom-el-input" @change="searchPeriodoIpress" />
        </div>
      </div>

      <div class="w-full md:w-auto flex justify-end">
        <button @click="exportToExcel"
          class="group flex items-center gap-2 bg-white border border-indigo-200 text-indigo-600 px-5 py-2 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm active:scale-95">
          <svg class="w-5 h-5 group-hover:text-indigo-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Exportar Excel
        </button>
      </div>
    </div>

    <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 transition-all hover:shadow-md w-full min-w-0">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <label class="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
          <div class="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
          Formulario a visualizar:
        </label>
        <select v-model="formularioSeleccionado" class="w-full sm:w-auto border border-indigo-200 px-4 py-2 rounded-xl text-sm bg-indigo-50/50 text-indigo-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-sm" @change="updateTabla">
          <option value="2">Unidad Actual</option>
          <option value="3">Infección</option>
          <option value="4">Morbilidad Hospitalaria</option>
          <option value="5">Resultados Clínicos</option>
          <option value="6">Vacunación</option>
        </select>
        <button v-if="formularioSeleccionado === '2'" @click="abrirModalNuevo"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-center justify-between pt-1">
        <div class="flex flex-1 flex-col sm:flex-row gap-4 w-full">
            <div class="relative flex-1 group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                <input v-model="filtroNombre" placeholder="Filtrar por nombre del paciente..." class="w-full border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-slate-50/50 focus:bg-white" />
            </div>
            <div class="relative flex-1 group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                <input v-model="filtroDocumento" placeholder="Filtrar por documento (DNI)..." class="w-full border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-slate-50/50 focus:bg-white" />
            </div>
        </div>
        <button @click="updateTabla" class="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Aplicar Filtros
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col w-full min-w-0 flex-1 overflow-hidden relative table-card">
      
      <div class="table-scroll-wrapper custom-scrollbar pb-3">
        <table class="tablas-table text-left border-collapse">
          <thead>
            <tr class="bg-slate-100/80 border-b border-slate-200">
              <th class="px-4 py-3 text-xs font-extrabold text-slate-700 uppercase tracking-wider text-center sticky left-0 bg-slate-100 z-20 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] border-r border-slate-200 backdrop-blur-md">
                Acciones
              </th>
              <th v-for="col in columnasTabla" :key="col" class="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {{ col.replaceAll("_", " ") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="datosTabla.length === 0">
              <td :colspan="columnasTabla.length + 1" class="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <div class="p-3 bg-slate-50 rounded-full">
                  <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                </div>
                <span class="font-semibold text-sm">No se encontraron registros.</span>
              </td>
            </tr>
            <tr v-for="(fila, i) in datosTabla" :key="i" class="hover:bg-indigo-50/50 transition-colors group">
              <td class="px-3 py-2 text-center sticky left-0 bg-white group-hover:bg-indigo-50/80 transition-colors z-10 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] border-r border-slate-100">
                <button @click="abrirModalDetalle(fila)" class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-90" title="Ver detalles completos">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </td>
              <td v-for="col in columnasTabla" :key="col" class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap border-b border-transparent">
                <span :class="{'text-slate-400 italic font-medium': !fila[col] || fila[col] === '-'}">{{ fila[col] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-50/80 px-4 md:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto w-full">
        <div class="text-xs md:text-sm text-slate-500 font-medium order-2 sm:order-1">
          Mostrando <span class="font-bold text-slate-900">{{ datosTabla.length }}</span> de <span class="font-bold text-slate-900">{{ totalRegistros }}</span> registros totales
        </div>
        <div class="flex items-center gap-2 order-1 sm:order-2">
          <button @click="goToPreviousPage" :disabled="!anteriorPagina" 
            class="px-3 py-1.5 border rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1"
            :class="anteriorPagina ? 'bg-white text-slate-700 border-slate-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            Anterior
          </button>
          <span class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-500/30">
            {{ paginaActual }}
          </span>
          <button @click="goToNextPage" :disabled="!siguientePagina" 
            class="px-3 py-1.5 border rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1"
            :class="siguientePagina ? 'bg-white text-slate-700 border-slate-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'">
            Siguiente
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal flotante Nuevo (Unidad Actual) -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in" @click="cerrarModalNuevo"></div>
      <div class="relative w-full max-w-5xl max-h-[90vh] bg-slate-50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/20 animate-pop-in">
        <div class="relative overflow-hidden px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 shrink-0">
          <div class="relative z-10 flex justify-between items-center">
            <h3 class="text-xl font-extrabold text-white tracking-tight">Nueva Unidad Actual</h3>
            <button @click="cerrarModalNuevo" class="p-2 bg-white/10 hover:bg-red-500 hover:text-white text-white/90 rounded-xl backdrop-blur-sm transition-all active:scale-90">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div v-if="!pacienteParaNuevo" class="space-y-4">
            <label class="block text-sm font-bold text-slate-700">Busque el paciente para registrar la unidad actual:</label>
            <div ref="buscadorPacienteRef" class="relative w-full max-w-md">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                v-model="busquedaPaciente"
                type="text"
                placeholder="Buscar por nombre o documento (DNI)..."
                class="w-full border border-slate-300 pl-11 pr-4 py-2.5 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @focus="mostrarListaPacientes = true"
                @keydown.escape="mostrarListaPacientes = false"
              />
              <div
                v-show="mostrarListaPacientes"
                class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar"
              >
                <div
                  v-for="(p, i) in pacientesFiltradosModal"
                  :key="p.id_paciente || p.documento || i"
                  class="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                  @mousedown.prevent="seleccionarPacienteModal(p)"
                >
                  <p class="font-medium text-slate-800">{{ p.paciente || p.nombre || 'Sin nombre' }}</p>
                  <p v-if="p.documento" class="text-xs text-slate-500">DNI: {{ p.documento }}</p>
                </div>
                <p v-if="pacientesFiltradosModal.length === 0" class="px-4 py-3 text-sm text-slate-500 italic">
                  No se encontraron pacientes.
                </p>
              </div>
            </div>
          </div>
          <div v-else class="pt-2">
            <Form2Hemodialisis
              :paciente="pacienteParaNuevo"
              :periodo="periodoSeleccionado"
              :periodoIpress="idPeriodoIpress"
              @cancelar="cerrarModalNuevo"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in" @click="cerrarModalDetalle"></div>

      <div class="relative w-full max-w-5xl bg-slate-50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[90vh] animate-pop-in border border-white/20">
        
        <div class="relative overflow-hidden px-8 py-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 shrink-0">
          <div class="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-10 -mb-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
          
          <div class="relative z-10 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path></svg>
              </div>
              <div>
                <h3 class="text-2xl font-extrabold text-white tracking-tight">Ficha Técnica del Paciente</h3>
                <p class="text-indigo-100 text-sm font-medium mt-1 opacity-90">Desglose completo de la información clínica registrada</p>
              </div>
            </div>
            
            <button @click="cerrarModalDetalle" class="p-2 bg-white/10 hover:bg-red-500 hover:text-white text-white/90 rounded-xl backdrop-blur-sm transition-all active:scale-90 border border-transparent">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar relative flex-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            <div v-for="(valor, clave) in registroSeleccionado" :key="clave" 
                 class="group relative bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              
              <div class="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

              <div class="pl-2">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors"></div>
                  <span class="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">{{ clave.replaceAll("_", " ") }}</span>
                </div>
                <span class="block text-sm font-semibold text-slate-800 break-words leading-relaxed pl-4" :class="{'text-slate-400 italic font-medium': !valor || valor === '-'}">
                  {{ valor || 'No registrado' }}
                </span>
              </div>
            </div>

          </div>
        </div>

        <div class="px-6 md:px-8 py-4 border-t border-slate-200 bg-white flex justify-end shrink-0">
          <button @click="cerrarModalDetalle" class="bg-indigo-50 text-indigo-700 px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95 border border-indigo-100 shadow-sm hover:shadow-md">
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
// ... EL SCRIPT ES EXACTAMENTE EL MISMO QUE EL ANTERIOR ...
import * as XLSX from 'xlsx';
const totalRegistros = ref(0);
const paginaActual = ref(1);
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue';

// ==========================================
// NUEVAS VARIABLES Y LÓGICA PARA EL MODAL
// ==========================================
const mostrarModal = ref(false);
const registroSeleccionado = ref(null);

const abrirModalDetalle = (fila) => {
  registroSeleccionado.value = fila;
  document.body.style.overflow = 'hidden'; // Evita el scroll del body al abrir modal
  mostrarModal.value = true;
};

const cerrarModalDetalle = () => {
  mostrarModal.value = false;
  document.body.style.overflow = ''; // Restaura el scroll
  setTimeout(() => {
      registroSeleccionado.value = null;
  }, 300); // Limpia después de la animación de cierre
};

const mostrarModalNuevo = ref(false);
const idPacienteParaNuevo = ref('');
const busquedaPaciente = ref('');
const mostrarListaPacientes = ref(false);

const pacienteParaNuevo = computed(() => {
  if (!idPacienteParaNuevo.value) return null;
  return pacientes.value.find(p => (p.id_paciente && String(p.id_paciente) === String(idPacienteParaNuevo.value)) || (p.documento && p.documento === idPacienteParaNuevo.value)) || null;
});

const pacientesFiltradosModal = computed(() => {
  const q = (busquedaPaciente.value || '').trim().toLowerCase();
  if (!q) return pacientes.value.slice(0, 50);
  return pacientes.value.filter(p => {
    const nombre = (p.paciente || p.nombre || '').toLowerCase();
    const doc = (p.documento || '').toString().toLowerCase();
    return nombre.includes(q) || doc.includes(q);
  }).slice(0, 50);
});

const buscadorPacienteRef = ref(null);

const seleccionarPacienteModal = (p) => {
  idPacienteParaNuevo.value = p.id_paciente || p.documento;
  busquedaPaciente.value = '';
  mostrarListaPacientes.value = false;
};

const cerrarListaPacientesSiFuera = (e) => {
  if (buscadorPacienteRef.value && !buscadorPacienteRef.value.contains(e.target)) {
    mostrarListaPacientes.value = false;
    document.removeEventListener('click', cerrarListaPacientesSiFuera);
  }
};

watch(mostrarListaPacientes, (open) => {
  if (open) {
    nextTick(() => document.addEventListener('click', cerrarListaPacientesSiFuera));
  } else {
    document.removeEventListener('click', cerrarListaPacientesSiFuera);
  }
});

const abrirModalNuevo = () => {
  idPacienteParaNuevo.value = '';
  busquedaPaciente.value = '';
  mostrarListaPacientes.value = false;
  document.body.style.overflow = 'hidden';
  mostrarModalNuevo.value = true;
};

const cerrarModalNuevo = () => {
  mostrarModalNuevo.value = false;
  document.body.style.overflow = '';
  setTimeout(() => {
    idPacienteParaNuevo.value = '';
    busquedaPaciente.value = '';
    mostrarListaPacientes.value = false;
  }, 300);
  updateTabla(); // Refrescar tabla por si se guardó algo
};
// ==========================================


const state1 = ref('')

const aplicaTodos = ref(true)
const modalidadSeleccionada = ref('todos')
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL')
const idClinicaSeleccionada = ref(62877)
const idPeriodoIpress = ref(17)
const periodoSeleccionado = ref(55)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits(['form2'])

const siguientePagina = ref(null);
const anteriorPagina = ref(null);
const formularioSeleccionado=ref(2)
const abrirFormulario = (paciente, numeroFormulario) => {
  console.log("paientessss",idPeriodoIpress.value)
  switch (numeroFormulario) {
    case 1: emit('form2', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value}); break
    case 2: emit('form3', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 3: emit('form4', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 4: emit('form5', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 5: emit('form7', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
}
const formulariosConfig = {
  2: {
    endpoint: "unidadesActualesPaginacion",
    columnas: [
      "paciente", "documento", "fecha_creacion_acceso_actual", "tipo_acceso_actual", "localizacion_acceso_actual", "cambio_acceso", "fecha_creacion_acceso_nuevo", "tipo_acceso_nuevo", "localizacion_acceso_nuevo"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      fecha_creacion_acceso_actual: item.fecha_creacion_acceso_actual ?? '-',
      tipo_acceso_actual: item.tipo_acceso_actual ?? item.tipo_acceso ?? '-',
      localizacion_acceso_actual: item.localizacion_acceso_actual ?? '-',
      cambio_acceso: item.cambio_acceso === 'true' || item.cambio_acceso === true ? 'Si' : 'No',
      motivo_cambio: item.motivo_cambio ?? '-',
      fecha_creacion_acceso_nuevo: item.fecha_creacion_acceso_nuevo ?? '-',
      tipo_acceso_nuevo: item.tipo_acceso_nuevo ?? '-',
      localizacion_acceso_nuevo: item.localizacion_acceso_nuevo ?? '-'
    })
  },
  3: {
    endpoint: "eventosAccesosVascularesPaginacion",
    columnas: [
      "paciente", "documento", "fe_evento", "tpInfeccion", "tratamientoIV", "vancomicinaIV", "hemocultivoPositivo", "tipoGram", "tipoInfeccionLocal", "tpGermen", "bacteria", "tipoBacteria", "observaciones"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      fe_evento: item.fecha_evento ?? '-',
      tpInfeccion: item.tipo_evento ?? '-',
      tratamientoIV: item.descripcion ?? '-',
      vancomicinaIV: item.vancomicinaIV ?? '-',
      hemocultivoPositivo: item.hemocultivoPositivo ?? '-',
      tipoGram: item.tipoGram ?? '-',
      tipoInfeccionLocal: item.tipoInfeccionLocal ?? '-',
      tpGermen: item.tpGermen ?? '-',
      bacteria: item.bacteria ?? '-',
      tipoBacteria: item.tipoBacteria ?? '-',
      observaciones: item.observaciones ?? '-'
    })
  },
  4: {
    endpoint: "morbilidadesHospitalarias",
    columnas: ["paciente", "documento", "diagnostico", "codigo_diagnostico", "fIniHos", "fAltHos", "fuente"],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      diagnostico: item.diagnostico ?? '-',
      codigo_diagnostico: item.codigo_diagnostico ?? '-',
      fIniHos: item.fIniHos ?? '-',
      fAltHos: item.fAltHos ?? '-',
      fuente: item.fuente ?? '-',
    })
  },
  5: {
    endpoint: "resultadosClinicos",
    columnas: ["paciente", "documento", "tmpDialisis", "eritropoyetina", "hierro", "hiperparatiroidismo", "hb", "calcio", "fosforo", "pthi", "alb", "calcioCorregido", "kt"],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      tmpDialisis: item.tmpDialisis ?? '-',
      eritropoyetina: item.eritropoyetina ?? '-',
      hierro: item.hierro ?? '-',
      hiperparatiroidismo: item.hiperparatiroidismo ?? '-',
      hb: item.hb ?? '-',
      calcio: item.calcio ?? '-',
      fosforo: item.fosforo ?? '-',
      pthi: item.pthi ?? '-',
      alb: item.alb ?? '-',
      calcioCorregido: item.calcioCorregido ?? '-',
      kt: item.kt ?? '-'
    })
  },
  6: {
    endpoint: "vacunaciones",
    columnas: [
      "paciente", "documento",
      "turno", "frecuencia",
      "vhbEstado", "vhbFecha", "vhcEstado", "vhcFecha", "vihEstado", "vihFecha",
      "vacunaHepatitis", "estadoAcHBs", "fechaVacHepatitis",
      "dosisHepatitisB", "fechaHepatitisB", "motivoNoHepatitisB",
      "dosisCovid", "fechaCovid", "motivoNoCovid",
      "fechaInfluenza", "motivoNoInfluenza",
      "fechaNeumococo", "motivoNoNeumococo"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      turno: item.turno ?? '-',
      frecuencia: item.frecuencia ?? '-',
      vhbEstado: item.vhbEstado ?? '-',
      vhbFecha: item.vhbFecha ?? '-',
      vhcEstado: item.vhcEstado ?? '-',
      vhcFecha: item.vhcFecha ?? '-',
      vihEstado: item.vihEstado ?? '-',
      vihFecha: item.vihFecha ?? '-',
      vacunaHepatitis: item.vacunaHepatitis ?? '-',
      estadoAcHBs: item.estadoAcHBs ?? '-',
      fechaVacHepatitis: item.fechaVacHepatitis ?? '-',
      dosisHepatitisB: item.dosisHepatitisB ?? '-',
      fechaHepatitisB: item.fechaHepatitisB ?? '-',
      motivoNoHepatitisB: item.motivoNoHepatitisB ?? '-',
      dosisCovid: item.dosisCovid ?? '-',
      fechaCovid: item.fechaCovid ?? '-',
      motivoNoCovid: item.motivoNoCovid ?? '-',
      fechaInfluenza: item.fechaInfluenza ?? '-',
      motivoNoInfluenza: item.motivoNoInfluenza ?? '-',
      fechaNeumococo: item.fechaNeumococo ?? '-',
      motivoNoNeumococo: item.motivoNoNeumococo ?? '-'
    })
  },
};

const datosTabla = ref([]);
const columnasTabla = ref([]);
const filtroNombre = ref("");
const filtroDocumento = ref("");

const colorClase = (n) => {
  if (n === 1) return 'text-red-600'
  if (n === 2) return 'text-orange-500'
  if (n === 3) return 'text-yellow-500'
  if (n >= 4) return 'text-green-600'
  return 'text-gray-500'
}
const exportToExcel = async () => {
  try {
    const config = formulariosConfig[formularioSeleccionado.value];
    if (!config) {
      alert('No hay configuración de formulario');
      return;
    }
    // Construir endpoint base con filtros
    let endpoint = `/${config.endpoint}/?id_periodo_ipress=${idPeriodoIpress.value}`;
    const params = [];
    if (filtroNombre.value) params.push(`search=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`search=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      endpoint += '&' + params.join('&');
    }
    // Función para obtener todos los registros paginando
    let nextUrl = endpoint;
    let allResults = [];
    while (nextUrl) {
      const data = await getAllIpress(nextUrl);
      if (data && data.results) {
        allResults = allResults.concat(data.results);
        nextUrl = data.next;
      } else {
        break;
      }
    }
    if (!allResults.length) {
      alert('No hay datos para exportar');
      return;
    }
    // Usar las columnas actuales para exportar
    const exportData = allResults.map(config.parse).map(row => {
      const obj = {};
      columnasTabla.value.forEach(col => {
        obj[col] = row[col];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');
    XLSX.writeFile(wb, 'registros_tabla.xlsx');
  } catch (error) {
    alert('Error al exportar a Excel');
    console.error(error);
  }
};
const numeroBadge = (paciente, n) => {
  if (n === 1) return paciente.cantidad_de_registros_unidades_actuales
  if (n === 2) return paciente.cantidad_de_eventos_accesos_vasculares
  if (n === 3) return paciente.cantidad_de_morbilidades
  if (n === 4) return paciente.cantidad_de_resultados_clinicos
  if (n === 5) return paciente.cantidad_de_vacunaciones
};
const cargarPagina = async (url) => {
  if (!url) return;
  const config = formulariosConfig[formularioSeleccionado.value];
  try {
    let finalUrl = url;
    const params = [];
    if (filtroNombre.value) params.push(`paciente=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`documento=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.join('&');
    }
    const data = await getAllIpress(finalUrl);
    datosTabla.value = data.results.map(config.parse);
    siguientePagina.value = data.next;
    anteriorPagina.value = data.previous;
    totalRegistros.value = data.count ?? datosTabla.value.length;
    // Calcular página actual
    if (data.next || data.previous) {
      const nextUrl = new URL(data.next ?? data.previous);
      const pageParam = nextUrl.searchParams.get('page');
      paginaActual.value = pageParam ? parseInt(pageParam) - (data.next ? 1 : -1) : 1;
    } else {
      paginaActual.value = 1;
    }
  } catch (error) {
    console.error("Error en paginación:", error);
  }
};
const pacientes = ref([])
const ipress = ref([])
const periodoIpress = ref([])
const periodos = ref([])
const idPerido = ref(55)
const idIpress = ref(62877)

const fechaActual = new Date()
const meses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
]
const anios = Array.from({ length: 10 }, (_, i) => fechaActual.getFullYear() - i)
const mes = ref(meses[fechaActual.getMonth()])
const ano = ref(fechaActual.getFullYear())


const updateTabla = async () => {
  const config = formulariosConfig[formularioSeleccionado.value];
  if (!config) return;

  try {
    let endpoint = `/${config.endpoint}/?id_periodo_ipress=${idPeriodoIpress.value}`;
    const params = [];
    if (filtroNombre.value) params.push(`search=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`search=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      endpoint += '&' + params.join('&');
    }
    const data = await getAllIpress(`${endpoint}`);
    const registros = data.results || [];

    datosTabla.value = registros.map(config.parse);
    columnasTabla.value = config.columnas;

    siguientePagina.value = data.next;
    anteriorPagina.value = data.previous;
    totalRegistros.value = data.count ?? datosTabla.value.length;
    // Calcular página actual
    if (data.next || data.previous) {
      const nextUrl = new URL(data.next ?? data.previous);
      const pageParam = nextUrl.searchParams.get('page');
      paginaActual.value = pageParam ? parseInt(pageParam) - (data.next ? 1 : -1) : 1;
    } else {
      paginaActual.value = 1;
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
    datosTabla.value = [];
    columnasTabla.value = [];
    totalRegistros.value = 0;
    paginaActual.value = 1;
  }
};
const goToNextPage = () => {
  if (siguientePagina.value) {
    cargarPagina(siguientePagina.value);
  }
};

const goToPreviousPage = () => {
  if (anteriorPagina.value) {
    cargarPagina(anteriorPagina.value);
  }
};

onMounted(updateTabla);
watch(formularioSeleccionado, updateTabla);
async function searchPeriodoIpress() {
  idIpress.value = idClinicaSeleccionada.value;
  idPerido.value = periodoSeleccionado.value;
  if (idClinicaSeleccionada.value == null || periodoSeleccionado.value == null) {
    idPeriodoIpress.value = null;
    updateTabla();
    return;
  }
  idPeriodoIpress.value = await resolverIdPeriodoIpress(
    periodoSeleccionado.value,
    idClinicaSeleccionada.value,
  );
  updateTabla();
}

const fetchPacientes = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/resumen_registros/" + idIpress.value + "/" + idPerido.value);
    pacientes.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const handleSelect = (item) => {
  idClinicaSeleccionada.value = item.id_ipress; // ID u otros datos
  searchPeriodoIpress();
};
const querySearch = (queryString, cb) => {
  const results = queryString
    ? ipress.value.filter(r =>
      r.ipress?.toLowerCase().includes(queryString.toLowerCase())
    )
    : ipress.value;
  cb(results);
};
const fetchIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/ipress/");
    ipress.value = respuesta

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

onMounted(async () => {
  await fetchPeriodo();
  fetchPacientes();
  fetchIpress();
  await searchPeriodoIpress();
});

</script>

<style scoped>
/* =========================================
   SCROLLBAR DE LA TABLA (MÁS GRUESO Y VISIBLE)
   ========================================= */
.custom-scrollbar::-webkit-scrollbar {
  height: 14px; /* Barra horizontal más gruesa para que sea fácil de agarrar */
  width: 8px;  /* Barra vertical */
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* Color de fondo sutil (slate-100) */
  border-radius: 10px;
  border-top: 1px solid #e2e8f0;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* Color del "agarre" (slate-300) */
  border-radius: 10px;
  border: 3px solid #f1f5f9; /* Borde para dar efecto de padding */
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6366f1; /* Se vuelve morado oscuro al pasar el ratón */
}

/* Fix específico de Tailwind y el-autocomplete */
:deep(.custom-el-input .el-input__wrapper) {
  border-radius: 0.75rem !important; 
  box-shadow: 0 0 0 1px #e2e8f0 inset !important; 
  padding: 0.25rem 1rem !important;
}
:deep(.custom-el-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5) inset !important; 
}

/* Animaciones del Modal */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Contenedor de la tabla: scroll horizontal sin expandir la página */
.tablas-page {
  max-width: 100%;
}
.table-card {
  max-width: 100%;
}
.table-scroll-wrapper {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
}
.tablas-table {
  width: max-content;
  min-width: 100%;
}

/* Utilidades */
.text-red-600 { color: #dc2626; }
.text-orange-500 { color: #f97316; }
.text-yellow-500 { color: #eab308; }
.text-green-600 { color: #16a34a; }
</style>