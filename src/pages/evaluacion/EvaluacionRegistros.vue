<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-violet-500 rounded-full"></span>
          Evaluación de registros
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Revise y apruebe o desapruebe los registros cargados por las clínicas. Usa el mismo periodo, IPRESS y modalidad de la barra superior.
        </p>
        <p class="text-xs text-slate-500 mt-2">
          <strong>Aprobar</strong> marca el registro como revisado favorablemente; <strong>Desaprobar</strong> lo deja para corrección en la clínica.
        </p>
        <p class="text-xs text-slate-500 mt-1">
          Solo se muestra el <strong>último registro</strong> de cada paciente (mayor ID del formulario = fila más reciente en base de datos).
        </p>
      </div>

      <div class="flex flex-wrap gap-1 mb-4 border-b border-slate-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="modulo === tab.key ? 'bg-white text-violet-700 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="modulo = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="!filtroListo" class="p-12 text-center text-slate-500">Seleccione periodo, clínica y modalidad en la barra superior.</div>
        <div v-else-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>

        <template v-else>
        <div
          v-if="mostrarBannerAbrir"
          class="px-4 py-3 border-b border-amber-100 bg-amber-50/90 flex flex-wrap items-center justify-between gap-3"
        >
          <p class="text-sm text-amber-950">
            El formulario de <strong>{{ etiquetaModuloActual }}</strong> está <strong>cerrado</strong> para este periodo, clínica y modalidad. Las clínicas no pueden registrar hasta que lo abra.
          </p>
          <button
            type="button"
            class="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            :disabled="abriendoFormulario"
            @click="confirmarAbrirFormulario"
          >
            {{ abriendoFormulario ? 'Abriendo…' : 'Abrir formulario' }}
          </button>
        </div>

        <div
          v-else-if="puedeCerrarFormulario"
          class="px-4 py-3 border-b border-emerald-100 bg-emerald-50/80 flex flex-wrap items-center justify-between gap-3"
        >
          <p class="text-sm text-emerald-900">
            Todos los registros visibles están <strong>aprobados</strong>. Puede cerrar el formulario para este periodo, clínica y modalidad.
          </p>
          <button
            type="button"
            class="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
            :disabled="cerrandoFormulario"
            @click="confirmarCerrarFormulario"
          >
            {{ cerrandoFormulario ? 'Cerrando…' : 'Cerrar formulario' }}
          </button>
        </div>

        <!-- Acceso vascular -->
        <div v-if="modulo === 'acceso'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de acceso vascular.</div>
          <table v-else class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipo acceso</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Localización</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostrada" :key="r.id_unidad_actual" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.tipo_acceso || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.localizacion_acceso || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('acceso', r.id_unidad_actual)"
                      @click="evaluar('acceso', r, 'APROBADO')"
                    >Aprobar</button>
                    <button
                      v-if="mostrarBotonDesaprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('acceso', r.id_unidad_actual)"
                      @click="evaluar('acceso', r, 'DESAPROBADO')"
                    >Desaprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Eventos infecciosos -->
        <div v-else-if="modulo === 'eventos'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay eventos infecciosos.</div>
          <table v-else class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipo infección</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Fecha evento</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostrada" :key="r.id_evento_acceso_vascular" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.tipo_infeccion || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.fecha_evento || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('eventos', r.id_evento_acceso_vascular)"
                      @click="evaluar('eventos', r, 'APROBADO')"
                    >Aprobar</button>
                    <button
                      v-if="mostrarBotonDesaprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('eventos', r.id_evento_acceso_vascular)"
                      @click="evaluar('eventos', r, 'DESAPROBADO')"
                    >Desaprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Morbilidad -->
        <div v-else-if="modulo === 'morbilidad'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de morbilidad hospitalaria.</div>
          <table v-else class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Diagnóstico</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">F. hospitalización</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostrada" :key="r.id_morbilidad_hospitalaria" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.diagnostico || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.fecha_hospitalizacion || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('morbilidad', r.id_morbilidad_hospitalaria)"
                      @click="evaluar('morbilidad', r, 'APROBADO')"
                    >Aprobar</button>
                    <button
                      v-if="mostrarBotonDesaprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('morbilidad', r.id_morbilidad_hospitalaria)"
                      @click="evaluar('morbilidad', r, 'DESAPROBADO')"
                    >Desaprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resultados clínicos -->
        <div v-else-if="modulo === 'resultados'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay resultados clínicos.</div>
          <table v-else class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Hb</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Kt/V</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostrada" :key="r.id_resultado_clinico" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.Hb ?? r.hb ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.ktv ?? '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('resultados', r.id_resultado_clinico)"
                      @click="evaluar('resultados', r, 'APROBADO')"
                    >Aprobar</button>
                    <button
                      v-if="mostrarBotonDesaprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('resultados', r.id_resultado_clinico)"
                      @click="evaluar('resultados', r, 'DESAPROBADO')"
                    >Desaprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vacunación -->
        <div v-else-if="modulo === 'vacunacion'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de vacunación.</div>
          <table v-else class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Resumen</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostrada" :key="r.id_vacunacion" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ resumenVacuna(r) }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('vacunacion', r.id_vacunacion)"
                      @click="evaluar('vacunacion', r, 'APROBADO')"
                    >Aprobar</button>
                    <button
                      v-if="mostrarBotonDesaprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('vacunacion', r.id_vacunacion)"
                      @click="evaluar('vacunacion', r, 'DESAPROBADO')"
                    >Desaprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import { ElMessage, ElMessageBox } from 'element-plus';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const tabs = [
  { key: 'acceso', label: 'Acceso Vascular' },
  { key: 'eventos', label: 'Eventos Infecciosos' },
  { key: 'morbilidad', label: 'Morbilidad Hospitalaria' },
  { key: 'resultados', label: 'Resultados Clínicos' },
  { key: 'vacunacion', label: 'Vacunación' },
];

const modulo = ref('acceso');
const cargando = ref(false);
const evaluando = ref(null);
const cerrandoFormulario = ref(false);
const abriendoFormulario = ref(false);
/** null = aún no consultado; true/false según rf_estado_formulario_periodo */
const formularioEstaAbierto = ref(null);
const cargandoEstadoFormulario = ref(false);

const listaAcceso = ref([]);
const listaEventos = ref([]);
const listaMorbilidad = ref([]);
const listaResultados = ref([]);
const listaVacunacion = ref([]);

const filtroListo = computed(() => {
  return (
    periodoGlobal.value != null &&
    periodoGlobal.value !== '' &&
    clinicaGlobal.value != null &&
    clinicaGlobal.value !== '' &&
    modalidadGlobal.value != null &&
    modalidadGlobal.value !== ''
  );
});

function buildQs() {
  const params = new URLSearchParams();
  if (periodoGlobal.value != null && periodoGlobal.value !== '') params.set('id_periodo', periodoGlobal.value);
  if (clinicaGlobal.value != null && clinicaGlobal.value !== '') params.set('id_ipress', clinicaGlobal.value);
  if (modalidadGlobal.value != null && modalidadGlobal.value !== '') params.set('id_modalidad', modalidadGlobal.value);
  return params.toString();
}

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}

function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

function claseEstado(estado) {
  const v = String(estado || '').toUpperCase();
  if (v === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (v === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
}

function claveFila(mod, id) {
  return `${mod}-${id}`;
}

function resumenVacuna(r) {
  const parts = [r.vhb, r.dosis_covid, r.fecha_influenza].filter(Boolean);
  return parts.length ? parts.join(' · ') : '—';
}

/** Número de formulario (1–5) — alineado con ListaPacientes / rf_estado_formulario_periodo */
const ENDPOINTS = {
  acceso: { path: 'unidadesActuales', idKey: 'id_unidad_actual', idFormulario: 1 },
  eventos: { path: 'eventosAccesosVasculares', idKey: 'id_evento_acceso_vascular', idFormulario: 2 },
  morbilidad: { path: 'morbilidadesHospitalarias', idKey: 'id_morbilidad_hospitalaria', idFormulario: 3 },
  resultados: { path: 'resultadosClinicos', idKey: 'id_resultado_clinico', idFormulario: 4 },
  vacunacion: { path: 'vacunaciones', idKey: 'id_vacunacion', idFormulario: 5 },
};

function idPacienteAtencionDe(r) {
  const v = r?.id_paciente_atencion ?? r?.datosPacienteAtencion?.id_paciente_atencion;
  return v != null && v !== '' ? String(v) : null;
}

/**
 * Un registro por paciente: el de mayor PK (idKey).
 * No usamos fecha_evaluacion ni fechas de negocio para ordenar: un registro ya evaluado
 * tenía fecha_evaluacion y ganaba frente a uno nuevo sin evaluar (mostraba el primero/antiguo).
 */
function ultimosRegistrosPorPaciente(rows, idField) {
  const grupos = new Map();
  for (const r of rows) {
    const pid = idPacienteAtencionDe(r);
    const clave = pid ?? `doc:${documentoPaciente(r)}`;
    const rid = Number(r[idField]) || 0;
    if (!grupos.has(clave)) grupos.set(clave, r);
    else {
      const prev = grupos.get(clave);
      const prevId = Number(prev[idField]) || 0;
      if (rid > prevId) grupos.set(clave, r);
    }
  }
  return Array.from(grupos.values());
}

function rawListaPorModulo(m) {
  switch (m) {
    case 'acceso':
      return listaAcceso.value;
    case 'eventos':
      return listaEventos.value;
    case 'morbilidad':
      return listaMorbilidad.value;
    case 'resultados':
      return listaResultados.value;
    case 'vacunacion':
      return listaVacunacion.value;
    default:
      return [];
  }
}

const listaMostrada = computed(() => {
  const cfg = ENDPOINTS[modulo.value];
  if (!cfg) return [];
  return ultimosRegistrosPorPaciente(rawListaPorModulo(modulo.value), cfg.idKey);
});

const etiquetaModuloActual = computed(() => {
  const t = tabs.find((x) => x.key === modulo.value);
  return t?.label || 'este formulario';
});

const todosRegistrosVisiblesAprobados = computed(() => {
  const rows = listaMostrada.value;
  if (!rows.length) return false;
  return rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
});

/** Solo si el formulario está abierto a nivel periodo/IPRESS/modalidad y todos los visibles aprobados */
const puedeCerrarFormulario = computed(() => {
  if (!filtroListo.value || formularioEstaAbierto.value !== true) return false;
  const rows = listaMostrada.value;
  if (!rows.length) return false;
  return rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
});

const mostrarBannerAbrir = computed(() => {
  return filtroListo.value && formularioEstaAbierto.value === false;
});

function mostrarBotonAprobar(estado) {
  return String(estado || '').toUpperCase() !== 'APROBADO';
}

function mostrarBotonDesaprobar(estado) {
  return String(estado || '').toUpperCase() !== 'DESAPROBADO';
}

async function fetchEstadoFormularioActual() {
  if (!filtroListo.value) {
    formularioEstaAbierto.value = null;
    return;
  }
  cargandoEstadoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    const res = await postAllIpress('/consulta_estado_formulario_moderno/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      numero_formulario: cfg.idFormulario,
    });
    formularioEstaAbierto.value = res?.abierto !== false;
  } catch (e) {
    console.error(e);
    formularioEstaAbierto.value = true;
  } finally {
    cargandoEstadoFormulario.value = false;
  }
}

async function confirmarAbrirFormulario() {
  try {
    await ElMessageBox.confirm(
      `Se abrirá el formulario «${etiquetaModuloActual.value}» para el periodo, clínica y modalidad seleccionados. Las clínicas podrán volver a registrar.`,
      '¿Abrir formulario?',
      { type: 'info', confirmButtonText: 'Sí, abrir', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  abriendoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    await postAllIpress('/cerrar_mes/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      id_formulario: cfg.idFormulario,
      estado: 1,
    });
    ElMessage.success('Formulario abierto correctamente.');
    await fetchEstadoFormularioActual();
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    const msg = e?.error || e?.response?.data?.error || e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo abrir el formulario.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo abrir el formulario.');
  } finally {
    abriendoFormulario.value = false;
  }
}

async function confirmarCerrarFormulario() {
  try {
    await ElMessageBox.confirm(
      'Se cerrará el formulario para el periodo, clínica y modalidad seleccionados. La clínica no podrá registrar hasta que se vuelva a abrir (estado 1 en gestión o vía API).',
      '¿Cerrar formulario?',
      { type: 'warning', confirmButtonText: 'Sí, cerrar', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  cerrandoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    await postAllIpress('/cerrar_mes/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      id_formulario: cfg.idFormulario,
      estado: 2,
    });
    ElMessage.success('Formulario cerrado correctamente.');
    await fetchEstadoFormularioActual();
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    const msg = e?.error || e?.response?.data?.error || e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo cerrar el formulario.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo cerrar el formulario.');
  } finally {
    cerrandoFormulario.value = false;
  }
}

async function cargarModuloActual() {
  if (!filtroListo.value) {
    listaAcceso.value = [];
    listaEventos.value = [];
    listaMorbilidad.value = [];
    listaResultados.value = [];
    listaVacunacion.value = [];
    return;
  }
  const qs = buildQs();
  cargando.value = true;
  try {
    if (modulo.value === 'acceso') {
      const res = await getAllIpress(`/unidadesActuales/?${qs}`);
      listaAcceso.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'eventos') {
      const res = await getAllIpress(`/eventosAccesosVasculares/?${qs}`);
      listaEventos.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'morbilidad') {
      const res = await getAllIpress(`/morbilidadesHospitalarias/?${qs}`);
      listaMorbilidad.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'resultados') {
      const res = await getAllIpress(`/resultadosClinicos/?${qs}`);
      listaResultados.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'vacunacion') {
      const res = await getAllIpress(`/vacunaciones/?${qs}`);
      listaVacunacion.value = Array.isArray(res) ? res : res?.results || [];
    }
  } catch (e) {
    console.error(e);
    ElMessage.error('Error al cargar los registros.');
  } finally {
    cargando.value = false;
  }
}

async function evaluar(mod, row, estadoAprobacion) {
  const cfg = ENDPOINTS[mod];
  const id = row?.[cfg.idKey];
  if (id == null) return;
  const key = claveFila(mod, id);
  evaluando.value = key;
  try {
    await postAllIpress(`/${cfg.path}/${id}/evaluar/`, { estado_aprobacion: estadoAprobacion });
    ElMessage.success(estadoAprobacion === 'APROBADO' ? 'Registro aprobado.' : 'Registro desaprobado.');
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.detail || e?.error || 'No se pudo actualizar el registro.');
  } finally {
    evaluando.value = null;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  cargarModuloActual();
  fetchEstadoFormularioActual();
}, { deep: true });
watch(modulo, () => {
  cargarModuloActual();
  fetchEstadoFormularioActual();
});

onMounted(() => {
  cargarModuloActual();
  fetchEstadoFormularioActual();
});
</script>
