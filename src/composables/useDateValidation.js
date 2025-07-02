import { ref, computed, watch } from 'vue';

export function useDateValidation(fechaCreacionInicioRef, fechaDiagnosticoRef) {

  const today = computed(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(now.getTime() - offset);
    return localNow.toISOString().split('T')[0];
  });

  const minFechaDependiente = computed(() => {
    if (!fechaCreacionInicioRef.value) {
      return today.value;
    }
    return fechaCreacionInicioRef.value;
  });

  const isFechaDiagnosticoValid = computed(() => {
    if (!fechaCreacionInicioRef.value || !fechaDiagnosticoRef.value) {
      return true;
    }
    return new Date(fechaDiagnosticoRef.value) >= new Date(fechaCreacionInicioRef.value);
  });

  watch(fechaCreacionInicioRef, (newVal) => {
    if (newVal) {
      if (fechaDiagnosticoRef.value && new Date(fechaDiagnosticoRef.value) < new Date(newVal)) {
        fechaDiagnosticoRef.value = '';
      }
    } else {
      fechaDiagnosticoRef.value = '';
    }
  });

  const validateDates = () => {
        if (!fechaCreacionInicioRef.value) {
            // Asumiendo que esta fecha es requerida
            alert('La Fecha de Creación de Acceso de Inicio es requerida.');
            return false;
        }
        if (new Date(fechaCreacionInicioRef.value) > new Date(today.value)) {
            alert('La Fecha de Creacion Acceso de Inicio no puede ser una fecha futura.');
            return false;
        }
        if (!fechaDiagnosticoRef.value) {
            // Asumiendo que esta fecha es requerida
            alert('La Fecha de Inicio TRR es requerida.');
            return false;
        }
        if (!isFechaDiagnosticoValid.value) {
            alert('La Fecha de Inicio TRR debe ser igual o posterior a la Fecha de Creacion Acceso de Inicio.');
            return false;
        }
        return true;
    };

  return {
    today,
    minFechaDependiente,
    isFechaDiagnosticoValid,
    validateDates
  };
}