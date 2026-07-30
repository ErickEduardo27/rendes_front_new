<template>
  <div class="min-h-screen bg-slate-50/80 p-4 sm:p-6">
    <div class="max-w-[100rem] mx-auto space-y-4">
      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-7 bg-cyan-500 rounded-full shrink-0" aria-hidden="true"></span>
            Calidad de agua y LD
          </h1>


          <p class="text-slate-500 text-xs mt-1 max-w-2xl">
            Registros de recuento bacteriano y endotoxinas en agua tratada y líquido de diálisis.
          </p>
        </div>


        
        <div class="flex flex-wrap items-end gap-2">
          <button
            type="button"
            class="header-accion-btn header-accion-btn-primario"
            :disabled="existeRegistroEnPeriodoActual"
            :title="existeRegistroEnPeriodoActual ? 'Ya hay un registro para este periodo. Edítelo desde la tabla.' : undefined"
            @click="abrirModalNuevo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="header-accion-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </button>
        </div>
      </header>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="tabla-cm divide-y divide-slate-200">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="tabla-cm-th">F. registro</th>
                <th class="tabla-cm-th">Control</th>
                <th class="tabla-cm-th">Bac. agua (Osm. / Circ.)</th>
                <th class="tabla-cm-th">Endo. agua</th>
                <th class="tabla-cm-th">Bac. líquido (M1 / M2)</th>
                <th class="tabla-cm-th">Endo. líquido</th>
                <th class="tabla-cm-th tabla-cm-th-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="registro in registrosFiltrados" :key="registro.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="tabla-cm-td font-medium text-slate-800">{{ formatoFechaTabla(registro.fechaRegistro || registro.periodo) }}</td>
                <td class="tabla-cm-td text-slate-600">{{ registro.control }}</td>
                <td class="tabla-cm-td text-slate-600 tabular-nums">
                  {{ formatoNumero(registro.bacSaOsmosis) }} / {{ formatoNumero(registro.bacAniCirculacion) }}
                </td>
                <td class="tabla-cm-td text-slate-600">{{ resumenEndoAgua(registro) }}</td>
                <td class="tabla-cm-td text-slate-600 tabular-nums">
                  {{ formatoNumero(registro.bacMaquiHemodi) }} / {{ formatoNumero(registro.bacMaquiHemodi2) }}
                </td>
                <td class="tabla-cm-td text-slate-600">{{ resumenEndoLiquido(registro) }}</td>
                <td class="tabla-cm-td tabla-cm-td-acciones">
                  <button
                    type="button"
                    class="tabla-cm-btn tabla-cm-btn-editar"
                    title="Editar registro"
                    @click="abrirModalEditar(registro)"
                  >
                    Editar
                  </button>
                </td>
              </tr>
              <tr v-if="registrosFiltrados.length === 0">
                <td colspan="7" class="tabla-cm-td text-center text-slate-500 italic py-8">
                  No hay registros para esta IPRESS.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal nuevo / editar -->
    <div
      v-if="mostrarModalFormulario"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      @click.self="cerrarModalFormulario"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto relative border border-slate-200">
        <div class="sticky top-0 z-10 bg-gradient-to-r from-cyan-600 to-cyan-700 px-4 py-3 flex justify-between items-center rounded-t-xl">
          <h2 class="text-sm font-bold text-white">
            {{ modoEdicion ? 'Editar calidad microbiológica' : 'Registrar calidad microbiológica' }}
          </h2>
          <button type="button" class="text-white/90 hover:text-white text-lg leading-none p-1" aria-label="Cerrar" @click="cerrarModalFormulario">✕</button>
        </div>

        <form class="p-4 space-y-3" @submit.prevent="guardarRegistro">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div>
              <label class="cm-label">Periodo de reporte</label>
              <div class="cm-info-box">{{ periodoDisplay }}</div>
            </div>
            <div class="cm-campo">
              <label class="cm-label">Fecha de registro</label>
              <FechaInput
                v-model="fechaRegistro"
                input-class="cm-control"
                :min="rangoFechasPeriodo.min || undefined"
                :max="rangoFechasPeriodo.max || undefined"
                :has-error="!!errorFechaRegistro"
                @change="validarFechaRegistro"
                @blur="validarFechaRegistro"
              />
              <p v-if="rangoFechasPeriodo.min" class="cm-hint">
                Si la indica, debe estar entre {{ rangoFechasPeriodoTexto.min }} y {{ rangoFechasPeriodoTexto.max }}
              </p>
              <p v-else-if="periodoVisibleId" class="cm-hint text-amber-700">No se pudo determinar el rango del periodo.</p>
              <p v-if="errorFechaRegistro" class="cm-error">{{ errorFechaRegistro }}</p>
            </div>
          </div>

          <div class="cm-campo">
            <label class="cm-label">Se realizó controles</label>
            <select v-model="control" class="cm-control">
              <option value="">Seleccione</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>

          <template v-if="control === '1'">
            <section class="cm-seccion">
              <h3 class="cm-seccion-titulo">Recuento bacteriano en agua tratada (UFC/mL)</h3>
              <div class="cm-grid">
                <div class="cm-campo">
                  <label class="cm-label">Salida de la ósmosis</label>
                  <input v-model="bacSaOsmosis" type="number" step="0.01" min="0" placeholder="10,00" class="cm-control tabular-nums" />
                </div>
                <div class="cm-campo">
                  <label class="cm-label">Retorno anillo circulación</label>
                  <input v-model="bacAniCirculacion" type="number" step="0.01" min="0" placeholder="10,00" class="cm-control tabular-nums" />
                </div>
              </div>
            </section>

            <section class="cm-seccion">
              <h3 class="cm-seccion-titulo">Endotoxinas en agua tratada (UE/mL)</h3>
              <div class="cm-grid">
                <div class="cm-campo">
                  <label class="cm-label">Salida de la ósmosis</label>
                  <select v-model="endoAguaTrata" class="cm-control">
                    <option value="">Seleccione</option>
                    <option v-for="op in opcionesEndotoxina" :key="op.value" :value="op.value">{{ op.label }}</option>
                  </select>
                </div>
                <div class="cm-campo">
                  <label class="cm-label">Retorno anillo circulación</label>
                  <select v-model="rtnAnilloCir" class="cm-control">
                    <option value="">Seleccione</option>
                    <option v-for="op in opcionesEndotoxina" :key="op.value" :value="op.value">{{ op.label }}</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="cm-seccion">
              <h3 class="cm-seccion-titulo">Recuento bacteriano en líquido de diálisis (UFC/mL)</h3>
              <div class="cm-grid">
                <div class="cm-campo">
                  <label class="cm-label">Máquina hemodiálisis 1</label>
                  <input v-model="bacMaquiHemodi" type="number" step="0.01" min="0" placeholder="7,00" class="cm-control tabular-nums" />
                </div>
                <div class="cm-campo">
                  <label class="cm-label">Máquina hemodiálisis 2</label>
                  <input v-model="bacMaquiHemodi2" type="number" step="0.01" min="0" placeholder="11,00" class="cm-control tabular-nums" />
                </div>
              </div>
            </section>

            <section class="cm-seccion">
              <h3 class="cm-seccion-titulo">Endotoxinas en líquido de diálisis (UE/mL)</h3>
              <div class="cm-grid">
                <div class="cm-campo">
                  <label class="cm-label">Máquina hemodiálisis 1</label>
                  <select v-model="endMaquiHemodi" class="cm-control">
                    <option value="">Seleccione</option>
                    <option v-for="op in opcionesEndotoxina" :key="op.value" :value="op.value">{{ op.label }}</option>
                  </select>
                </div>
                <div class="cm-campo">
                  <label class="cm-label">Máquina hemodiálisis 2</label>
                  <select v-model="endMaquiHemodi2" class="cm-control">
                    <option value="">Seleccione</option>
                    <option v-for="op in opcionesEndotoxina" :key="op.value" :value="op.value">{{ op.label }}</option>
                  </select>
                </div>
              </div>
            </section>
          </template>

          <div
            v-else-if="control === '2'"
            class="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900"
          >
            No se realizaron controles: puede guardar sin completar mediciones.
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              class="cm-btn cm-btn-secundario"
              @click="cerrarModalFormulario"
            >
              Cancelar
            </button>
            <div class="flex flex-col sm:flex-row gap-2">
              <button
                v-if="!modoEdicion"
                type="button"
                class="cm-btn cm-btn-outline"
                :disabled="!puedeGuardarFormulario"
                @click="guardarYVolver"
              >
                Registrar y volver
              </button>
              <button
                type="submit"
                class="cm-btn cm-btn-primario"
                :disabled="!puedeGuardarFormulario"
              >
                {{ modoEdicion ? 'Guardar cambios' : 'Registrar' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllIpress } from '@/services/ipress/Ipress.service';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const periodos = ref([]);

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
    fechaRegistro: '2025-09-15',
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
    fechaRegistro: '2025-08-10',
    control: 'No',
    bacSaOsmosis: null,
    bacAniCirculacion: null,
    endoAguaTrata: '',
    rtnAnilloCir: '',
    bacMaquiHemodi: null,
    bacMaquiHemodi2: null,
    endMaquiHemodi: '',
    endMaquiHemodi2: '',
  },
]);

const ipressActiva = computed(() => clinicaGlobal.value ?? ipressSeleccionada.value);

function rangoDesdeTextoPeriodo(textoPeriodo) {
  if (!textoPeriodo) return { min: null, max: null };
  const parts = String(textoPeriodo).trim().split('-');
  if (parts.length < 2) return { min: null, max: null };
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (Number.isNaN(year) || Number.isNaN(month)) return { min: null, max: null };
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0],
  };
}

function registroPerteneceAlPeriodo(registro, idPeriodo) {
  if (idPeriodo == null || idPeriodo === '') return false;
  if (registro.id_periodo != null && registro.id_periodo !== '') {
    return String(registro.id_periodo) === String(idPeriodo);
  }
  const fecha = registro.fechaRegistro || registro.periodo;
  if (!fecha) return false;
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const p = lista.find((per) => String(per.id_periodo) === String(idPeriodo));
  const rango = rangoDesdeTextoPeriodo(p?.periodo);
  if (!rango.min || !rango.max) return false;
  return fecha >= rango.min && fecha <= rango.max;
}

const registrosFiltrados = computed(() => {
  const idIpress = ipressActiva.value;
  const idPeriodo = periodoVisibleId.value;
  return registros.value.filter((r) => {
    const matchIpress = idIpress == null || !r.id_ipress || String(r.id_ipress) === String(idIpress);
    if (idPeriodo == null || idPeriodo === '') return matchIpress;
    return matchIpress && registroPerteneceAlPeriodo(r, idPeriodo);
  });
});

const existeRegistroEnPeriodoActual = computed(() => registrosFiltrados.value.length > 0);

const mostrarModalFormulario = ref(false);
const modoEdicion = ref(false);
const registroEdicionId = ref(null);

const fechaRegistro = ref('');
const errorFechaRegistro = ref('');

const control = ref('');
const bacSaOsmosis = ref('');
const bacAniCirculacion = ref('');
const endoAguaTrata = ref('');
const rtnAnilloCir = ref('');
const bacMaquiHemodi = ref('');
const bacMaquiHemodi2 = ref('');
const endMaquiHemodi = ref('');
const endMaquiHemodi2 = ref('');

const opcionesEndotoxina = [
  { value: 'Normal', label: 'Normal (≤ 0,25)' },
  { value: 'Alto', label: 'Alto (> 0,25)' },
  { value: 'Normal_03', label: 'Normal (≤ 0,3)' },
  { value: 'Anormal_03', label: 'Anormal (> 0,3)' },
];

const periodoVisibleId = computed(() => periodoGlobal.value ?? null);

const periodoTexto = computed(() => {
  const idPeriodo = periodoVisibleId.value;
  if (idPeriodo == null) return '';
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const item = lista.find((per) => String(per.id_periodo) === String(idPeriodo));
  return item?.periodo || '';
});

const periodoDisplay = computed(() => periodoTexto.value || '—');

const rangoFechasPeriodo = computed(() => {
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const idPeriodo = periodoVisibleId.value;
  if (idPeriodo == null || idPeriodo === '') return { min: null, max: null };
  const p = lista.find((per) => String(per.id_periodo) === String(idPeriodo));
  return rangoDesdeTextoPeriodo(p?.periodo);
});

const rangoFechasPeriodoTexto = computed(() => {
  const r = rangoFechasPeriodo.value;
  if (!r.min || !r.max) return { min: '', max: '' };
  return {
    min: formatoFechaTabla(r.min),
    max: formatoFechaTabla(r.max),
  };
});

/** Solo bloquea guardar si la fecha ingresada (opcional) está fuera del periodo. */
const puedeGuardarFormulario = computed(() => !errorFechaRegistro.value);

function formatoFechaTabla(iso) {
  if (!iso) return '—';
  const s = String(iso).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-');
    return `${d}-${m}-${y}`;
  }
  return s;
}

function validarFechaRegistro() {
  const fecha = fechaRegistro.value?.trim();
  const rango = rangoFechasPeriodo.value;
  const rangoTxt = rangoFechasPeriodoTexto.value;
  if (!fecha) {
    errorFechaRegistro.value = '';
    return true;
  }
  if (!rango.min || !rango.max) {
    errorFechaRegistro.value = '';
    return true;
  }
  if (fecha < rango.min || fecha > rango.max) {
    errorFechaRegistro.value = `La fecha debe estar entre ${rangoTxt.min} y ${rangoTxt.max}.`;
    return false;
  }
  errorFechaRegistro.value = '';
  return true;
}

function bloquearRegistroDuplicadoEnPeriodo() {
  if (modoEdicion.value) return false;
  if (periodoVisibleId.value == null || periodoVisibleId.value === '') return false;
  if (!existeRegistroEnPeriodoActual.value) return false;
  ElMessage.warning('Solo puede registrar un control por mes (periodo de reporte). Edite el registro existente.');
  return true;
}

async function fetchPeriodos() {
  try {
    const res = await getAllIpress('/periodos/');
    periodos.value = Array.isArray(res) ? res : (res?.results || []);
  } catch (e) {
    console.error('Error al cargar periodos:', e);
    periodos.value = [];
  }
}

function controlDesdeRegistro(val) {
  if (val === 'Sí') return '1';
  if (val === 'No') return '2';
  return '';
}

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

function normalizarEndotoxina(val) {
  if (val === 'Anormal') return 'Anormal_03';
  return val || '';
}

function textoEndotoxina(val) {
  const etiquetas = {
    Normal: '≤ 0,25',
    Alto: '> 0,25',
    Normal_03: '≤ 0,3',
    Anormal_03: '> 0,3',
    Anormal: '> 0,3',
  };
  return etiquetas[val] || '—';
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

function limpiarFormulario() {
  fechaRegistro.value = '';
  errorFechaRegistro.value = '';
  control.value = '';
  bacSaOsmosis.value = '';
  bacAniCirculacion.value = '';
  endoAguaTrata.value = '';
  rtnAnilloCir.value = '';
  bacMaquiHemodi.value = '';
  bacMaquiHemodi2.value = '';
  endMaquiHemodi.value = '';
  endMaquiHemodi2.value = '';
}

function cargarRegistroEnFormulario(registro) {
  fechaRegistro.value = registro.fechaRegistro || registro.periodo || '';
  validarFechaRegistro();
  control.value = controlDesdeRegistro(registro.control);
  if (control.value === '1') {
    bacSaOsmosis.value = registro.bacSaOsmosis ?? '';
    bacAniCirculacion.value = registro.bacAniCirculacion ?? '';
    endoAguaTrata.value = normalizarEndotoxina(registro.endoAguaTrata);
    rtnAnilloCir.value = normalizarEndotoxina(registro.rtnAnilloCir);
    bacMaquiHemodi.value = registro.bacMaquiHemodi ?? '';
    bacMaquiHemodi2.value = registro.bacMaquiHemodi2 ?? '';
    endMaquiHemodi.value = normalizarEndotoxina(registro.endMaquiHemodi);
    endMaquiHemodi2.value = normalizarEndotoxina(registro.endMaquiHemodi2);
  }
}

function abrirModalNuevo() {
  if (bloquearRegistroDuplicadoEnPeriodo()) return;
  modoEdicion.value = false;
  registroEdicionId.value = null;
  limpiarFormulario();
  mostrarModalFormulario.value = true;
}

function abrirModalEditar(registro) {
  modoEdicion.value = true;
  registroEdicionId.value = registro.id;
  limpiarFormulario();
  cargarRegistroEnFormulario(registro);
  mostrarModalFormulario.value = true;
}

function cerrarModalFormulario() {
  mostrarModalFormulario.value = false;
  modoEdicion.value = false;
  registroEdicionId.value = null;
  limpiarFormulario();
}

function construirRegistroDesdeFormulario() {
  const conMediciones = control.value === '1';
  return {
    id_periodo: periodoVisibleId.value ?? null,
    fechaRegistro: fechaRegistro.value || '',
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

function guardarRegistro() {
  if (!validarFechaRegistro()) {
    ElMessage.warning(errorFechaRegistro.value || 'Revise la fecha de registro.');
    return;
  }
  if (!puedeGuardarFormulario.value) return;
  if (bloquearRegistroDuplicadoEnPeriodo()) return;
  const datos = construirRegistroDesdeFormulario();

  if (modoEdicion.value && registroEdicionId.value != null) {
    const idx = registros.value.findIndex((r) => r.id === registroEdicionId.value);
    if (idx >= 0) {
      registros.value[idx] = {
        ...registros.value[idx],
        ...datos,
      };
    }
  } else {
    registros.value.unshift({
      id: Date.now(),
      id_ipress: ipressActiva.value,
      ...datos,
    });
  }

  cerrarModalFormulario();
}

function guardarYVolver() {
  if (!validarFechaRegistro()) {
    ElMessage.warning(errorFechaRegistro.value || 'Revise la fecha de registro.');
    return;
  }
  if (!puedeGuardarFormulario.value) return;
  if (bloquearRegistroDuplicadoEnPeriodo()) return;
  const datos = construirRegistroDesdeFormulario();
  registros.value.unshift({
    id: Date.now(),
    id_ipress: ipressActiva.value,
    ...datos,
  });
  limpiarFormulario();
}

watch(periodoGlobal, () => {
  if (fechaRegistro.value) validarFechaRegistro();
});

onMounted(() => {
  fetchPeriodos();
});
</script>

<style scoped>
.tabla-cm {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.tabla-cm-th,
.tabla-cm-td {
  white-space: nowrap;
  padding: 0.375rem 0.75rem;
  font-size: 0.6875rem;
  line-height: 1.25;
}

.tabla-cm-th {
  text-align: left;
  font-size: 0.625rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tabla-cm-th-acciones,
.tabla-cm-td-acciones {
  text-align: right;
}

.tabla-cm-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tabla-cm-btn-editar {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: transparent;
}

.tabla-cm-btn-editar:hover {
  background: #ecfeff;
}

.header-accion-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.header-accion-btn-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.header-accion-btn-primario {
  border: 1px solid #0891b2;
  color: #fff;
  background: #0891b2;
}

.header-accion-btn-primario:hover:not(:disabled) {
  background: #0e7490;
}

.header-accion-btn-primario:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.cm-seccion {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
  padding: 0.5rem 0.625rem;
}

.cm-seccion-titulo {
  font-size: 0.625rem;
  font-weight: 700;
  color: #155e75;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.375rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.cm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .cm-grid {
    grid-template-columns: 1fr;
  }
}

.cm-campo {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cm-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #475569;
}

.cm-info-box {
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.cm-hint {
  font-size: 0.625rem;
  color: #94a3b8;
  margin-top: 0.15rem;
}

.cm-error {
  font-size: 0.625rem;
  color: #dc2626;
  margin-top: 0.15rem;
}

.cm-control {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.25;
  color: #1e293b;
  background: #fff;
}

.cm-control:focus {
  outline: none;
  border-color: #0891b2;
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.2);
}

.cm-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.cm-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.cm-btn-secundario {
  border: 1px solid #cbd5e1;
  color: #334155;
  background: #fff;
}

.cm-btn-secundario:hover:not(:disabled) {
  background: #f8fafc;
}

.cm-btn-outline {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: #fff;
}

.cm-btn-outline:hover:not(:disabled) {
  background: #ecfeff;
}

.cm-btn-primario {
  border: 1px solid #0891b2;
  color: #fff;
  background: #0891b2;
}

.cm-btn-primario:hover:not(:disabled) {
  background: #0e7490;
}
</style>
