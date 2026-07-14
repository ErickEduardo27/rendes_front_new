<template>
  <div class="form5-shell p-4 space-y-4 bg-gray-50">

    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Periodo de reporte</label>
          <div class="form5-info-box">
            {{ periodoDisplay }}
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Clínica</label>
          <div class="form5-info-box">
            {{ clinicaDisplay }}
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Modalidad de diálisis</label>
          <div class="form5-info-box">
            {{ modalidadDisplay }}
          </div>
        </div>
      </div>
      <div v-if="paciente" class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span class="font-semibold text-slate-700">Paciente:</span>
        <span class="font-medium text-slate-800">{{ paciente.paciente || '—' }}</span>
        <span class="text-slate-300">|</span>
        <span class="font-semibold text-slate-700">DNI:</span>
        <span class="font-medium text-slate-800">{{ paciente.documento || '—' }}</span>
      </div>
    </div>

    <div class="border-l-4 border-cyan-600 pl-3">
      <h2 class="text-base font-bold text-slate-800">Resultados Clínicos</h2>
      <p class="text-xs text-slate-500">
        Los resultados de laboratorio son opcionales. Solo son obligatorios el tiempo de diálisis y el tratamiento administrado.
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-start">
      
      <div class="flex-1 w-full">
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="campo in camposResultados" :key="campo.key">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {{ campo.label }} <span class="text-slate-400 font-normal normal-case">(opcional)</span>
              </label>

              <div class="flex items-center gap-2">
                <input
                  v-model.number="form[campo.key]"
                  type="number"
                  :min="campo.min"
                  :max="campo.max"
                  :step="campo.allowDecimals ? '0.01' : '1'"
                  class="form5-control"
                  :readonly="campo.readonly"
                  :class="{
                    'form5-control--readonly': campo.readonly,
                    'form5-control--error': validarCampo(campo),
                  }"
                  @keydown="campo.allowDecimals ? permitirDecimal($event) : bloquearDecimal($event)"
                  @blur="validarRango(campo)"
                  :title="campo.min !== undefined && campo.max !== undefined ? `Rango válido: ${campo.min} - ${campo.max}` : ''"
                />
                
                <div
                  class="w-4 h-4 rounded-full border border-slate-200 shadow-inner flex-shrink-0 transition-colors duration-300"
                  :class="obtenerColorSemaforo(campo)"
                ></div>

                <button
                  type="button"
                  class="form5-btn-icon"
                  title="Ver historial del paciente"
                  @click="abrirHistoricoCampo(campo)"
                >
                  <ChartBarIcon class="w-4 h-4" />
                </button>
              </div>

              <p v-if="validarCampo(campo)" class="text-[11px] text-red-500 mt-1 font-medium">
                El valor debe estar entre {{ campo.min }} y {{ campo.max }}
              </p>
            </div>
          </div>

          <hr class="border-slate-100" />

          <div class="w-full md:w-1/2 md:pr-3">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Tiempo de diálisis (horas) <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
              <select
                v-model="form.tmpDialisis"
                class="form5-control"
                :class="{ 'form5-control--error': errorTiempoDialisis }"
                @change="errorTiempoDialisis = false"
              >
                <option value="">Seleccione horas…</option>
                <option
                  v-for="v in opcionesTiempoDialisisLista"
                  :key="v"
                  :value="String(v)"
                >
                  {{ formatearTiempoDialisisEtiqueta(v) }} h
                </option>
              </select>
              <button
                type="button"
                class="form5-btn-icon"
                title="Ver historial del paciente"
                @click="abrirHistoricoCampo(campoTiempoDialisis)"
              >
                <ChartBarIcon class="w-4 h-4" />
              </button>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Obligatorio. Valores permitidos: de {{ TIEMPO_DIALISIS_MIN }} a {{ TIEMPO_DIALISIS_MAX }} horas, en incrementos de 0,25.</p>
            <p v-if="errorTiempoDialisis" class="text-[11px] text-red-500 mt-1 font-medium">
              {{ MENSAJE_TIEMPO_DIALISIS_INVALIDO }}
            </p>
          </div>

          <h3 class="text-sm font-bold text-slate-800 pt-1">Tratamiento Administrado <span class="text-red-500 text-xs">*</span></h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Eritropoyetina <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.eritropoyetina"
                class="form5-control"
                :class="{ 'form5-control--error': erroresTratamiento.eritropoyetina }"
                @change="erroresTratamiento.eritropoyetina = false"
              >
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
              <p v-if="erroresTratamiento.eritropoyetina" class="text-[11px] text-red-500 mt-1 font-medium">Seleccione Sí o No.</p>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Hierro <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.hierro"
                class="form5-control"
                :class="{ 'form5-control--error': erroresTratamiento.hierro }"
                @change="erroresTratamiento.hierro = false"
              >
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
              <p v-if="erroresTratamiento.hierro" class="text-[11px] text-red-500 mt-1 font-medium">Seleccione Sí o No.</p>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Calcitriol <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.hiperparatiroidismo"
                class="form5-control"
                :class="{ 'form5-control--error': erroresTratamiento.hiperparatiroidismo }"
                @change="erroresTratamiento.hiperparatiroidismo = false"
              >
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
              <p v-if="erroresTratamiento.hiperparatiroidismo" class="text-[11px] text-red-500 mt-1 font-medium">Seleccione Sí o No.</p>
            </div>
          </div>

          <ComentarioSupervisorEvaluacion v-if="modoSupervisor" v-model="comentarioSupervisor" />
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="form5-btn form5-btn--secondary"
              @click="$emit('cancelar')"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="form5-btn form5-btn--primary"
              @click="postForm"
            >
              {{ idResultadoEdicion ? 'Guardar cambios' : 'Registrar' }}
            </button>
          </div>
        </div>
      </div>

   

    </div>

    <Teleport to="body">
      <div
        v-if="modalHistorico.visible"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40"
        @click.self="cerrarHistorico"
      >
        <div class="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
          <div class="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-slate-800">Historial — {{ modalHistorico.campo?.label }}</h3>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ paciente?.paciente || 'Paciente' }}
                <span v-if="paciente?.documento"> · DNI {{ paciente.documento }}</span>
              </p>
            </div>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 text-xl leading-none px-1"
              @click="cerrarHistorico"
            >
              ×
            </button>
          </div>

          <div class="p-5">
            <div v-if="historicoCargando" class="py-10 text-center text-sm text-slate-400">
              Cargando historial...
            </div>
            <div v-else-if="modalHistorico.serie.length === 0" class="py-10 text-center text-sm text-slate-400 italic">
              No hay registros históricos para este campo.
            </div>
            <template v-else>
              <svg
                :viewBox="`0 0 ${chartGeom.width} ${chartGeom.height}`"
                class="w-full h-auto"
                role="img"
                :aria-label="`Gráfico histórico de ${modalHistorico.campo?.label}`"
              >
                <rect
                  v-if="chartGeom.bandaVerde"
                  :x="chartGeom.padding.left"
                  :y="chartGeom.bandaVerde.y"
                  :width="chartGeom.plotW"
                  :height="chartGeom.bandaVerde.h"
                  fill="#dcfce7"
                  opacity="0.65"
                />

                <line
                  :x1="chartGeom.padding.left"
                  :y1="chartGeom.padding.top + chartGeom.plotH"
                  :x2="chartGeom.padding.left + chartGeom.plotW"
                  :y2="chartGeom.padding.top + chartGeom.plotH"
                  stroke="#cbd5e1"
                  stroke-width="1"
                />
                <line
                  :x1="chartGeom.padding.left"
                  :y1="chartGeom.padding.top"
                  :x2="chartGeom.padding.left"
                  :y2="chartGeom.padding.top + chartGeom.plotH"
                  stroke="#cbd5e1"
                  stroke-width="1"
                />

                <text
                  :x="chartGeom.padding.left - 6"
                  :y="chartGeom.padding.top + 4"
                  text-anchor="end"
                  class="fill-slate-400"
                  font-size="9"
                >
                  {{ chartGeom.yMaxLabel }}
                </text>
                <text
                  :x="chartGeom.padding.left - 6"
                  :y="chartGeom.padding.top + chartGeom.plotH"
                  text-anchor="end"
                  class="fill-slate-400"
                  font-size="9"
                >
                  {{ chartGeom.yMinLabel }}
                </text>

                <path
                  :d="chartGeom.linePath"
                  fill="none"
                  stroke="#0891b2"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />

                <g v-for="(punto, idx) in chartGeom.points" :key="idx">
                  <circle :cx="punto.x" :cy="punto.y" r="4.5" fill="#0891b2" stroke="#fff" stroke-width="1.5" />
                  <text
                    :x="punto.x"
                    :y="chartGeom.padding.top + chartGeom.plotH + 14"
                    text-anchor="middle"
                    class="fill-slate-500"
                    font-size="8"
                  >
                    {{ punto.periodoCorto }}
                  </text>
                  <text
                    :x="punto.x"
                    :y="punto.y - 8"
                    text-anchor="middle"
                    class="fill-cyan-700 font-semibold"
                    font-size="9"
                  >
                    {{ punto.valorLabel }}
                  </text>
                </g>
              </svg>

              <p class="text-[11px] text-slate-400 mt-3 text-center">
                {{ modalHistorico.serie.length }} registro(s) por periodo · La franja verde indica el rango ideal
              </p>
            </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import ComentarioSupervisorEvaluacion from '@/components/evaluacion/ComentarioSupervisorEvaluacion.vue';
import { useEdicionSupervisor } from '@/composables/useEdicionSupervisor';
import Swal from 'sweetalert2';
import {
  TIEMPO_DIALISIS_MIN,
  TIEMPO_DIALISIS_MAX,
  MENSAJE_TIEMPO_DIALISIS_INVALIDO,
  esTiempoDialisisValorValido,
  opcionesTiempoDialisis,
  formatearTiempoDialisisEtiqueta,
  parseTiempoDialisisNumero,
} from '@/utils/tiempoDialisis';

const props = defineProps({
  paciente: { type: Object, default: null },
  periodo: { type: Number, default: null },
  idPacienteAtencion: { type: [Number, String], default: null },
  registroEdicion: { type: Object, default: null },
  clinicaNombre: { type: String, default: '' },
  periodoLabel: { type: String, default: '' },
  modalidadNombre: { type: String, default: '' },
  modoSupervisor: { type: Boolean, default: false },
})

const { paciente, periodo, idPacienteAtencion } = props

const emit = defineEmits(['cancelar', 'guardado'])

const { comentarioSupervisor, guardarComoSupervisor } = useEdicionSupervisor(props);

const periodoGlobal = inject('periodoGlobal', ref(null))
const clinicaGlobal = inject('clinicaGlobal', ref(null))
const modalidadGlobal = inject('modalidadGlobal', ref(null))

const periodos = ref([])
const clinicas = ref([])

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
  const lista = Array.isArray(clinicas.value) ? clinicas.value : []
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

const form = ref({
  tmpDialisis: '',
  eritropoyetina: '',
  hierro: '',
  hiperparatiroidismo: '',
  hb: null,
  calcio: null,
  fosforo: null,
  pthi: null,
  alb: null,
  calcioCorregido: null,
  kt: null,
  id_periodo_ipress: 17,
  id_red: 1,
  id_paciente: paciente?.id_paciente ?? null
})

/* CAMPOS: RANGOS ACTUALIZADOS Y RANGOS NORMALES PARA SEMÁFORO */
// NOTA: Los rangos "normales" (verde) y "precaución" (amarillo) son configurables en las propiedades 'rangoVerde' y 'rangoAmarillo'. 
// Si está fuera de amarillo pero dentro del min/max global, será Rojo.
const camposResultados = [
  { label: 'Hb (gr/dl)', key: 'hb', apiKey: 'Hb', allowDecimals: true, min: 1, max: 18, rangoVerde: [10, 12], rangoAmarillo: [9, 13] },
  { label: 'Calcio (mg/dl)', key: 'calcio', apiKey: 'calcio', allowDecimals: true, min: 1, max: 15, rangoVerde: [8.4, 9.5], rangoAmarillo: [8.0, 10.0] },
  { label: 'Fosforo (mg/dl)', key: 'fosforo', apiKey: 'fosforo', allowDecimals: true, min: 1, max: 12, rangoVerde: [3.5, 5.5], rangoAmarillo: [3.0, 6.0] },
  { label: 'PTHi (pg/ml)', key: 'pthi', apiKey: 'PTHi', allowDecimals: false, min: 1, max: 5000, rangoVerde: [150, 300], rangoAmarillo: [100, 500] },
  { label: 'Alb (gr/dl)', key: 'alb', apiKey: 'Alb', allowDecimals: true, min: 1, max: 6, rangoVerde: [4.0, 6.0], rangoAmarillo: [3.5, 6.0] },
  { label: 'Calcio corregido (mg/dl)', key: 'calcioCorregido', apiKey: 'calcio_corregido', allowDecimals: true, readonly: true, min: 1, max: 15, rangoVerde: [8.4, 9.5], rangoAmarillo: [8.0, 10.0] },
  { label: 'Kt/v', key: 'kt', apiKey: 'ktv', allowDecimals: true, min: 0.1, max: 3.0, rangoVerde: [1.2, 3.0], rangoAmarillo: [1.0, 3.0] }
]

const campoTiempoDialisis = {
  label: 'Tiempo de diálisis (horas)',
  key: 'tmpDialisis',
  apiKey: 'tiempo_dialisis',
  allowDecimals: true,
  min: TIEMPO_DIALISIS_MIN,
  max: TIEMPO_DIALISIS_MAX,
  rangoVerde: null,
  rangoAmarillo: null,
}

const opcionesTiempoDialisisLista = computed(() => {
  const base = opcionesTiempoDialisis()
  const actual = parseTiempoDialisisNumero(form.value.tmpDialisis)
  if (actual != null && !base.some((v) => Math.abs(v - actual) < 1e-9)) {
    return [...base, actual].sort((a, b) => a - b)
  }
  return base
})

const idResultadoEdicion = ref(null)

function parseNumeroCampo(val) {
  if (val == null || val === '') return null
  const n = Number(String(val).replace(',', '.'))
  return Number.isNaN(n) ? null : n
}

function boolToSelect(val) {
  if (val === true || val === 'true' || val === 1 || val === '1') return '1'
  if (val === false || val === 'false' || val === 0 || val === '0') return '2'
  return ''
}

function tiempoDialisisDesdeRegistro(val) {
  if (val == null || val === '') return ''
  if (typeof val === 'object' && val !== null) {
    const h = val.hour ?? val.hours ?? 0
    const m = val.minute ?? val.minutes ?? 0
    const s = val.second ?? val.seconds ?? 0
    const horas = h + m / 60 + s / 3600
    return String(Math.round(horas * 100) / 100)
  }
  const str = String(val).trim()
  if (/^\d{1,2}:\d{2}(:\d{2})?(\.\d+)?$/.test(str)) {
    const parts = str.split(':')
    const h = parseInt(parts[0], 10) || 0
    const m = parseInt(parts[1], 10) || 0
    const sec = parseFloat(parts[2] || '0') || 0
    const horas = h + m / 60 + sec / 3600
    return String(Math.round(horas * 100) / 100)
  }
  const n = Number(str.replace(',', '.'))
  return Number.isNaN(n) ? '' : String(n)
}

function cargarRegistroEdicion(registro) {
  if (!registro) return
  idResultadoEdicion.value = registro.id_resultado_clinico
  form.value.hb = parseNumeroCampo(registro.Hb ?? registro.hb)
  form.value.calcio = parseNumeroCampo(registro.calcio)
  form.value.fosforo = parseNumeroCampo(registro.fosforo)
  form.value.pthi = parseNumeroCampo(registro.PTHi ?? registro.pthi)
  form.value.alb = parseNumeroCampo(registro.Alb ?? registro.alb)
  form.value.kt = parseNumeroCampo(registro.ktv ?? registro.kt)
  form.value.tmpDialisis = tiempoDialisisDesdeRegistro(registro.tiempo_dialisis)
  // Campo BD: eritoproyetina (sin la segunda 'r')
  form.value.eritropoyetina = boolToSelect(registro.eritoproyetina)
  form.value.hierro = boolToSelect(registro.hierro)
  form.value.hiperparatiroidismo = boolToSelect(registro.calcitriol)
  const calcioN = Number(form.value.calcio)
  const albN = Number(form.value.alb)
  if (calcioN > 0 && albN > 0) {
    form.value.calcioCorregido = Math.round((calcioN + 0.8 * (4 - albN)) * 100) / 100
  } else {
    form.value.calcioCorregido = parseNumeroCampo(registro.calcio_corregido)
  }
}

const historicoResultados = ref([])
const historicoCargando = ref(false)
const historicoCargado = ref(false)
const modalHistorico = ref({
  visible: false,
  campo: null,
  serie: [],
})

const CHART_WIDTH = 400
const CHART_HEIGHT = 220
const CHART_PADDING = { top: 24, right: 16, bottom: 36, left: 36 }

function normalizarArrayRespuesta(res) {
  return Array.isArray(res) ? res : (res?.results || [])
}

function etiquetaPeriodoCorta(periodo) {
  const texto = String(periodo ?? '—')
  if (texto.length <= 8) return texto
  return `${texto.slice(0, 3)}…${texto.slice(-2)}`
}

function parseValorHistorico(raw) {
  if (raw === null || raw === undefined || raw === '') return null
  const n = Number(String(raw).replace(',', '.'))
  return Number.isNaN(n) ? null : n
}

async function cargarHistoricoResultados() {
  if (historicoCargado.value || historicoCargando.value) return

  const idPaciente = paciente?.id_paciente
  if (!idPaciente) {
    historicoCargado.value = true
    return
  }

  historicoCargando.value = true
  try {
    const atencionesRes = await getAllIpress(`/pacienteAtencion/?id_paciente=${encodeURIComponent(idPaciente)}`)
    const atenciones = normalizarArrayRespuesta(atencionesRes)

    const bloques = await Promise.all(
      atenciones.map(async (aten) => {
        const idAten = aten.id_paciente_atencion
        if (!idAten) return []

        try {
          const res = await getAllIpress(`/resultadosClinicos/?id_paciente_atencion=${encodeURIComponent(idAten)}`)
          const filas = normalizarArrayRespuesta(res)
          const periodoLabel = aten.datosPeriodo?.periodo || `Periodo ${aten.id_periodo ?? idAten}`
          const idPeriodo = aten.id_periodo ?? aten.datosPeriodo?.id_periodo ?? 0

          return filas.map((fila) => ({
            ...fila,
            periodoLabel,
            id_periodo: idPeriodo,
            id_paciente_atencion: idAten,
          }))
        } catch {
          return []
        }
      })
    )

    historicoResultados.value = bloques.flat()
    historicoCargado.value = true
  } catch (error) {
    console.error('Error al cargar historial de resultados clínicos:', error)
    historicoResultados.value = []
    historicoCargado.value = true
  } finally {
    historicoCargando.value = false
  }
}

function construirSerieHistorico(campo) {
  const apiKey = campo?.apiKey
  if (!apiKey) return []

  const porPeriodo = new Map()

  for (const reg of historicoResultados.value) {
    const valor = parseValorHistorico(reg[apiKey])
    if (valor === null) continue

    const periodoKey = String(reg.id_periodo ?? reg.periodoLabel ?? reg.id_paciente_atencion)
    const idResultado = Number(reg.id_resultado_clinico) || 0
    const existente = porPeriodo.get(periodoKey)

    if (!existente || idResultado >= existente.idResultado) {
      porPeriodo.set(periodoKey, {
        periodo: reg.periodoLabel || periodoKey,
        periodoOrden: Number(reg.id_periodo) || 0,
        valor,
        idResultado,
      })
    }
  }

  return [...porPeriodo.values()].sort(
    (a, b) => a.periodoOrden - b.periodoOrden || String(a.periodo).localeCompare(String(b.periodo), undefined, { numeric: true })
  )
}

async function abrirHistoricoCampo(campo) {
  modalHistorico.value = {
    visible: true,
    campo,
    serie: [],
  }
  await cargarHistoricoResultados()
  modalHistorico.value.serie = construirSerieHistorico(campo)
}

function cerrarHistorico() {
  modalHistorico.value.visible = false
}

const chartGeom = computed(() => {
  const campo = modalHistorico.value.campo
  const serie = modalHistorico.value.serie || []
  const width = CHART_WIDTH
  const height = CHART_HEIGHT
  const padding = CHART_PADDING
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  if (!serie.length) {
    return {
      width,
      height,
      padding,
      plotW,
      plotH,
      points: [],
      linePath: '',
      yMinLabel: '',
      yMaxLabel: '',
      bandaVerde: null,
    }
  }

  const valores = serie.map((p) => p.valor)
  let yMin = Math.min(...valores)
  let yMax = Math.max(...valores)

  if (campo?.min != null) yMin = Math.min(yMin, campo.min)
  if (campo?.max != null) yMax = Math.max(yMax, campo.max)

  const yPad = (yMax - yMin) * 0.12 || 1
  yMin -= yPad
  yMax += yPad
  const yRango = yMax - yMin || 1

  const valorAY = (valor) => padding.top + plotH - ((valor - yMin) / yRango) * plotH

  const points = serie.map((punto, idx) => {
    const x = padding.left + (serie.length === 1 ? plotW / 2 : (idx / (serie.length - 1)) * plotW)
    const y = valorAY(punto.valor)
    const decimales = campo?.allowDecimals ? 2 : 0
    return {
      x,
      y,
      periodoCorto: etiquetaPeriodoCorta(punto.periodo),
      valorLabel: Number(punto.valor).toFixed(decimales),
    }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  let bandaVerde = null
  if (campo?.rangoVerde) {
    const [rvMin, rvMax] = campo.rangoVerde
    const yTop = valorAY(rvMax)
    const yBottom = valorAY(rvMin)
    bandaVerde = {
      y: yTop,
      h: Math.max(yBottom - yTop, 1),
    }
  }

  return {
    width,
    height,
    padding,
    plotW,
    plotH,
    points,
    linePath,
    yMinLabel: yMin.toFixed(campo?.allowDecimals ? 1 : 0),
    yMaxLabel: yMax.toFixed(campo?.allowDecimals ? 1 : 0),
    bandaVerde,
  }
})

/* CÁLCULO EDAD PACIENTE PARA EL PERFIL */
const edadPaciente = computed(() => {
    if (!paciente?.fecha_nacimiento) return '44 años' // Fallback visual
    const hoy = new Date()
    const nacimiento = new Date(paciente.fecha_nacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }
    return `${edad} años`
})

/* ✅ CALCIO CORREGIDO SOLO SI Ca > 0 y Alb > 0 */
const calcioCorregidoCalculado = computed(() => {
  const calcio = Number(form.value.calcio)
  const alb = Number(form.value.alb)

  if (calcio > 0 && alb > 0) {
    return Math.round((calcio + 0.8 * (4 - alb)) * 100) / 100
  }

  return null
})

watch(calcioCorregidoCalculado, (nuevoValor) => {
  form.value.calcioCorregido = nuevoValor
})

/* VALIDACIONES NUMÉRICAS */
function bloquearDecimal(e) {
  if (['.', ',', 'e', '-'].includes(e.key)) e.preventDefault()
}
function permitirDecimal(e) {
  if ([',', 'e', '-'].includes(e.key)) e.preventDefault()
}

// Validar si un campo está fuera del rango maestro (errores de digitación)
const validarCampo = (campo) => {
  const valor = form.value[campo.key]
  if (valor === null || valor === undefined || valor === '') return false
  
  const numValor = Number(valor)
  if (isNaN(numValor)) return false
  
  if (campo.min !== undefined && numValor < campo.min) return true
  if (campo.max !== undefined && numValor > campo.max) return true
  
  return false
}

// Validar y ajustar el rango cuando el usuario sale del campo (blur)
const validarRango = (campo) => {
  const valor = form.value[campo.key]
  if (valor === null || valor === undefined || valor === '') return
  
  const numValor = Number(valor)
  if (isNaN(numValor)) {
    form.value[campo.key] = null
    return
  }
  
  // Ajustar al mínimo si es menor
  if (campo.min !== undefined && numValor < campo.min) {
    form.value[campo.key] = campo.min
    return
  }
  
  // Ajustar al máximo si es mayor
  if (campo.max !== undefined && numValor > campo.max) {
    form.value[campo.key] = campo.max
    return
  }
}

/* SISTEMA SEMAFÓRICO */
const obtenerColorSemaforo = (campo) => {
  const valor = form.value[campo.key];
  
  // Si está vacío, semáforo apagado (gris)
  if (valor === null || valor === undefined || valor === '') {
    return 'bg-gray-200';
  }

  const num = Number(valor);

  // Si rompe las reglas maestras (digitación errónea), se pone ROJO directo
  if (num < campo.min || num > campo.max) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';

  // Validar Verde (Rango ideal)
  if (campo.rangoVerde && num >= campo.rangoVerde[0] && num <= campo.rangoVerde[1]) {
    return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  }

  // Validar Amarillo (Rango de precaución)
  if (campo.rangoAmarillo && num >= campo.rangoAmarillo[0] && num <= campo.rangoAmarillo[1]) {
    return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]';
  }

  // Si no está ni en verde ni en amarillo, pero es válido, es Rojo clínico
  return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
};

/* DATA */
const fetchPeriodo = async () => {
  const res = await getAllIpress('/periodos/')
  periodos.value = Array.isArray(res) ? res : (res?.results || [])
}

const fetchClinicas = async () => {
  try {
    const res = await getAllIpress('/ipress/')
    clinicas.value = Array.isArray(res) ? res : (res?.results || [])
  } catch (e) {
    console.error('Error al cargar IPRESS:', e)
    clinicas.value = []
  }
}

const errorTiempoDialisis = ref(false)
const erroresTratamiento = ref({
  eritropoyetina: false,
  hierro: false,
  hiperparatiroidismo: false,
})

function tratamientoSeleccionado(val) {
  return val === '1' || val === '2'
}

function validarTratamientoObligatorio() {
  erroresTratamiento.value = {
    eritropoyetina: !tratamientoSeleccionado(form.value.eritropoyetina),
    hierro: !tratamientoSeleccionado(form.value.hierro),
    hiperparatiroidismo: !tratamientoSeleccionado(form.value.hiperparatiroidismo),
  }
  return !Object.values(erroresTratamiento.value).some(Boolean)
}

function tiempoDialisisHorasValido() {
  return esTiempoDialisisValorValido(form.value.tmpDialisis)
}

function tiempoDialisisPayloadString() {
  const n = parseTiempoDialisisNumero(form.value.tmpDialisis)
  return n == null ? '' : String(n)
}

const postForm = async () => {
  const camposInvalidos = camposResultados.filter(campo => {
    if (campo.readonly) return false
    return validarCampo(campo)
  })
  
  if (camposInvalidos.length > 0) {
    const nombresInvalidos = camposInvalidos.map(c => c.label).join(', ')
    await Swal.fire({
      title: 'Campos fuera de rango',
      html: `Por favor corrija los siguientes campos que están fuera del rango válido:<br><strong>${nombresInvalidos}</strong>`,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#008f9c',
    })
    return
  }

  if (!tiempoDialisisHorasValido()) {
    errorTiempoDialisis.value = true
    await Swal.fire({
      title: 'Tiempo de diálisis requerido',
      text: MENSAJE_TIEMPO_DIALISIS_INVALIDO,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#008f9c',
    })
    return
  }
  errorTiempoDialisis.value = false

  if (!validarTratamientoObligatorio()) {
    await Swal.fire({
      title: 'Tratamiento incompleto',
      text: 'Complete el tratamiento administrado: Eritropoyetina, Hierro y Calcitriol (Sí o No).',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#008f9c',
    })
    return
  }
  
  try {
    let payload
    if (idPacienteAtencion != null && idPacienteAtencion !== '') {
      payload = {
        id_paciente_atencion: Number(idPacienteAtencion),
        Hb: form.value.hb != null && form.value.hb !== '' ? String(form.value.hb) : '',
        calcio: form.value.calcio != null && form.value.calcio !== '' ? String(form.value.calcio) : '',
        fosforo: form.value.fosforo != null && form.value.fosforo !== '' ? String(form.value.fosforo) : '',
        PTHi: form.value.pthi != null && form.value.pthi !== '' ? String(form.value.pthi) : '',
        Alb: form.value.alb != null && form.value.alb !== '' ? String(form.value.alb) : '',
        calcio_corregido: form.value.calcioCorregido != null && form.value.calcioCorregido !== '' ? String(form.value.calcioCorregido) : '',
        ktv: form.value.kt != null && form.value.kt !== '' ? String(form.value.kt) : '',
        tiempo_dialisis: tiempoDialisisPayloadString(),
        eritoproyetina: form.value.eritropoyetina === 1 || form.value.eritropoyetina === '1',
        hierro: form.value.hierro === 1 || form.value.hierro === '1',
        calcitriol: form.value.hiperparatiroidismo === 1 || form.value.hiperparatiroidismo === '1'
      }
      if (idResultadoEdicion.value != null) {
        if (props.modoSupervisor) {
          await guardarComoSupervisor('resultadosClinicos', idResultadoEdicion.value, payload)
        } else {
          await patchAllIpress(`/resultadosClinicos/${idResultadoEdicion.value}/`, payload)
        }
        emit('guardado')
        return
      }
    } else {
      payload = form.value
    }
    await postAllIpress("/resultadosClinicos/", payload)
    if (idPacienteAtencion != null && idPacienteAtencion !== '') {
      emit('guardado')
      return
    }
    await Swal.fire({
      title: 'Registro guardado',
      text: 'Se registró con éxito.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#008f9c',
    })
    window.location.reload()
  } catch (error) {
    console.error('Error al registrar:', error)
    const mensaje = error?.error || error?.response?.data?.detail || error?.message
    await Swal.fire({
      title: 'Error al registrar',
      text: typeof mensaje === 'string' ? mensaje : 'Error al registrar los resultados clínicos.',
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#008f9c',
    })
  }
}

onMounted(async () => {
  await Promise.all([fetchPeriodo(), fetchClinicas()])
  if (props.registroEdicion) {
    cargarRegistroEdicion(props.registroEdicion)
  }
})
</script>

<style scoped>
.form5-info-box {
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: #334155;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
}

.form5-shell input.form5-control,
.form5-shell select.form5-control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  min-height: 2.375rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1e293b;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form5-shell input.form5-control:focus,
.form5-shell select.form5-control:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgb(6 182 212 / 0.2);
}

.form5-shell input.form5-control--readonly {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.form5-shell input.form5-control--error {
  border-color: #f87171;
  background-color: #fef2f2;
}

.form5-shell input.form5-control--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.15);
}

.form5-shell select.form5-control {
  cursor: pointer;
  appearance: auto;
}

.form5-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.form5-btn--secondary {
  color: #334155;
  background-color: #ffffff;
  border-color: #cbd5e1;
}

.form5-btn--secondary:hover {
  background-color: #f8fafc;
}

.form5-btn--primary {
  color: #ffffff;
  background-color: #2563eb;
  border-color: #2563eb;
}

.form5-btn--primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.form5-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.375rem;
  color: #0891b2;
  background-color: #ffffff;
  border: 1px solid #a5f3fc;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.form5-btn-icon:hover {
  background-color: #ecfeff;
}
</style>