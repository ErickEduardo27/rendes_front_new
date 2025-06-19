import { ref, computed, watch } from 'vue';

export function useDateValidation(fechaCreacionInicioRef, fechaDiagnosticoRef, fechaIngresoUnidadRef) {

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

  const isFechaIngresoUnidadValid = computed(() => {
    if (!fechaCreacionInicioRef.value || !fechaIngresoUnidadRef.value) {
      return true;
    }
    return new Date(fechaIngresoUnidadRef.value) >= new Date(fechaCreacionInicioRef.value);
  });

  watch(fechaCreacionInicioRef, (newVal) => {
    if (newVal) {
      if (fechaDiagnosticoRef.value && new Date(fechaDiagnosticoRef.value) < new Date(newVal)) {
        fechaDiagnosticoRef.value = '';
      }
      if (fechaIngresoUnidadRef.value && new Date(fechaIngresoUnidadRef.value) < new Date(newVal)) {
        fechaIngresoUnidadRef.value = '';
      }
    } else {
      fechaDiagnosticoRef.value = '';
      fechaIngresoUnidadRef.value = '';
    }
  });

  const validateDates = () => {
    if (!fechaCreacionInicioRef.value || new Date(fechaCreacionInicioRef.value) < new Date(today.value)) {
      alert('La Fecha de Creacion Acceso de Inicio debe ser del día o una fecha futura.');
      return false;
    }
    if (!isFechaDiagnosticoValid.value) {
      alert('La Fecha de Inicio TRR debe ser igual o posterior a la Fecha de Creacion Acceso de Inicio.');
      return false;
    }
    if (!isFechaIngresoUnidadValid.value) {
      alert('La Fecha de Primer ingreso a la Unidad debe ser igual o posterior a la Fecha de Creacion Acceso de Inicio.');
      return false;
    }
    return true;
  };

  return {
    today,
    minFechaDependiente,
    isFechaDiagnosticoValid,
    isFechaIngresoUnidadValid,
    validateDates
  };
}