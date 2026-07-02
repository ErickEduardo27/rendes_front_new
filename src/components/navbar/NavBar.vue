<template>
  <header class="sticky top-0 z-50 w-full flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-cyan-200 shadow-sm">
    <div class="flex items-center gap-3 min-w-0">
      <Bars3Icon class="icons-arrow-left w-6 h-6 shrink-0 text-cyan-600 cursor-pointer" @click="$emit('toggle-sidebar')" />
      <SelectorPeriodo
        v-if="mostrarSelectorPeriodo"
        v-model:periodo="periodo"
        v-model:clinica="clinica"
        v-model:modalidad="modalidad"
        @change="onSelectorChange"
      />
      <div v-else class="min-w-0">
        <h1 class="text-sm sm:text-base font-bold text-cyan-800 truncate">Panel de supervisión</h1>
        <p class="text-[11px] text-slate-500 hidden sm:block">Resumen de clínicas asignadas</p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="mostrarBotonNotificar"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shrink-0 transition-colors"
        :class="botonNotificarHabilitado
          ? 'border-cyan-600 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
          : 'border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed'"
        :title="tituloBotonNotificar"
        @click="onClickNotificar"
      >
        Notificar
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
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-cyan-50/80">
          <h2 class="text-base font-bold text-slate-800">Notificar envío a revisión</h2>
          <button type="button" class="text-slate-500 hover:text-slate-800 text-lg leading-none" aria-label="Cerrar" @click="cerrarModalNotificar">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <p v-if="!filtroSelectorListo" class="text-sm text-amber-700">Seleccione periodo, clínica y modalidad en la barra superior.</p>
          <template v-else>
            <p class="text-sm text-slate-600">Registros cargados según el filtro actual:</p>
            <div v-if="cargandoStats" class="text-sm text-slate-500 py-4 text-center">Cargando conteos…</div>
            <div v-else class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 border border-slate-100 rounded-lg p-3 bg-slate-50/80">
              <div class="flex justify-between col-span-2 font-semibold text-slate-500 uppercase tracking-wide text-[10px] mb-1">Resumen del periodo</div>
              <div class="flex justify-between col-span-2 pb-1 mb-1 border-b border-slate-200/80">
                <span>Total pacientes atendidos</span>
                <span class="font-semibold text-slate-800">{{ statsModal.totalPacientesAtendidos }}</span>
              </div>
              <div class="flex justify-between col-span-2 font-semibold text-slate-500 uppercase tracking-wide text-[10px] mb-1 mt-1">Registros por formulario</div>
              <div class="flex justify-between"><span>Cambio Acceso Vascular</span><span class="font-semibold text-sky-700">{{ statsModal.totalUnidades }}</span></div>
              <div class="flex justify-between"><span>Infecciones</span><span class="font-semibold text-rose-700">{{ statsModal.totalEventos }}</span></div>
              <div class="flex justify-between"><span>Morbilidad Hosp.</span><span class="font-semibold text-amber-700">{{ statsModal.totalMorbilidades }}</span></div>
              <div class="flex justify-between"><span>Resultados Clínicos</span><span class="font-semibold text-indigo-700">{{ statsModal.totalResultados }}</span></div>
              <div class="flex justify-between col-span-2">
                <span>Resultados completos (tiempo diálisis y tratamientos)</span>
                <span class="font-semibold" :class="statsModal.puedeNotificarClinica ? 'text-emerald-700' : 'text-rose-700'">{{ statsModal.totalResultadosCompletos }}</span>
              </div>
              <div class="flex justify-between col-span-2"><span>Calidad de agua</span><span class="font-semibold text-teal-700">{{ statsModal.totalCalidadAgua }}</span></div>
            </div>
            <p
              v-if="esPerfilClinicaUsuario && !statsModal.puedeNotificarClinica"
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
            :disabled="!filtroSelectorListo || enviandoNotificacion || (esPerfilClinicaUsuario && !statsModal.puedeNotificarClinica)"
            @click="confirmarNotificacion"
          >{{ enviandoNotificacion ? 'Enviando…' : 'Sí, notificar' }}</button>
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
import { mensajeBloqueoNotificacionClinica } from '@/utils/resultadosClinicosNotificacion'
import { ElMessage } from 'element-plus'
import { useAuthStore } from "@/store/auth";
import router from "@/router/index";
import { toast } from 'vue-sonner'
import { TokenService } from '@/services/api/token.service'
import SelectorPeriodo from '@/components/SelectorPeriodo.vue'
import { esSupervisor, debeLimitarClinicasAlUsuario, esPerfilClinica } from '@/utils/perfil'

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
const noLeidas = ref(0)
let pollTimer = null

const modalNotificarAbierto = ref(false)
const cargandoStats = ref(false)
const enviandoNotificacion = ref(false)
const statsModal = ref({
  totalUnidades: 0,
  totalEventos: 0,
  totalMorbilidades: 0,
  totalResultados: 0,
  totalCalidadAgua: 0,
  totalPacientesAtendidos: 0,
  totalResultadosCompletos: 0,
  puedeNotificarClinica: false,
})

const esPerfilClinicaUsuario = computed(() => esPerfilClinica())

const mensajeBloqueoNotificacion = computed(() =>
  mensajeBloqueoNotificacionClinica(
    statsModal.value.totalPacientesAtendidos,
    statsModal.value.totalResultadosCompletos,
  ),
)

const botonNotificarHabilitado = computed(() => {
  if (!filtroSelectorListo.value) return false
  if (cargandoStats.value) return false
  if (esPerfilClinicaUsuario.value) return statsModal.value.puedeNotificarClinica === true
  return true
})

const tituloBotonNotificar = computed(() => {
  if (!filtroSelectorListo.value) return 'Seleccione periodo, clínica y modalidad'
  if (esPerfilClinicaUsuario.value && !statsModal.value.puedeNotificarClinica) {
    return mensajeBloqueoNotificacion.value
  }
  return 'Notificar envío a revisión'
})

/**
 * Botón "Notificar" en rutas de carga de registros (misma idea que meta `mostrarNotificarRegistros`).
 * No ocultar por perfil Supervisor/Admin: en el menú lateral también entran a Registros y deben poder
 * avisar a revisión. Solo ocultar en la pantalla de Evaluación (rol revisor).
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

const filtroSelectorListo = computed(() => {
  return (
    periodo.value != null && periodo.value !== '' &&
    clinica.value != null && clinica.value !== '' &&
    modalidad.value != null && modalidad.value !== ''
  )
})

async function cargarStatsNotificacion() {
  if (!filtroSelectorListo.value) {
    statsModal.value = {
      totalUnidades: 0,
      totalEventos: 0,
      totalMorbilidades: 0,
      totalResultados: 0,
      totalCalidadAgua: 0,
      totalPacientesAtendidos: 0,
      totalResultadosCompletos: 0,
      puedeNotificarClinica: false,
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

function onClickNotificar() {
  if (!filtroSelectorListo.value) {
    ElMessage.warning('Seleccione periodo, clínica y modalidad en la barra superior.')
    return
  }
  if (esPerfilClinicaUsuario.value && !statsModal.value.puedeNotificarClinica) {
    ElMessage.warning(mensajeBloqueoNotificacion.value)
    return
  }
  abrirModalNotificar()
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
    ElMessage.success('Notificación enviada. El equipo de revisión verá el aviso en Evaluación de registros.')
    window.dispatchEvent(new CustomEvent('notificacion-revision:actualizar'))
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
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  window.removeEventListener('focus', fetchNoLeidas)
  window.removeEventListener('notificaciones:actualizar', onNotifEvent)
})

watch(
  () => [periodo.value, clinica.value, modalidad.value, mostrarBotonNotificar.value],
  () => {
    if (mostrarBotonNotificar.value) cargarStatsNotificacion()
  },
  { immediate: true },
)

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