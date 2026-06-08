<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">

    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-x-8 gap-y-4">
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Periodo de Reporte:</span>
        <select v-model="periodoSeleccionado" class="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-gray-600 font-medium outline-none" disabled>
          <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Clínica:</span>
        <span class="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 text-gray-600 font-medium">{{ paciente.ipress }}</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Modalidad de Diálisis:</span>
        <span class="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 text-gray-600 font-medium">{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodiálisis" : "Peritoneal" }}</span>
      </div>
    </div>

    <div class="border-l-4 border-cyan-600 pl-3 my-6">
      <h2 class="text-xl font-bold text-gray-800">Resultados Clínicos</h2>
      <p class="text-sm text-gray-500">Complete la información médica del paciente</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
      
      <div class="flex-1 w-full space-y-6">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="campo in camposResultados" :key="campo.key">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {{ campo.label }}
              </label>

              <div class="flex items-center gap-3">
                <input
                  v-model.number="form[campo.key]"
                  type="number"
                  :min="campo.min"
                  :max="campo.max"
                  :step="campo.allowDecimals ? '0.01' : '1'"
                  class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  :readonly="campo.readonly"
                  :class="{ 
                    'bg-gray-100 text-gray-600 cursor-not-allowed': campo.readonly, 
                    'border-red-500 bg-red-50': validarCampo(campo),
                    'bg-white': !campo.readonly && !validarCampo(campo)
                  }"
                  @keydown="campo.allowDecimals ? permitirDecimal($event) : bloquearDecimal($event)"
                  @blur="validarRango(campo)"
                  :title="campo.min !== undefined && campo.max !== undefined ? `Rango válido: ${campo.min} - ${campo.max}` : ''"
                />
                
                <div
                  class="w-5 h-5 rounded-full border border-gray-200 shadow-inner flex-shrink-0 transition-colors duration-300"
                  :class="obtenerColorSemaforo(campo)"
                ></div>

                <button
                  type="button"
                  class="p-1.5 rounded-md border border-cyan-200 text-cyan-600 hover:bg-cyan-50 transition-colors flex-shrink-0"
                  title="Ver historial del paciente"
                  @click="abrirHistoricoCampo(campo)"
                >
                  <ChartBarIcon class="w-4 h-4" />
                </button>
              </div>

              <p v-if="validarCampo(campo)" class="text-xs text-red-500 mt-1.5 font-medium">
                El valor debe estar entre {{ campo.min }} y {{ campo.max }}
              </p>
            </div>
          </div>

          <hr class="border-gray-100 my-4" />

          <div class="space-y-1 w-full md:w-1/2 pr-3">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tiempo de diálisis (horas)</label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.tmpDialisis"
                type="number"
                min="0.25"
                max="8"
                step="any"
                inputmode="decimal"
                placeholder="Ej. 2, 2.5, 3.25"
                class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white"
              />
              <button
                type="button"
                class="p-1.5 rounded-md border border-cyan-200 text-cyan-600 hover:bg-cyan-50 transition-colors flex-shrink-0"
                title="Ver historial del paciente"
                @click="abrirHistoricoCampo(campoTiempoDialisis)"
              >
                <ChartBarIcon class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-gray-400">Ingrese el valor en horas (número entero o decimal, entre 0,25 y 8).</p>
          </div>

          <h3 class="text-lg font-bold text-gray-800 mt-8 mb-4">Tratamiento Administrado</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Eritropoyetina</label>
              <select v-model="form.eritropoyetina" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hierro</label>
              <select v-model="form.hierro" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Calcitriol</label>
              <select v-model="form.hiperparatiroidismo" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button @click="$emit('cancelar')" class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Cancelar
            </button>
            <button @click="postForm" class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Registrar
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
import { ref, computed, watch, onMounted } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

const { paciente, periodo, idPacienteAtencion } = defineProps({
  paciente: { type: Object, required: true },
  periodo: { type: Number, default: null },
  idPacienteAtencion: { type: [Number, String], default: null }
})

const emit = defineEmits(['cancelar', 'guardado'])

const pacienteSeleccionado = ref(paciente)
const periodoSeleccionado = ref(periodo)
const periodos = ref([])

const form = ref({
  tmpDialisis: '',
  eritropoyetina: null,
  hierro: null,
  hiperparatiroidismo: null,
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
  min: 0.25,
  max: 8,
  rangoVerde: null,
  rangoAmarillo: null,
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
  periodos.value = await getAllIpress("/periodos/")
}

const TIEMPO_DIALISIS_MIN = 0.25
const TIEMPO_DIALISIS_MAX = 8

function tiempoDialisisHorasValido() {
  const raw = form.value.tmpDialisis
  if (raw === null || raw === '') return false
  const n = Number(String(raw).replace(',', '.'))
  if (Number.isNaN(n)) return false
  return n >= TIEMPO_DIALISIS_MIN && n <= TIEMPO_DIALISIS_MAX
}

function tiempoDialisisPayloadString() {
  const raw = form.value.tmpDialisis
  if (raw === null || raw === '') return ''
  const n = Number(String(raw).replace(',', '.'))
  if (Number.isNaN(n)) return ''
  return String(n)
}

const postForm = async () => {
  const camposInvalidos = camposResultados.filter(campo => {
    if (campo.readonly) return false
    return validarCampo(campo)
  })
  
  if (camposInvalidos.length > 0) {
    const nombresInvalidos = camposInvalidos.map(c => c.label).join(', ')
    alert(`Por favor corrija los siguientes campos que están fuera del rango válido:\n${nombresInvalidos}`)
    return
  }

  if (!tiempoDialisisHorasValido()) {
    alert(`Indique el tiempo de diálisis en horas (número entre ${TIEMPO_DIALISIS_MIN} y ${TIEMPO_DIALISIS_MAX}).`)
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
    } else {
      payload = form.value
    }
    await postAllIpress("/resultadosClinicos/", payload)
    if (idPacienteAtencion != null && idPacienteAtencion !== '') {
      emit('guardado')
      return
    }
    alert("Se registró con éxito")
    window.location.reload()
  } catch (error) {
    console.error('Error al registrar:', error)
    alert("Error al registrar los resultados clínicos")
  }
}

onMounted(fetchPeriodo)
</script>