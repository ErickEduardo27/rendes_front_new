<!--  <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Registro para Hemodiálisis</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Ingreso/Reingreso a Unidad</label>
                <input v-model="feIngresoReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
            </div>

            <div class="space-y-2 col-span-1 lg:col-span-2">
                <label class="block font-semibold text-sm text-gray-700">Hospital de Precedencia</label>
                <input v-model="busqueda" type="text" placeholder="Escribe al menos 3 letras..."
                    class="w-full border rounded p-2 text-sm" />

                
                <ul v-if="busqueda.length >= 3 && mostrarResultados" class="mt-2 space-y-1">
                    <li v-for="item in resultadosFiltrados" :key="item.id"
                        class="border p-2 rounded text-sm cursor-pointer hover:bg-gray-100"
                        @click="seleccionarHospital(item)">
                        {{ item.nombre }}
                    </li>
                    <li v-if="resultadosFiltrados.length === 0" class="text-gray-500 text-sm italic">
                        No se encontraron resultados.
                    </li>
                </ul>
            </div>

            
            <div class="col-span-1 lg:col-span-2">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Serología Actual</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="serologia in serologiasLabels" :key="serologia"
                        class="bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-black transition-all duration-200">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium text-gray-800">{{ serologia }}</span>
                            <div class="flex items-center gap-2">
                                <select v-model="estadoSerologias[serologia].resultado"
                                    class="w-full border rounded p-2 text-sm">
                                    <option value="Desconocido">Desconocido</option>
                                    <option value="Positivo">Positivo</option>
                                    <option value="Negativo">Negativo</option>
                                </select>
                            </div>
                        </div>
                        </div>
                </div>
            </div>

            <div class="col-span-1 lg:col-span-2">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">¿Titulo de AcHBs?</label>
                        <select v-model="AcHBs" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="1"> > 10</option>
                            <option value="2">10-99</option>
                            <option value="3">100-999</option>
                            <option value="4">1000+</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">Estado</label>
                        <div class="w-full border rounded p-2 text-sm bg-gray-50 text-gray-800">
                            {{ estadoAcHBs }}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                        <select v-model="accActual" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="1">FAV</option>
                            <option value="2">Injerto autólogo</option>
                            <option value="3">Injerto protésico</option>
                            <option value="4">CVCLP</option>
                            <option value="5">CVCT</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">Ubicación</label>
                        <select v-model="ubicacion" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione una opción</option>
                            <option v-for="ubi in ubicacionesFiltradas" :key="ubi.value" :value="ubi.value">
                                {{ ubi.label }}
                            </option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">¿Motivo Cambio de Acceso?</label>
                        <select v-model="motivCambioAcc" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="1">Complicación mecánica</option>
                            <option value="2">Complicación infecciosa</option>
                            <option value="3">Prescripción Médica</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">Fecha Creación de Acceso Actual</label>
                        <input v-model="faCreaAcc" type="date" class="w-full border rounded p-2 text-sm" />
                    </div>
                </div>
            </div>
        </div>

        <hr />

        <div class="space-y-4">
            <h3 class="text-base font-semibold">Eventos de Egreso/Reingreso</h3>

            <div v-for="(evento, index) in eventos" :key="index"
                class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div class="space-y-2 lg:col-span-4">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Egreso de la Unidad</label>
                    <input v-model="evento.feEgreUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="space-y-2 lg:col-span-4">
                    <label class="block font-semibold text-sm text-gray-700">Tipo de Egreso</label>
                    <select v-model="evento.tyEgreso" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Fallecimiento</option>
                        <option value="2">Hospitalización</option>
                        <option value="3">Trasplante</option>
                        <option value="4">Cambio de modalidad</option>
                        <option value="5">Cambio de unidad</option>
                        <option value="6">Otros</option>
                    </select>
                    <input v-if="evento.tyEgreso === '6'" v-model="evento.otroEgreso" type="text"
                        placeholder="Especifique el tipo de egreso" class="w-full border rounded p-2 text-sm mt-2" />
                </div>

                <div class="space-y-2 lg:col-span-3">
                    <label class="block font-semibold text-sm text-gray-700">Fecha Reingreso a la Unidad</label>
                    <input v-model="evento.feReingresoUni" type="date" class="w-full border rounded p-2 text-sm" />
                </div>

                <div class="flex justify-end lg:col-span-1" v-if="eventos.length > 1">
                    <button @click="eliminarEvento(index)" type="button"
                        class="text-red-600 border border-red-500 p-2 rounded-full hover:bg-red-100 transition"
                        title="Eliminar evento">
                        🗑️
                    </button>
                </div>
            </div>

            <button @click="agregarEvento" type="button" class="text-blue-600 text-sm mt-2 hover:underline">
                ➕ Agregar otro evento
            </button>
        </div>

        <div class="mt-4 space-y-2">
            <label class="block font-semibold text-sm text-gray-700">¿Presenta infecciones?</label>
            <select v-model="localInfeccion" class="w-full border rounded p-2 text-sm">
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
        </div>

        <hr />


        <button @click="verFormData" class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div> -->
<!-- ACCESO ACTUAL -->
<!-- <script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const mes = 'JULIO'
const anio = '2025'
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const clinicaSeleccionada = clinicas[0]
const modalidad = 'Hemodiálisis'
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
  ← Volver al inicio
</div>

    <div class="flex items-center gap-2 flex-wrap">
      <label>Mes de Reporte:</label>
      <select v-model="mes" class="border px-2 py-1 rounded">
        <option value="JULIO">JULIO</option>
        <option value="AGOSTO">AGOSTO</option>
      </select>

      <select v-model="anio" class="border px-2 py-1 rounded">
        <option value="2025">2025</option>
      </select>

      <label>Clínica:</label>
      <select v-model="clinicaSeleccionada" class="border px-2 py-1 rounded">
        <option v-for="c in clinicas" :key="c">{{ c }}</option>
      </select>

      <label>Modalidad de Diálisis:</label>
      <select v-model="modalidad" class="border px-2 py-1 rounded">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
    </div>


    <h2 class="text-xl font-semibold mt-6">UNIDAD ACTUAL</h2>
    <p class="text-sm text-gray-600">A continuación se presenta el Acceso Actual del paciente</p>

    <div class="grid grid-cols-3 gap-4 mt-4">

      <div>
        <label class="text-sm">Fecha de Creación de Acceso Actual</label>
        <input type="date" class="w-full border px-2 py-1 rounded" />
      </div>

      <div>
        <label class="text-sm">Tipo de Acceso Actual</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Seleccione una opción</option>
        </select>
      </div>

      <div>
        <label class="text-sm">Localización de Acceso Actual</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Seleccione una opción</option>
        </select>
      </div>

      <div>
        <label class="text-sm">¿Se va a cambiar el acceso del paciente?</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>SÍ</option>
          <option>NO</option>
        </select>
      </div>

      <div>
        <label class="text-sm">Especificar el Motivo de Cambio de Acceso</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Seleccione una opción</option>
        </select>
      </div>
    </div>


    <div class="grid grid-cols-3 gap-4 mt-6">
      <div>
        <label class="text-sm">Fecha de Creación de Nuevo Acceso</label>
        <input type="date" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm">Tipo de Nuevo Acceso</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Seleccione una opción</option>
        </select>
      </div>
      <div>
        <label class="text-sm">Localización de Nuevo Acceso</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Seleccione una opción</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
      <button class="bg-sky-500 text-white px-4 py-2 rounded">Registrar</button>
      <button class="bg-sky-500 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button>
    </div>


    <div class="mt-6 p-4 border rounded shadow w-80 ml-auto">
      <div class="flex items-center justify-center mb-2">
        <div class="bg-gray-300 rounded-full h-16 w-16"></div>
      </div>
      <p class="text-center font-bold">Alejandro Antony Cerpa de la Cruz</p>
      <p class="text-center text-sm text-gray-600">DNI: 74456747</p>
      <ul class="text-sm text-gray-700 mt-4 space-y-1">
        <li><strong>Edad:</strong> 38</li>
        <li><strong>Sexo:</strong> Masculino</li>
        <li><strong>Tipo de Registro:</strong> Hemodiálisis</li>
        <li><strong>Estado:</strong> Nuevo</li>
        <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
      </ul>
      <div class="mt-4">
        <label class="text-sm font-medium">Historial de Registros</label>
        <select class="w-full border px-2 py-1 rounded">
          <option>Registro 1</option>
        </select>
      </div>
    </div>
  </div>
</template>


<style scoped>
select, input[type="text"], input[type="date"] {
  font-size: 14px;
}
</style> -->


<template>
    <div class="p-6 space-y-6">
        <!-- Botón de regreso -->
        <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>

        <!-- Filtros Superiores -->
        <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
            <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
                <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
            </select>

            <label>Clínica:</label>
            <label>{{ paciente.ipress }}</label>

            <label>Modalidad de Diálisis:</label>
            <label v-if="pacienteSeleccionado.value">{{ pacienteSeleccionado.value.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
        </div>

        <!-- Contenedor principal en columnas -->
        <div class="flex gap-6 mt-6">
            <!-- Contenido principal -->
            <div class="flex-1 space-y-6">
                <!-- Sección Unidad Actual -->
                <div>
                    <h2 class="text-xl font-semibold">UNIDAD ACTUAL</h2>
                    <p class="text-sm text-gray-600">A continuación se presenta el Acceso Actual del paciente</p>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <!-- Acceso Actual -->
                    <div>
                        <label class="text-sm">Fecha de Creación de Acceso Actual</label>
                        <input disabled v-model="form.fecha_creacion_acceso_actual" type="date" class="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label class="text-sm">Tipo de Acceso Actual</label>
                        <select disabled v-model="form.tipo_acceso_actual" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option value="FAV">FAV</option>
                            <option value="CVCT">CVCT</option>
                            <option value="CVCLP">CVCLP</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Acceso Actual</label>
                        <select disabled v-model="form.localizacion_acceso_actual" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option value="Radial derecha">Radial derecha</option>
                            <option value="Radial izquierda">Radial izquierda</option>
                            <option value="Braquial o cubital derecha">Braquial o cubital derecha</option>
                            <option value="Braquial o cubital izquierdo">Braquial o cubital izquierdo</option>
                            <option value="Yugular derecha">Yugular derecha</option>
                            <option value="Yugular izquierda">Yugular izquierda</option>
                            <option value="Subclavio derecho">Subclavio derecho</option>
                            <option value="Subclavio izquierdo">Subclavio izquierdo</option>
                            <option value="Femoral derecho">Femoral derecho</option>
                            <option value="Femoral izquierdo">Femoral izquierdo</option>
                            <option value="Translumbar">Translumbar</option>
                            <option value="Transhepático">Transhepático</option>
                            <option value="Injerto autólogo">Injerto autólogo</option>
                            <option value="Injerto autólogo">Injerto protésico</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">¿Se va a cambiar el acceso del paciente?</label>
                        <select v-model="form.cambio_acceso" class="w-full border px-2 py-1 rounded">
                            <option value="true">SÍ</option>
                            <option value="false">NO</option>
                        </select>
                    </div>

                </div>

                <!-- Nuevo Acceso -->
                <div class="grid grid-cols-3 gap-4" v-if="form.cambio_acceso == 'true'">
                    <div>
                        <label class="text-sm">Especificar el Motivo de Cambio de Acceso</label>
                        <select v-model="form.motivo_cambio" class="w-full border px-2 py-1 rounded">
                            <option value="">Seleccione una opción</option>
                            <option value="1">Complicación mecánica</option>
                            <option value="2">Complicación infecciosa</option>
                            <option value="3">Prescripción Médica</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm">Fecha de Creación de Nuevo Acceso</label>
                        <input v-model="form.fecha_creacion_acceso_nuevo" type="date" :min="minFechaNuevoAcceso"
                            class="w-full border px-2 py-1 rounded" />
                    </div>
                    <div>
                        <label class="text-sm">Tipo de Nuevo Acceso</label>
                        <select v-model="form.tipo_acceso_nuevo" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option value="FAV">FAV</option>
                            <option value="CVCT">CVCT</option>
                            <option value="CVCLP">CVCLP</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Nuevo Acceso</label>
                        <select v-model="form.localizacion_acceso_nuevo" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option v-for="op in localizacionesFiltradas" :key="op" :value="op">
                                {{ op }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Botones -->
                <div class="flex justify-end gap-2">
                    <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                    <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="postForm()">Registrar</button>
                    <!-- <button class="bg-sky-500 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button> -->
                </div>
            </div>

            <!-- Perfil del paciente al costado -->
            <div class="w-80 p-4 border rounded shadow" v-if="pacienteSeleccionado.value">
                <div class="flex items-center justify-center mb-2">
                    <div class="bg-gray-300 rounded-full h-16 w-16"></div>
                </div>
                <p class="text-center font-bold">{{ pacienteSeleccionado.value.paciente }}</p>
                <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.value.documento }}</p>
                <ul class="text-sm text-gray-700 mt-4 space-y-1">
                    <li><strong>Edad:</strong> {{ edadPaciente }}</li>
                    <li><strong>Sexo:</strong> {{ pacienteSeleccionado.value.genero == "M" ? "Masculino" : "Femenino" }}
                    </li>
                    <li><strong>Tipo de Registro:</strong> {{ pacienteSeleccionado.value.id_modalidad
                        == 1 ? "Hemodialisis" : "Peritonial" }}</li>
                    <li><strong>Estado:</strong> Nuevo</li>
                    <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
                </ul>
                <!-- <div class="mt-4">
                    <label class="text-sm font-medium">Historial de Registros</label>
                    <select class="w-full border px-2 py-1 rounded">
                        <option>Registro 1</option>
                    </select>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed } from 'vue';
import { getAllIpress, patchAllIpress, postAllIpress, putAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';

// 👇 defineProps debe estar fuera de cualquier función
const { paciente, periodo,periodoIpress } = defineProps({
    paciente: {
        type: Object,
        required: true
    },
    periodo: {
        type: Number,
        required: true
    },
    periodoIpress: {
        type: Number,
        required: true
    }
})

const router = useRouter()
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo
const idPeriodoIpress=periodoIpress
const periodoActual = ref([])
console.log("ajlkdjflkasjdflkasdf",periodoIpress)

const form = reactive({
    fecha_creacion_acceso_actual: null,
    tipo_acceso_actual:null,
    localizacion_acceso_actual:null,
    cambio_acceso: 'false',
    motivo_cambio: null,
    fecha_creacion_acceso_nuevo:null,
    tipo_acceso_nuevo:null,
    localizacion_acceso_nuevo:null,
    id_periodo_ipress: periodoIpress,
    id_red: 1,
    id_paciente: paciente.id_paciente

})
// Puedes usar props.paciente o hacer destructuring:

const opcionesLocalizacion = {
  'FAV': [ // FAV
    'Radial derecha',
    'Radial izquierda',
    'Braquial o cubital derecha',
    'Braquial o cubital izquierdo',
  ],
  'CVCT': [ // CVCT
    'Yugular derecha',
    'Yugular izquierda',
    'Subclavio derecho',
    'Subclavio izquierdo',
    'Femoral derecho',
    'Femoral izquierdo',
  ],
  'CVCLP': [ // CVCLP
    'Yugular derecha',
    'Yugular izquierda',
    'Subclavio derecho',
    'Subclavio izquierdo',
    'Femoral derecho',
    'Femoral izquierdo',
    'Translumbar',
    'Transhepático',
  ],
  'otros': [
    'Injerto autólogo',
    'Injerto protésico',
  ]
}
const localizacionesFiltradas = computed(() => {
  const tipo = form.tipo_acceso_nuevo;
  const base = opcionesLocalizacion[tipo] || [];
  return [...base, ...opcionesLocalizacion.otros];
});

const minFechaNuevoAcceso = computed(() => {
  if (!form.fecha_creacion_acceso_actual) return null;
  const fecha = new Date(form.fecha_creacion_acceso_actual);
  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString().split('T')[0]; // formato YYYY-MM-DD
});
const validarFormulario = () => {
  const camposObligatorios = [
    'fecha_creacion_acceso_nuevo',
    'tipo_acceso_nuevo',
    'localizacion_acceso_nuevo',
  ];

  for (const campo of camposObligatorios) {
    if (!form[campo]) {
      ElMessage({
        message: `Por favor complete el campo: ${campo}`,
        type: 'warning',
        plain: true,
      })
      return false;
    }
  }

  return true;
};
const postForm = async (url = null) => {
     if (!validarFormulario()) return;
    const formEnvio={
        fecha_creacion_acceso_actual:form.fecha_creacion_acceso_nuevo,
        tipo_acceso_actual:form.tipo_acceso_nuevo,
        localizacion_acceso_actual:form.localizacion_acceso_nuevo,
        cambio_acceso: null,
        motivo_cambio: null,
        fecha_creacion_acceso_nuevo:null,
        tipo_acceso_nuevo:null,
        localizacion_acceso_nuevo:null,
        id_periodo_ipress: periodoIpress,
        id_red: 1,
        id_paciente: paciente.id_paciente
    }
    try {
        await postAllIpress(url ?? "/unidadesActuales/", formEnvio);
        if(periodoActual.value[0]){
        console.log("editar")
            await editForm();
        }else{
            alert("Se registro con exito")
            window.location.reload()
        }

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const editForm = async (url = null) => {
    try {
        await patchAllIpress(url ?? "/unidadesActuales/"+periodoActual.value[0].id_unidad_actual+"/", form);
            alert("Se registro con exito")
            window.location.reload()
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchPeriodoActual = async (url = null) => {
    try {
        const respuesta = await getAllIpress( "/unidadesActuales/?id_periodo_ipress=" +periodoIpress);
        periodoActual.value = respuesta;
        form.fecha_creacion_acceso_actual = periodoActual.value[0].fecha_creacion_acceso_actual;
        form.tipo_acceso_actual = periodoActual.value[0].tipo_acceso_actual;
        form.localizacion_acceso_actual = periodoActual.value[0].localizacion_acceso_actual;
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const fetchPaciente = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
        console.log("paientes seleccionado", pacienteSeleccionado)

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const periodos = ref([])
// Otros datos
const mes = 'JULIO'
const anio = '2025'
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const clinicaSeleccionada = clinicas[0]

const modalidad = 'Hemodiálisis'

const fetchPeriodo = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/periodos/");
        periodos.value = respuesta;

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const edadPaciente = computed(() => {
    if (!pacienteSeleccionado.value?.fecha_nacimiento) return ''

    const hoy = new Date()
    const nacimiento = new Date(pacienteSeleccionado.value.fecha_nacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }

    return `${edad} años`
})

onMounted(() => {
    fetchPaciente();
    fetchPeriodo();
    fetchPeriodoActual();
});

</script>

<style scoped>
select,
input[type="text"],
input[type="date"] {
    font-size: 14px;
}
</style>