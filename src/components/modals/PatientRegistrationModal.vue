<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Registrar Nuevo Paciente</h2>
      <p class="modal-subtitle">
        Complete la información básica del paciente para crear su expediente médico.
      </p>

      <form @submit.prevent="handleSubmit" class="form-grid">
        <!-- Fila 1 -->
        <div class="form-group">
          <label for="nombres">Nombres *</label>
          <input id="nombres" v-model="formData.nombres" required />
        </div>
        <div class="form-group">
          <label for="apellidos">Apellidos *</label>
          <input id="apellidos" v-model="formData.apellidos" required />
        </div>

        <!-- Fila 2 -->
        <div class="form-group">
          <label for="fechaNacimiento">Fecha de Nacimiento *</label>
          <input id="fechaNacimiento" type="date" v-model="formData.fechaNacimiento" required />
        </div>
        <div class="form-group">
          <label for="genero">Género *</label>
          <select id="genero" v-model="formData.genero" required>
            <option disabled value="">Seleccionar género</option>
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Otro</option>
          </select>
        </div>

        <!-- Fila 3 -->
        <div class="form-group">
          <label for="tipoId">Tipo de Identificación *</label>
          <select id="tipoId" v-model="formData.tipoId" required>
            <option disabled value="">Tipo de ID</option>
            <option>Cédula</option>
            <option>Pasaporte</option>
            <option>Licencia</option>
          </select>
        </div>
        <div class="form-group">
          <label for="numeroId">Número de Identificación *</label>
          <input id="numeroId" v-model="formData.numeroId" required />
        </div>

        <!-- Fila 4 -->
        <div class="form-group">
          <label for="telefono">Teléfono *</label>
          <input id="telefono" v-model="formData.telefono" required />
        </div>
        <div class="form-group">
          <label for="edad">Edad *</label>
          <input id="edad" v-model="formData.edad" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="formData.email" />
        </div>

        <!-- Fila 5 -->
        <div class="form-group full-width">
          <label for="direccion">Dirección *</label>
          <textarea id="direccion" v-model="formData.direccion" required></textarea>
        </div>

        <!-- Fila 6 -->
        <div class="form-group">
          <label for="contactoEmergencia">Contacto de Emergencia</label>
          <input id="contactoEmergencia" v-model="formData.contactoEmergencia" />
        </div>
        <div class="form-group">
          <label for="telefonoEmergencia">Teléfono de Emergencia</label>
          <input id="telefonoEmergencia" v-model="formData.telefonoEmergencia" />
        </div>

        <!-- Botones -->
        <div class="form-actions full-width">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-submit">Registrar Paciente</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientRegistrationModal',
  props: {
    isOpen: Boolean,
    onPatientRegistered: Function
  },
  emits: ['close'],
  data() {
    return {
      formData: {
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        genero: "",
        tipoId: "",
        numeroId: "",
        telefono: "",
        edad: "",
        email: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoEmergencia: ""
      }
    };
  },
  methods: {
    handleSubmit() {
      const patientData = {
        ...this.formData,
        id: Date.now().toString(),
        fechaRegistro: new Date().toISOString()
      };
      this.onPatientRegistered(patientData);
      this.$emit('close');

      this.formData = {
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        genero: "",
        tipoId: "",
        numeroId: "",
        telefono: "",
        edad: "",
        email: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoEmergencia: ""
      };
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.modal-subtitle {
  color: #666;
  margin-bottom: 20px;
}

.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.form-group {
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  flex: 1 1 100%;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
}

textarea {
  min-height: 60px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  background: #f3f3f3;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
