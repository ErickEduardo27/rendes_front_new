<template>
  <header class="sticky top-0 z-50 w-full flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-cyan-200 shadow-sm">
    <div class="flex flex-wrap items-center gap-3 min-w-0">
      <Bars3Icon class="icons-arrow-left w-6 h-6 shrink-0 text-cyan-600 cursor-pointer" @click="$emit('toggle-sidebar')" />
      <SelectorPeriodo
        v-if="mostrarSelectorPeriodo"
        v-model:periodo="periodo"
        v-model:clinica="clinica"
        v-model:modalidad="modalidad"
        @change="onSelectorChange"
      />
      <NumeroAtencionesNav
        v-if="mostrarSelectorPeriodo && mostrarNumeroAtenciones"
        :periodo="periodo"
        :clinica="clinica"
        :modalidad="modalidad"
      />
      <div v-else class="min-w-0">
        <!-- <h1 class="text-sm sm:text-base font-bold text-cyan-800 truncate">Panel de supervisión</h1>
        <p class="text-[11px] text-slate-500 hidden sm:block">Resumen de clínicas asignadas</p> -->
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="mostrarBotonNotificar"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shrink-0 transition-colors"
        :class="clasesBotonNotificar"
        :title="tituloBotonNotificar"
        :disabled="!botonNotificarClickeable"
        @click="onClickNotificar"
      >
        {{ etiquetaBotonNotificar }}
      </button>
      <button
        v-if="mostrarBotonAccionesSupervisor"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-amber-900 shrink-0 hover:bg-amber-100 transition-colors"
        title="Ver observaciones y correcciones del supervisor"
        @click="abrirModalAccionesSupervisor"
      >
        Acciones supervisor
        <span
          v-if="totalAccionesSupervisor > 0"
          class="inline-flex min-w-[1.25rem] h-5 px-1 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white"
        >
          {{ totalAccionesSupervisor > 99 ? '99+' : totalAccionesSupervisor }}
        </span>
      </button>
      <router-link
        to="/notificaciones"
        class="relative inline-flex p-1 rounded-lg hover:bg-cyan-50 transition-colors"
        aria-label="Notificaciones"
      >
        <BellIcon class="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
        <span
          v-if="noLeidas > 0"
          class="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
        >
          {{ noLeidas > 99 ? '99+' : noLeidas }}
        </span>
      </router-link>
      <div class="relative">
        <div
          class="w-10 h-10 rounded-full bg-gray-200 cursor-pointer"
          @click="showMenu = !showMenu"
          aria-haspopup="true"
          :aria-expanded="showMenu"
        />
        <div
          v-if="showMenu"
          ref="menuRef"
          class="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md py-1 z-[60] border border-gray-200"
        >
          <button type="button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-100"
            @click="goToSettings">
            ⚙️ Settings
          </button>
          <button type="button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
            @click="logout">
            🚪 Salir
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="modalNotificarAbierto"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="cerrarModalNotificar"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-cyan-50/80">
          <h2 class="text-base font-bold text-slate-800">Notificar envío a revisión</h2>
          <button type="button" class="text-slate-500 hover:text-slate-800 text-lg leading-none" aria-label="Cerrar" @click="cerrarModalNotificar">✕</button>
        </div>
        <div class="p-5 space-y-4 max-h-[min(80vh,36rem)] overflow-y-auto">
          <p v-if="!filtroSelectorListo" class="text-sm text-amber-700">Seleccione periodo, clínica y modalidad en la barra superior.</p>
          <template v-else>
            <p class="text-sm text-slate-600">Registros cargados según el filtro actual:</p>
            <div v-if="cargandoStats" class="text-sm text-slate-500 py-4 text-center">Cargando conteos…</div>
            <div v-else class="space-y-3 text-xs text-slate-600 border border-slate-100 rounded-lg p-3 bg-slate-50/80">
              <div class="flex justify-between">
                <span>N° de sesiones del mes</span>
                <span
                  class="font-semibold"
                  :class="tieneNumeroAtenciones ? 'text-slate-800' : 'text-rose-700'"
                >{{ etiquetaNumeroAtenciones }}</span>
              </div>
              <div
                v-if="esPerfilClinicaUsuario && !tieneNumeroAtenciones"
                class="text-[11px] text-rose-700"
              >
                Registre el N° de sesiones del mes a notificar.
              </div>

              <p class="font-semibold text-slate-500 uppercase tracking-wide text-[10px] pt-1">Pacientes atendidos — condición inicial</p>
              <p class="text-[11px] text-slate-400 -mt-1">Condición con la que el paciente ingresó al mes y clínica.</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                <div class="flex justify-between col-span-2"><span>Total</span><span class="font-semibold text-slate-800">{{ statsModal.inicial?.total ?? 0 }}</span></div>
                <div class="flex justify-between"><span>Nuevos</span><span class="font-semibold text-slate-800">{{ statsModal.inicial?.nuevos ?? 0 }}</span></div>
                <div class="flex justify-between"><span>Reingresos</span><span class="font-semibold text-slate-800">{{ statsModal.inicial?.reingresos ?? 0 }}</span></div>
                <div class="flex justify-between"><span>Continuadores</span><span class="font-semibold text-slate-800">{{ statsModal.inicial?.continuadores ?? 0 }}</span></div>
                <div class="flex justify-between"><span>Egresos</span><span class="font-semibold text-slate-800">{{ statsModal.inicial?.egresados ?? 0 }}</span></div>
              </div>

              <p class="font-semibold text-slate-500 uppercase tracking-wide text-[10px] pt-2 border-t border-slate-200/80">Pacientes atendidos — condición final</p>
              <p class="text-[11px] text-slate-400 -mt-1">Última condición registrada del paciente en el periodo.</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                <div class="flex justify-between col-span-2"><span>Total</span><span class="font-semibold text-slate-800">{{ totalPacientesResumen }}</span></div>
                <div class="flex justify-between"><span>Nuevos</span><span class="font-semibold text-slate-800">{{ statsModal.final?.nuevos ?? statsModal.nuevos }}</span></div>
                <div class="flex justify-between"><span>Reingresos</span><span class="font-semibold text-slate-800">{{ statsModal.final?.reingresos ?? statsModal.reingresos }}</span></div>
                <div class="flex justify-between"><span>Continuadores</span><span class="font-semibold text-slate-800">{{ statsModal.final?.continuadores ?? statsModal.continuadores }}</span></div>
                <div class="flex justify-between"><span>Egresos</span><span class="font-semibold text-slate-800">{{ statsModal.final?.egresados ?? statsModal.egresados }}</span></div>
              </div>

              <p class="font-semibold text-slate-500 uppercase tracking-wide text-[10px] pt-2 border-t border-slate-200/80">Registros por formulario</p>
              <div class="grid grid-cols-1 gap-y-1">
                <div class="flex justify-between"><span>Cambio Acceso Vascular</span><span class="font-semibold text-slate-800">{{ statsModal.totalUnidades }}</span></div>
                <div class="flex justify-between"><span>Infecciones</span><span class="font-semibold text-slate-800">{{ statsModal.totalEventos }}</span></div>
                <div class="flex justify-between"><span>Morbilidad Hosp.</span><span class="font-semibold text-slate-800">{{ statsModal.totalMorbilidades }}</span></div>
                <div class="flex justify-between">
                  <span>Resultados clínicos (registros)</span>
                  <span
                    class="font-semibold"
                    :class="resultadosClinicosOk ? 'text-slate-800' : 'text-rose-700'"
                  >{{ statsModal.totalResultadosRegistrados }}</span>
                </div>
                <div
                  v-if="esPerfilClinicaUsuario && !resultadosClinicosOk"
                  class="text-[11px] text-rose-700"
                >
                  Debe haber un registro de resultados clínicos por cada paciente atendido, incluidos egresos ({{ statsModal.totalPacientesAtendidos }} paciente(s) / {{ statsModal.totalResultadosRegistrados }} registro(s)).
                </div>
                <div class="flex justify-between"><span>Calidad de agua</span><span class="font-semibold text-slate-800">{{ statsModal.totalCalidadAgua }}</span></div>
              </div>
            </div>
            <p
              v-if="mensajeBloqueoNotificacion"
              class="text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"
            >
              {{ mensajeBloqueoNotificacion }}
            </p>
            <p class="text-sm text-slate-700">
              ¿Desea <strong>notificar al equipo de revisión</strong> que estos datos están listos para ser evaluados?
            </p>
          </template>
        </div>
        <div class="px-5 py-3 border-t border-slate-100 flex flex-wrap justify-end gap-2 bg-slate-50">
          <button type="button" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalNotificar">Cancelar</button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:opacity-50"
            :disabled="!filtroSelectorListo || enviandoNotificacion || periodoConforme || estadoNotificacionRevision.estado === 'NOTIFICADO' || (esPerfilClinicaUsuario && !statsModal.puedeNotificarClinica)"
            @click="confirmarNotificacion"
          >{{ enviandoNotificacion ? 'Enviando…' : (periodoConforme ? 'Conforme' : 'Sí, notificar') }}</button>
        </div>
      </div>
    </div>

    <div
      v-if="modalAccionesSupervisorAbierto"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="cerrarModalAccionesSupervisor"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-amber-50/80 shrink-0">
          <div>
            <h2 class="text-base font-bold text-slate-800">Acciones del supervisor</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Observaciones y correcciones del periodo, clínica y modalidad actuales.
            </p>
          </div>
          <button
            type="button"
            class="text-slate-500 hover:text-slate-800 text-lg leading-none"
            aria-label="Cerrar"
            @click="cerrarModalAccionesSupervisor"
          >✕</button>
        </div>
        <div class="p-5 overflow-auto flex-1">
          <p v-if="!filtroSelectorListo" class="text-sm text-amber-700">Seleccione periodo, clínica y modalidad en la barra superior.</p>
          <div v-else-if="cargandoAccionesSupervisor" class="py-10 text-center text-sm text-slate-500">Cargando acciones…</div>
          <div v-else-if="!accionesSupervisor.length" class="py-10 text-center text-sm text-slate-500">
            No hay observaciones ni ediciones del supervisor para este filtro.
          </div>
          <div v-else class="overflow-x-auto border border-slate-100 rounded-lg">
            <table class="w-full text-xs">
              <thead class="bg-slate-50 border-b">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Fecha</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Acción</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Formulario</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Paciente</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(item, idx) in accionesSupervisor"
                  :key="`${item.tipo}-${item.id_registro || idx}-${item.creado_en || idx}`"
                  class="hover:bg-slate-50/80"
                >
                  <td class="px-3 py-2 whitespace-nowrap text-slate-800 tabular-nums">
                    {{ formatFechaAccionSupervisor(item.creado_en) }}
                  </td>
                  <td class="px-3 py-2">
                    <span
                      class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                      :class="claseTipoAccionSupervisor(item.tipo)"
                    >
                      {{ item.tipo_label || item.tipo }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-slate-700">{{ item.formulario || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">
                    <span class="font-medium">{{ item.paciente || '—' }}</span>
                    <span v-if="item.documento && item.documento !== '—'" class="block text-[10px] text-slate-500">
                      {{ item.documento }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-slate-600 max-w-sm whitespace-pre-wrap break-words">
                    {{ item.comentario || item.mensaje || '—' }}
                    <span v-if="item.usuario_nombre" class="block mt-1 text-[10px] text-slate-400">
                      Por: {{ item.usuario_nombre }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50 shrink-0">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
            @click="cerrarModalAccionesSupervisor"
          >Cerrar</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { BellIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service'
import { obtenerEstadisticasRegistrosFormularios } from '@/utils/estadisticasRegistrosFormularios'
import {
  mensajeBloqueoNotificacionClinica,
  tieneNumeroAtencionesRegistrado,
  MENSAJE_BLOQUEO_SIN_NUMERO_ATENCIONES,
} from '@/utils/resultadosClinicosNotificacion'
import { ElMessage } from 'element-plus'
import { useAuthStore } from "@/store/auth";
import router from "@/router/index";
import { toast } from 'vue-sonner'
import { TokenService } from '@/services/api/token.service'
import SelectorPeriodo from '@/components/SelectorPeriodo.vue'
import NumeroAtencionesNav from '@/components/navbar/NumeroAtencionesNav.vue'
import { esSupervisor, debeLimitarClinicasAlUsuario, esPerfilClinica } from '@/utils/perfil'
import { setEstadoRevisionShared } from '@/composables/useBloqueoNotificacionRevision'
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat'

const props = defineProps({
  periodo: { type: [Number, String], default: null },
  clinica: { type: [Number, String], default: null },
  modalidad: { type: [Number, String], default: null },
})

const emit = defineEmits(['toggle-sidebar', 'update:periodo', 'update:clinica', 'update:modalidad', 'change'])

const periodo = ref(props.periodo)
const clinica = ref(props.clinica)
const modalidad = ref(props.modalidad)

watch(() => props.periodo, (v) => { periodo.value = v })
watch(() => props.clinica, (v) => { clinica.value = v })
watch(() => props.modalidad, (v) => { modalidad.value = v })

watch(periodo, (v) => emit('update:periodo', v))
watch(clinica, (v) => emit('update:clinica', v))
watch(modalidad, (v) => emit('update:modalidad', v))

const onSelectorChange = (payload) => {
  emit('change', payload)
}

const authStore = useAuthStore()
const showMenu = ref(false)
const route = useRoute()

/** En Inicio el supervisor usa su panel propio; en el resto de rutas conserva periodo/clínica/modalidad. */
const mostrarSelectorPeriodo = computed(() => {
  if (esSupervisor() && route.name === 'Inicio') return false
  return true
})

const mostrarNumeroAtenciones = computed(() => esPerfilClinicaUsuario.value)
const noLeidas = ref(0)
let pollTimer = null

const modalNotificarAbierto = ref(false)
const modalAccionesSupervisorAbierto = ref(false)
const cargandoStats = ref(false)
const cargandoEstadoRevision = ref(false)
const cargandoAccionesSupervisor = ref(false)
const enviandoNotificacion = ref(false)
const accionesSupervisor = ref([])
const estadoNotificacionRevision = ref({
  notificado: false,
  notificado_en: null,
  usuario_nombre: null,
  estado: 'POR_NOTIFICAR',
  requiere_renotificacion: false,
  ya_dio_conformidad: false,
  conformidad_en: null,
  conformidad_usuario_nombre: null,
})

const periodoConforme = computed(() => Boolean(estadoNotificacionRevision.value.ya_dio_conformidad))
const statsModal = ref({
  totalUnidades: 0,
  totalEventos: 0,
  totalMorbilidades: 0,
  totalResultados: 0,
  totalCalidadAgua: 0,
  totalPacientesAtendidos: 0,
  nuevos: 0,
  reingresos: 0,
  continuadores: 0,
  egresados: 0,
  numeroAtenciones: null,
  totalResultadosRegistrados: 0,
  totalResultadosCompletos: 0,
  puedeNotificarClinica: false,
  inicial: { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 },
  final: { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 },
})

const esPerfilClinicaUsuario = computed(() => esPerfilClinica())

const etiquetaNumeroAtenciones = computed(() => {
  const n = statsModal.value.numeroAtenciones
  if (n == null || Number.isNaN(n)) return 'Sin registrar'
  return n
})

const tieneNumeroAtenciones = computed(() =>
  tieneNumeroAtencionesRegistrado(statsModal.value.numeroAtenciones),
)

const totalPacientesResumen = computed(() => {
  const f = statsModal.value.final
  if (f && typeof f === 'object') {
    const t = Number(f.total || 0)
    if (t > 0) return t
    return (
      Number(f.nuevos || 0)
      + Number(f.reingresos || 0)
      + Number(f.continuadores || 0)
      + Number(f.egresados || 0)
    )
  }
  return (
    Number(statsModal.value.nuevos || 0)
    + Number(statsModal.value.reingresos || 0)
    + Number(statsModal.value.continuadores || 0)
    + Number(statsModal.value.egresados || 0)
  )
})

const resultadosClinicosOk = computed(() => {
  const total = Number(statsModal.value.totalPacientesAtendidos || 0)
  const regs = Number(statsModal.value.totalResultadosRegistrados || 0)
  return total > 0 && total === regs
})

const mensajeBloqueoNotificacion = computed(() => {
  if (!esPerfilClinicaUsuario.value || statsModal.value.puedeNotificarClinica) return ''
  if (!tieneNumeroAtenciones.value) {
    return MENSAJE_BLOQUEO_SIN_NUMERO_ATENCIONES
  }
  return mensajeBloqueoNotificacionClinica(
    statsModal.value.totalPacientesAtendidos,
    statsModal.value.totalResultadosRegistrados,
  ) || 'Complete los requisitos antes de notificar.'
})

const botonNotificarHabilitado = computed(() => {
  if (!filtroSelectorListo.value || cargandoStats.value || cargandoEstadoRevision.value) return false
  if (periodoConforme.value) return false
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') return false
  if (esPerfilClinicaUsuario.value && !statsModal.value.puedeNotificarClinica) return false
  return true
})

const botonNotificarClickeable = computed(() => {
  if (!filtroSelectorListo.value || cargandoEstadoRevision.value) return false
  if (periodoConforme.value) return false
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') return false
  return true
})

const etiquetaBotonNotificar = computed(() => {
  if (!filtroSelectorListo.value || cargandoEstadoRevision.value) return 'Por notificar'
  if (periodoConforme.value) return 'Conforme'
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') return 'Notificado'
  if (estadoNotificacionRevision.value.requiere_renotificacion) return 'Por notificar'
  return 'Por notificar'
})

const clasesBotonNotificar = computed(() => {
  if (!filtroSelectorListo.value || cargandoEstadoRevision.value) {
    return 'border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed'
  }
  if (periodoConforme.value) {
    return 'border-emerald-400 bg-emerald-100 text-emerald-900 cursor-not-allowed'
  }
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
  }
  if (botonNotificarHabilitado.value) {
    return 'border-cyan-600 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
  }
  return 'border-amber-300 bg-amber-50 text-amber-800 cursor-not-allowed'
})

const tituloBotonNotificar = computed(() => {
  if (!filtroSelectorListo.value) return 'Seleccione periodo, clínica y modalidad'
  if (periodoConforme.value) {
    const fecha = estadoNotificacionRevision.value.conformidad_en
    const quien = estadoNotificacionRevision.value.conformidad_usuario_nombre
    let t = 'Ya se registró la conformidad para este periodo, clínica y modalidad. No puede volver a notificar.'
    if (fecha) t += ` ${new Date(fecha).toLocaleString('es-PE')}.`
    if (quien) t += ` Por: ${quien}.`
    return t
  }
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') {
    const fecha = estadoNotificacionRevision.value.notificado_en
    const quien = estadoNotificacionRevision.value.usuario_nombre
    let t = 'Ya notificó el envío a revisión.'
    if (fecha) t += ` ${new Date(fecha).toLocaleString('es-PE')}.`
    if (quien) t += ` Por: ${quien}.`
    t += ' Espere la observación del supervisor para volver a editar y notificar.'
    return t
  }
  if (estadoNotificacionRevision.value.requiere_renotificacion) {
    return 'El supervisor realizó correcciones. Revise los registros y vuelva a notificar.'
  }
  if (esPerfilClinicaUsuario.value && !statsModal.value.puedeNotificarClinica) {
    return 'Revise los requisitos antes de notificar (pase el cursor sobre el botón o ábralo para ver el detalle).'
  }
  return 'Notificar envío a revisión'
})

/**
 * Perfil clínica/hospital: botón visible en todas las pantallas (salvo Evaluación).
 * Supervisor/admin: solo en rutas de registros o con meta mostrarNotificarRegistros.
 */
const RUTAS_NOTIFICAR_REGISTROS = new Set([
  'AccesoVascular',
  'EventosInfecciosos',
  'MorbilidadHospitalaria',
  'ResultadosClinicos',
  'Vacunacion',
])

const mostrarBotonNotificar = computed(() => {
  if (route.name === 'Evaluacion') return false
  if (esPerfilClinicaUsuario.value) return true
  if (RUTAS_NOTIFICAR_REGISTROS.has(route.name)) return true
  if (
    route.name === 'Inicio' &&
    debeLimitarClinicasAlUsuario() &&
    !esSupervisor()
  ) {
    return true
  }
  return route.matched.some((r) => r.meta?.mostrarNotificarRegistros === true)
})

const totalAccionesSupervisor = computed(() => accionesSupervisor.value.length)

const filtroSelectorListo = computed(() => {
  return (
    periodo.value != null && periodo.value !== '' &&
    clinica.value != null && clinica.value !== '' &&
    modalidad.value != null && modalidad.value !== ''
  )
})

const mostrarBotonAccionesSupervisor = computed(() => {
  if (!mostrarBotonNotificar.value || !filtroSelectorListo.value) return false
  if (estadoNotificacionRevision.value.requiere_renotificacion) return true
  return totalAccionesSupervisor.value > 0
})

function claseTipoAccionSupervisor(tipo) {
  if (tipo === 'OBSERVADO' || tipo === 'OBSERVACION_ENVIO') return 'bg-amber-100 text-amber-900'
  if (tipo === 'EDICION_SUPERVISOR') return 'bg-violet-100 text-violet-900'
  return 'bg-slate-100 text-slate-700'
}

function formatFechaAccionSupervisor(iso) {
  return formatFechaHoraDDMMAAAA(iso) || '—'
}

async function cargarAccionesSupervisorDesdeModulos() {
  const params = new URLSearchParams({
    id_periodo: String(periodo.value),
    id_ipress: String(clinica.value),
    id_modalidad: String(modalidad.value),
  })
  const qs = params.toString()
  const endpoints = [
    { path: 'unidadesActuales', idKey: 'id_unidad_actual', form: 'Acceso vascular' },
    { path: 'eventosAccesosVasculares', idKey: 'id_evento_acceso_vascular', form: 'Eventos infecciosos' },
    { path: 'morbilidadesHospitalarias', idKey: 'id_morbilidad_hospitalaria', form: 'Morbilidad hospitalaria' },
    { path: 'resultadosClinicos', idKey: 'id_resultado_clinico', form: 'Resultados clínicos' },
    { path: 'vacunaciones', idKey: 'id_vacunacion', form: 'Vacunación' },
  ]
  const items = []
  const responses = await Promise.all(
    endpoints.map((ep) => getAllIpress(`/${ep.path}/?${qs}`).catch(() => [])),
  )
  responses.forEach((res, i) => {
    const ep = endpoints[i]
    const lista = Array.isArray(res) ? res : (res?.results || [])
    for (const r of lista) {
      const estado = String(r?.estado_aprobacion || '').toUpperCase()
      const editado = !!r?.supervisor_edito_registro
      if (estado !== 'OBSERVADO' && !editado) continue
      const paciente = r?.datosPaciente?.paciente
        || r?.datosPacienteAtencion?.datosPaciente?.paciente
        || '—'
      const documento = r?.datosPaciente?.documento
        || r?.datosPacienteAtencion?.datosPaciente?.documento
        || '—'
      const comentario = String(r?.comentario_evaluacion || '').trim()
      items.push({
        tipo: estado === 'OBSERVADO' ? 'OBSERVADO' : 'EDICION_SUPERVISOR',
        tipo_label: estado === 'OBSERVADO' ? 'Registro observado' : 'Registro editado por supervisor',
        formulario: ep.form,
        paciente,
        documento,
        comentario,
        mensaje: comentario || (estado === 'OBSERVADO' ? 'Registro observado' : 'Registro editado por supervisor'),
        id_registro: r?.[ep.idKey] ?? null,
        usuario_nombre: r?.datosEvaluadoPor?.nombre || r?.datosEvaluadoPor?.usuario || null,
        creado_en: r?.fecha_edicion_supervisor || r?.fecha_evaluacion || null,
      })
    }
  })
  try {
    const hist = await getAllIpress(`/historial_notificacion_revision/?${qs}`)
    const rows = Array.isArray(hist?.results) ? hist.results : []
    for (const h of rows) {
      if (String(h?.tipo || '').toUpperCase() !== 'OBSERVACION') continue
      items.push({
        tipo: 'OBSERVACION_ENVIO',
        tipo_label: h.tipo_label || 'Observación del supervisor',
        formulario: 'Envío a revisión',
        paciente: '—',
        documento: '—',
        comentario: h.mensaje || '',
        mensaje: h.mensaje || 'Observación del supervisor.',
        id_registro: null,
        usuario_nombre: h.usuario_nombre || null,
        creado_en: h.creado_en || null,
      })
    }
  } catch {
    /* ignore */
  }
  items.sort((a, b) => String(b.creado_en || '').localeCompare(String(a.creado_en || '')))
  return items
}

async function cargarAccionesSupervisor() {
  if (!filtroSelectorListo.value) {
    accionesSupervisor.value = []
    return
  }
  cargandoAccionesSupervisor.value = true
  try {
    const params = new URLSearchParams({
      id_periodo: String(periodo.value),
      id_ipress: String(clinica.value),
      id_modalidad: String(modalidad.value),
    })
    const r = await getAllIpress(`/acciones_supervisor_revision/?${params.toString()}`)
    accionesSupervisor.value = Array.isArray(r?.results) ? r.results : []
  } catch {
    try {
      accionesSupervisor.value = await cargarAccionesSupervisorDesdeModulos()
    } catch {
      accionesSupervisor.value = []
    }
  } finally {
    cargandoAccionesSupervisor.value = false
  }
}

async function abrirModalAccionesSupervisor() {
  modalAccionesSupervisorAbierto.value = true
  await cargarAccionesSupervisor()
}

function cerrarModalAccionesSupervisor() {
  modalAccionesSupervisorAbierto.value = false
}

async function cargarEstadoNotificacionRevision() {
  if (!filtroSelectorListo.value) {
    estadoNotificacionRevision.value = {
      notificado: false,
      notificado_en: null,
      usuario_nombre: null,
      estado: 'POR_NOTIFICAR',
      requiere_renotificacion: false,
      ya_dio_conformidad: false,
      conformidad_en: null,
      conformidad_usuario_nombre: null,
    }
    setEstadoRevisionShared('POR_NOTIFICAR')
    return
  }
  cargandoEstadoRevision.value = true
  try {
    const params = new URLSearchParams({
      id_periodo: String(periodo.value),
      id_ipress: String(clinica.value),
      id_modalidad: String(modalidad.value),
    })
    const r = await getAllIpress(`/consulta_notificacion_envio_revision/?${params.toString()}`)
    let yaConforme = Boolean(r?.ya_dio_conformidad)
    let conformidadEn = r?.conformidad_en ?? null
    let conformidadUsuario = r?.conformidad_usuario_nombre ?? null

    // QA antiguo sin campos de conformidad: respaldar con historial.
    if (r && r.ya_dio_conformidad == null) {
      try {
        const hist = await getAllIpress(`/historial_notificacion_revision/?${params.toString()}`)
        const conf = (Array.isArray(hist?.results) ? hist.results : [])
          .find((x) => String(x?.tipo || '').toUpperCase() === 'CONFORMIDAD')
        if (conf) {
          yaConforme = true
          conformidadEn = conf.creado_en ?? null
          conformidadUsuario = conf.usuario_nombre ?? null
        }
      } catch {
        /* ignore */
      }
    }

    const estado = (r?.notificado === true || r?.estado === 'NOTIFICADO') ? 'NOTIFICADO' : 'POR_NOTIFICAR'
    estadoNotificacionRevision.value = {
      notificado: Boolean(r?.notificado) || estado === 'NOTIFICADO',
      notificado_en: r?.notificado_en ?? null,
      usuario_nombre: r?.usuario_nombre ?? null,
      estado,
      requiere_renotificacion: yaConforme ? false : Boolean(r?.requiere_renotificacion),
      ya_dio_conformidad: yaConforme,
      conformidad_en: conformidadEn,
      conformidad_usuario_nombre: conformidadUsuario,
    }
    setEstadoRevisionShared(estado)
  } catch {
    estadoNotificacionRevision.value = {
      notificado: false,
      notificado_en: null,
      usuario_nombre: null,
      estado: 'POR_NOTIFICAR',
      requiere_renotificacion: false,
      ya_dio_conformidad: false,
      conformidad_en: null,
      conformidad_usuario_nombre: null,
    }
    setEstadoRevisionShared('POR_NOTIFICAR')
  } finally {
    cargandoEstadoRevision.value = false
  }
}

async function cargarStatsNotificacion() {
  if (!filtroSelectorListo.value) {
    statsModal.value = {
      totalUnidades: 0,
      totalEventos: 0,
      totalMorbilidades: 0,
      totalResultados: 0,
      totalCalidadAgua: 0,
      totalPacientesAtendidos: 0,
      nuevos: 0,
      reingresos: 0,
      continuadores: 0,
      egresados: 0,
      numeroAtenciones: null,
      totalResultadosRegistrados: 0,
      totalResultadosCompletos: 0,
      puedeNotificarClinica: false,
      inicial: { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 },
      final: { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 },
    }
    return
  }
  cargandoStats.value = true
  try {
    statsModal.value = await obtenerEstadisticasRegistrosFormularios({
      idPeriodo: periodo.value,
      idIpress: clinica.value,
      idModalidad: modalidad.value,
    })
  } finally {
    cargandoStats.value = false
  }
}

async function onClickNotificar() {
  if (!filtroSelectorListo.value) {
    ElMessage.warning('Seleccione periodo, clínica y modalidad en la barra superior.')
    return
  }
  if (periodoConforme.value) {
    ElMessage.info('Ya se registró la conformidad. No puede volver a notificar.')
    return
  }
  if (estadoNotificacionRevision.value.estado === 'NOTIFICADO') {
    ElMessage.info('Ya notificó el envío a revisión. Espere correcciones del supervisor para volver a notificar.')
    return
  }
  await abrirModalNotificar()
}

async function abrirModalNotificar() {
  modalNotificarAbierto.value = true
  await cargarStatsNotificacion()
}

function cerrarModalNotificar() {
  modalNotificarAbierto.value = false
  enviandoNotificacion.value = false
}

async function confirmarNotificacion() {
  if (!filtroSelectorListo.value) return
  if (periodoConforme.value) {
    ElMessage.info('Ya se registró la conformidad. No puede volver a notificar.')
    return
  }
  if (esPerfilClinicaUsuario.value && !statsModal.value.puedeNotificarClinica) {
    ElMessage.warning(mensajeBloqueoNotificacion.value)
    return
  }
  enviandoNotificacion.value = true
  try {
    await postAllIpress('/notificar_envio_revision/', {
      id_periodo: Number(periodo.value),
      id_ipress: Number(clinica.value),
      id_modalidad: Number(modalidad.value),
    })
    ElMessage.success('Notificación enviada. Pendiente de conformidad de OECIS.')
    window.dispatchEvent(new CustomEvent('notificacion-revision:actualizar'))
    await cargarEstadoNotificacionRevision()
    cerrarModalNotificar()
  } catch (e) {
    const msg = e?.detail || e?.error || e?.response?.data?.detail || e?.message || 'No se pudo enviar la notificación.'
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo enviar la notificación.')
  } finally {
    enviandoNotificacion.value = false
  }
}

async function fetchNoLeidas() {
  if (!TokenService.getToken()) {
    noLeidas.value = 0
    return
  }
  try {
    const r = await getAllIpress('/notificaciones/no-leidas/')
    noLeidas.value = Number(r?.count) || 0
  } catch {
    noLeidas.value = 0
  }
}

function onNotifEvent() {
  fetchNoLeidas()
}

onMounted(() => {
  fetchNoLeidas()
  pollTimer = setInterval(fetchNoLeidas, 60000)
  window.addEventListener('focus', fetchNoLeidas)
  window.addEventListener('notificaciones:actualizar', onNotifEvent)
  window.addEventListener('registros-formularios:actualizar', cargarStatsNotificacion)
  window.addEventListener('notificacion-revision:actualizar', cargarEstadoNotificacionRevision)
  window.addEventListener('notificaciones:actualizar', cargarEstadoNotificacionRevision)
  window.addEventListener('notificacion-revision:actualizar', cargarAccionesSupervisor)
  window.addEventListener('notificaciones:actualizar', cargarAccionesSupervisor)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  window.removeEventListener('focus', fetchNoLeidas)
  window.removeEventListener('notificaciones:actualizar', onNotifEvent)
  window.removeEventListener('registros-formularios:actualizar', cargarStatsNotificacion)
  window.removeEventListener('notificacion-revision:actualizar', cargarEstadoNotificacionRevision)
  window.removeEventListener('notificaciones:actualizar', cargarEstadoNotificacionRevision)
  window.removeEventListener('notificacion-revision:actualizar', cargarAccionesSupervisor)
  window.removeEventListener('notificaciones:actualizar', cargarAccionesSupervisor)
})

watch(
  () => [periodo.value, clinica.value, modalidad.value, mostrarBotonNotificar.value],
  () => {
    if (mostrarBotonNotificar.value) {
      cargarStatsNotificacion()
      cargarEstadoNotificacionRevision()
      cargarAccionesSupervisor()
    }
  },
  { immediate: true },
)

watch(modalNotificarAbierto, (abierto) => {
  if (abierto) cargarStatsNotificacion()
})

watch(
  () => route.path,
  () => fetchNoLeidas()
)

const logout = () => {
  authStore.logout()
  router.push('/login')
  toast.success('¡Saliste del Sistema!')
}

const goToSettings = () => {
  console.log('Ir a ajustes')
}
</script>

<style>
/* Ocultar ciertos elementos en móvil */
@media (max-width: 768px) {
  .icons-arrow-left {
    display: block !important;
  }
}
</style>