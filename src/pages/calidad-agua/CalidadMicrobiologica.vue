<template>
  <div class="min-h-screen bg-slate-50/80 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full shrink-0" aria-hidden="true"></span>
            Calidad microbiológica
          </h1>
          <p class="text-slate-500 text-sm mt-1 max-w-2xl">
            Registros de recuento bacteriano y endotoxinas en agua tratada y líquido de diálisis.
          </p>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-cyan-700 transition-colors"
            @click="abrirModalNuevo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Registrar nuevo
          </button>
        </div>
      </header>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Periodo</th>
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Control</th>
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Bac. agua (Osm. / Circ.)</th>
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Endo. agua</th>
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Bac. líquido (M1 / M2)</th>
                <th class="text-left px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Endo. líquido</th>
                <th class="text-right px-4 py-3 font-bold text-slate-600 uppercase text-xs tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="registro in registrosFiltrados" :key="registro.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">{{ registro.periodo }}</td>
                <td class="px-4 py-3 text-slate-600">{{ registro.control }}</td>
                <td class="px-4 py-3 text-slate-600 tabular-nums">
                  {{ formatoNumero(registro.bacSaOsmosis) }} / {{ formatoNumero(registro.bacAniCirculacion) }}
                </td>
                <td class="px-4 py-3 text-slate-600 text-xs max-w-[200px]">
                  {{ resumenEndoAgua(registro) }}
                </td>
                <td class="px-4 py-3 text-slate-600 tabular-nums">
                  {{ formatoNumero(registro.bacMaquiHemodi) }} / {{ formatoNumero(registro.bacMaquiHemodi2) }}
                </td>
                <td class="px-4 py-3 text-slate-600 text-xs max-w-[200px]">
                  {{ resumenEndoLiquido(registro) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg border border-cyan-200 text-cyan-700 text-xs font-semibold hover:bg-cyan-50 transition-colors"
                    @click="abrirModal(registro)"
                  >
                    Ver / Editar
                  </button>
                </td>
              </tr>
              <tr v-if="registrosFiltrados.length === 0">
                <td colspan="7" class="px-4 py-12 text-center text-slate-500 italic">
                  No hay registros para esta IPRESS.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal ver / editar -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      @click.self="cerrarModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-slate-200">
        <div class="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 px-5 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 class="text-lg font-bold text-white">Detalle del registro</h3>
          <button type="button" class="text-white/90 hover:text-white text-xl leading-none p-1" aria-label="Cerrar" @click="cerrarModal">✕</button>
        </div>
        <div class="p-5 space-y-5 text-sm">
          <div class="flex flex-wrap gap-4 text-slate-600 border-b border-slate-100 pb-4">
            <div><span class="font-semibold text-slate-800">Periodo:</span> {{ registroActual.periodo }}</div>
            <div><span class="font-semibold text-slate-800">Control:</span> {{ registroActual.control }}</div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h4 class="text-xs font-bold text-cyan-800 uppercase tracking-wide">Recuento bacteriano en agua tratada (UFC/mL)</h4>
            <p class="text-slate-700"><span class="text-slate-500">Salida de la ósmosis:</span> {{ formatoNumero(registroActual.bacSaOsmosis) }}</p>
            <p class="text-slate-700"><span class="text-slate-500">Retorno del anillo de circulación:</span> {{ formatoNumero(registroActual.bacAniCirculacion) }}</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h4 class="text-xs font-bold text-cyan-800 uppercase tracking-wide">Nivel de endotoxinas en agua tratada (UE/mL)</h4>
            <p class="text-slate-700">
              <span class="text-slate-500">Salida de la ósmosis:</span> {{ textoEndotoxina(registroActual.endoAguaTrata) }}
            </p>
            <p class="text-slate-700">
              <span class="text-slate-500">Retorno del anillo de circulación:</span> {{ textoEndotoxina(registroActual.rtnAnilloCir) }}
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h4 class="text-xs font-bold text-cyan-800 uppercase tracking-wide">Recuento bacteriano en líquido de diálisis (UFC/mL)</h4>
            <p class="text-slate-700"><span class="text-slate-500">Máquina de hemodiálisis 1:</span> {{ formatoNumero(registroActual.bacMaquiHemodi) }}</p>
            <p class="text-slate-700"><span class="text-slate-500">Máquina de hemodiálisis 2:</span> {{ formatoNumero(registroActual.bacMaquiHemodi2) }}</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h4 class="text-xs font-bold text-cyan-800 uppercase tracking-wide">Nivel de endotoxinas en líquido de diálisis (UE/mL)</h4>
            <p class="text-slate-700">
              <span class="text-slate-500">Máquina de hemodiálisis 1:</span> {{ textoEndotoxina(registroActual.endMaquiHemodi) }}
            </p>
            <p class="text-slate-700">
              <span class="text-slate-500">Máquina de hemodiálisis 2:</span> {{ textoEndotoxina(registroActual.endMaquiHemodi2) }}
            </p>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
              @click="cerrarModal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nuevo registro -->
    <div
      v-if="mostrarModalNuevo"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      @click.self="cerrarModalNuevo"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto relative border border-slate-200">
        <div class="sticky top-0 z-10 bg-gradient-to-r from-cyan-600 to-cyan-700 px-5 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 class="text-lg font-bold text-white">Registrar calidad microbiológica</h2>
          <button type="button" class="text-white/90 hover:text-white text-xl leading-none p-1" aria-label="Cerrar" @click="cerrarModalNuevo">✕</button>
        </div>

        <form class="p-5 sm:p-6 space-y-6" @submit.prevent="registrarNuevo">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Se realizó controles</label>
            <select
              v-model="control"
              class="w-full max-w-md border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
            <p v-if="control === ''" class="text-xs text-slate-500 mt-2">
              Indique primero si se realizaron controles para continuar.
            </p>
          </div>

          <template v-if="control === '1'">
          <!-- Recuento bacteriano agua tratada -->
          <section class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <h3 class="text-sm font-bold text-cyan-900 border-b border-cyan-200/80 pb-2">
              Recuento bacteriano en agua tratada (UFC/mL)
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0">Salida de la ósmosis</label>
                <input
                  v-model="bacSaOsmosis"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 10,00"
                  class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm tabular-nums focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0">Retorno del anillo de circulación</label>
                <input
                  v-model="bacAniCirculacion"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 10,00"
                  class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm tabular-nums focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          <!-- Endotoxinas agua tratada -->
          <section class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <h3 class="text-sm font-bold text-cyan-900 border-b border-cyan-200/80 pb-2">
              Nivel de endotoxinas en agua tratada (UE/mL)
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0 pt-2">Salida de la ósmosis</label>
                <div class="flex-1 space-y-2">
                  <select
                    v-model="endoAguaTrata"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Normal">Normal (≤ 0,25 UE/mL)</option>
                    <option value="Alto">Alto (&gt; 0,25 UE/mL)</option>
                  </select>
                  <p class="text-xs text-slate-500 pl-0.5">{{ textoEndotoxina(endoAguaTrata) }}</p>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0 pt-2">Retorno del anillo de circulación</label>
                <div class="flex-1 space-y-2">
                  <select
                    v-model="rtnAnilloCir"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Normal">Normal (≤ 0,25 UE/mL)</option>
                    <option value="Alto">Alto (&gt; 0,25 UE/mL)</option>
                  </select>
                  <p class="text-xs text-slate-500 pl-0.5">{{ textoEndotoxina(rtnAnilloCir) }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Recuento bacteriano líquido diálisis -->
          <section class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <h3 class="text-sm font-bold text-cyan-900 border-b border-cyan-200/80 pb-2">
              Recuento bacteriano en líquido de diálisis (UFC/mL)
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0">Máquina de hemodiálisis 1</label>
                <input
                  v-model="bacMaquiHemodi"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 7,00"
                  class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm tabular-nums focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0">Máquina de hemodiálisis 2</label>
                <input
                  v-model="bacMaquiHemodi2"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 11,00"
                  class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm tabular-nums focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          <!-- Endotoxinas líquido diálisis -->
          <section class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <h3 class="text-sm font-bold text-cyan-900 border-b border-cyan-200/80 pb-2">
              Nivel de endotoxinas en líquido de diálisis (UE/mL)
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0 pt-2">Máquina de hemodiálisis 1</label>
                <div class="flex-1 space-y-2">
                  <select
                    v-model="endMaquiHemodi"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Normal">Normal (≤ 0,25 UE/mL)</option>
                    <option value="Alto">Alto (&gt; 0,25 UE/mL)</option>
                  </select>
                  <p class="text-xs text-slate-500 pl-0.5">{{ textoEndotoxina(endMaquiHemodi) }}</p>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label class="text-sm font-medium text-slate-700 sm:w-64 shrink-0 pt-2">Máquina de hemodiálisis 2</label>
                <div class="flex-1 space-y-2">
                  <select
                    v-model="endMaquiHemodi2"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Normal">Normal (≤ 0,25 UE/mL)</option>
                    <option value="Alto">Alto (&gt; 0,25 UE/mL)</option>
                  </select>
                  <p class="text-xs text-slate-500 pl-0.5">{{ textoEndotoxina(endMaquiHemodi2) }}</p>
                </div>
              </div>
            </div>
          </section>
          </template>

          <div
            v-else-if="control === '2'"
            class="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900"
          >
            No se realizaron controles: puede registrar el registro sin completar mediciones. Los valores de laboratorio no aplican en este caso.
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              @click="cerrarModalNuevo"
            >
              Cancelar
            </button>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                class="px-4 py-2.5 rounded-lg border border-cyan-200 text-cyan-800 font-semibold text-sm hover:bg-cyan-50 transition-colors disabled:opacity-45 disabled:pointer-events-none"
                :disabled="!puedeEnviarRegistro"
                @click="registrarYVolver"
              >
                Registrar y volver a llenar
              </button>
              <button
                type="submit"
                class="px-4 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 shadow-sm transition-colors disabled:opacity-45 disabled:pointer-events-none"
                :disabled="!puedeEnviarRegistro"
              >
                Registrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const listaIpress = ref([
  { id_ipress: 1, nombre_corto: 'Centro Nacional de Salud Renal' },
  { id_ipress: 2, nombre_corto: 'Clínica Vida' },
  { id_ipress: 3, nombre_corto: 'Sanar' },
]);
const ipressSeleccionada = ref(listaIpress.value[0]?.id_ipress ?? null);

const registros = ref([
  {
    id: 1,
    id_ipress: 1,
    periodo: '2025-09-01',
    control: 'Sí',
    bacSaOsmosis: 10,
    bacAniCirculacion: 10,
    endoAguaTrata: 'Normal',
    rtnAnilloCir: 'Normal',
    bacMaquiHemodi: 7,
    bacMaquiHemodi2: 11,
    endMaquiHemodi: 'Normal',
    endMaquiHemodi2: 'Normal',
  },
  {
    id: 2,
    id_ipress: 1,
    periodo: '2025-08-01',
    control: 'No',
    bacSaOsmosis: 20,
    bacAniCirculacion: 8,
    endoAguaTrata: 'Alto',
    rtnAnilloCir: 'Normal',
    bacMaquiHemodi: 5,
    bacMaquiHemodi2: 9,
    endMaquiHemodi: 'Alto',
    endMaquiHemodi2: 'Normal',
  },
]);

const registrosFiltrados = computed(() =>
  registros.value.filter((r) => !r.id_ipress || r.id_ipress === ipressSeleccionada.value),
);

const mostrarModal = ref(false);
const registroActual = ref({});

const mostrarModalNuevo = ref(false);

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

/** Requiere Sí o No antes de registrar */
const puedeEnviarRegistro = computed(() => control.value === '1' || control.value === '2');

function limpiarSoloMediciones() {
  bacSaOsmosis.value = '';
  bacAniCirculacion.value = '';
  endoAguaTrata.value = '';
  rtnAnilloCir.value = '';
  bacMaquiHemodi.value = '';
  bacMaquiHemodi2.value = '';
  endMaquiHemodi.value = '';
  endMaquiHemodi2.value = '';
}

watch(control, (val) => {
  if (val !== '1') limpiarSoloMediciones();
});

function textoEndotoxina(val) {
  if (val === 'Normal') return '≤ 0,25 (Normal)';
  if (val === 'Alto') return '> 0,25 (Alto)';
  return '—';
}

function formatoNumero(val) {
  if (val === null || val === undefined || val === '') return '—';
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function resumenEndoAgua(r) {
  const a = textoEndotoxina(r.endoAguaTrata);
  const b = textoEndotoxina(r.rtnAnilloCir);
  return `Osm.: ${a} · Circ.: ${b}`;
}

function resumenEndoLiquido(r) {
  const a = textoEndotoxina(r.endMaquiHemodi);
  const b = textoEndotoxina(r.endMaquiHemodi2);
  return `M1: ${a} · M2: ${b}`;
}

function abrirModal(registro) {
  registroActual.value = { ...registro };
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
}

function abrirModalNuevo() {
  mostrarModalNuevo.value = true;
}

function cerrarModalNuevo() {
  mostrarModalNuevo.value = false;
}

function limpiarFormulario() {
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

function construirRegistroDesdeFormulario() {
  const conMediciones = control.value === '1';
  return {
    id: Date.now(),
    id_ipress: ipressSeleccionada.value,
    periodo: new Date().toISOString().slice(0, 10),
    control: control.value === '1' ? 'Sí' : control.value === '2' ? 'No' : '',
    bacSaOsmosis: conMediciones && bacSaOsmosis.value !== '' ? Number(bacSaOsmosis.value) : null,
    bacAniCirculacion: conMediciones && bacAniCirculacion.value !== '' ? Number(bacAniCirculacion.value) : null,
    endoAguaTrata: conMediciones ? (endoAguaTrata.value || '') : '',
    rtnAnilloCir: conMediciones ? (rtnAnilloCir.value || '') : '',
    bacMaquiHemodi: conMediciones && bacMaquiHemodi.value !== '' ? Number(bacMaquiHemodi.value) : null,
    bacMaquiHemodi2: conMediciones && bacMaquiHemodi2.value !== '' ? Number(bacMaquiHemodi2.value) : null,
    endMaquiHemodi: conMediciones ? (endMaquiHemodi.value || '') : '',
    endMaquiHemodi2: conMediciones ? (endMaquiHemodi2.value || '') : '',
  };
}

function registrarNuevo() {
  if (!puedeEnviarRegistro.value) return;
  registros.value.unshift(construirRegistroDesdeFormulario());
  limpiarFormulario();
  cerrarModalNuevo();
}

function registrarYVolver() {
  if (!puedeEnviarRegistro.value) return;
  registros.value.unshift(construirRegistroDesdeFormulario());
  limpiarFormulario();
}
</script>
