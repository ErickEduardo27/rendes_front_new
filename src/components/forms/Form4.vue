<!-- <template>
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

        <div class="flex gap-6 mt-6">
            <div class="flex-1 space-y-6">
                <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Diagnóstico de Alta de Hospitalización (CIE10)</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Por Código:</label>
                <input v-model="filtroCodigo" type="text" placeholder="Buscar por código..."
                    class="w-full border rounded p-2 text-sm" />
            </div>

            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Por Descripción:</label>
                <input v-model="filtroDescripcion" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <div v-if="mostrarLista" class="space-y-1 mt-3">
            <ul>
                <li v-for="item in resultadosFiltrados" :key="item.id"
                    class="border p-2 rounded text-sm flex items-center gap-2">
                    <input type="checkbox" :value="item" v-model="seleccionados" />
                    <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                </li>
            </ul>
        </div>


        <div v-else-if="hayBusqueda" class="text-gray-500 text-sm italic mt-2">
            No se encontraron resultados.
        </div>


        <div v-if="seleccionados.length > 0" class="mt-4">
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Seleccionados:</h3>
            <ul class="space-y-1 text-sm">
                <li v-for="item in seleccionados" :key="item.id"
                    class="bg-gray-100 p-2 rounded flex justify-between items-center">
                    <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                    <button @click="quitarSeleccion(item)" class="text-red-500 hover:underline text-xs">Quitar</button>
                </li>
            </ul>
        </div>

        <hr />
        <h2 class="text-xl font-semibold mb-1">Datos Adicionales</h2>
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Inicio de Hospitalización</label>
                <input v-model="fIniHos" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fecha de Alta de Hospitalización</label>
                <input v-model="fAltHos" type="date" class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fuente *</label>
                <select v-model="fuente" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Epicrisis</option>
                    <option value="2">Informe de Alta</option>
                    <option value="3">Otro</option>
                </select>
            </div>
        </div>



        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
            </div>


            <div class="w-80 p-4 border rounded shadow">
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
    </div>
</template>


<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const filtroCodigo = ref('');
        const filtroDescripcion = ref('');
        const seleccionados = ref([]);
        const fIniHos = ref('');
        const fAltHos = ref('');
        const fuente = ref('');

        const items = ref([
            { id: 1, codigo: 'A123', descripcion: 'Hipertensión esencial' },
            { id: 2, codigo: 'B456', descripcion: 'Diabetes tipo 2' },
            { id: 3, codigo: 'C789', descripcion: 'Asma bronquial' },
            // Agrega más diagnósticos según lo necesites
        ]);

        const resultadosFiltrados = computed(() => {
            return items.value.filter((item) => {
                const coincideCodigo = filtroCodigo.value
                    ? item.codigo.toLowerCase().includes(filtroCodigo.value.toLowerCase())
                    : true;

                const coincideDescripcion = filtroDescripcion.value.length >= 3
                    ? item.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase())
                    : true;

                return coincideCodigo && coincideDescripcion;
            });
        });

        const hayBusqueda = computed(() => {
            return filtroCodigo.value.length > 0 || filtroDescripcion.value.length >= 3;
        });

        const mostrarLista = computed(() => {
            return hayBusqueda.value && resultadosFiltrados.value.length > 0;
        });

        const quitarSeleccion = (item) => {
            seleccionados.value = seleccionados.value.filter(sel => sel.id !== item.id);
        };


        return {
            filtroCodigo,
            filtroDescripcion,
            resultadosFiltrados,
            seleccionados,
            mostrarLista,
            hayBusqueda,
            quitarSeleccion,
            fIniHos,
            fAltHos,
            fuente,
        };
    },
};
</script> -->


<template>
  <div class="p-6 space-y-6">
    <!-- Botón de regreso -->
    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>

    <!-- Filtros Superiores -->
    <div class="flex items-center gap-2 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" disabled>
        <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
      </select>

      <label>Clínica:</label>
      <span>{{ pacienteSeleccionado.ipress }}</span>

      <label>Modalidad de Diálisis:</label>
      <span>{{ pacienteSeleccionado.id_modalidad == 1 ? 'Hemodiálisis' : 'Peritoneal' }}</span>
    </div>

    <!-- Contenido -->
    <div class="flex gap-6 mt-6">
      <!-- Formulario -->
      <div class="flex-1 space-y-6">
        <h2 class="text-2xl font-semibold">Morbilidad Hospitalaria</h2>

        <!-- Búsqueda -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold">Buscar por Código</label>
            <input v-model="form.filtroCodigo" type="text" class="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-semibold">Buscar por Descripción</label>
            <input v-model="form.filtroDescripcion" type="text" class="w-full border rounded p-2 text-sm" />
          </div>
        </div>

        <div v-if="mostrarLista" class="mt-2 space-y-2">
          <div v-for="item in resultadosFiltrados" :key="item.id" class="flex items-center gap-2">
            <input type="checkbox" :value="item" v-model="form.seleccionados" />
            <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
          </div>
        </div>
        <p v-else-if="hayBusqueda" class="italic text-gray-500">No se encontraron resultados.</p>

        <div v-if="form.seleccionados.length" class="mt-4">
          <h3 class="text-sm font-semibold mb-2">Seleccionados:</h3>
          <ul>
            <li v-for="item in form.seleccionados" :key="item.id" class="bg-gray-100 p-2 rounded flex justify-between">
              <span><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
              <button @click="quitarSeleccion(item)" class="text-red-500 text-xs">Quitar</button>
            </li>
          </ul>
        </div>

        <!-- Fechas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-semibold">Fecha de Inicio</label>
            <input v-model="form.fIniHos" type="date" class="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-semibold">Fecha de Alta</label>
            <input v-model="form.fAltHos" type="date" class="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label class="text-sm font-semibold">Fuente</label>
            <select v-model="form.fuente" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione</option>
              <option value="1">Epicrisis</option>
              <option value="2">Informe de Alta</option>
              <option value="3">Otro</option>
            </select>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-6">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm">Cancelar</button>
          <button @click="postForm()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm">Registrar</button>
        </div>
      </div>

      <!-- Perfil -->
      <div class="w-80 p-4 border rounded shadow">
        <div class="flex justify-center mb-2">
          <div class="bg-gray-300 rounded-full h-16 w-16"></div>
        </div>
        <p class="text-center font-bold">{{ pacienteSeleccionado.paciente }}</p>
        <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.documento }}</p>
        <ul class="text-sm text-gray-700 mt-4 space-y-1">
          <li><strong>Edad:</strong> {{ pacienteSeleccionado.fecha_nacimiento }}</li>
          <li><strong>Sexo:</strong> {{ pacienteSeleccionado.genero === 'M' ? 'Masculino' : 'Femenino' }}</li>
          <li><strong>Tipo de Registro:</strong> {{ pacienteSeleccionado.id_modalidad === 1 ? 'Hemodiálisis' : 'Peritoneal' }}</li>
          <li><strong>Estado:</strong> Nuevo</li>
          <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
// 👇 defineProps debe estar fuera de cualquier función
const props = defineProps({
  paciente: {
    type: Object,
    required: true
  },
  periodo: {
    type: Number,
    required: true
  }
})

const pacienteSeleccionado = props.paciente
const periodoSeleccionado = props.periodo
const paciente = props.paciente
const periodo = props.periodo
const periodos = ref([]);
const items = ref([
  { id: 1, codigo: 'A123', descripcion: 'Hipertensión esencial' },
  { id: 2, codigo: 'B456', descripcion: 'Diabetes tipo 2' },
  { id: 3, codigo: 'C789', descripcion: 'Asma bronquial' }
]);

const form = ref({
  filtroCodigo: '',
  filtroDescripcion: '',
  seleccionados: [],
  fIniHos: '',
  fAltHos: '',
  fuente: '',
  id_periodo_ipress:17,
    id_red:1,
    id_paciente:null
});
form.value.id_paciente=paciente.id_paciente
const resultadosFiltrados = computed(() => {
  return items.value.filter((item) => {
    const matchCod = form.value.filtroCodigo
      ? item.codigo.toLowerCase().includes(form.value.filtroCodigo.toLowerCase())
      : true;
    const matchDesc = form.value.filtroDescripcion.length >= 3
      ? item.descripcion.toLowerCase().includes(form.value.filtroDescripcion.toLowerCase())
      : true;
    return matchCod && matchDesc;
  });
});

const hayBusqueda = computed(() =>
  form.value.filtroCodigo.length > 0 || form.value.filtroDescripcion.length >= 3
);

const mostrarLista = computed(() =>
  hayBusqueda.value && resultadosFiltrados.value.length > 0
);

const quitarSeleccion = (item) => {
  form.value.seleccionados = form.value.seleccionados.filter(i => i.id !== item.id);
};

const postForm = async (url = null) => {
  try {
    const respuesta = await postAllIpress(url ?? "/morbilidadesHospitalarias/",form.value); 
    pacienteSeleccionado.value = respuesta;
    alert("Se registro con exito")
    window.location.reload()

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const fetchPeriodo = async () => {
  try {
    periodos.value = await getAllIpress("/periodos/");
  } catch (e) {
    console.error("Error obteniendo periodos:", e);
  }
};

onMounted(() => {
  fetchPeriodo();
});
</script>