<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-6xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
            Tasa BRC
          </h1>
          <p class="text-slate-500 mt-1 text-sm">
            Bacteriemia relacionada a catéter por 1000 días-catéter. Solo pacientes de Hemodiálisis con
            catéter venoso central de larga permanencia.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
            :disabled="cargando"
            @click="cargar"
          >
            Actualizar
          </button>
          <button
            type="button"
            class="px-4 py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-cyan-700 disabled:opacity-50"
            :disabled="cargando || !filas.length"
            @click="exportarExcel"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <p
        v-if="modalidadGlobal != null && modalidadGlobal !== '' && Number(modalidadGlobal) !== ID_MODALIDAD_HD"
        class="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
      >
        La tasa BRC se calcula siempre sobre Hemodiálisis, independientemente de la modalidad seleccionada.
      </p>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="!periodoGlobal || !clinicaGlobal" class="p-12 text-center text-slate-500 italic">
          Seleccione periodo y clínica.
        </div>
        <div v-else-if="cargando" class="p-12 text-center text-slate-500">Calculando...</div>
        <div v-else-if="error" class="p-12 text-center text-rose-600">{{ error }}</div>
        <div v-else-if="!filas.length" class="p-12 text-center text-slate-500 italic">
          No hay pacientes con catéter de larga permanencia en el periodo seleccionado.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="tabla-brc">
            <thead>
              <tr>
                <th rowspan="2" class="text-left">N°</th>
                <th rowspan="2" class="text-left">Apellidos y nombres de pacientes</th>
                <th rowspan="2" class="text-left">DNI</th>
                <th colspan="4">Periodo de seguimiento {{ mesPeriodo }}</th>
              </tr>
              <tr>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Días</th>
                <th>Evento BRC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(f, i) in filas" :key="`${f.idPaciente}-${f.inicio}`">
                <td class="text-slate-500">{{ i + 1 }}</td>
                <td class="text-left font-medium text-slate-800">{{ f.paciente }}</td>
                <td class="text-left text-slate-600">{{ f.documento }}</td>
                <td>{{ fechaCelda(f.inicio) }}</td>
                <td>{{ fechaCelda(f.fin) }}</td>
                <td>{{ f.dias }}</td>
                <td>{{ f.eventos || '' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fila-total">
                <td colspan="5" class="text-left">Total de días - catéter</td>
                <td>{{ totalDias }}</td>
                <td>{{ totalEventos }}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-left">Suma de días-catéter: <strong>DENOMINADOR</strong></td>
                <td>{{ totalDias }}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-left">Número de episodios de infección CVC: <strong>NUMERADOR</strong></td>
                <td>{{ totalEventos }}</td>
              </tr>
              <tr class="fila-total">
                <td colspan="6" class="text-left">Tasa BRC x 1000 días catéter</td>
                <td>{{ tasaTexto }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { fechaCelda } from '@/utils/fechaFormat';
import { rangoFechasDesdePeriodoTexto } from '@/utils/accesoVascularValidacion';
import { filasBrcPaciente, tasaBrcPorMilDias } from '@/utils/tasaBrc';

const ID_MODALIDAD_HD = 1;
const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
const LOTE_CONSULTAS = 8;

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const cargando = ref(false);
const error = ref('');
const filas = ref([]);
const periodoTexto = ref('');

const mesPeriodo = computed(() => {
  const [y, m] = String(periodoTexto.value || '').split('-').map(Number);
  return m ? `${MESES[m - 1]} ${y}` : '';
});
const totalDias = computed(() => filas.value.reduce((s, f) => s + f.dias, 0));
const totalEventos = computed(() => filas.value.reduce((s, f) => s + f.eventos, 0));
const tasaTexto = computed(() => {
  const t = tasaBrcPorMilDias(totalEventos.value, totalDias.value);
  return t == null ? '—' : t.toFixed(1);
});

function aLista(res) {
  return Array.isArray(res) ? res : (res?.results || []);
}

function idPacienteDe(row) {
  return row?.id_paciente
    ?? row?.datosPaciente?.id_paciente
    ?? row?.datosPacienteAtencion?.id_paciente
    ?? row?.datosPacienteAtencion?.datosPaciente?.id_paciente
    ?? null;
}

async function resolverPeriodoTexto(idPeriodo) {
  const lista = aLista(await getAllIpress('/periodos/'));
  const p = lista.find((x) => String(x.id_periodo) === String(idPeriodo));
  return p?.periodo || '';
}

async function unidadesPorPaciente(ids) {
  const mapa = new Map();
  for (let i = 0; i < ids.length; i += LOTE_CONSULTAS) {
    const lote = ids.slice(i, i + LOTE_CONSULTAS);
    const respuestas = await Promise.all(
      lote.map((id) => getAllIpress(`/unidadesActuales/?id_paciente=${encodeURIComponent(id)}`).catch(() => [])),
    );
    lote.forEach((id, j) => mapa.set(String(id), aLista(respuestas[j])));
  }
  return mapa;
}

async function cargar() {
  filas.value = [];
  error.value = '';
  if (!periodoGlobal.value || !clinicaGlobal.value) return;
  cargando.value = true;
  try {
    const qs = new URLSearchParams({
      id_periodo: String(periodoGlobal.value),
      id_ipress: String(clinicaGlobal.value),
      id_modalidad: String(ID_MODALIDAD_HD),
    }).toString();
    const [resAt, resEv, texto] = await Promise.all([
      getAllIpress(`/pacienteAtencion/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      resolverPeriodoTexto(periodoGlobal.value),
    ]);
    periodoTexto.value = texto;
    const rango = rangoFechasDesdePeriodoTexto(texto);
    if (!rango.min) {
      error.value = 'No se pudo determinar el rango de fechas del periodo.';
      return;
    }

    const atencionesPorPaciente = new Map();
    for (const a of aLista(resAt)) {
      const id = idPacienteDe(a);
      if (id == null) continue;
      const k = String(id);
      if (!atencionesPorPaciente.has(k)) atencionesPorPaciente.set(k, []);
      atencionesPorPaciente.get(k).push(a);
    }
    const eventosPorPaciente = new Map();
    for (const ev of aLista(resEv)) {
      const id = idPacienteDe(ev);
      if (id == null) continue;
      const k = String(id);
      if (!eventosPorPaciente.has(k)) eventosPorPaciente.set(k, []);
      eventosPorPaciente.get(k).push(ev);
    }

    const unidades = await unidadesPorPaciente([...atencionesPorPaciente.keys()]);

    const resultado = [];
    for (const [idPaciente, atenciones] of atencionesPorPaciente) {
      const datos = atenciones.find((a) => a.datosPaciente)?.datosPaciente || {};
      const filasPaciente = filasBrcPaciente({
        atenciones,
        unidades: unidades.get(idPaciente) || [],
        eventos: eventosPorPaciente.get(idPaciente) || [],
        rango,
      });
      for (const f of filasPaciente) {
        resultado.push({
          ...f,
          idPaciente,
          paciente: datos.paciente || '—',
          documento: datos.documento || '—',
        });
      }
    }
    resultado.sort((a, b) => a.paciente.localeCompare(b.paciente, 'es') || a.inicio.localeCompare(b.inicio));
    filas.value = resultado;
  } catch (e) {
    console.error('Error al calcular tasa BRC:', e);
    error.value = 'No se pudo calcular la tasa BRC.';
  } finally {
    cargando.value = false;
  }
}

function exportarExcel() {
  try {
    const aoa = [
      ['TASA BRC', '', '', `PERIODO DE SEGUIMIENTO ${mesPeriodo.value}`],
      ['N°', 'APELLIDOS Y NOMBRES DE PACIENTES', 'DNI', 'INICIO', 'FIN', 'DIAS', 'EVENTO BRC'],
      ...filas.value.map((f, i) => [
        i + 1, f.paciente, f.documento, fechaCelda(f.inicio), fechaCelda(f.fin), f.dias, f.eventos || '',
      ]),
      ['', 'TOTAL DE DIAS - CATETER', '', '', '', totalDias.value, totalEventos.value],
      ['', 'SUMA DE DIAS-CATÉTER: DENOMINADOR', '', '', '', '', totalDias.value],
      ['', 'NUMERO DE EPISODIOS DE INFECCION CVC: NUMERADOR', '', '', '', '', totalEventos.value],
      ['', 'TASA BRC x 1000 dias catéter', '', '', '', '', tasaTexto.value],
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 5 }, { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasa BRC');
    XLSX.writeFile(wb, `tasa_brc_${periodoTexto.value || 'periodo'}.xlsx`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  }
}

watch([periodoGlobal, clinicaGlobal], cargar);
onMounted(cargar);
</script>

<style scoped>
.tabla-brc {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.tabla-brc th,
.tabla-brc td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  text-align: center;
  white-space: nowrap;
}
.tabla-brc thead th {
  background: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.tabla-brc tbody tr:hover {
  background: #f8fafc;
}
.tabla-brc tfoot td {
  background: #f8fafc;
  color: #334155;
}
.tabla-brc .fila-total td {
  background: #e2e8f0;
  font-weight: 700;
}
</style>
