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
            :disabled="!filtroListo || cargando"
            :title="!filtroListo
              ? 'Seleccione periodo y clínica'
              : (existeRegistroEnPeriodoActual ? 'Ya hay un registro: se abrirá para editarlo' : undefined)"
            @click="existeRegistroEnPeriodoActual ? abrirEditarRegistroActual() : abrirModalNuevo()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="header-accion-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ existeRegistroEnPeriodoActual ? 'Editar registro' : 'Nuevo' }}
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
              <tr v-if="cargando">
                <td colspan="7" class="tabla-cm-td text-center text-slate-500 py-8">
                  Cargando registros…
                </td>
              </tr>
              <tr v-else-if="!filtroListo">
                <td colspan="7" class="tabla-cm-td text-center text-slate-500 italic py-8">
                  Seleccione periodo y clínica en el encabezado.
                </td>
              </tr>
              <template v-else>
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
                    No hay registros para este periodo e IPRESS.
                  </td>
                </tr>
              </template>
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
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/auth';
import { getAllIpress, postAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service';
import { rangoFechasDesdePeriodoTexto } from '@/utils/accesoVascularValidacion';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const periodos = ref([]);
const registros = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const idUsuarioIpress = ref(null);

const periodoVisibleId = computed(() => periodoGlobal.value ?? null);
const ipressActiva = computed(() => clinicaGlobal.value ?? null);

const filtroListo = computed(() => (
  periodoVisibleId.value != null && periodoVisibleId.value !== ''
  && ipressActiva.value != null && ipressActiva.value !== ''
));

const registrosFiltrados = computed(() => registros.value);

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
  { value: 'Normal_03', label: 'Normal (≤ 0,03)' },
  { value: 'Anormal_03', label: 'Anormal (> 0,03)' },
];

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
  return rangoFechasDesdePeriodoTexto(p?.periodo);
});

const rangoFechasPeriodoTexto = computed(() => {
  const r = rangoFechasPeriodo.value;
  if (!r.min || !r.max) return { min: '', max: '' };
  return {
    min: formatoFechaTabla(r.min),
    max: formatoFechaTabla(r.max),
  };
});

const puedeGuardarFormulario = computed(() => (
  !errorFechaRegistro.value
  && !guardando.value
  && filtroListo.value
  && idUsuarioIpress.value != null
  && (control.value === '1' || control.value === '2')
));

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
  if (!existeRegistroEnPeriodoActual.value) return false;
  ElMessage.warning('Solo puede registrar un control por mes (periodo de reporte). Edite el registro existente.');
  return true;
}

function controlDesdeRegistro(val) {
  if (val === true || val === 'Sí' || val === 1 || val === '1') return '1';
  if (val === false || val === 'No' || val === 0 || val === '2') return '2';
  return '';
}

function normalizarEndotoxina(val) {
  if (val === 'Anormal') return 'Anormal_03';
  return val || '';
}

function textoEndotoxina(val) {
  const etiquetas = {
    Normal: '≤ 0,25',
    Alto: '> 0,25',
    Normal_03: '≤ 0,03',
    Anormal_03: '> 0,03',
    Anormal: '> 0,03',
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

function mapApiARegistro(row) {
  const conControl = Boolean(row.control);
  return {
    id: row.id_calidad_microbiologica,
    id_calidad_microbiologica: row.id_calidad_microbiologica,
    id_usuario_ipress: row.id_usuario_ipress,
    id_periodo: row.id_periodo,
    id_ipress: row.id_ipress,
    fechaRegistro: row.fecha_registro || '',
    control: conControl ? 'Sí' : 'No',
    bacSaOsmosis: conControl && row.salida_osmosis_ufc !== '' ? row.salida_osmosis_ufc : null,
    bacAniCirculacion: conControl && row.anillo_circulacion_ufc !== '' ? row.anillo_circulacion_ufc : null,
    endoAguaTrata: conControl ? (row.salida_osmosis_ue || '') : '',
    rtnAnilloCir: conControl ? (row.anillo_circulacion_ue || '') : '',
    bacMaquiHemodi: conControl && row.maquina_1_ufc !== '' ? row.maquina_1_ufc : null,
    bacMaquiHemodi2: conControl && row.maquina_2_ufc !== '' ? row.maquina_2_ufc : null,
    endMaquiHemodi: conControl ? (row.maquina_1_ue || '') : '',
    endMaquiHemodi2: conControl ? (row.maquina_2_ue || '') : '',
  };
}

function textoOVacio(val) {
  if (val == null || val === '') return '';
  return String(val);
}

function construirPayloadApi() {
  const conMediciones = control.value === '1';
  return {
    id_usuario_ipress: Number(idUsuarioIpress.value),
    id_periodo: Number(periodoVisibleId.value),
    id_ipress: Number(ipressActiva.value),
    fecha_registro: fechaRegistro.value || '',
    control: conMediciones,
    salida_osmosis_ufc: conMediciones ? textoOVacio(bacSaOsmosis.value) : '',
    anillo_circulacion_ufc: conMediciones ? textoOVacio(bacAniCirculacion.value) : '',
    salida_osmosis_ue: conMediciones ? textoOVacio(endoAguaTrata.value) : '',
    anillo_circulacion_ue: conMediciones ? textoOVacio(rtnAnilloCir.value) : '',
    maquina_1_ufc: conMediciones ? textoOVacio(bacMaquiHemodi.value) : '',
    maquina_2_ufc: conMediciones ? textoOVacio(bacMaquiHemodi2.value) : '',
    maquina_1_ue: conMediciones ? textoOVacio(endMaquiHemodi.value) : '',
    maquina_2_ue: conMediciones ? textoOVacio(endMaquiHemodi2.value) : '',
  };
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

async function resolverIdUsuarioIpress() {
  const idIpress = ipressActiva.value;
  if (idIpress == null || idIpress === '') {
    idUsuarioIpress.value = null;
    return null;
  }
  const idUsuario = user.value?.id_usuario ?? JSON.parse(localStorage.getItem('user') || 'null')?.id_usuario;
  if (idUsuario) {
    try {
      const asig = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
      const lista = Array.isArray(asig) ? asig : (asig?.results || []);
      const match = lista.find((a) => String(a.id_ipress) === String(idIpress));
      if (match?.id_usuario_ipress != null) {
        idUsuarioIpress.value = match.id_usuario_ipress;
        return match.id_usuario_ipress;
      }
    } catch (e) {
      console.error('Error al resolver usuario IPRESS:', e);
    }
  }
  try {
    const uiList = await getAllIpress(`/usuarioIpress/?id_ipress=${idIpress}`);
    const lista = Array.isArray(uiList) ? uiList : (uiList?.results || []);
    const id = lista[0]?.id_usuario_ipress ?? null;
    idUsuarioIpress.value = id;
    return id;
  } catch (e) {
    console.error('Error al obtener vínculo usuario–IPRESS:', e);
    idUsuarioIpress.value = null;
    return null;
  }
}

async function cargarRegistros() {
  if (!filtroListo.value) {
    registros.value = [];
    return;
  }
  cargando.value = true;
  try {
    await resolverIdUsuarioIpress();
    const params = new URLSearchParams({
      id_periodo: String(periodoVisibleId.value),
      id_ipress: String(ipressActiva.value),
    });
    const data = await getAllIpress(`/calidadMicrobiologicas/?${params.toString()}`);
    const lista = Array.isArray(data) ? data : (data?.results || []);
    registros.value = lista.map(mapApiARegistro);
  } catch (e) {
    console.error('Error al cargar calidad microbiológica:', e);
    registros.value = [];
    ElMessage.error('No se pudieron cargar los registros de calidad de agua.');
  } finally {
    cargando.value = false;
  }
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

function limpiarFormulario() {
  fechaRegistro.value = '';
  errorFechaRegistro.value = '';
  control.value = '';
  limpiarSoloMediciones();
}

function cargarRegistroEnFormulario(registro) {
  fechaRegistro.value = registro.fechaRegistro || '';
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

async function abrirModalNuevo() {
  if (!filtroListo.value) {
    ElMessage.warning('Seleccione periodo y clínica en el encabezado.');
    return;
  }
  if (bloquearRegistroDuplicadoEnPeriodo()) {
    abrirEditarRegistroActual();
    return;
  }
  await resolverIdUsuarioIpress();
  if (idUsuarioIpress.value == null) {
    ElMessage.error('No se encontró asignación usuario–IPRESS para guardar el registro.');
    return;
  }
  modoEdicion.value = false;
  registroEdicionId.value = null;
  limpiarFormulario();
  mostrarModalFormulario.value = true;
}

function abrirEditarRegistroActual() {
  const registro = registrosFiltrados.value[0];
  if (!registro) {
    ElMessage.warning('No hay un registro visible para editar en este periodo e IPRESS.');
    return;
  }
  abrirModalEditar(registro);
}

function abrirModalEditar(registro) {
  modoEdicion.value = true;
  registroEdicionId.value = registro.id;
  limpiarFormulario();
  cargarRegistroEnFormulario(registro);
  mostrarModalFormulario.value = true;
}

function cerrarModalFormulario({ forzar = false } = {}) {
  if (guardando.value && !forzar) return;
  mostrarModalFormulario.value = false;
  modoEdicion.value = false;
  registroEdicionId.value = null;
  limpiarFormulario();
}

async function persistirRegistro({ cerrarModal = true, limpiarTrasGuardar = false } = {}) {
  if (!validarFechaRegistro()) {
    ElMessage.warning(errorFechaRegistro.value || 'Revise la fecha de registro.');
    return false;
  }
  if (!puedeGuardarFormulario.value) {
    if (!control.value) ElMessage.warning('Seleccione si se realizaron controles.');
    return false;
  }
  if (bloquearRegistroDuplicadoEnPeriodo()) return false;

  await resolverIdUsuarioIpress();
  if (idUsuarioIpress.value == null) {
    ElMessage.error('No se encontró asignación usuario–IPRESS para guardar el registro.');
    return false;
  }

  guardando.value = true;
  let ok = false;
  try {
    const payload = construirPayloadApi();
    if (modoEdicion.value && registroEdicionId.value != null) {
      await patchAllIpress(`/calidadMicrobiologicas/${registroEdicionId.value}/`, payload);
      ElMessage.success('Registro actualizado correctamente.');
    } else {
      await postAllIpress('/calidadMicrobiologicas/', payload);
      ElMessage.success('Registro guardado correctamente.');
    }
    window.dispatchEvent(new CustomEvent('calidad-agua:actualizar'));
    await cargarRegistros();
    ok = true;
    return true;
  } catch (e) {
    console.error(e);
    const dataErr = e?.data || e?.response?.data || {};
    const detalle = e?.error
      || dataErr?.detail
      || dataErr?.non_field_errors?.[0]
      || e?.detail
      || e?.message;
    const msg = typeof detalle === 'string' ? detalle : 'No se pudo guardar el registro.';
    const code = dataErr?.code || '';
    const lower = String(msg).toLowerCase();
    const esDuplicado = code === 'duplicado_periodo_ipress'
      || lower.includes('unique')
      || lower.includes('único')
      || lower.includes('ya existe');

    if (esDuplicado) {
      const registroApi = dataErr?.registro;
      await cargarRegistros();
      if (registroApi?.id_calidad_microbiologica) {
        const mapped = mapApiARegistro(registroApi);
        abrirModalEditar(mapped);
        ElMessage.warning('Ya existía un registro para este periodo e IPRESS. Se abrió para editarlo.');
      } else if (registrosFiltrados.value[0]) {
        abrirEditarRegistroActual();
        ElMessage.warning('Ya existía un registro para este periodo e IPRESS. Se abrió para editarlo.');
      } else {
        ElMessage.error('Ya existe un registro para este periodo e IPRESS, pero no se pudo cargar para editar. Recargue la página.');
      }
    } else {
      ElMessage.error(msg);
    }
    return false;
  } finally {
    guardando.value = false;
    if (ok) {
      if (limpiarTrasGuardar) limpiarFormulario();
      if (cerrarModal) cerrarModalFormulario({ forzar: true });
    }
  }
}

async function guardarRegistro() {
  await persistirRegistro({ cerrarModal: true });
}

async function guardarYVolver() {
  await persistirRegistro({ cerrarModal: true, limpiarTrasGuardar: true });
}

watch([periodoGlobal, clinicaGlobal], () => {
  if (fechaRegistro.value) validarFechaRegistro();
  cargarRegistros();
});

onMounted(async () => {
  await fetchPeriodos();
  await cargarRegistros();
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
