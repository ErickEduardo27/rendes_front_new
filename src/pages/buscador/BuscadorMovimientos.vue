<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
          Buscador de movimientos
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Busque por DNI o nombre del paciente y revise todo su historial de movimientos con las clínicas reales.
        </p>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">DNI o nombre del paciente</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            v-model="consulta"
            type="search"
            class="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
            placeholder="Ej.: 12345678 o APELLIDOS NOMBRES"
            @keydown.enter.prevent="buscarPacientes"
          />
          <button
            type="button"
            class="shrink-0 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
            :disabled="cargandoPacientes || !consulta.trim()"
            @click="buscarPacientes"
          >
            {{ cargandoPacientes ? 'Buscando…' : 'Buscar' }}
          </button>
        </div>
        <p v-if="errorBusqueda" class="mt-2 text-xs text-rose-700">{{ errorBusqueda }}</p>
      </div>

      <div v-if="resultadosPacientes.length" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <h2 class="text-sm font-bold text-slate-800">
            Resultados ({{ resultadosPacientes.length }})
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">Seleccione un paciente para ver sus movimientos.</p>
        </div>
        <ul class="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          <li v-for="p in resultadosPacientes" :key="p.id_paciente">
            <button
              type="button"
              class="w-full text-left px-4 py-3 hover:bg-cyan-50 transition-colors"
              :class="pacienteSeleccionado?.id_paciente === p.id_paciente ? 'bg-cyan-50 border-l-4 border-cyan-500' : ''"
              @click="seleccionarPaciente(p)"
            >
              <div class="text-sm font-semibold text-slate-800">{{ p.paciente || '—' }}</div>
              <div class="text-xs text-slate-500 mt-0.5">DNI {{ p.documento || '—' }}</div>
            </button>
          </li>
        </ul>
      </div>

      <div
        v-else-if="busquedaHecha && !cargandoPacientes && !errorBusqueda"
        class="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-10 text-center text-sm text-slate-500 italic"
      >
        No se encontraron pacientes con ese criterio.
      </div>

      <div v-if="pacienteSeleccionado" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50/40 flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-base font-bold text-slate-800 truncate">{{ pacienteSeleccionado.paciente }}</h2>
            <p class="text-sm text-slate-600 mt-0.5">DNI {{ pacienteSeleccionado.documento }}</p>
            <p class="text-xs text-slate-500 mt-1">
              {{ movimientos.length }} movimiento(s) en todas las clínicas
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              :class="esFallecido
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
            >
              {{ esFallecido ? 'Fallecido' : 'No fallecido' }}
            </span>
            <span
              v-if="esFallecido && detalleFallecimiento"
              class="text-[11px] text-rose-700 max-w-xs"
            >
              {{ detalleFallecimiento }}
            </span>
          </div>
        </div>

        <div class="p-4">
          <div v-if="cargandoMovimientos" class="py-12 text-center text-sm text-slate-500">
            Cargando movimientos…
          </div>
          <div v-else-if="!movimientos.length" class="py-12 text-center text-sm text-slate-500 italic">
            Este paciente no tiene movimientos registrados.
          </div>
          <div v-else class="overflow-x-auto border border-slate-200 rounded-lg">
            <table class="min-w-full text-xs">
              <thead class="bg-slate-50 border-b">
                <tr>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Fecha</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Tipo</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Condición</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Tipo egreso</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Periodo</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Clínica</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-500 uppercase">Modalidad</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="m in movimientos"
                  :key="m.id"
                  class="hover:bg-slate-50"
                  :class="esEgresoFallecimiento(m) ? 'bg-rose-50/60' : ''"
                >
                  <td class="px-3 py-2 whitespace-nowrap">{{ fechaCelda(m.fecha) }}</td>
                  <td class="px-3 py-2">
                    <span
                      class="inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded-full"
                      :class="m.tipo === 'INGRESO' ? 'bg-green-100 text-green-800'
                        : m.tipo === 'EGRESO' ? 'bg-red-100 text-red-800'
                        : m.tipo === 'CAMBIO_MODALIDAD' ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-blue-100 text-blue-800'"
                    >
                      {{ m.tipo === 'CAMBIO_MODALIDAD' ? 'CAMBIO MOD.' : m.tipo }}
                    </span>
                  </td>
                  <td class="px-3 py-2">{{ m.condicion }}</td>
                  <td class="px-3 py-2">
                    <span :class="esEgresoFallecimiento(m) ? 'font-semibold text-rose-700' : ''">
                      {{ m.tipo_egreso || '—' }}
                    </span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap">{{ m.periodo }}</td>
                  <td class="px-3 py-2 font-medium text-slate-800">{{ m.clinica }}</td>
                  <td class="px-3 py-2 max-w-[180px] truncate" :title="m.modalidad">{{ m.modalidad }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { fechaCelda, parseFechaAISO } from '@/utils/fechaFormat';
import { esSupervisor } from '@/utils/perfil';

const router = useRouter();

onMounted(() => {
  if (!esSupervisor()) {
    router.replace({ name: 'Inicio' });
  }
});

const consulta = ref('');
const cargandoPacientes = ref(false);
const cargandoMovimientos = ref(false);
const busquedaHecha = ref(false);
const errorBusqueda = ref('');
const resultadosPacientes = ref([]);
const pacienteSeleccionado = ref(null);
const movimientos = ref([]);

const MODALIDADES = {
  1: 'HEMODIALISIS',
  2: 'DIALISIS PERITONEAL',
  3: 'TRASPLANTE',
};

function listaDesdeResponse(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.results)) return res.results;
  return [];
}

function extraerTipoEgresoDesdeObs(observaciones) {
  const obs = String(observaciones || '').trim();
  if (!obs) return null;
  const match = obs.match(/^Egreso:\s*([^.]+)/i);
  return match ? match[1].trim() : obs;
}

function etiquetaModalidad(id) {
  if (id == null || id === '') return '—';
  return MODALIDADES[Number(id)] || String(id);
}

function mapearAtencion(mov) {
  const tipoAtencion = String(mov.tipo_atencion || '').toUpperCase();
  const estadoAtencion = String(mov.estado || '').toUpperCase();
  let tipo = 'INGRESO';
  if (tipoAtencion === 'CAMBIO_MODALIDAD') tipo = 'CAMBIO_MODALIDAD';
  else if (tipoAtencion === 'EGRESO' || estadoAtencion === 'EGRESADO') tipo = 'EGRESO';

  const modalidadLabel = mov.datosModalidad?.modalidad
    || etiquetaModalidad(mov.id_modalidad ?? mov.datosModalidad?.id_modalidad);

  const fechaMov = parseFechaAISO(mov.fecha_atencion)
    || parseFechaAISO(mov.fecha_fin)
    || parseFechaAISO(mov.created_at)
    || 'N/A';

  return {
    id: mov.id_paciente_atencion,
    tipo,
    condicion: tipo === 'EGRESO'
      ? 'EGRESADO'
      : (tipoAtencion === 'CAMBIO_MODALIDAD' ? 'CAMBIO_MODALIDAD' : (mov.tipo_atencion || 'N/A')),
    fecha: fechaMov,
    tipo_egreso: tipo === 'EGRESO' ? extraerTipoEgresoDesdeObs(mov.observaciones) : null,
    observaciones: mov.observaciones,
    periodo: mov.datosPeriodo?.periodo || '—',
    clinica: mov.datosIpress?.nombre_corto || mov.datosIpress?.ipress || '—',
    modalidad: modalidadLabel,
    created_at: mov.created_at,
  };
}

function compararFechaDesc(a, b) {
  const cmpFecha = String(b.fecha || '').localeCompare(String(a.fecha || ''));
  if (cmpFecha !== 0) return cmpFecha;
  const cmpCreated = String(b.created_at || '').localeCompare(String(a.created_at || ''));
  if (cmpCreated !== 0) return cmpCreated;
  return (Number(b.id) || 0) - (Number(a.id) || 0);
}

function esEgresoFallecimiento(m) {
  if (!m || String(m.tipo || '').toUpperCase() !== 'EGRESO') return false;
  const texto = `${m.tipo_egreso || ''} ${m.observaciones || ''}`.toLowerCase();
  return texto.includes('fallec');
}

const esFallecido = computed(() => movimientos.value.some(esEgresoFallecimiento));

const detalleFallecimiento = computed(() => {
  const egreso = movimientos.value.find(esEgresoFallecimiento);
  if (!egreso) return '';
  const fecha = fechaCelda(egreso.fecha);
  const clinica = egreso.clinica || '—';
  return `Egreso por fallecimiento el ${fecha} · ${clinica}`;
});

async function buscarPacientes() {
  const q = consulta.value.trim();
  errorBusqueda.value = '';
  busquedaHecha.value = false;
  resultadosPacientes.value = [];
  pacienteSeleccionado.value = null;
  movimientos.value = [];

  if (!q) {
    errorBusqueda.value = 'Ingrese un DNI o nombre para buscar.';
    return;
  }
  if (q.length < 2) {
    errorBusqueda.value = 'Ingrese al menos 2 caracteres.';
    return;
  }

  cargandoPacientes.value = true;
  try {
    const params = new URLSearchParams({ q });
    const res = await getAllIpress(`/pacientes/?${params.toString()}`);
    const lista = listaDesdeResponse(res);
    // Limitar resultados visibles
    resultadosPacientes.value = lista.slice(0, 40);
    busquedaHecha.value = true;

    if (resultadosPacientes.value.length === 1) {
      await seleccionarPaciente(resultadosPacientes.value[0]);
    }
  } catch (e) {
    console.error(e);
    errorBusqueda.value = e?.error || e?.message || 'No se pudo realizar la búsqueda.';
  } finally {
    cargandoPacientes.value = false;
  }
}

async function seleccionarPaciente(paciente) {
  if (!paciente?.id_paciente) return;
  pacienteSeleccionado.value = paciente;
  cargandoMovimientos.value = true;
  movimientos.value = [];
  try {
    const res = await getAllIpress(`/pacienteAtencion/?id_paciente=${encodeURIComponent(paciente.id_paciente)}`);
    const lista = listaDesdeResponse(res).map(mapearAtencion);
    lista.sort(compararFechaDesc);
    movimientos.value = lista;
  } catch (e) {
    console.error(e);
    errorBusqueda.value = 'No se pudieron cargar los movimientos del paciente.';
  } finally {
    cargandoMovimientos.value = false;
  }
}
</script>
