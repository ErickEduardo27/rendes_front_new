<template>
  <div class="form7-shell p-4 space-y-4 max-w-5xl">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-gray-200">
      <div>
        <label class="form7-meta-label">Periodo de reporte</label>
        <div class="form7-info-box">{{ periodoDisplay }}</div>
      </div>
      <div>
        <label class="form7-meta-label">Clínica</label>
        <div class="form7-info-box">{{ clinicaDisplay }}</div>
      </div>
      <div>
        <label class="form7-meta-label">Modalidad de diálisis</label>
        <div class="form7-info-box">{{ modalidadDisplay }}</div>
      </div>
    </div>

    <p v-if="rangoFechasPeriodo.min" class="text-[11px] text-gray-500">
      Fechas dentro del periodo ({{ rangoFechasPeriodoTexto.min }} a {{ rangoFechasPeriodoTexto.max }}). Formato: dd-mm-aaaa. También puede usar el calendario.
    </p>

    <div class="space-y-4">
      <div class="border-l-4 border-[#008f9c] pl-3">
        <h2 class="text-base font-bold text-gray-800">Serología y vacunación</h2>
        <p class="text-xs text-gray-500">Todos los campos son opcionales. Si ingresa fechas, deben estar en el periodo y con formato dd-mm-aaaa.</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 class="form7-section-title">Condición serológica actual</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form7-field">
            <label class="form7-label">VHB</label>
            <select class="form7-control" v-model="form.vhbEstado" @change="onCambioEstadoSerologico('vhbEstado', 'vhbFecha')">
              <option :value="null">Seleccione</option>
              <option>Positivo</option>
              <option>Negativo</option>
              <option>Desconocido</option>
            </select>
            <template v-if="!esEstadoDesconocido(form.vhbEstado)">
            <label class="form7-label-sub">Fecha examen</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.vhbFecha" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.vhbFecha }" @input="onInputFechaTexto('vhbFecha', $event)" @blur="validarCampoFechaEnBlur('vhbFecha')" />
              <input :ref="(el) => setDatePickerRef('vhbFecha', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('vhbFecha')" :min="rangoFechasPeriodo.min || undefined" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('vhbFecha', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('vhbFecha')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="erroresFecha.vhbFecha" class="form7-date-error">{{ erroresFecha.vhbFecha }}</p>
            </template>
          </div>
          <div class="form7-field">
            <label class="form7-label">Anti-HBc total</label>
            <select class="form7-control" v-model="form.antiHbcEstado" @change="onCambioEstadoSerologico('antiHbcEstado', 'antiHbcFecha')">
              <option :value="null">Seleccione</option>
              <option>Positivo</option>
              <option>Negativo</option>
              <option>Desconocido</option>
            </select>
            <template v-if="!esEstadoDesconocido(form.antiHbcEstado)">
            <label class="form7-label-sub">Fecha examen</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.antiHbcFecha" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.antiHbcFecha }" @input="onInputFechaTexto('antiHbcFecha', $event)" @blur="validarCampoFechaEnBlur('antiHbcFecha')" />
              <input :ref="(el) => setDatePickerRef('antiHbcFecha', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('antiHbcFecha')" :min="rangoFechasPeriodo.min || undefined" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('antiHbcFecha', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('antiHbcFecha')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="erroresFecha.antiHbcFecha" class="form7-date-error">{{ erroresFecha.antiHbcFecha }}</p>
            </template>
          </div>
          <div class="form7-field">
            <label class="form7-label">VHC</label>
            <select class="form7-control" v-model="form.vhcEstado" @change="onCambioEstadoSerologico('vhcEstado', 'vhcFecha')">
              <option :value="null">Seleccione</option>
              <option>Positivo</option>
              <option>Negativo</option>
              <option>Desconocido</option>
            </select>
            <template v-if="!esEstadoDesconocido(form.vhcEstado)">
            <label class="form7-label-sub">Fecha examen</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.vhcFecha" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.vhcFecha }" @input="onInputFechaTexto('vhcFecha', $event)" @blur="validarCampoFechaEnBlur('vhcFecha')" />
              <input :ref="(el) => setDatePickerRef('vhcFecha', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('vhcFecha')" :min="rangoFechasPeriodo.min || undefined" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('vhcFecha', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('vhcFecha')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="erroresFecha.vhcFecha" class="form7-date-error">{{ erroresFecha.vhcFecha }}</p>
            </template>
          </div>
          <div class="form7-field">
            <label class="form7-label">VIH</label>
            <select class="form7-control" v-model="form.vihEstado" @change="onCambioEstadoSerologico('vihEstado', 'vihFecha')">
              <option :value="null">Seleccione</option>
              <option>Positivo</option>
              <option>Negativo</option>
              <option>Desconocido</option>
            </select>
            <template v-if="!esEstadoDesconocido(form.vihEstado)">
            <label class="form7-label-sub">Fecha examen</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.vihFecha" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.vihFecha }" @input="onInputFechaTexto('vihFecha', $event)" @blur="validarCampoFechaEnBlur('vihFecha')" />
              <input :ref="(el) => setDatePickerRef('vihFecha', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('vihFecha')" :min="rangoFechasPeriodo.min || undefined" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('vihFecha', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('vihFecha')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="erroresFecha.vihFecha" class="form7-date-error">{{ erroresFecha.vihFecha }}</p>
            </template>
          </div>
        </div>

        <hr class="border-gray-100" />

        <h3 class="form7-section-title">Título AcHBs</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form7-field">
            <label class="form7-label">Título (mUI/mL)</label>
            <input
              type="number"
              class="form7-control"
              v-model.number="form.vacunaHepatitis"
              placeholder="0 – 2000"
              :min="0"
              :max="2000"
              :step="0.01"
              :disabled="esEstadoDesconocido(form.estadoAcHBs)"
            />
          </div>
          <div class="form7-field">
            <label class="form7-label">Estado según AcHBs</label>
            <select class="form7-control" v-model="form.estadoAcHBs" @change="onCambioEstadoAcHBs">
              <option :value="null">Seleccione</option>
              <option>Desconocido</option>
              <option>No Responde</option>
              <option>Respuesta pobre</option>
              <option>Óptimo</option>
              <option>Excelente</option>
            </select>
          </div>
          <div v-if="!esEstadoDesconocido(form.estadoAcHBs)" class="form7-field">
            <label class="form7-label">Fecha de prueba</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.fechaVacHepatitis" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.fechaVacHepatitis }" @input="onInputFechaTexto('fechaVacHepatitis', $event)" @blur="validarCampoFechaEnBlur('fechaVacHepatitis')" />
              <input :ref="(el) => setDatePickerRef('fechaVacHepatitis', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('fechaVacHepatitis')" :min="rangoFechasPeriodo.min || undefined" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('fechaVacHepatitis', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('fechaVacHepatitis')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="erroresFecha.fechaVacHepatitis" class="form7-date-error">{{ erroresFecha.fechaVacHepatitis }}</p>
          </div>
        </div>

        <hr class="border-gray-100" />

        <h3 class="form7-section-title">Vacunación</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form7-field">
            <label class="form7-label">Hepatitis B — dosis</label>
            <select class="form7-control" v-model="form.dosisHepatitisB" @change="onCambioDosisVacuna('fechaHepatitisB')">
              <option :value="null">Seleccione</option>
              <option
                v-for="op in opcionesDosisHepatitis"
                :key="`hb-${op}`"
                :value="op"
                :disabled="dosisHepatitisBloqueada(op)"
              >
                {{ op }}{{ dosisHepatitisBloqueada(op) ? ' (ya registrada)' : '' }}
              </option>
            </select>
            <p v-if="resumenDosisHepatitis" class="text-[10px] text-slate-500 mt-1">{{ resumenDosisHepatitis }}</p>
          </div>
          <div class="form7-field">
            <label class="form7-label">Hepatitis B — fecha</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.fechaHepatitisB" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.fechaHepatitisB }" @input="onInputFechaTexto('fechaHepatitisB', $event)" @blur="validarCampoFechaEnBlur('fechaHepatitisB')" />
              <input :ref="(el) => setDatePickerRef('fechaHepatitisB', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('fechaHepatitisB')" :min="minPickerVacuna('fechaHepatitisB')" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('fechaHepatitisB', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('fechaHepatitisB')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="hintFechaMinDosis('fechaHepatitisB')" class="text-[10px] text-slate-500 mt-1">{{ hintFechaMinDosis('fechaHepatitisB') }}</p>
            <p v-if="erroresFecha.fechaHepatitisB" class="form7-date-error">{{ erroresFecha.fechaHepatitisB }}</p>
          </div>
          <div class="form7-field">
            <label class="form7-label">Covid-19 — dosis</label>
            <select class="form7-control" v-model="form.dosisCovid" @change="onCambioDosisVacuna('fechaCovid')">
              <option :value="null">Seleccione</option>
              <option
                v-for="op in opcionesDosisCovid"
                :key="`cv-${op}`"
                :value="op"
                :disabled="dosisCovidBloqueada(op)"
              >
                {{ op }}{{ dosisCovidBloqueada(op) ? ' (ya registrada)' : '' }}
              </option>
            </select>
            <p v-if="resumenDosisCovid" class="text-[10px] text-slate-500 mt-1">{{ resumenDosisCovid }}</p>
          </div>
          <div class="form7-field">
            <label class="form7-label">Covid-19 — fecha</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.fechaCovid" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.fechaCovid }" @input="onInputFechaTexto('fechaCovid', $event)" @blur="validarCampoFechaEnBlur('fechaCovid')" />
              <input :ref="(el) => setDatePickerRef('fechaCovid', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('fechaCovid')" :min="minPickerVacuna('fechaCovid')" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('fechaCovid', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('fechaCovid')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="hintFechaMinDosis('fechaCovid')" class="text-[10px] text-slate-500 mt-1">{{ hintFechaMinDosis('fechaCovid') }}</p>
            <p v-if="erroresFecha.fechaCovid" class="form7-date-error">{{ erroresFecha.fechaCovid }}</p>
          </div>
          <div class="form7-field">
            <label class="form7-label">Influenza — fecha</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.fechaInfluenza" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.fechaInfluenza }" @input="onInputFechaTexto('fechaInfluenza', $event)" @blur="validarCampoFechaEnBlur('fechaInfluenza')" />
              <input :ref="(el) => setDatePickerRef('fechaInfluenza', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('fechaInfluenza')" :min="minPickerVacuna('fechaInfluenza')" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('fechaInfluenza', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('fechaInfluenza')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="hintFechaMinDosis('fechaInfluenza')" class="text-[10px] text-slate-500 mt-1">{{ hintFechaMinDosis('fechaInfluenza') }}</p>
            <p v-if="erroresFecha.fechaInfluenza" class="form7-date-error">{{ erroresFecha.fechaInfluenza }}</p>
          </div>
          <div class="form7-field">
            <label class="form7-label">Neumococo — fecha</label>
            <div class="form7-date-wrap">
              <input type="text" class="form7-control form7-control--date" v-model="form.fechaNeumococo" placeholder="dd/mm/aaaa" maxlength="10" :class="{ 'form7-control--error': erroresFecha.fechaNeumococo }" @input="onInputFechaTexto('fechaNeumococo', $event)" @blur="validarCampoFechaEnBlur('fechaNeumococo')" />
              <input :ref="(el) => setDatePickerRef('fechaNeumococo', el)" type="date" class="form7-date-native" tabindex="-1" aria-hidden="true" :value="fechaPickerValue('fechaNeumococo')" :min="minPickerVacuna('fechaNeumococo')" :max="rangoFechasPeriodo.max || undefined" @change="onFechaPickerChange('fechaNeumococo', $event)" />
              <button type="button" class="form7-date-btn" title="Seleccionar fecha" @click="abrirSelectorFecha('fechaNeumococo')">
                <svg class="form7-date-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </button>
            </div>
            <p v-if="hintFechaMinDosis('fechaNeumococo')" class="text-[10px] text-slate-500 mt-1">{{ hintFechaMinDosis('fechaNeumococo') }}</p>
            <p v-if="erroresFecha.fechaNeumococo" class="form7-date-error">{{ erroresFecha.fechaNeumococo }}</p>
          </div>
        </div>
      </div>

      <ComentarioSupervisorEvaluacion v-if="modoSupervisor" v-model="comentarioSupervisor" />

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="form7-btn form7-btn--secondary" @click="$emit('cancelar')">Cancelar</button>
        <button type="button" class="form7-btn form7-btn--primary" @click="postForm()">{{ idVacunacionEdicion ? 'Guardar cambios' : 'Registrar' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed, reactive, watch, inject } from 'vue'
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import ComentarioSupervisorEvaluacion from '@/components/evaluacion/ComentarioSupervisorEvaluacion.vue';
import { useEdicionSupervisor } from '@/composables/useEdicionSupervisor';
import { parseFechaAISO, formatFechaDDMMAAAA } from '@/utils/fechaFormat';
// Importamos la librería de confeti
//import confetti from 'canvas-confetti';

// 👇 defineProps debe estar fuera de cualquier función
const props = defineProps({
  paciente: {
    type: Object,
    required: true
  },
  periodo: {
    type: Number,
    required: true
  },
  idPeriodoIpress: {
    type: Number,
    default: null
  },
  idRed: {
    type: Number,
    default: 1
  },
  idPacienteAtencion: {
    type: [Number, String],
    default: null
  },
  registroEdicion: {
    type: Object,
    default: null
  },
  clinicaNombre: { type: String, default: '' },
  periodoLabel: { type: String, default: '' },
  modalidadNombre: { type: String, default: '' },
  modoSupervisor: { type: Boolean, default: false },
})
const { paciente, periodo } = props
const emit = defineEmits(['cancelar', 'guardado'])

const { comentarioSupervisor, guardarComoSupervisor } = useEdicionSupervisor(props);

const periodoGlobal = inject('periodoGlobal', ref(null))
const clinicaGlobal = inject('clinicaGlobal', ref(null))
const modalidadGlobal = inject('modalidadGlobal', ref(null))

const idVacunacionEdicion = ref(null)
const clinicasLista = ref([])
const periodos = ref([])

function valorTexto(v) {
  if (v === null || v === undefined || v === '') return null
  return v
}

function cargarRegistroEdicion(registro) {
  if (!registro) return
  idVacunacionEdicion.value = registro.id_vacunacion
  form.vhbEstado = valorTexto(registro.vhb)
  form.vhbFecha = fechaDesdeRegistro(registro.fecha_vhb)
  form.antiHbcEstado = valorTexto(registro.antiHbc)
  form.antiHbcFecha = fechaDesdeRegistro(registro.fecha_antiHbc)
  form.vhcEstado = valorTexto(registro.vhc)
  form.vhcFecha = fechaDesdeRegistro(registro.fecha_vhc)
  form.vihEstado = valorTexto(registro.vih)
  form.vihFecha = fechaDesdeRegistro(registro.fecha_vih)
  const titulo = registro.titulo_acHbs
  form.vacunaHepatitis = titulo != null && titulo !== '' ? Number(titulo) : null
  form.estadoAcHBs = valorTexto(registro.estado_acHbs)
  form.fechaVacHepatitis = fechaDesdeRegistro(registro.fecha_titulo_acHbs)
  form.dosisHepatitisB = etiquetaCanonicaDosis(valorTexto(registro.dosis_hepatitis_b), OPCIONES_DOSIS_HEPATITIS)
    || valorTexto(registro.dosis_hepatitis_b)
  form.fechaHepatitisB = fechaDesdeRegistro(registro.fecha_hepatitis_b)
  form.dosisCovid = etiquetaCanonicaDosis(valorTexto(registro.dosis_covid), OPCIONES_DOSIS_COVID)
    || valorTexto(registro.dosis_covid)
  form.fechaCovid = fechaDesdeRegistro(registro.fecha_covid)
  form.fechaInfluenza = fechaDesdeRegistro(registro.fecha_influenza)
  form.fechaNeumococo = fechaDesdeRegistro(registro.fecha_neumococo)
  if (esEstadoDesconocido(form.vhbEstado)) form.vhbFecha = null
  if (esEstadoDesconocido(form.antiHbcEstado)) form.antiHbcFecha = null
  if (esEstadoDesconocido(form.vhcEstado)) form.vhcFecha = null
  if (esEstadoDesconocido(form.vihEstado)) form.vihFecha = null
  if (esEstadoDesconocido(form.estadoAcHBs)) {
    form.vacunaHepatitis = null
    form.fechaVacHepatitis = null
  } else if (!form.estadoAcHBs && (form.vacunaHepatitis == null || form.vacunaHepatitis === '')) {
    form.estadoAcHBs = 'Desconocido'
  }
}

const periodoVisibleId = computed(() => periodoGlobal.value ?? periodo ?? null)
const clinicaVisibleId = computed(() => clinicaGlobal.value ?? null)
const modalidadVisibleId = computed(() => modalidadGlobal.value ?? null)

const periodoTexto = computed(() => {
  const idPeriodo = periodoVisibleId.value
  if (idPeriodo == null) return ''
  const lista = Array.isArray(periodos.value) ? periodos.value : []
  const item = lista.find((per) => String(per.id_periodo) === String(idPeriodo))
  return item?.periodo || ''
})

const clinicaTexto = computed(() => {
  const idClinica = clinicaVisibleId.value
  if (idClinica == null || idClinica === '') return ''
  const lista = Array.isArray(clinicasLista.value) ? clinicasLista.value : []
  const item = lista.find((ip) => String(ip.id_ipress) === String(idClinica))
  return item?.nombre_corto || item?.ipress || ''
})

const modalidadTexto = computed(() => {
  const equivalencias = {
    1: 'Hemodiálisis',
    2: 'Diálisis Peritoneal',
    3: 'Trasplante',
  }
  return equivalencias[Number(modalidadVisibleId.value)] || ''
})

const periodoDisplay = computed(() => props.periodoLabel || periodoTexto.value || '—')
const clinicaDisplay = computed(() => props.clinicaNombre || clinicaTexto.value || '—')
const modalidadDisplay = computed(() => props.modalidadNombre || modalidadTexto.value || '—')

const rangoFechasPeriodo = computed(() => {
  const lista = Array.isArray(periodos.value) ? periodos.value : []
  const idPeriodo = periodoVisibleId.value
  if (idPeriodo == null || idPeriodo === '') return { min: null, max: null }
  const p = lista.find((per) => String(per.id_periodo) === String(idPeriodo))
  if (!p?.periodo) return { min: null, max: null }
  const parts = String(p.periodo).trim().split('-')
  if (parts.length < 2) return { min: null, max: null }
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  if (Number.isNaN(year) || Number.isNaN(month)) return { min: null, max: null }
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0],
  }
})

const CAMPOS_FECHA = [
  { key: 'vhbFecha', label: 'Fecha de examen VHB', estadoKey: 'vhbEstado' },
  { key: 'antiHbcFecha', label: 'Fecha de examen Anti-HBc', estadoKey: 'antiHbcEstado' },
  { key: 'vhcFecha', label: 'Fecha de examen VHC', estadoKey: 'vhcEstado' },
  { key: 'vihFecha', label: 'Fecha de examen VIH', estadoKey: 'vihEstado' },
  { key: 'fechaVacHepatitis', label: 'Fecha de prueba AcHBs', achbs: true },
  { key: 'fechaHepatitisB', label: 'Fecha de vacunación Hepatitis B', vacuna: true },
  { key: 'fechaCovid', label: 'Fecha de vacunación Covid-19', vacuna: true },
  { key: 'fechaInfluenza', label: 'Fecha de vacunación Influenza', vacuna: true },
  { key: 'fechaNeumococo', label: 'Fecha de vacunación Neumococo', vacuna: true },
]

const CAMPOS_FECHA_VACUNAS = [
  { key: 'fechaHepatitisB', label: 'Hepatitis B' },
  { key: 'fechaCovid', label: 'Covid-19' },
  { key: 'fechaInfluenza', label: 'Influenza' },
  { key: 'fechaNeumococo', label: 'Neumococo' },
]

function esEstadoDesconocido(estado) {
  return String(estado || '').trim().toLowerCase() === 'desconocido'
}

function fechaSerologiaAplica(campo) {
  if (campo.estadoKey && esEstadoDesconocido(form[campo.estadoKey])) return false
  if (campo.achbs && esEstadoDesconocido(form.estadoAcHBs)) return false
  return true
}

function onCambioEstadoSerologico(estadoKey, fechaKey) {
  if (esEstadoDesconocido(form[estadoKey])) {
    form[fechaKey] = null
    erroresFecha[fechaKey] = ''
  }
}

function onCambioEstadoAcHBs() {
  if (esEstadoDesconocido(form.estadoAcHBs)) {
    form.vacunaHepatitis = null
    form.fechaVacHepatitis = null
    erroresFecha.fechaVacHepatitis = ''
  }
}

function validarFechasVacunasDuplicadas() {
  for (const { key } of CAMPOS_FECHA_VACUNAS) {
    const prev = erroresFecha[key]
    if (prev && String(prev).includes('Máximo 2 vacunas')) {
      erroresFecha[key] = mensajeErrorFecha(key)
    }
  }

  const conteo = {}
  for (const { key } of CAMPOS_FECHA_VACUNAS) {
    const iso = parseFechaAISO(form[key])
    if (!iso) continue
    conteo[iso] = (conteo[iso] || 0) + 1
  }

  let mensajeGlobal = null
  for (const [iso, total] of Object.entries(conteo)) {
    if (total > 2) {
      mensajeGlobal = `Máximo 2 vacunas con la misma fecha (${formatFechaDDMMAAAA(iso)}).`
      const msg = mensajeGlobal
      for (const { key } of CAMPOS_FECHA_VACUNAS) {
        if (parseFechaAISO(form[key]) === iso) {
          erroresFecha[key] = msg
        }
      }
    }
  }
  return mensajeGlobal
}

/** (parseFechaAISO / formatFechaDDMMAAAA desde @/utils/fechaFormat) */

function fechaDDMMAAAAValida(value) {
  const iso = parseFechaAISO(value)
  if (!iso) return false
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

function fechaDesdeRegistro(value) {
  const t = valorTexto(value)
  if (!t) return null
  return formatFechaDDMMAAAA(t) || t
}

const rangoFechasPeriodoTexto = computed(() => {
  const r = rangoFechasPeriodo.value
  if (!r.min || !r.max) return { min: '', max: '' }
  return {
    min: formatFechaDDMMAAAA(r.min) || r.min,
    max: formatFechaDDMMAAAA(r.max) || r.max,
  }
})

const erroresFecha = reactive({})
const datePickerRefs = {}

function setDatePickerRef(key, el) {
  if (el) datePickerRefs[key] = el
}

function fechaPickerValue(key) {
  return parseFechaAISO(form[key]) || ''
}

function mensajeErrorFecha(key) {
  const fecha = form[key]
  if (!fecha) {
    erroresFecha[key] = ''
    return ''
  }
  if (!fechaDDMMAAAAValida(fecha)) {
    return 'Formato inválido (dd/mm/aaaa)'
  }
  const iso = parseFechaAISO(fecha)
  const rango = rangoFechasPeriodo.value
  const rangoTxt = rangoFechasPeriodoTexto.value
  if (rango.min && rango.max && iso && (iso < rango.min || iso > rango.max)) {
    return `Debe estar entre ${rangoTxt.min} y ${rangoTxt.max}`
  }
  const minDosis = fechaMinimaPorDosisPrevias(key)
  if (minDosis && iso && iso < minDosis) {
    return `No puede ser anterior a la dosis previa (${formatFechaDDMMAAAA(minDosis)})`
  }
  return ''
}

function onCambioDosisVacuna(fechaKey) {
  if (!form[fechaKey]) {
    erroresFecha[fechaKey] = ''
    return
  }
  erroresFecha[fechaKey] = mensajeErrorFecha(fechaKey)
  if (CAMPOS_FECHA_VACUNAS.some((c) => c.key === fechaKey)) {
    validarFechasVacunasDuplicadas()
  }
}

function onInputFechaTexto(key, event) {
  let v = String(event?.target?.value ?? form[key] ?? '')
  v = v.replace(/[^\d/\-.]/g, '')
  if (/^\d{8}$/.test(v)) {
    const formateada = formatFechaDDMMAAAA(v)
    form[key] = formateada || v
    erroresFecha[key] = mensajeErrorFecha(key)
    return
  }
  form[key] = v
}

function validarCampoFechaEnBlur(key) {
  normalizarCampoFecha(key)
  erroresFecha[key] = mensajeErrorFecha(key)
  if (CAMPOS_FECHA_VACUNAS.some((c) => c.key === key)) {
    validarFechasVacunasDuplicadas()
  }
}

function onFechaPickerChange(key, event) {
  const iso = event.target?.value
  form[key] = iso ? formatFechaDDMMAAAA(iso) : null
  erroresFecha[key] = mensajeErrorFecha(key)
  if (CAMPOS_FECHA_VACUNAS.some((c) => c.key === key)) {
    validarFechasVacunasDuplicadas()
  }
}

function abrirSelectorFecha(key) {
  const el = datePickerRefs[key]
  if (!el) return
  if (typeof el.showPicker === 'function') {
    try {
      el.showPicker()
      return
    } catch {
      // fallback below
    }
  }
  el.focus()
  el.click()
}

function normalizarCampoFecha(key) {
  const raw = form[key]
  if (raw == null || String(raw).trim() === '') {
    form[key] = null
    return
  }
  const formateada = formatFechaDDMMAAAA(raw)
  if (formateada) form[key] = formateada
}

function normalizarTodasLasFechas() {
  CAMPOS_FECHA.forEach(({ key }) => {
    normalizarCampoFecha(key)
    erroresFecha[key] = mensajeErrorFecha(key)
  })
  validarFechasVacunasDuplicadas()
}

function validarFechasPeriodo() {
  const rango = rangoFechasPeriodo.value
  const rangoTxt = rangoFechasPeriodoTexto.value
  for (const campo of CAMPOS_FECHA) {
    if (!fechaSerologiaAplica(campo)) continue
    const { key, label } = campo
    const fecha = form[key]
    if (!fecha) continue
    if (!fechaDDMMAAAAValida(fecha)) {
      return `${label}: use el formato dd-mm-aaaa`
    }
    const iso = parseFechaAISO(fecha)
    if (rango.min && rango.max && (iso < rango.min || iso > rango.max)) {
      return `${label} debe estar entre ${rangoTxt.min} y ${rangoTxt.max}`
    }
    const minDosis = fechaMinimaPorDosisPrevias(key)
    if (minDosis && iso && iso < minDosis) {
      return `${label}: no puede ser anterior a la dosis previa (${formatFechaDDMMAAAA(minDosis)})`
    }
  }
  return validarFechasVacunasDuplicadas()
}

const form = reactive({
  vhbEstado: null,
  vhbFecha: null,
  vhcEstado: null,
  vhcFecha: null,
  vihEstado: null,
  vihFecha: null,
  antiHbcEstado: null,
  antiHbcFecha: null,
  vacunaHepatitis: null,
  estadoAcHBs: null,
  fechaVacHepatitis: null,
  dosisHepatitisB: null,
  fechaHepatitisB: null,
  dosisCovid: null,
  fechaCovid: null,
  fechaInfluenza: null,
  fechaNeumococo: null,
})

/** Esquema Hepatitis B (primaria 1-3 + refuerzos anuales hasta 10). */
const OPCIONES_DOSIS_HEPATITIS = [
  '1ra dosis',
  '2da dosis',
  '3ra dosis',
  '4ta dosis (1er refuerzo)',
  '5ta dosis (2do refuerzo)',
  '6ta dosis (3er refuerzo)',
  '7ma dosis',
  '8va dosis',
  '9na dosis',
  '10ma dosis',
]

/** Esquema Covid-19 (serie primaria + refuerzos sucesivos). */
const OPCIONES_DOSIS_COVID = [
  '1ra dosis',
  '2da dosis',
  '3ra dosis (1er refuerzo)',
  '4ta dosis (2do refuerzo)',
  '5ta dosis (3er refuerzo)',
  '6ta dosis',
  '7ma dosis',
  '8va dosis',
  '9na dosis',
  '10ma dosis',
]

const opcionesDosisHepatitis = OPCIONES_DOSIS_HEPATITIS
const opcionesDosisCovid = OPCIONES_DOSIS_COVID

const dosisHepatitisUsadas = ref(new Set())
const dosisCovidUsadas = ref(new Set())
/** Fechas ISO por clave de dosis (ej. { 'dosis-1': '2024-01-15' }). */
const fechasDosisHepatitis = ref({})
const fechasDosisCovid = ref({})
/** Última fecha ISO registrada (otra atención), para vacunas sin esquema de dosis. */
const fechaUltimaInfluenza = ref(null)
const fechaUltimaNeumococo = ref(null)
const cargandoDosisPrevias = ref(false)

function normalizarClaveDosis(texto) {
  const raw = String(texto || '').trim().toLowerCase()
  if (!raw) return ''
  const t = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const numMatch = t.match(/(\d+)\s*(er|ra|da|ta|ma|mo|na|va)?/)
    || t.match(/(1er|1ra|2da|3ra|4ta|5ta|6ta|7ma|8va|9na|9no|10ma|10mo)/)
  if (numMatch) {
    const digitos = String(numMatch[0]).match(/\d+/)
    if (digitos) return `dosis-${Number(digitos[0])}`
  }
  if (t.includes('refuerzo')) return 'refuerzo'
  return t
}

function numeroDesdeClaveDosis(clave) {
  const m = String(clave || '').match(/dosis-(\d+)/)
  return m ? Number(m[1]) : null
}

function registrarFechaDosis(mapa, clave, fechaRaw) {
  const iso = parseFechaAISO(fechaRaw)
  if (!clave || !iso) return
  const prev = mapa[clave]
  if (!prev || iso > prev) mapa[clave] = iso
}

function fechaMaximaDosisAnteriores(mapaFechas, dosisSeleccionada) {
  const n = numeroDesdeClaveDosis(normalizarClaveDosis(dosisSeleccionada))
  if (n == null) return null
  let max = null
  for (const [clave, iso] of Object.entries(mapaFechas || {})) {
    const num = numeroDesdeClaveDosis(clave)
    if (num == null || num >= n || !iso) continue
    if (!max || iso > max) max = iso
  }
  return max
}

/** Fecha mínima por dosis previas del mismo tipo de vacuna (ISO). */
function fechaMinimaPorDosisPrevias(key) {
  if (key === 'fechaHepatitisB') {
    return fechaMaximaDosisAnteriores(fechasDosisHepatitis.value, form.dosisHepatitisB)
  }
  if (key === 'fechaCovid') {
    return fechaMaximaDosisAnteriores(fechasDosisCovid.value, form.dosisCovid)
  }
  if (key === 'fechaInfluenza') return fechaUltimaInfluenza.value
  if (key === 'fechaNeumococo') return fechaUltimaNeumococo.value
  return null
}

/** min del date picker: mayor entre inicio de periodo y dosis previa. */
function minPickerVacuna(key) {
  const periodoMin = rangoFechasPeriodo.value.min || null
  const dosisMin = fechaMinimaPorDosisPrevias(key)
  if (periodoMin && dosisMin) return dosisMin > periodoMin ? dosisMin : periodoMin
  return dosisMin || periodoMin || undefined
}

function hintFechaMinDosis(key) {
  const min = fechaMinimaPorDosisPrevias(key)
  if (!min) return ''
  if (key === 'fechaHepatitisB' || key === 'fechaCovid') {
    return `Debe ser igual o posterior a la dosis previa (${formatFechaDDMMAAAA(min)}).`
  }
  if (key === 'fechaInfluenza') {
    return `Debe ser igual o posterior a la última Influenza (${formatFechaDDMMAAAA(min)}).`
  }
  if (key === 'fechaNeumococo') {
    return `Debe ser igual o posterior a la última Neumococo (${formatFechaDDMMAAAA(min)}).`
  }
  return ''
}

function etiquetaCanonicaDosis(texto, opciones) {
  const clave = normalizarClaveDosis(texto)
  if (!clave) return null
  const match = opciones.find((op) => normalizarClaveDosis(op) === clave)
  return match || String(texto || '').trim() || null
}

function dosisHepatitisBloqueada(opcion) {
  const clave = normalizarClaveDosis(opcion)
  if (!clave || !dosisHepatitisUsadas.value.has(clave)) return false
  // Al editar, la dosis del registro actual permanece habilitada
  if (idVacunacionEdicion.value != null && normalizarClaveDosis(form.dosisHepatitisB) === clave) {
    return false
  }
  return true
}

function dosisCovidBloqueada(opcion) {
  const clave = normalizarClaveDosis(opcion)
  if (!clave || !dosisCovidUsadas.value.has(clave)) return false
  if (idVacunacionEdicion.value != null && normalizarClaveDosis(form.dosisCovid) === clave) {
    return false
  }
  return true
}

function siguienteDosisDisponible(opciones, usadas, dosisActual = null) {
  const claveActual = normalizarClaveDosis(dosisActual)
  for (const op of opciones) {
    const clave = normalizarClaveDosis(op)
    if (!clave) continue
    if (claveActual && clave === claveActual) return op
    if (!usadas.has(clave)) return op
  }
  return null
}

const resumenDosisHepatitis = computed(() => {
  if (cargandoDosisPrevias.value) return 'Consultando dosis previas…'
  const n = dosisHepatitisUsadas.value.size
  const siguiente = siguienteDosisDisponible(OPCIONES_DOSIS_HEPATITIS, dosisHepatitisUsadas.value)
  if (n === 0) return 'Sin dosis de Hepatitis B registradas. Puede iniciar con la 1ra dosis.'
  if (!siguiente) return `${n} dosis de Hepatitis B registradas. Esquema completo.`
  return `${n} dosis ya registrada(s). Siguiente disponible: ${siguiente}.`
})

const resumenDosisCovid = computed(() => {
  if (cargandoDosisPrevias.value) return 'Consultando dosis previas…'
  const n = dosisCovidUsadas.value.size
  const siguiente = siguienteDosisDisponible(OPCIONES_DOSIS_COVID, dosisCovidUsadas.value)
  if (n === 0) return 'Sin dosis de Covid-19 registradas. Puede iniciar con la 1ra dosis.'
  if (!siguiente) return `${n} dosis de Covid-19 registradas. Esquema completo.`
  return `${n} dosis ya registrada(s). Siguiente disponible: ${siguiente}.`
})

function aplicarSiguienteDosisSiCorresponde() {
  // Si la dosis elegida ya está registrada (p. ej. valor legacy), limpiar para forzar la siguiente.
  if (form.dosisHepatitisB && dosisHepatitisBloqueada(form.dosisHepatitisB)) {
    form.dosisHepatitisB = null
  }
  if (form.dosisCovid && dosisCovidBloqueada(form.dosisCovid)) {
    form.dosisCovid = null
  }
}

async function cargarDosisPreviasPaciente() {
  const idPaciente = props.paciente?.id_paciente
  dosisHepatitisUsadas.value = new Set()
  dosisCovidUsadas.value = new Set()
  fechasDosisHepatitis.value = {}
  fechasDosisCovid.value = {}
  fechaUltimaInfluenza.value = null
  fechaUltimaNeumococo.value = null
  if (idPaciente == null || idPaciente === '') return

  cargandoDosisPrevias.value = true
  try {
    const resAt = await getAllIpress(`/pacienteAtencion/?id_paciente=${idPaciente}`)
    const atenciones = Array.isArray(resAt) ? resAt : (resAt?.results || [])
    const idsAtencion = [...new Set(
      atenciones
        .map((a) => a.id_paciente_atencion)
        .filter((id) => id != null && id !== ''),
    )]
    if (idsAtencion.length === 0) return

    const respuestas = await Promise.all(
      idsAtencion.map((id) =>
        getAllIpress(`/vacunaciones/?id_paciente_atencion=${id}`).catch(() => []),
      ),
    )
    const registros = respuestas.flatMap((r) => (Array.isArray(r) ? r : (r?.results || [])))
    const hb = new Set()
    const cv = new Set()
    const fechasHb = {}
    const fechasCv = {}
    let maxInf = null
    let maxNeu = null
    for (const reg of registros) {
      if (idVacunacionEdicion.value != null && String(reg.id_vacunacion) === String(idVacunacionEdicion.value)) {
        continue
      }
      const claveHb = normalizarClaveDosis(reg.dosis_hepatitis_b)
      const claveCv = normalizarClaveDosis(reg.dosis_covid)
      if (claveHb) {
        hb.add(claveHb)
        registrarFechaDosis(fechasHb, claveHb, reg.fecha_hepatitis_b)
      }
      if (claveCv) {
        cv.add(claveCv)
        registrarFechaDosis(fechasCv, claveCv, reg.fecha_covid)
      }
      const isoInf = parseFechaAISO(reg.fecha_influenza)
      if (isoInf && (!maxInf || isoInf > maxInf)) maxInf = isoInf
      const isoNeu = parseFechaAISO(reg.fecha_neumococo)
      if (isoNeu && (!maxNeu || isoNeu > maxNeu)) maxNeu = isoNeu
    }
    dosisHepatitisUsadas.value = hb
    dosisCovidUsadas.value = cv
    fechasDosisHepatitis.value = fechasHb
    fechasDosisCovid.value = fechasCv
    fechaUltimaInfluenza.value = maxInf
    fechaUltimaNeumococo.value = maxNeu

    // Normalizar etiquetas legacy al canónico del esquema
    if (form.dosisHepatitisB) {
      form.dosisHepatitisB = etiquetaCanonicaDosis(form.dosisHepatitisB, OPCIONES_DOSIS_HEPATITIS)
        || form.dosisHepatitisB
    }
    if (form.dosisCovid) {
      form.dosisCovid = etiquetaCanonicaDosis(form.dosisCovid, OPCIONES_DOSIS_COVID)
        || form.dosisCovid
    }
    aplicarSiguienteDosisSiCorresponde()
    // Revalidar fechas de vacunas con el historial cargado
    for (const { key } of CAMPOS_FECHA_VACUNAS) {
      if (form[key]) erroresFecha[key] = mensajeErrorFecha(key)
    }
  } catch (e) {
    console.error('Error al cargar dosis previas de vacunación:', e)
  } finally {
    cargandoDosisPrevias.value = false
  }
}

function campoTextoOpcional(val) {
  if (val == null) return '';
  return String(val);
}

function buildPayload() {
  const payload = {
    id_paciente_atencion: props.idPacienteAtencion,
    vhbEstado: campoTextoOpcional(form.vhbEstado),
    vhbFecha: campoTextoOpcional(form.vhbFecha),
    antiHbcEstado: campoTextoOpcional(form.antiHbcEstado),
    antiHbcFecha: campoTextoOpcional(form.antiHbcFecha),
    vhcEstado: campoTextoOpcional(form.vhcEstado),
    vhcFecha: campoTextoOpcional(form.vhcFecha),
    vihEstado: campoTextoOpcional(form.vihEstado),
    vihFecha: campoTextoOpcional(form.vihFecha),
    vacunaHepatitis: form.vacunaHepatitis != null && form.vacunaHepatitis !== '' ? String(form.vacunaHepatitis) : '',
    estadoAcHBs: campoTextoOpcional(form.estadoAcHBs),
    fechaVacHepatitis: campoTextoOpcional(form.fechaVacHepatitis),
    dosisHepatitisB: campoTextoOpcional(form.dosisHepatitisB),
    fechaHepatitisB: campoTextoOpcional(form.fechaHepatitisB),
    dosisCovid: campoTextoOpcional(form.dosisCovid),
    fechaCovid: campoTextoOpcional(form.fechaCovid),
    fechaInfluenza: campoTextoOpcional(form.fechaInfluenza),
    fechaNeumococo: campoTextoOpcional(form.fechaNeumococo),
  }
  return payload
}

watch(() => form.vacunaHepatitis, (nuevoValor) => {
  if (esEstadoDesconocido(form.estadoAcHBs)) return

  if (nuevoValor > 2000) {
    form.vacunaHepatitis = 2000;
    return;
  }

  if (nuevoValor === null || nuevoValor === undefined || nuevoValor === '' || isNaN(nuevoValor)) {
    form.estadoAcHBs = 'Desconocido';
    return;
  }

  const valor = Number(nuevoValor);

  if (valor < 10) {
    form.estadoAcHBs = 'No Responde';
  } else if (valor >= 10 && valor < 100) {
    form.estadoAcHBs = 'Respuesta pobre';
  } else if (valor >= 100 && valor < 1000) {
    form.estadoAcHBs = 'Óptimo';
  } else if (valor >= 1000 && valor <= 2000) {
    form.estadoAcHBs = 'Excelente';
  } else {
    form.estadoAcHBs = 'Desconocido';
  }
});


const router = useRouter()
const pacienteSeleccionado = paciente

const postForm = async () => {
  normalizarTodasLasFechas()
  const errorFecha = validarFechasPeriodo();
  if (errorFecha) {
    alert(errorFecha);
    return;
  }
  if (props.idPacienteAtencion == null || props.idPacienteAtencion === '') {
    alert('No se encontró la atención del paciente para el periodo actual. Cierre el formulario y vuelva a seleccionar al paciente.');
    return;
  }
  if (form.dosisHepatitisB && dosisHepatitisBloqueada(form.dosisHepatitisB)) {
    alert('Esa dosis de Hepatitis B ya está registrada. Seleccione la siguiente dosis del esquema.');
    return;
  }
  if (form.dosisCovid && dosisCovidBloqueada(form.dosisCovid)) {
    alert('Esa dosis de Covid-19 ya está registrada. Seleccione la siguiente dosis del esquema.');
    return;
  }
  const payload = buildPayload();
  try {
    if (idVacunacionEdicion.value != null) {
      if (props.modoSupervisor) {
        await guardarComoSupervisor('vacunaciones', idVacunacionEdicion.value, payload);
      } else {
        await patchAllIpress(`/vacunaciones/${idVacunacionEdicion.value}/`, payload);
      }
      emit('guardado');
      return;
    }
    await postAllIpress('/vacunaciones/', payload);
    emit('guardado');
  } catch (error) {
    console.error('Error al guardar vacunación:', error);
    const detalle = error?.response?.data;
    const mensaje = typeof detalle === 'string'
      ? detalle
      : detalle
        ? JSON.stringify(detalle)
        : 'Error al guardar el registro de vacunación';
    alert(mensaje);
  }
};

const fetchPaciente = async (url = null) => {
  try {
    const respuesta = await getAllIpress( "/pacientes/" + paciente.id_paciente);
    pacienteSeleccionado.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPeriodo = async () => {
  try {
    const respuesta = await getAllIpress('/periodos/')
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || [])
  } catch (error) {
    console.error('Error al obtener periodos:', error)
    periodos.value = []
  }
}

const fetchClinicas = async () => {
  try {
    const res = await getAllIpress('/ipress/')
    clinicasLista.value = Array.isArray(res) ? res : (res?.results || [])
  } catch (error) {
    console.error('Error al cargar IPRESS:', error)
    clinicasLista.value = []
  }
}

watch(() => props.registroEdicion, async (registro) => {
  if (registro) cargarRegistroEdicion(registro)
  await cargarDosisPreviasPaciente()
}, { immediate: true })

watch(() => props.paciente?.id_paciente, async () => {
  await cargarDosisPreviasPaciente()
})

onMounted(async () => {
  await Promise.all([fetchPaciente(), fetchPeriodo(), fetchClinicas()])
  if (props.registroEdicion) {
    cargarRegistroEdicion(props.registroEdicion)
  }
  await cargarDosisPreviasPaciente()
})


const mes = ref('JULIO')
const anio = ref('2025')
const clinica = ref('DA VIDA S.A.C.')
const turno = ref('')
const frecuencia = ref('')

const edadPaciente = computed(() => {
  if (!pacienteSeleccionado.value?.fecha_nacimiento) return ''

  const hoy = new Date()
  const nacimiento = new Date(pacienteSeleccionado.value.fecha_nacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }

  return `${edad} años`
})
</script>

<!-- <script setup>
import { ref } from 'vue'

// Datos de Turno
const turno = ref('')
const frecuencia = ref('')

// Condición Serológica
const vhb = ref('')
const vhbFechaVacunacion = ref('')
const vhc = ref('')
const vhcFechaVacunacion = ref('')
const vhi = ref('')
const vhiFechaVacunacion = ref('')

// AcHBs
const tipoAcHBs = ref('')
const estadoAcHBs = ref('')
const fechaVacAcHBs = ref('')

// Vacunación Hepatitis B
const ultimaDosisHepB = ref('')
const fechaUltimaDosisHepB = ref('')
const motivoNoVacHepB = ref('')

// Vacunación COVID-19
const ultimaDosisCovid = ref('')
const fechaUltimaDosisCovid = ref('')
const motivoNoVacCovid = ref('')

// Vacunación Influenza
const fechaVacInfluenza = ref('')
const motivoNoVacInfluenza = ref('')

// Vacunación Neumococo
const fechaVacNeumococo = ref('')
const motivoNoVacNeumococo = ref('')

// Opciones sugeridas
const opcionesTurno = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: 'No corresponde' }
]

const opcionesFrecuencia = [
  { value: 'LMV', label: 'Lunes-Miércoles-Viernes' },
  { value: 'MJS', label: 'Martes-Jueves-Sábado' },
  { value: '2x', label: '2 veces por semana' },
  { value: 'otros', label: 'Otros' },
  { value: 'nc', label: 'No corresponde' }
]

const opcionesCondicion = [
  { value: 'negativo', label: 'Negativo' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'no se realizó', label: 'No se realizó' }
]

const opcionesTipoAcHBs = [
  { value: 'positivo', label: 'Positivo (>10 mUI/mL)' },
  { value: 'negativo', label: 'Negativo (<10 mUI/mL)' },
  { value: 'no evaluado', label: 'No evaluado' }
]

const opcionesDosis = [
  { value: '1ra', label: '1ra. Dosis' },
  { value: '2da', label: '2da. Dosis' },
  { value: '3ra', label: '3ra. Dosis' },
  { value: 'refuerzo', label: 'Refuerzo' }
]

const motivosNoVacunacion = [
  { value: 'rechazo', label: 'No aceptó la vacunación' },
  { value: 'fallecido', label: 'Falleció' },
  { value: 'hospitalizado', label: 'Está hospitalizado' },
  { value: 'proceso infeccioso', label: 'Cursa con proceso infeccioso' },
  { value: 'diagnóstico covid', label: 'Tiene diagnóstico COVID-19' },
  { value: 'vacuna reciente', label: 'Tiene antecedente de vacunación reciente' },
  { value: 'cambio unidad', label: 'Cambio de unidad' },
  { value: 'no corresponde', label: 'No corresponde' }
]
</script> -->

<style scoped>
.form7-meta-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.form7-info-box {
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.form7-section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.form7-field {
  min-width: 0;
}

.form7-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.form7-label-sub {
  display: block;
  font-size: 0.625rem;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 0.375rem;
  margin-bottom: 0.2rem;
}

.form7-shell input.form7-control,
.form7-shell select.form7-control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  min-height: 2rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: #1e293b;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form7-shell input.form7-control:focus,
.form7-shell select.form7-control:focus {
  border-color: #008f9c;
  box-shadow: 0 0 0 2px rgb(0 143 156 / 0.15);
}

.form7-shell input.form7-control--readonly,
.form7-shell input.form7-control:disabled {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.form7-shell select.form7-control {
  cursor: pointer;
}

.form7-date-wrap {
  display: flex;
  align-items: stretch;
  position: relative;
}

.form7-date-wrap .form7-control--date {
  flex: 1;
  min-width: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.form7-date-native {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.form7-date-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  padding: 0;
  border: 1px solid #cbd5e1;
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0;
  background: #f8fafc;
  color: #008f9c;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.form7-date-btn:hover {
  background: #ecfeff;
}

.form7-date-btn-icon {
  width: 0.9rem;
  height: 0.9rem;
}

.form7-shell input.form7-control--date {
  font-variant-numeric: tabular-nums;
}

.form7-shell input.form7-control--error {
  border-color: #f87171;
  background-color: #fef2f2;
}

.form7-date-error {
  margin-top: 0.2rem;
  font-size: 0.625rem;
  line-height: 0.875rem;
  color: #dc2626;
}

.form7-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.form7-btn--secondary {
  color: #374151;
  background: #fff;
  border-color: #d1d5db;
}

.form7-btn--secondary:hover {
  background: #f9fafb;
}

.form7-btn--primary {
  color: #fff;
  background: #008f9c;
  border-color: #008f9c;
}

.form7-btn--primary:hover {
  background: #007a85;
}
</style>