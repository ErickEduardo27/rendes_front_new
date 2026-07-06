import { ref, watch } from 'vue';
import { patchAllIpress } from '@/services/ipress/Ipress.service';

/** Comentario + guardado vía PATCH …/edicion-supervisor/ (evaluación supervisor). */
export function useEdicionSupervisor(props) {
  const comentarioSupervisor = ref('');

  watch(
    () => props.registroEdicion,
    (r) => {
      comentarioSupervisor.value = r?.comentario_evaluacion || '';
    },
    { immediate: true },
  );

  async function guardarComoSupervisor(resourcePath, id, fields) {
    await patchAllIpress(`/${resourcePath}/${id}/edicion-supervisor/`, {
      ...fields,
      comentario_evaluacion: comentarioSupervisor.value ?? '',
    });
    window.dispatchEvent(new CustomEvent('notificaciones:actualizar'));
    window.dispatchEvent(new CustomEvent('notificacion-revision:actualizar'));
  }

  return { comentarioSupervisor, guardarComoSupervisor };
}
