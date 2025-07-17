<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">Mes de Reporte: JUNIO</h2>

    <!-- DATOS PERSONALES -->
    <section>
      <h3 class="font-semibold mb-2">Registro de Nuevo Paciente en Diálisis:</h3>
      <p class="mb-4 text-sm text-gray-600">Complete los datos para la creación del expediente médico.</p>
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label for="tipoDocumento" class="text-sm font-medium">Tipo de Documento *</label>
          <select id="tipoDocumento" class="w-full border px-2 py-1 rounded" v-model="form.tipoDocumento">
            <option disabled value="">Seleccione</option>
            <option>DNI</option>
            <option>CE</option>
            <option>PASAPORTE</option>
          </select>
        </div>
        <div>
          <label for="numeroDocumento" class="text-sm font-medium">Número de Documento *</label>
          <input id="numeroDocumento" class="w-full border px-2 py-1 rounded" v-model="form.numeroDocumento" />
        </div>
        <div>
          <label for="apellidos" class="text-sm font-medium">Apellidos *</label>
          <input id="apellidos" class="w-full border px-2 py-1 rounded" v-model="form.apellidos" />
        </div>
        <div>
          <label for="nombres" class="text-sm font-medium">Nombres *</label>
          <input id="nombres" class="w-full border px-2 py-1 rounded" v-model="form.nombres" />
        </div>
        <div>
          <label for="fechaNacimiento" class="text-sm font-medium">Fecha de Nacimiento *</label>
          <input type="date" id="fechaNacimiento" class="w-full border px-2 py-1 rounded" v-model="form.fechaNacimiento" />
        </div>
        <div>
          <label for="edad" class="text-sm font-medium">Edad *</label>
          <input id="edad" class="w-full border px-2 py-1 rounded" v-model="form.edad" readonly />
        </div>
        <div>
          <label for="sexo" class="text-sm font-medium">Sexo *</label>
          <select id="sexo" class="w-full border px-2 py-1 rounded" v-model="form.sexo">
            <option disabled value="">Seleccione</option>
            <option>Femenino</option>
            <option>Masculino</option>
          </select>
        </div>
        <div>
          <label for="grado" class="text-sm font-medium">Grado de Instrucción *</label>
          <input id="grado" class="w-full border px-2 py-1 rounded" v-model="form.gradoInstruccion" />
        </div>
      </div>
    </section>

    <!-- ETIOLOGÍA -->
    <section>
      <h3 class="font-semibold mb-2">Etiología</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="etiologiaGeneral" class="text-sm font-medium">Etiología General *</label>
          <select id="etiologiaGeneral" class="w-full border px-2 py-1 rounded" v-model="form.etiologiaGeneral">
            <option disabled value="">Seleccione</option>
            <option>Genética</option>
            <option>Autoinmune</option>
            <option>Otra</option>
          </select>
        </div>
        <div>
          <label for="etiologiaEspecifica" class="text-sm font-medium">Etiología Específica *</label>
          <select id="etiologiaEspecifica" class="w-full border px-2 py-1 rounded" v-model="form.etiologiaEspecifica">
            <option disabled value="">Seleccione</option>
          </select>
        </div>
      </div>
    </section>

    <!-- COMORBILIDAD -->
    <section>
      <h3 class="font-semibold mb-2">Comorbilidad</h3>
      <p class="text-sm text-gray-600 mb-2">El paciente presenta las siguientes enfermedades:</p>
      <div class="grid grid-cols-3 gap-4">
        <label><input type="checkbox" v-model="form.comorbilidades" value="Insuficiencia cardiaca" /> Insuficiencia cardiaca congestiva</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Diabetes" /> Diabetes</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Aterosclerosis" /> Enfermedades Ateroscleróticas</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Hipertensión" /> Hipertensión</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Vascular periférica" /> Enfermedad vascular periférica</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Tuberculosis" /> Tuberculosis</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="ACV" /> Accidente cerebrovascular</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Cáncer" /> Cáncer</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Otra" /> Otra</label>
      </div>
    </section>

    <!-- ACCESO VASCULAR -->
    <section>
      <h3 class="font-semibold mb-2">Acceso Vascular</h3>
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="text-sm font-medium">Modalidad de inicio de TRR *</label>
          <select class="w-full border px-2 py-1 rounded" v-model="form.modalidadTRR">
            <option disabled value="">Seleccione</option>
            <option>Hemodiálisis</option>
            <option>Peritoneal</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium">Fecha de inicio de TRR *</label>
          <input type="date" class="w-full border px-2 py-1 rounded" v-model="form.fechaInicioTRR" />
        </div>
        <div>
          <label class="text-sm font-medium">Subsistema de Salud *</label>
          <select class="w-full border px-2 py-1 rounded" v-model="form.subsistemaSalud">
            <option disabled value="">Seleccione</option>
            <option>EsSalud</option>
            <option>MINSA</option>
            <option>Privado</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium">Edad de inicio de TRR *</label>
          <input class="w-full border px-2 py-1 rounded" v-model="form.edadInicioTRR" />
        </div>
        <!-- Más campos según sea necesario... -->
      </div>
    </section>

    <!-- BOTONES -->
    <div class="flex justify-end gap-4 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded" @click="$emit('cancelar')">Cancelar</button>
      <button class="bg-sky-600 text-white px-6 py-2 rounded font-semibold" @click="registrarPaciente">Registrar Nuevo Paciente</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  tipoDocumento: '',
  numeroDocumento: '',
  apellidos: '',
  nombres: '',
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
  edadInicioTRR: ''
})

const registrarPaciente = () => {
  console.log('Formulario enviado:', form)
  // Aquí va la lógica para guardar
}
</script>
