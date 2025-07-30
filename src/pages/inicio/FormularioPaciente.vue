<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">Registro de Nuevo Paciente en Diálisis:</h2>
    <p class="text-sm text-gray-600">Complete los respectivos datos del paciente para la creación del expediente médico.</p>

    <!-- Datos personales -->
    <div class="grid grid-cols-4 gap-4">
      <div>
        <label class="text-sm font-medium">Tipo de Documento*</label>
        <select v-model="form.tipoDocumento" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>DNI</option>
          <option>CE</option>
          <option>PASAPORTE</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Número de Documento*</label>
        <input v-model="form.numeroDocumento" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Apellidos y Nombres*</label>
        <input v-model="form.nombreCompleto" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Nacimiento*</label>
        <input type="date" v-model="form.fechaNacimiento" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Edad</label>
        <input v-model="form.edad" class="w-full border px-2 py-1 rounded bg-gray-100" readonly />
      </div>
      <div>
        <label class="text-sm font-medium">Sexo*</label>
        <select v-model="form.sexo" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Masculino</option>
          <option>Femenino</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Grado de Instrucción*</label>
        <select v-model="form.gradoInstruccion" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Primaria</option>
          <option>Secundaria</option>
          <option>Técnico</option>
          <option>Superior</option>
        </select>
      </div>
    </div>

    <!-- Etiología -->
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div>
        <label class="text-sm font-medium">Etiología General*</label>
        <select v-model="form.etiologiaGeneral" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Genética</option>
          <option>Autoinmune</option>
          <option>Infecciosa</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Etiología Específica*</label>
        <select v-model="form.etiologiaEspecifica" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Glomerulonefritis</option>
          <option>Nefropatía diabética</option>
        </select>
      </div>
    </div>

    <!-- Comorbilidad -->
    <div class="mt-6">
      <label class="text-sm font-medium block mb-2">Comorbilidad</label>
      <div class="grid grid-cols-3 gap-4">
        <label><input type="checkbox" v-model="form.comorbilidades" value="Insuficiencia cardiaca" /> Insuficiencia cardiaca congestiva</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Diabetes" /> Diabetes</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Aterosclerosis" /> Aterosclerosis cardíaca</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Hipertensión" /> Hipertensión</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Vascular periférica" /> Enfermedad vascular periférica</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Tuberculosis" /> Tuberculosis</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="ACV" /> Accidente cerebrovascular</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Cáncer" /> Cáncer</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Otra" /> Otra</label>
      </div>
    </div>

    <!-- Acceso Vascular -->
    <div class="grid grid-cols-4 gap-4 mt-6">
      <div>
        <label class="text-sm font-medium">Modalidad de Inicio de TRR</label>
        <select v-model="form.modalidadTRR" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Hemodiálisis</option>
          <option>Diálisis Peritoneal</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Inicio de TRR</label>
        <input type="date" v-model="form.fechaInicioTRR" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Subsistema de Salud</label>
        <select v-model="form.subsistemaSalud" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>MINSA</option>
          <option>EsSalud</option>
          <option>Privado</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Edad de Inicio de TRR</label>
        <input v-model="form.edadInicioTRR" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Tipo de Acceso de Inicio</label>
        <select v-model="form.tipoAccesoInicio" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Catéter</option>
          <option>Fístula</option>
          <option>Injerto</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Creación del Acceso</label>
        <input type="date" v-model="form.fechaCreacionAcceso" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Ingreso a Hospital EsSalud</label>
        <input type="date" v-model="form.fechaIngresoEsSalud" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Primer Ingreso a Unidad</label>
        <input type="date" v-model="form.fechaPrimerIngreso" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Localización Acceso de Inicio</label>
        <select v-model="form.localizacionAcceso" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>MSD</option>
          <option>MSI</option>
          <option>MID</option>
          <option>MII</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Hospital Procedencia TRR en EsSalud</label>
        <input type="date" v-model="form.hospitalProcedencia" class="w-full border px-2 py-1 rounded" />
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-4 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded" @click="$emit('cancelar')">Cancelar</button>
      <button class="bg-sky-600 text-white px-6 py-2 rounded font-semibold" @click="registrarPaciente">
        Registrar Nuevo Paciente
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  tipoDocumento: '',
  numeroDocumento: '',
  nombreCompleto: '',
  fechaNacimiento: '',
  edad: '',
  sexo: '',
  gradoInstruccion: '',
  etiologiaGeneral: '',
  etiologiaEspecifica: '',
  comorbilidades: [],
  modalidadTRR: '',
  fechaInicioTRR: '',
  subsistemaSalud: '',
  edadInicioTRR: '',
  tipoAccesoInicio: '',
  fechaCreacionAcceso: '',
  fechaIngresoEsSalud: '',
  fechaPrimerIngreso: '',
  localizacionAcceso: '',
  hospitalProcedencia: ''
})

const registrarPaciente = () => {
  console.log('Datos del formulario:', form)
}
</script>