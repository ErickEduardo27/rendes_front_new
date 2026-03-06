<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-slate-600 rounded-full"></span>
            Eventos Infecciosos
          </h1>
          <p class="text-slate-500 mt-1 text-sm">Registros de eventos infecciosos asociados al acceso por periodo, IPRESS y modalidad.</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            @click="abrirModalImportar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 transition-colors"
            @click="abrirModalNuevo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </button>
        </div>
      </div>

      <div class="flex gap-1 mb-4 border-b border-slate-200">
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'registros' ? 'bg-white text-slate-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'registros'"
        >
          Solo con registros
        </button>
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'todos' ? 'bg-white text-slate-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'todos'"
        >
          Todos los pacientes
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay registros de eventos infecciosos para el periodo, IPRESS y modalidad seleccionados.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha evento</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tipo infección</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Antimicrobial</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Vancomicina</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hemocultivo (+)</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Germen</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in registros" :key="r.id_evento_acceso_vascular" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.fecha_evento || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.tipo_infeccion || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.antmicrobial || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.vancomicina || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.hemocultivo_positivo || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.germen || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>
          <div v-if="todosPacientesLista.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay pacientes en el periodo, IPRESS y modalidad seleccionados.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha evento</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tipo infección</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Antimicrobial</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Vancomicina</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hemocultivo (+)</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Germen</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="fila in todosPacientesLista" :key="fila.id_paciente_atencion" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-amber-50/50': !fila.tieneRegistro }">
                  <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ fila.paciente || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.documento || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.fecha_evento || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.tipo_infeccion || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.antmicrobial || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.vancomicina || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.hemocultivo_positivo || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.germen || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>

    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-slate-700 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white flex items-center gap-2">Nuevo evento infeccioso</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalNuevo">✕</button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="!pacienteParaFormulario" class="space-y-4">
            <label class="block text-sm font-bold text-slate-700">Seleccione el paciente</label>
            <select
              v-model="idPacienteSeleccionado"
              class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">— Elija un paciente —</option>
              <option v-for="p in pacientesDisponibles" :key="p.id_paciente_atencion" :value="p.id_paciente_atencion">
                {{ p.datosPaciente?.paciente || 'Sin nombre' }} — {{ p.datosPaciente?.documento || '' }}
              </option>
            </select>
            <p class="text-xs text-slate-500">Pacientes con atención en el periodo, IPRESS y modalidad actuales.</p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalNuevo">Cancelar</button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-bold text-white bg-slate-600 hover:bg-slate-700 rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <Form3Hemodialisis
              :paciente="pacienteParaFormulario"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              @cancelar="cerrarModalNuevo"
              @guardado="onGuardado"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalImportar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-slate-600 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white">Importar Eventos Infecciosos</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <p class="text-sm text-slate-600">Descargue el formato en Excel, complételo y cárguelo aquí.</p>
          <button type="button" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50" @click="descargarFormatoExcel">
            Descargar formato Excel
          </button>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Cargar archivo Excel</label>
            <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="onDropArchivo" :class="arrastrando ? 'border-slate-400 bg-slate-50' : ''">
              <input ref="inputArchivoImportar" type="file" accept=".xlsx,.xls" class="hidden" @change="onSeleccionarArchivo" />
              <p class="text-slate-500 text-sm mb-2">Arrastre el archivo o</p>
              <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300" @click="inputArchivoImportar?.click()">Seleccionar archivo</button>
              <p v-if="archivoSeleccionado" class="mt-3 text-sm font-medium text-slate-600">{{ archivoSeleccionado.name }}</p>
            </div>
          </div>
          <div v-if="importando" class="text-center text-slate-500 text-sm">Importando...</div>
          <div v-if="resultadoImportacion" class="rounded-lg p-3 text-sm" :class="resultadoImportacion.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">{{ resultadoImportacion.mensaje }}</div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalImportar">Cerrar</button>
            <button type="button" class="px-4 py-2 text-sm font-bold text-white bg-slate-600 hover:bg-slate-700 rounded-lg disabled:opacity-50" :disabled="!archivoSeleccionado || importando" @click="ejecutarImportacion">Importar datos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import Form3Hemodialisis from '@/components/forms/typesForm3/Form3Hemodialisis.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const registros = ref([]);
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const vistaActiva = ref('registros');
const listadoAtenciones = ref([]);
const idPacienteSeleccionado = ref('');
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const mostrarModalImportar = ref(false);
const arrastrando = ref(false);
const archivoSeleccionado = ref(null);
const inputArchivoImportar = ref(null);
const importando = ref(false);
const resultadoImportacion = ref(null);

const COLUMNAS_FORMATO = ['id_paciente_atencion', 'tipo_infeccion', 'fecha_evento', 'antmicrobial', 'vancomicina', 'hemocultivo_positivo', 'germen'];

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}
function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

const pacientesDisponibles = computed(() => Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : []);

const todosPacientesLista = computed(() => {
  const atenciones = Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [];
  const regs = Array.isArray(registros.value) ? registros.value : [];
  const porAtencion = {};
  regs.forEach((r) => {
    const id = r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion;
    if (id != null && !porAtencion[String(id)]) porAtencion[String(id)] = r;
  });
  return atenciones.map((a) => {
    const id = a.id_paciente_atencion;
    const r = id != null ? porAtencion[String(id)] : null;
    const paciente = a.datosPaciente?.paciente ?? '—';
    const documento = a.datosPaciente?.documento ?? '—';
    if (r) {
      return {
        id_paciente_atencion: id,
        id_evento_acceso_vascular: r.id_evento_acceso_vascular,
        tieneRegistro: true,
        paciente: nombrePaciente(r),
        documento: documentoPaciente(r),
        fecha_evento: r.fecha_evento || '',
        tipo_infeccion: r.tipo_infeccion || '',
        antmicrobial: r.antmicrobial || '',
        vancomicina: r.vancomicina || '',
        hemocultivo_positivo: r.hemocultivo_positivo || '',
        germen: r.germen || '',
      };
    }
    return { id_paciente_atencion: id, tieneRegistro: false, paciente, documento, fecha_evento: '', tipo_infeccion: '', antmicrobial: '', vancomicina: '', hemocultivo_positivo: '', germen: '' };
  });
});

async function fetchRegistros() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();
  if (!qs) {
    registros.value = [];
    return;
  }
  cargando.value = true;
  try {
    const [resReg, resAten] = await Promise.all([
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
    ]);
    registros.value = Array.isArray(resReg) ? resReg : resReg?.results || [];
    listadoAtenciones.value = Array.isArray(resAten) ? resAten : resAten?.results || [];
  } catch (e) {
    console.error('Error al cargar eventos infecciosos:', e);
    registros.value = [];
    listadoAtenciones.value = [];
  } finally {
    cargando.value = false;
  }
}

async function fetchPacientesAtencion() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();
  if (!qs) {
    listadoAtenciones.value = [];
    return;
  }
  try {
    const res = await getAllIpress(`/pacienteAtencion/?${qs}`);
    listadoAtenciones.value = Array.isArray(res) ? res : res?.results || [];
  } catch (e) {
    console.error('Error al cargar atenciones:', e);
    listadoAtenciones.value = [];
  }
}

function abrirModalNuevo() {
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  fetchPacientesAtencion();
  mostrarModalNuevo.value = true;
}

function confirmarPacienteYMostrarFormulario() {
  const id = idPacienteSeleccionado.value;
  const atencion = listadoAtenciones.value.find((a) => a.id_paciente_atencion === id || String(a.id_paciente_atencion) === String(id));
  if (atencion?.datosPaciente) {
    pacienteParaFormulario.value = atencion.datosPaciente;
    idPacienteAtencionParaForm.value = atencion.id_paciente_atencion ?? id;
  }
}

function cerrarModalNuevo() {
  mostrarModalNuevo.value = false;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  fetchRegistros();
}

function onGuardado() {
  fetchRegistros();
}

function abrirModalImportar() {
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  mostrarModalImportar.value = true;
}
function cerrarModalImportar() {
  mostrarModalImportar.value = false;
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  arrastrando.value = false;
  fetchRegistros();
}
function descargarFormatoExcel() {
  const ws = XLSX.utils.aoa_to_sheet([COLUMNAS_FORMATO, ['', '', '', '', '', '', '']]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Eventos infecciosos');
  XLSX.writeFile(wb, 'formato_eventos_infecciosos.xlsx');
}
function onSeleccionarArchivo(ev) {
  const file = ev.target.files?.[0];
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    archivoSeleccionado.value = file;
    resultadoImportacion.value = null;
  }
  ev.target.value = '';
}
function onDropArchivo(ev) {
  arrastrando.value = false;
  const file = ev.dataTransfer?.files?.[0];
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    archivoSeleccionado.value = file;
    resultadoImportacion.value = null;
  }
}
function leerFilasExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
async function ejecutarImportacion() {
  const file = archivoSeleccionado.value;
  if (!file) return;
  importando.value = true;
  resultadoImportacion.value = null;
  try {
    const rows = await leerFilasExcel(file);
    if (rows.length < 2) {
      resultadoImportacion.value = { ok: false, mensaje: 'El archivo no tiene filas de datos.' };
      importando.value = false;
      return;
    }
    const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1).filter((r) => r.some((c) => c != null && String(c).trim() !== ''));
    let creados = 0,
      errores = 0;
    for (const row of dataRows) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] != null ? String(row[i]).trim() : ''));
      const idAtencion = obj.id_paciente_atencion ? Number(obj.id_paciente_atencion) : null;
      if (!idAtencion) {
        errores++;
        continue;
      }
      try {
        await postAllIpress('/eventosAccesosVasculares/', {
          id_paciente_atencion: idAtencion,
          tipo_infeccion: obj.tipo_infeccion || '',
          fecha_evento: obj.fecha_evento || '',
          antmicrobial: obj.antmicrobial || '',
          vancomicina: obj.vancomicina || '',
          hemocultivo_positivo: obj.hemocultivo_positivo || '',
          germen: obj.germen || '',
        });
        creados++;
      } catch (e) {
        errores++;
      }
    }
    resultadoImportacion.value = { ok: true, mensaje: `Importación completada: ${creados} registro(s) creado(s).` + (errores ? ` ${errores} fila(s) con error.` : '') };
    fetchRegistros();
  } catch (e) {
    console.error(e);
    resultadoImportacion.value = { ok: false, mensaje: 'Error al procesar el archivo.' };
  } finally {
    importando.value = false;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => fetchRegistros(), { deep: true });
onMounted(() => fetchRegistros());
</script>

<style scoped>
</style>
