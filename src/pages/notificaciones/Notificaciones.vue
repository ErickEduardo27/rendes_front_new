<template>
  <div class="min-h-screen bg-slate-50/80 p-4 sm:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full" />
            Notificaciones
          </h1>
          <p class="text-slate-500 mt-1 text-sm">
            Avisos cuando se abre o cierra un formulario, cuando un supervisor corrige un registro o desaprueba un registro.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            :disabled="cargando || lista.length === 0 || !filtroListo"
            @click="marcarTodasLeidas"
          >
            Marcar todas leídas
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            :disabled="cargando"
            @click="cargar"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div v-if="!filtroListo" class="text-center py-16 text-slate-500 italic bg-white rounded-xl border border-slate-200">
        Seleccione periodo, IPRESS y modalidad en la barra superior para ver las notificaciones de ese contexto.
      </div>
      <div v-else-if="cargando && lista.length === 0" class="text-center py-16 text-slate-500">Cargando…</div>
      <div v-else-if="lista.length === 0" class="text-center py-16 text-slate-500 italic bg-white rounded-xl border border-slate-200">
        No tiene notificaciones para este periodo, IPRESS y modalidad.
      </div>
      <ul v-else class="space-y-3">
        <li
          v-for="n in lista"
          :key="n.id_notificacion"
          class="rounded-xl border bg-white p-4 shadow-sm transition-colors"
          :class="n.leida ? 'border-slate-200 opacity-80' : 'border-cyan-200 ring-1 ring-cyan-100'"
        >
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                :class="chipClass(n.tipo)"
              >
                {{ etiquetaTipo(n.tipo) }}
              </span>
              <span v-if="!n.leida" class="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                Nueva
              </span>
            </div>
            <span class="text-xs text-slate-400">{{ formatearFecha(n.creado_en) }}</span>
          </div>
          <h2 class="font-semibold text-slate-800 mt-2">{{ n.titulo }}</h2>
          <p class="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{{ n.mensaje }}</p>
          <div class="mt-3 flex justify-end">
            <button
              v-if="!n.leida"
              type="button"
              class="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              @click="marcarLeida(n)"
            >
              Marcar como leída
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { getAllIpress, patchAllIpress, postAllIpress } from '@/services/ipress/Ipress.service'
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat'

const periodoGlobal = inject('periodoGlobal', ref(null))
const clinicaGlobal = inject('clinicaGlobal', ref(null))
const modalidadGlobal = inject('modalidadGlobal', ref(null))

const lista = ref([])
const cargando = ref(false)

const filtroListo = computed(() => {
  const p = periodoGlobal?.value
  const i = clinicaGlobal?.value
  const m = modalidadGlobal?.value
  return p != null && p !== '' && i != null && i !== '' && m != null && m !== ''
})

function queryFiltro() {
  if (!filtroListo.value) return ''
  const params = new URLSearchParams({
    id_periodo: String(periodoGlobal.value),
    id_ipress: String(clinicaGlobal.value),
    id_modalidad: String(modalidadGlobal.value),
  })
  return `?${params.toString()}`
}

function etiquetaTipo(tipo) {
  const m = {
    FORMULARIO_ABIERTO: 'Formulario abierto',
    FORMULARIO_CERRADO: 'Formulario cerrado',
    REGISTRO_DESAPROBADO: 'Desaprobado',
    SUPERVISOR_EDITO_REGISTRO: 'Corrección supervisor',
    OBSERVACION_SUPERVISOR: 'Observación supervisor',
  }
  return m[tipo] || tipo || 'Aviso'
}

function chipClass(tipo) {
  if (tipo === 'FORMULARIO_ABIERTO') return 'bg-emerald-100 text-emerald-800'
  if (tipo === 'FORMULARIO_CERRADO') return 'bg-amber-100 text-amber-900'
  if (tipo === 'REGISTRO_DESAPROBADO') return 'bg-rose-100 text-rose-800'
  if (tipo === 'SUPERVISOR_EDITO_REGISTRO') return 'bg-violet-100 text-violet-800'
  if (tipo === 'OBSERVACION_SUPERVISOR') return 'bg-amber-100 text-amber-900'
  return 'bg-slate-100 text-slate-700'
}

function formatearFecha(iso) {
  return formatFechaHoraDDMMAAAA(iso)
}

async function cargar() {
  if (!filtroListo.value) {
    lista.value = []
    return
  }
  cargando.value = true
  try {
    const res = await getAllIpress(`/notificaciones/${queryFiltro()}`)
    lista.value = Array.isArray(res) ? res : res?.results || []
  } catch (e) {
    console.error(e)
    lista.value = []
  } finally {
    cargando.value = false
  }
}

async function marcarLeida(n) {
  try {
    await patchAllIpress(`/notificaciones/${n.id_notificacion}/`, { leida: true })
    n.leida = true
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'))
  } catch (e) {
    console.error(e)
  }
}

async function marcarTodasLeidas() {
  if (!filtroListo.value) return
  try {
    await postAllIpress(`/notificaciones/marcar-todas-leidas/${queryFiltro()}`, {})
    await cargar()
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'))
  } catch (e) {
    console.error(e)
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  cargar()
})

onMounted(() => {
  cargar()
})
</script>
