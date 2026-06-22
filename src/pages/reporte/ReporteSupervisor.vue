<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4">
    <div class="w-full max-w-full mx-auto space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
            Reporte
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Resumen de la clínica seleccionada en la barra superior (periodo, IPRESS y modalidad).
          </p>
        </div>
        <button
          type="button"
          class="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          :disabled="cargando || !filtroListo"
          @click="cargarReporte"
        >
          {{ cargando ? 'Actualizando…' : 'Actualizar' }}
        </button>
      </div>

      <div v-if="!filtroListo" class="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        Seleccione periodo, clínica y modalidad en la barra superior.
      </div>

      <div v-else-if="cargando" class="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        Cargando reporte…
      </div>

      <template v-else>
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <!-- Pacientes -->
          <div class="xl:col-span-4 rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-50 p-5 shadow-sm border border-emerald-100">
            <div class="flex items-start gap-3">
              <div class="text-5xl font-extrabold text-emerald-800 tabular-nums">{{ stats.totalPacientes }}</div>
              <div class="text-emerald-700 text-3xl opacity-60">👥</div>
            </div>
            <p class="text-sm text-slate-700 mt-3 leading-relaxed">{{ stats.textoDemografia }}</p>
          </div>

          <!-- Acceso vascular -->
          <div class="xl:col-span-5 rounded-xl bg-gradient-to-br from-lime-100 to-green-50 p-5 shadow-sm border border-green-100 space-y-3">
            <div v-if="stats.alertCvct" class="rounded-lg bg-white/80 border border-amber-200 px-3 py-2 text-xs text-amber-900 flex gap-2">
              <span>⚠️</span>
              <span>{{ stats.alertCvct }}</span>
            </div>
            <h3 class="text-xs font-bold uppercase tracking-wide text-green-800">Tipo de acceso en unidad actual</h3>
            <div class="flex items-end justify-around gap-1 min-h-[120px] pt-2">
              <div v-for="bar in stats.barrasAcceso" :key="bar.label" class="flex flex-col items-center flex-1 min-w-0">
                <span class="text-[9px] font-semibold text-green-900 mb-0.5">{{ bar.pct }}%</span>
                <div
                  class="w-full max-w-[2.5rem] rounded-t bg-green-600/90"
                  :style="{ height: `${bar.altura}px` }"
                  :title="`${bar.cantidad} pacientes`"
                />
                <span class="text-[8px] text-center text-green-900 mt-1 leading-tight">{{ bar.label }}</span>
                <span class="text-[8px] text-green-700">({{ bar.cantidad }})</span>
              </div>
            </div>
          </div>

          <!-- Alertas clínicas -->
          <div class="xl:col-span-3 rounded-xl bg-gradient-to-b from-orange-200 to-orange-100 p-5 shadow-sm border border-orange-200 flex flex-col justify-center gap-3">
            <div class="rounded-xl bg-white/90 px-3 py-2 text-xs text-slate-800 shadow-sm">
              {{ stats.alertaHb }}
            </div>
            <div class="rounded-xl bg-white/90 px-3 py-2 text-xs text-slate-800 shadow-sm">
              {{ stats.alertaKtv }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- Hb / Kt/V registro -->
          <div class="rounded-xl bg-sky-50 border border-sky-100 p-4 space-y-3">
            <h3 class="text-xs font-bold text-sky-900 uppercase">Hemoglobina (Hb)</h3>
            <div class="flex items-end justify-around gap-1 min-h-[90px]">
              <div v-for="bar in stats.barrasHbRegistro" :key="bar.label" class="flex flex-col items-center flex-1">
                <span class="text-[9px] font-semibold">{{ bar.pct }}%</span>
                <div class="w-full max-w-[2rem] rounded-t bg-sky-500" :style="{ height: `${bar.altura}px` }" />
                <span class="text-[8px] text-center mt-1">{{ bar.label }}</span>
              </div>
            </div>
            <div class="flex items-end justify-around gap-1 min-h-[90px] border-t border-sky-100 pt-2">
              <div v-for="bar in stats.barrasHbRo" :key="bar.label" class="flex flex-col items-center flex-1">
                <span class="text-[9px] font-semibold">{{ bar.pct }}%</span>
                <div class="w-full max-w-[2rem] rounded-t bg-rose-400" :style="{ height: `${bar.altura}px` }" />
                <span class="text-[8px] text-center mt-1 leading-tight">{{ bar.label }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl bg-indigo-50 border border-indigo-100 p-4 space-y-3">
            <h3 class="text-xs font-bold text-indigo-900 uppercase">Kt/V</h3>
            <div class="flex items-end justify-around gap-1 min-h-[90px]">
              <div v-for="bar in stats.barrasKtvRegistro" :key="bar.label" class="flex flex-col items-center flex-1">
                <span class="text-[9px] font-semibold">{{ bar.pct }}%</span>
                <div class="w-full max-w-[2rem] rounded-t bg-indigo-500" :style="{ height: `${bar.altura}px` }" />
                <span class="text-[8px] text-center mt-1">{{ bar.label }}</span>
              </div>
            </div>
            <div class="flex items-end justify-around gap-1 min-h-[90px] border-t border-indigo-100 pt-2">
              <div v-for="bar in stats.barrasKtvRo" :key="bar.label" class="flex flex-col items-center flex-1">
                <span class="text-[9px] font-semibold">{{ bar.pct }}%</span>
                <div class="w-full max-w-[2rem] rounded-t bg-violet-500" :style="{ height: `${bar.altura}px` }" />
                <span class="text-[8px] text-center mt-1 leading-tight">{{ bar.label }}</span>
              </div>
            </div>
          </div>

          <!-- Serología -->
          <div class="rounded-xl bg-amber-50 border border-amber-100 p-4 lg:col-span-2">
            <h3 class="text-xs font-bold text-amber-900 uppercase mb-2">Condición serológica actual</h3>
            <p class="text-xs text-slate-700 mb-3">{{ stats.textoSerologia }}</p>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="sero in stats.barrasSerologia" :key="sero.campo" class="space-y-1">
                <div class="text-[10px] font-bold text-center text-amber-900">{{ sero.campo }}</div>
                <div class="flex items-end justify-center gap-0.5 min-h-[70px]">
                  <div v-for="bar in sero.barras" :key="bar.label" class="flex flex-col items-center w-1/3">
                    <span class="text-[8px]">{{ bar.pct }}%</span>
                    <div class="w-full max-w-[1.25rem] rounded-t" :class="bar.color" :style="{ height: `${bar.altura}px` }" />
                    <span class="text-[7px] text-center leading-tight mt-0.5">{{ bar.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vacunación -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="vac in stats.tarjetasVacunacion"
            :key="vac.titulo"
            class="rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 p-4"
          >
            <h3 class="text-xs font-bold text-blue-900 uppercase mb-2">{{ vac.titulo }}</h3>
            <div class="flex items-end justify-around gap-1 min-h-[80px] mb-2">
              <div v-for="bar in vac.barras" :key="bar.label" class="flex flex-col items-center flex-1 min-w-0">
                <span class="text-[8px] font-semibold">{{ bar.pct }}%</span>
                <div class="w-full max-w-[1.5rem] rounded-t bg-blue-500" :style="{ height: `${bar.altura}px` }" />
                <span class="text-[7px] text-center mt-0.5 leading-tight">{{ bar.label }}</span>
              </div>
            </div>
            <p class="text-xs text-slate-700">{{ vac.texto }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue';
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { esTipoAccesoTemporal } from '@/utils/accesoVascularValidacion';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const nombreClinica = ref('');

const cargando = ref(false);
const pacientes = ref([]);
const accesos = ref([]);
const resultados = ref([]);
const vacunaciones = ref([]);

const filtroListo = computed(() =>
  periodoGlobal.value != null && periodoGlobal.value !== ''
  && clinicaGlobal.value != null && clinicaGlobal.value !== ''
  && modalidadGlobal.value != null && modalidadGlobal.value !== '',
);

function buildQs() {
  const p = new URLSearchParams();
  p.set('id_periodo', String(periodoGlobal.value));
  p.set('id_ipress', String(clinicaGlobal.value));
  p.set('id_modalidad', String(modalidadGlobal.value));
  return p.toString();
}

function parseFechaNac(fecha) {
  if (!fecha) return null;
  const s = String(fecha).trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T12:00:00`);
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T12:00:00`);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function edadAnios(fechaNac) {
  const d = parseFechaNac(fechaNac);
  if (!d) return null;
  const hoy = new Date();
  let e = hoy.getFullYear() - d.getFullYear();
  const m = hoy.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < d.getDate())) e -= 1;
  return e;
}

function esMujer(genero) {
  const g = String(genero || '').trim().toLowerCase();
  return g === 'f' || g.startsWith('fem') || g === 'mujer' || g === '2';
}

function esVaron(genero) {
  const g = String(genero || '').trim().toLowerCase();
  return g === 'm' || g.startsWith('mas') || g === 'varon' || g === 'hombre' || g === '1';
}

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

function alturaBarra(pctVal, max = 72) {
  return Math.max(6, Math.round((pctVal / 100) * max));
}

function barrasDesdeConteo(mapa, orden, total) {
  return orden.map((label) => {
    const cantidad = mapa[label] || 0;
    const p = pct(cantidad, total);
    return { label, cantidad, pct: p, altura: alturaBarra(p) };
  });
}

function normalizarTipoAcceso(tipo) {
  const t = String(tipo || '').trim().toUpperCase();
  if (!t) return 'No registrado';
  if (/^FAV|FÍSTULA|FISTULA/.test(t)) return 'FAV';
  if (/AUTOINJERTO/.test(t)) return 'Autoinjerto';
  if (/INJERTO/.test(t) && !/AUTO/.test(t)) return 'Injerto';
  if (/CVCP|CVC\s*P|PERMANENTE/.test(t)) return 'CVCP';
  if (/CVCT|CVC\s*T|TEMPORAL/.test(t)) return 'CVCT';
  return t.length <= 12 ? t : t.slice(0, 12);
}

function ultimoPorPaciente(rows, idKey) {
  const map = new Map();
  for (const r of rows || []) {
    const pid = r?.id_paciente_atencion
      ?? r?.datosPacienteAtencion?.id_paciente_atencion
      ?? r?.datosPaciente?.id_paciente;
    const clave = pid != null ? String(pid) : `doc:${r?.datosPacienteAtencion?.datosPaciente?.documento || ''}`;
    const rid = Number(r[idKey]) || 0;
    const prev = map.get(clave);
    if (!prev || rid > (Number(prev[idKey]) || 0)) map.set(clave, r);
  }
  return [...map.values()];
}

function esPositivoSerologia(val) {
  return String(val || '').trim().toLowerCase().includes('positivo');
}

function tieneRegistro(val) {
  return val != null && String(val).trim() !== '';
}

function parseNum(val) {
  if (val == null || val === '') return null;
  const n = Number(String(val).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

const stats = computed(() => {
  const listaPac = pacientes.value || [];
  const total = listaPac.length;
  const nombreClinicaTxt = nombreClinica.value || 'la IPRESS seleccionada';

  let mujeres = 0;
  let varones = 0;
  let edad60 = 0;
  for (const p of listaPac) {
    const gen = p.datosPaciente?.genero ?? p.genero;
    if (esMujer(gen)) mujeres += 1;
    else if (esVaron(gen)) varones += 1;
    const edad = edadAnios(p.datosPaciente?.fecha_nacimiento ?? p.fecha_nacimiento);
    if (edad != null && edad >= 60) edad60 += 1;
  }

  const pctM = pct(mujeres, total);
  const pctV = pct(varones, total);
  const pct60 = pct(edad60, total);
  const textoDemografia = total
    ? `${total} pacientes son atendidos en ${nombreClinicaTxt}, de los cuales ${mujeres} son mujeres (${pctM}%) y ${varones} varones (${pctV}%), así también ${edad60} pacientes tienen 60 años o más (${pct60}%).`
    : `No hay pacientes registrados en ${nombreClinicaTxt} para el periodo y modalidad seleccionados.`;

  const accUlt = ultimoPorPaciente(accesos.value, 'id_unidad_actual');
  const totalAcc = accUlt.length || total;
  const conteoAcceso = { FAV: 0, Autoinjerto: 0, Injerto: 0, CVCP: 0, CVCT: 0, 'No registrado': 0 };
  let cvct = 0;
  for (const a of accUlt) {
    const tipo = normalizarTipoAcceso(a.tipo_acceso || a.tipo_acceso_actual);
    conteoAcceso[tipo] = (conteoAcceso[tipo] || 0) + 1;
    if (tipo === 'CVCT' || esTipoAccesoTemporal(a.tipo_acceso || a.tipo_acceso_actual)) cvct += 1;
  }
  const ordenAcc = ['FAV', 'Autoinjerto', 'Injerto', 'CVCP', 'CVCT', 'No registrado'];
  const barrasAcceso = barrasDesdeConteo(conteoAcceso, ordenAcc, totalAcc);
  const alertCvct = cvct
    ? `${cvct} paciente${cvct === 1 ? '' : 's'} tiene${cvct === 1 ? '' : 'n'} implantado un CVCT como acceso actual (${pct(cvct, totalAcc)}%), recuerde que este tipo de acceso es de temporalidad corta y requiere cambiar a un acceso vascular definitivo.`
    : '';

  const resUlt = ultimoPorPaciente(resultados.value, 'id_resultado_clinico');
  const totalRes = resUlt.length || total;
  let hbReg = 0;
  let ktvReg = 0;
  let hbMenor10 = 0;
  let hbRo = 0;
  let hbMayor = 0;
  let ktvRo = 0;
  let ktvMenor = 0;
  for (const r of resUlt) {
    const hb = parseNum(r.Hb ?? r.hb);
    const ktv = parseNum(r.ktv);
    if (hb != null) {
      hbReg += 1;
      if (hb < 10) hbMenor10 += 1;
      else if (hb >= 10 && hb <= 12) hbRo += 1;
      else hbMayor += 1;
    }
    if (ktv != null) {
      ktvReg += 1;
      if (ktv >= 1.3) ktvRo += 1;
      else ktvMenor += 1;
    }
  }
  const hbNoReg = Math.max(0, totalRes - hbReg);
  const ktvNoReg = Math.max(0, totalRes - ktvReg);

  const barrasHbRegistro = barrasDesdeConteo(
    { Registrado: hbReg, 'No registrado': hbNoReg },
    ['Registrado', 'No registrado'],
    totalRes,
  );
  const hbConValor = hbReg || 1;
  const barrasHbRo = barrasDesdeConteo(
    { 'Mayor al RO': hbMayor, 'RO (10-12)': hbRo, 'Menor al RO': hbMenor10 },
    ['Mayor al RO', 'RO (10-12)', 'Menor al RO'],
    hbConValor,
  );

  const barrasKtvRegistro = barrasDesdeConteo(
    { Registrado: ktvReg, 'No registrado': ktvNoReg },
    ['Registrado', 'No registrado'],
    totalRes,
  );
  const ktvConValor = ktvReg || 1;
  const barrasKtvRo = barrasDesdeConteo(
    { 'RO (≥1.3)': ktvRo, 'Menor al RO': ktvMenor },
    ['RO (≥1.3)', 'Menor al RO'],
    ktvConValor,
  );

  const alertaHb = `${hbMenor10} paciente${hbMenor10 === 1 ? '' : 's'} tiene${hbMenor10 === 1 ? '' : 'n'} Hemoglobina menor a 10 g/dL (${pct(hbMenor10, hbConValor)}%).`;
  const alertaKtv = `${ktvMenor} paciente${ktvMenor === 1 ? '' : 's'} tiene${ktvMenor === 1 ? '' : 'n'} Kt/V menor a 1.3 (${pct(ktvMenor, ktvConValor)}%).`;

  const vacUlt = ultimoPorPaciente(vacunaciones.value, 'id_vacunacion');
  const totalVac = vacUlt.length || total;
  let vhbPos = 0;
  let vhcPos = 0;
  let vihPos = 0;

  function conteoSerologia(campo) {
    let pos = 0;
    let neg = 0;
    let nr = 0;
    for (const v of vacUlt) {
      const val = v[campo];
      if (!tieneRegistro(val)) nr += 1;
      else if (esPositivoSerologia(val)) pos += 1;
      else neg += 1;
    }
    const t = totalVac || 1;
    const mk = (label, n, color) => ({
      label,
      pct: pct(n, t),
      altura: alturaBarra(pct(n, t), 56),
      color,
    });
    return {
      campo: campo.toUpperCase(),
      barras: [
        mk('Pos.', pos, 'bg-rose-500'),
        mk('Neg.', neg, 'bg-emerald-500'),
        mk('N/R', nr, 'bg-slate-400'),
      ],
    };
  }

  for (const v of vacUlt) {
    if (esPositivoSerologia(v.vhb)) vhbPos += 1;
    if (esPositivoSerologia(v.vhc)) vhcPos += 1;
    if (esPositivoSerologia(v.vih)) vihPos += 1;
  }
  const textoSerologia = `Respecto a la condición serológica actual: ${vhbPos} paciente${vhbPos === 1 ? '' : 's'} con VHB (${pct(vhbPos, totalVac)}%), ${vhcPos} con VHC (${pct(vhcPos, totalVac)}%) y ${vihPos} con VIH (${pct(vihPos, totalVac)}%).`;

  const barrasSerologia = [
    conteoSerologia('vhb'),
    conteoSerologia('vhc'),
    conteoSerologia('vih'),
  ];

  function vacunaInmunizado(fecha) {
    return tieneRegistro(fecha);
  }

  let vhbCompleto = 0;
  let vhbNoVac = 0;
  let covidRef = 0;
  let covidNoVac = 0;
  let inflInm = 0;
  let inflNo = 0;
  let neumoInm = 0;
  let neumoNo = 0;

  for (const v of vacUlt) {
    const dosisHb = String(v.dosis_hepatitis_b || '').toLowerCase();
    if (dosisHb.includes('completo') || dosisHb.includes('3') || dosisHb.includes('refuerzo')) vhbCompleto += 1;
    else if (!tieneRegistro(v.dosis_hepatitis_b) && !tieneRegistro(v.fecha_hepatitis_b)) vhbNoVac += 1;

    const dosisCov = String(v.dosis_covid || '').toLowerCase();
    if (dosisCov.includes('refuerzo') || dosisCov.includes('4') || dosisCov.includes('3')) covidRef += 1;
    else if (!tieneRegistro(v.dosis_covid) && !tieneRegistro(v.fecha_covid)) covidNoVac += 1;

    if (vacunaInmunizado(v.fecha_influenza)) inflInm += 1;
    else inflNo += 1;

    if (vacunaInmunizado(v.fecha_neumococo)) neumoInm += 1;
    else neumoNo += 1;
  }

  const tarjetasVacunacion = [
    {
      titulo: 'Vacuna contra VHB',
      barras: barrasDesdeConteo(
        { 'Esquema compl.': vhbCompleto, 'Sin vacunar': vhbNoVac, Otros: Math.max(0, totalVac - vhbCompleto - vhbNoVac) },
        ['Esquema compl.', 'Sin vacunar', 'Otros'],
        totalVac,
      ),
      texto: `${vhbCompleto} paciente${vhbCompleto === 1 ? '' : 's'} con esquema completo (${pct(vhbCompleto, totalVac)}%); ${vhbNoVac} no vacunado${vhbNoVac === 1 ? '' : 's'} (${pct(vhbNoVac, totalVac)}%).`,
    },
    {
      titulo: 'Vacuna contra COVID-19',
      barras: barrasDesdeConteo(
        { Refuerzo: covidRef, 'Sin vacunar': covidNoVac, Otros: Math.max(0, totalVac - covidRef - covidNoVac) },
        ['Refuerzo', 'Sin vacunar', 'Otros'],
        totalVac,
      ),
      texto: `${covidRef} con dosis de refuerzo (${pct(covidRef, totalVac)}%); ${covidNoVac} no vacunado${covidNoVac === 1 ? '' : 's'} (${pct(covidNoVac, totalVac)}%).`,
    },
    {
      titulo: 'Vacuna contra Influenza',
      barras: barrasDesdeConteo(
        { Inmunizado: inflInm, 'No inmun.': inflNo },
        ['Inmunizado', 'No inmun.'],
        totalVac,
      ),
      texto: `${inflInm} inmunizado${inflInm === 1 ? '' : 's'} (${pct(inflInm, totalVac)}%); ${inflNo} no inmunizado${inflNo === 1 ? '' : 's'} (${pct(inflNo, totalVac)}%).`,
    },
    {
      titulo: 'Vacuna contra Neumococo',
      barras: barrasDesdeConteo(
        { Inmunizado: neumoInm, 'No inmun.': neumoNo },
        ['Inmunizado', 'No inmun.'],
        totalVac,
      ),
      texto: `${neumoInm} inmunizado${neumoInm === 1 ? '' : 's'} (${pct(neumoInm, totalVac)}%); ${neumoNo} no inmunizado${neumoNo === 1 ? '' : 's'} (${pct(neumoNo, totalVac)}%).`,
    },
  ];

  return {
    totalPacientes: total,
    textoDemografia,
    alertCvct,
    barrasAcceso,
    alertaHb,
    alertaKtv,
    barrasHbRegistro,
    barrasHbRo,
    barrasKtvRegistro,
    barrasKtvRo,
    textoSerologia,
    barrasSerologia,
    tarjetasVacunacion,
  };
});

async function cargarReporte() {
  if (!filtroListo.value) return;
  cargando.value = true;
  try {
    const qs = buildQs();
    const params = new URLSearchParams(qs);
    const [resPac, resAcc, resRes, resVac, resIpress] = await Promise.all([
      getAllIpress(`/listado_pacientes_dialisis_por_ipress_periodo/?${params}`),
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      getAllIpress(`/vacunaciones/?${qs}`),
      getAllIpress(`/ipress/${clinicaGlobal.value}/`).catch(() => null),
    ]);
    nombreClinica.value = resIpress?.ipress || '';
    pacientes.value = Array.isArray(resPac) ? resPac : resPac?.results || [];
    accesos.value = Array.isArray(resAcc) ? resAcc : resAcc?.results || [];
    resultados.value = Array.isArray(resRes) ? resRes : resRes?.results || [];
    vacunaciones.value = Array.isArray(resVac) ? resVac : resVac?.results || [];
  } catch (e) {
    console.error(e);
    pacientes.value = [];
    accesos.value = [];
    resultados.value = [];
    vacunaciones.value = [];
  } finally {
    cargando.value = false;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  if (filtroListo.value) cargarReporte();
}, { deep: true });

onMounted(() => {
  if (filtroListo.value) cargarReporte();
});
</script>
