import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import { getAllIpress } from '@/services/ipress/Ipress.service'
import { esPerfilClinica } from '@/utils/perfil'

/** Estado compartido entre NavBar y páginas (misma sesión). */
const estadoRevisionShared = ref('POR_NOTIFICAR')

export const MENSAJE_BLOQUEO_NOTIFICADO =
  'El periodo ya fue notificado. No puede registrar pacientes, hacer movimientos ni llenar/editar registros hasta que el supervisor envíe una observación.'

export function setEstadoRevisionShared(estado) {
  estadoRevisionShared.value = estado === 'NOTIFICADO' ? 'NOTIFICADO' : 'POR_NOTIFICAR'
}

/**
 * Bloqueo de clínica mientras el envío está en estado NOTIFICADO.
 * Se libera cuando el supervisor marca observación (backend borra el envío → POR_NOTIFICAR)
 * o cuando requiere_renotificacion (edición del supervisor).
 */
export function useBloqueoNotificacionRevision() {
  const periodoGlobal = inject('periodoGlobal', ref(null))
  const clinicaGlobal = inject('clinicaGlobal', ref(null))
  const modalidadGlobal = inject('modalidadGlobal', ref(null))

  const bloqueadoPorNotificacion = computed(() => {
    if (!esPerfilClinica()) return false
    return estadoRevisionShared.value === 'NOTIFICADO'
  })

  async function refrescarEstadoRevision(override = null) {
    const idPeriodo = override?.idPeriodo ?? periodoGlobal.value
    const idIpress = override?.idIpress ?? clinicaGlobal.value
    const idModalidad = override?.idModalidad ?? modalidadGlobal.value
    if (
      idPeriodo == null || idPeriodo === '' ||
      idIpress == null || idIpress === '' ||
      idModalidad == null || idModalidad === ''
    ) {
      // No resetear el estado compartido: otro componente (NavBar) puede tener el filtro activo.
      return
    }
    try {
      const params = new URLSearchParams({
        id_periodo: String(idPeriodo),
        id_ipress: String(idIpress),
        id_modalidad: String(idModalidad),
      })
      const r = await getAllIpress(`/consulta_notificacion_envio_revision/?${params.toString()}`)
      setEstadoRevisionShared(r?.estado === 'NOTIFICADO' ? 'NOTIFICADO' : 'POR_NOTIFICAR')
    } catch {
      // Conservar último estado conocido ante error de red.
    }
  }

  function onRevisionEvent() {
    refrescarEstadoRevision()
  }

  onMounted(() => {
    window.addEventListener('notificacion-revision:actualizar', onRevisionEvent)
    window.addEventListener('notificaciones:actualizar', onRevisionEvent)
    refrescarEstadoRevision()
  })

  onUnmounted(() => {
    window.removeEventListener('notificacion-revision:actualizar', onRevisionEvent)
    window.removeEventListener('notificaciones:actualizar', onRevisionEvent)
  })

  watch(
    [periodoGlobal, clinicaGlobal, modalidadGlobal],
    () => refrescarEstadoRevision(),
    { immediate: true },
  )

  return {
    estadoRevision: estadoRevisionShared,
    bloqueadoPorNotificacion,
    mensajeBloqueoNotificacion: MENSAJE_BLOQUEO_NOTIFICADO,
    refrescarEstadoRevision,
  }
}
