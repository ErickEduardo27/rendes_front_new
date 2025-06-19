<template>
  <v-card>
    <div style="padding: 2rem">
      <h2>Lista de Causas Primarias de la Enfermedad Renal en Estadio Final</h2>
      <table class="table-eti">
        <tr>
          <th>Grupo</th>
          <th>Código</th>
          <th>Diagnóstico</th>
          <th></th>
        </tr>
        <tr class="diabetes">
          <td rowspan="2">DIABETES</td>
          <td>A.1.</td>
          <td>Diabetes con manifestaciones renales tipo II</td>
          <td>E11.21, E11.22, E11.29, E11.65, E11.9, E13.9</td>
        </tr>
        <tr class="diabetes">
          <td>A.2.</td>
          <td>Diabetes con manifestaciones renales tipo I</td>
          <td>E10.22, E10.29, E10.9</td>
        </tr>
        <tr class="glomerulonefritis">
          <td rowspan="10">GLOMERULONEFRITIS</td>
          <td>B.1.</td>
          <td>Glomerulonefritis GN (Histológicamente no examinada)</td>
          <td>N00.8, N03.0, N03.8, N03.9, N04.0, N04.8, N04.9, N05.8, N05.9</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.2.</td>
          <td>Glomeruloesclerosis focal, Esclerosante focal</td>
          <td>N03.1, N04.1, N05.1</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.3.</td>
          <td>Nefropatía membranosa</td>
          <td>N03.2, N04.2</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.4.</td>
          <td>
            GN Membranoproliferativa tipo I, GN Membranoproliferativa Difusa
          </td>
          <td>N03.5, N04.5</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.5.</td>
          <td>
            Enfermedad por depósitos densos, GN membranoproliferativa tipo II
          </td>
          <td>N03.6, N04.6</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.6.</td>
          <td>
            Nefropatía IgA, Enfermedad de Berger (demostrado por
            inmunofluorescencia)
          </td>
          <td>N02.8</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.7.</td>
          <td>Nefropatía IgM, (demostrado por inmunofluorescencia)</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.8.</td>
          <td>GN rápidamente progresiva</td>
          <td>N01.9</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.9.</td>
          <td>Gn post infecciosa</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>B.10.</td>
          <td>Otras GN proliferativas</td>
          <td>N03.3, N03.4, N03.7, N04.3, N04.4, N04.7</td>
        </tr>
        <!-- GLOMERULONEFRITIS SECUNDARIA/VASCULITIS -->
        <tr class="glomerulonefritis">
          <td rowspan="10">GLOMERULONEFRITIS SECUNDARIA/VASCULITIS</td>
          <td>C.1.</td>
          <td>Lupus eritematoso</td>
          <td>M32.0, M32.10, M32.14, M32.15</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.2.</td>
          <td>Síndrome de Henoch-Schonlein</td>
          <td>D69.0</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.3.</td>
          <td>Esclerodermia</td>
          <td>M34.89</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.4.</td>
          <td>Síndrome urémico hemolítico</td>
          <td>D59.3</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.5.</td>
          <td>Poliarteritis</td>
          <td>M31.7</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.6.</td>
          <td>Granulomatosis de Wegener</td>
          <td>M31.31</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.7.</td>
          <td>Nefropatía por abuso de heroína y relacionado a drogas</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.8.</td>
          <td>Otras vasculitis y sus derivadas</td>
          <td>I77.89</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.9.</td>
          <td>Síndrome de Goodpasture</td>
          <td>M31.0</td>
        </tr>
        <tr class="glomerulonefritis">
          <td>C.10.</td>
          <td>Otras GN secundarias</td>
          <td>M31.1</td>
        </tr>
        <!-- NEFRITIS INTERSTICIAL/PIELONEFRITIS -->
        <tr class="nefritis">
          <td rowspan="12">NEFRITIS INTERSTICIAL/PIELONEFRITIS</td>
          <td>D.1.</td>
          <td>Abuso de analgésicos</td>
          <td>N14.0</td>
        </tr>
        <tr class="nefritis">
          <td>D.2.</td>
          <td>Nefritis por radiación</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="nefritis">
          <td>D.3.</td>
          <td>Nefropatía por plomo</td>
          <td>N14.3</td>
        </tr>
        <tr class="nefritis">
          <td>D.4.</td>
          <td>Nefropatía causada por otros agentes</td>
          <td>N14.1, N14.2</td>
        </tr>
        <tr class="nefritis">
          <td>D.5.</td>
          <td>Nefropatía por gota</td>
          <td>M10.30</td>
        </tr>
        <tr class="nefritis">
          <td>D.6.</td>
          <td>Nefrolitiasis</td>
          <td>N20.0</td>
        </tr>
        <tr class="nefritis">
          <td>D.7.</td>
          <td>Uropatía obstructiva adquirida</td>
          <td>N13.8</td>
        </tr>
        <tr class="nefritis">
          <td>D.8.</td>
          <td>Pielonefritis crónica, nefropatía por reflujo</td>
          <td>N13.70</td>
        </tr>
        <tr class="nefritis">
          <td>D.9.</td>
          <td>Nefritis intersticial crónica</td>
          <td>N11.9</td>
        </tr>
        <tr class="nefritis">
          <td>D.10.</td>
          <td>Nefritis intersticial aguda</td>
          <td>N10</td>
        </tr>
        <tr class="nefritis">
          <td>D.11.</td>
          <td>Urolitiasis</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="nefritis">
          <td>D.12.</td>
          <td>Otros desórdenes del metabolismo de calcio</td>
          <td>E83.52</td>
        </tr>
        <!-- HIPERTENSIÓN/ENFERMDAD DE VASOS GRANDES -->
        <tr class="hipertension">
          <td rowspan="4">HIPERTENSIÓN/ENFERMDAD DE VASOS GRANDES</td>
          <td>E.1.</td>
          <td>Hipertensión no especificada con falla renal</td>
          <td>I10, I12.0, I12.9, I13.10, I13.2, I15, I15.0, R03.0</td>
        </tr>
        <tr class="hipertension">
          <td>E.2.</td>
          <td>Estenosis de la arteria renal</td>
          <td>I15.8</td>
        </tr>
        <tr class="hipertension">
          <td>E.3.</td>
          <td>Oclusión de la arteria renal</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="hipertension">
          <td>E.4.</td>
          <td>Embolia causada por coleterol, embolia renal</td>
          <td>I75.81</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td rowspan="16">ENFERMEDAD QUÍSTICA/HEREDITARIA/CONGÉNITA</td>
          <td>F.1.</td>
          <td>Riñón poliquístico del adulto tipo dominante</td>
          <td>Q61.2</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.2.</td>
          <td>Riñón poliquistico infantil recesivo</td>
          <td>Q61.19</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.3.</td>
          <td>Enfermedad quística medular, incluye nefronoptisis</td>
          <td>Q61.5</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.4.</td>
          <td>Esclerosis tubular</td>
          <td>Q85.1</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.5.</td>
          <td>Nefritis hereditaria, síndrome de Alport</td>
          <td>N07.0, N07.8, Q87.81</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.6.</td>
          <td>Cistinosis</td>
          <td>E72.04</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.7.</td>
          <td>Oxalosis primaria</td>
          <td>E72.53</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.8.</td>
          <td>Enfermedad de Fabry</td>
          <td>E75.21</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.9.</td>
          <td>Síndrome nefrótico congénito</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.10.</td>
          <td>Síndrome Drash, esclerosis mesangial</td>
          <td>Q56.0</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.11.</td>
          <td>Obstrucción congénita de la unión ureteropélvica</td>
          <td>Q62.11</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.12.</td>
          <td>Obstrucción congénita de la unión ureterovesical</td>
          <td>Q62.12</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.13.</td>
          <td>Otras uropatías obstructivas congénitas</td>
          <td>N31.9</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.14.</td>
          <td>Hipoplasia renal, displasia, oligonefronía</td>
          <td>Q61.4</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.15.</td>
          <td>Síndrome del abdomen en ciruela pasa</td>
          <td>Q79.4</td>
        </tr>
        <tr class="enfermedad_quistica">
          <td>F.16.</td>
          <td>Otros (Síndromes de malformaciones congénitas)</td>
          <td>Q60.0, Q60.2, Q61.3, Q61.8, Q63.8, Q64.2, Q86.8, Q87.1</td>
        </tr>
        <!-- NEOPLASIAS/TUMORES -->
        <tr class="neoplasias">
          <td rowspan="10">NEOPLASIAS/TUMORES</td>
          <td>G.1.</td>
          <td>Tumor renal maligno</td>
          <td>C64.9, C80.1</td>
        </tr>
        <tr class="neoplasias">
          <td>G.2.</td>
          <td>Tumor maligno del tracto urinario</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="neoplasias">
          <td>G.3.</td>
          <td>Tumor renal benigno</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="neoplasias">
          <td>G.4.</td>
          <td>Tumor benigno del tracto urinario</td>
          <td>D30.9</td>
        </tr>
        <tr class="neoplasias">
          <td>G.5.</td>
          <td>Tumor renal no especificado</td>
          <td>D41.00</td>
        </tr>
        <tr class="neoplasias">
          <td>G.6.</td>
          <td>Tumor de tracto urinario no especificado</td>
          <td>D41.9</td>
        </tr>
        <tr class="neoplasias">
          <td>G.7.</td>
          <td>Linfoma de riñón</td>
          <td>C85.93</td>
        </tr>
        <tr class="neoplasias">
          <td>G.8.</td>
          <td>Mieloma múltiple</td>
          <td>C90.00</td>
        </tr>
        <tr class="neoplasias">
          <td>G.9.</td>
          <td>Otras neoplasias inmunoproliferativas (Incluye nefropatía de cadena ligera)</td>
          <td>C88.2</td>
        </tr>
        <tr class="neoplasias">
          <td>G.10.</td>
          <td>Amiloidosis</td>
          <td>E85.9</td>
        </tr>
        <!-- COMPLICACIONES DE ÓRGANO TRASPLANTADO -->
        <tr class="complicaciones_trasplante">
          <td rowspan="9">COMPLICACIONES DE ÓRGANO TRASPLANTADO</td>
          <td>G.11.</td>
          <td>Complicaciones de órgano trasplantado no especificado</td>
          <td>T86.90-T86.99</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.12.</td>
          <td>Complicaciones por trasplante de riñón</td>
          <td>T86.10</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.13.</td>
          <td>Complicaciones por trasplante de hígado</td>
          <td>T86.40</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.14.</td>
          <td>Complicaciones por trasplante de corazón</td>
          <td>T86.20</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.15.</td>
          <td>Complicaciones por trasplante de pulmón</td>
          <td>T86.81, T86.819</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.16.</td>
          <td>Complicaciones por trasplante de médula ósea</td>
          <td>T86.00</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.17.</td>
          <td>Complicaciones por trasplante de páncreas</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.18.</td>
          <td>Complicaciones por trasplante de intestino</td>
          <td>T86.85, T86.859</td>
        </tr>
        <tr class="complicaciones_trasplante">
          <td>G.19.</td>
          <td>Complicaciones de otro órgano trasplantado especificado</td>
          <td>T86.89, T86.899</td>
        </tr>
        <!-- OTRAS CONDICIONES -->
        <tr class="otras_condiciones">
          <td rowspan="10">OTRAS CONDICIONES</td>
          <td>H.1.</td>
          <td>Enfermedad de células falciformes/anemia</td>
          <td>D57.1</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.2.</td>
          <td>Rasgo de células falciformes y otras células falciformes (Hbs/Hb otras)</td>
          <td>D57.3</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.3.</td>
          <td>Falla renal post parto</td>
          <td>O90.4</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.4.</td>
          <td>Nefropatía por SIDA</td>
          <td>B20</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.5.</td>
          <td>Pérdida traumática o quirúrgica de riñón</td>
          <td>S37.00, S37.009, S37.009A, Z90.5</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.6.</td>
          <td>Síndrome hepatorenal</td>
          <td>K76.7</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.7.</td>
          <td>Necrosis tubular (sin recuperación)</td>
          <td>N17.0, N17.1, N17.9, N28.0</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.8.</td>
          <td>Otros desórdenes renales</td>
          <td>A18.10, N15.9, N28.9, I50.9, N25.89, N26.9, N28.89</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H.9.</td>
          <td>Etiología incierta</td>
          <td>Not on 2015 version of Form 2728 and not in data</td>
        </tr>
        <tr class="otras_condiciones">
          <td>H10</td>
          <td>Otras no especificadas (mencionar)</td>
          <td></td>
        </tr>
      </table>
    </div>
  </v-card>
</template>
<style scoped>
.bg-primary-table {
  background: rgb(27 160 255 / 12%);
  font-weight: 400;
}

.text-start {
  font-size: 0.8rem !important;
}

.container {
  max-width: 3000px !important;
}

.v-label {
  margin-left: 0;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: .7rem;
}

th,
.table-eti td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.diabetes {
  border: 1px solid black;
}

.glomerulonefritis {
  border: 1px solid black;
}

.glomerulonefritis {
  border: 1px solid black;
}

.nefritis {
  border: 1px solid black;
}

.hipertension {
  border: 1px solid black;
}

.enfermedad_quistica {
  border: 1px solid black;
}

.otras_condiciones {
  /* background-color: #ffffcc; */
  border: 1px solid black;
}

.diabetes td:last-child,
.glomerulonefritis td:last-child,
.nefritis td:last-child,
.hipertension td:last-child,
.enfermedad_quistica td:last-child,
.neoplasias td:last-child,
.complicaciones_trasplante td:last-child,
.otras_condiciones td:last-child {
  font-size: .7rem;
}

.table-eti tr:first-child {
  background-color: #ccffcc !important;
}

table tr:first-child th {
  background-color: rgb(25, 115, 165) !important;
  color: #fff;
}

table tr th {
  background-color: rgb(25, 115, 165) !important;
  color: #fff;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
  /* Color de fondo para los tr pares */
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
export default {
  data() {
    return {
      e1: 1,
      shipping: 0,
      step: 1,
      items: ["Review Order", "Select Shipping", "Submit"],
      products: [
        {
          name: "Product 1",
          price: 10,
          quantity: 2,
        },
        {
          name: "Product 2",
          price: 15,
          quantity: 10,
        },
      ],
      valor1: 15,
      valor2: 10,
      ver: false,
      searchIpress: "",
      searchRed: "",
      dataIpress: [],
      dataEnvio: {
        fecha: null,
      },

      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        counterDocumento: (value) => value.length <= 10 || "Max 10 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      dialog: false,
      datos: {
        modalidad_inicio_trr: "",
        fecha_inicio_trr: "",
        subsistema_salud: "",
        tipo_acceso: "",
        fecha_creacion_acceso: "",
        fecha_primer_ingreso: "",
        comorbilidadOtros: "",
      },
      menu1: false,
      menu2: false,
      menu3: false,
      titleButton: "",
      titleCard: "",
      valid: true,
      documento: {
        id_paciente: null,
        id_etiologia: null,
        tipo: "",
        numero: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: "",
        edad: "",
        sexo: "",
        gradoInstruccion: "",
        etiologiaCodigo: "",
        etiologiaGeneral: "",
        etiologiaEspecifica: "",
        enf_otra: "",
        id_usuario_ipress: "",
        id_fecha: "",
      },
      e6: [],
      // Esto es para almacenar las opciones seleccionadas
      comorbilidad: [
        "Enfermedades Ateroescleróticas cardiacas",
        "Insuficiencia cardíaca congestiva",
        "Enfermedad vascular periférica",
        "Accidente cerebro vascular / accidente isquémico transitorio",
        "Cáncer",
        "Diabetes",
        "Hipertensión",
        "Tuberculosis",
      ],
      ipressData: {
        codigo_unico: null,
        ipress: null,
        ruc: null,
        tipo_institucion: null,
        ubigeo: null,
        direccion: null,
        codigo_disa: null,
        disa: null,
        codigo_red: null,
        red: null,
        codigo_microred: null,
        microred: null,
        categoria: null,
        telefono: null,
        inicio_actividades: null,
        horario_atencion: null,
        estado: 1,
      },
      pacienteData: {
        documento: null,
        tipo_documento: null,
        autogenerado: null,
        paciente: null,
        fecha_nacimiento: null,
        genero: null,
        grado_instruccion: null,
      },
      cas: null,
      maestro: null,
      deleteUser: [],
      statusEdit: false,
      date: new Date().toISOString().substr(0, 10),
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      date3: new Date().toISOString().substr(0, 10),
      date4: new Date().toISOString().substr(0, 10),
      search: "",
      sortBy: [{ key: "codigo_unico", order: "asc" }],
      headers: [
        { text: "Codigo Unic", value: "codigo_unico" },
        { text: "Ipress", value: "ipress" },
        { text: "Ruc", value: "ruc" },
        { text: "Tipo Inst.", value: "tipo_institucion" },
        { text: "Ubigeo", value: "ubigeo" },
        { text: "Dirección", value: "direccion" },
        { text: "Cod. Disa", value: "codigo_disa" },
        { text: "Disa", value: "disa" },
        { text: "Cod. Red", value: "codigo_red" },
        { text: "Red", value: "red" },
        { text: "Actions", align: "center", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      itemsTipSex: ["MASCULINO", "FEMENINO"],
      menu1: false,
      menu2: false,
      menu4: false,
      dataEtiologia: [],
      dataPaciente: [],
      erroresForm: [],
    };
  },
  methods: {
    continuePaciente() {
      if (this.documento.numero == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡Ingrese el número de documento del paciente!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.documento.apellidosNombres == "") {
        /* Swal.fire({
          title: "¡Alerta!",
          text: "¡El paciente no se encuentra registrado!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        this.dialogEdit = true;
        return; */
        Swal.fire({
          title: "¡Alerta!",
          text: "¡El paciente no se encuentra registrado!¿Desea registrar un nuevo paciente?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogEdit = true;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Aquí colocas la lógica que se ejecutará si el usuario hace clic en "No" o fuera del modal
            console.log("El usuario hizo clic en No o cerró el modal");
          }
        });
        return;
      }
      this.e1 = 2;
    },
    continueEliologia() {
      if (this.documento.etiologiaCodigo == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡Ingrese el código de etiología!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.documento.etiologiaGeneral == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡El código no es correcto!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      this.e1 = 3;
    },
    continueComorbilidad() {
      this.e1 = 4;
    },
    deleteOpen(item) {
      this.deleteUser = item;
      this.dialogDelete = true;
    },
    deleteClose() {
      this.dialogDelete = false;
    },
    dataInit() {
      this.isLoading = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/ipress/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
              this.isLoading = false;
              this.dataIpress = res.data;
              /* this.dataIpress.forEach((item) => {
                // Calcula el nombre completo y guárdalo en una nueva propiedad 'nombreCompleto'
                item.descripCas = `${item.datosCasOri.descripCas}`;
                item.descripMaestro = `${item.datosMaestro.descripMaestro}`;
              }); */
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    loadEti() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/etiologia/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dataEtiologia = res.data;
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    updateCodEti() {
      for (const i in this.dataEtiologia) {
        const element = this.dataEtiologia[i];
        // Tu lógica aquí
        if (element.codigo === this.documento.etiologiaCodigo) {
          this.documento.etiologiaGeneral = element.general;
          this.documento.etiologiaEspecifica = element.especifica;
          this.documento.id_etiologia = element.url;
          break;
        }
        if (element.codigo != this.documento.etiologiaCodigo) {
          this.documento.etiologiaGeneral = "";
          this.documento.etiologiaEspecifica = "";
        }
      }
    },
    loadPaciente() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/paciente/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitocAS", res.data);
              this.dataPaciente = res.data;
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    updatePaciente() {
      for (const i in this.dataPaciente) {
        const element = this.dataPaciente[i];
        // Tu lógica aquí
        if (element.documento == this.documento.numero) {
          this.documento.tipo = element.tipo_documento;
          this.documento.autogenerado = element.autogenerado;
          this.documento.apellidosNombres = element.paciente;
          this.documento.fecha_nacimiento = this.formatDates(
            element.fecha_nacimiento
          );
          this.documento.edad = this.calculateAge(element.fecha_nacimiento);
          this.documento.sexo = element.genero;
          this.documento.gradoInstruccion = element.grado_instruccion;
          this.documento.id_paciente = element.url;
          break;
        }
        if (element.documento != this.documento.numero) {
          this.documento.tipo = "";
          this.documento.autogenerado = "";
          this.documento.apellidosNombres = "";
          this.documento.fecha_nacimiento = "";
          this.documento.edad = "";
          this.documento.sexo = "";
          this.documento.gradoInstruccion = "";
        }
      }
    },
    loadFecha() {
      console.log("fecha de hoy a la misma hora ", this.date);
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/fecha/?search=" + this.date, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito Data fecha", res.data);
              this.documento.id_fecha = res.data[0].url;
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    formatearFecha(fecha) {
      // Dividir la fecha en partes: año, mes y día
      const partes = fecha.split("-");
      // Crear una nueva fecha con el formato "mm-dd-yyyy"
      const nuevaFecha = new Date(`${partes[1]}/${partes[2]}/${partes[0]}`);
      // Obtener el mes, día y año de la nueva fecha
      const mes = nuevaFecha.getMonth() + 1;
      const dia = nuevaFecha.getDate();
      const año = nuevaFecha.getFullYear();
      // Formatear la fecha en el formato deseado
      return `${mes.toString().padStart(2, "0")}-${dia
        .toString()
        .padStart(2, "0")}-${año}`;
    },
    clearForm() {
      (this.date1 = new Date().toISOString().substr(0, 10)),
        (this.date2 = new Date().toISOString().substr(0, 10)),
        (this.date3 = new Date().toISOString().substr(0, 10)),
        (this.date4 = new Date().toISOString().substr(0, 10)),
        (this.datos = {
          modalidad_inicio_trr: "",
          fecha_inicio_trr: "",
          subsistema_salud: "",
          tipo_acceso: "",
          fecha_creacion_acceso: "",
          fecha_primer_ingreso: "",
          comorbilidadOtros: "",
        });
      this.documento = {
        id_paciente: null,
        id_etiologia: null,
        tipo: "",
        numero: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: "",
        edad: "",
        sexo: "",
        gradoInstruccion: "",
        etiologiaCodigo: "",
        etiologiaGeneral: "",
        etiologiaEspecifica: "",
        enf_otra: "",
        id_usuario_ipress: "",
        id_fecha: "",
      };
      this.documento.enf_ateroesclerotica_cardiaca = "";
      this.documento.enf_insuficiencia_cardiaca_congestiva = "";
      this.documento.enf_vascular_periferica = "";
      this.documento.enf_cerebro_vascular = "";
      this.documento.enf_cancer = "";
      this.documento.enf_diabetes = "";
      this.documento.enf_hipertension = "";
      this.documento.enf_tuberculosis = "";
      this.e6 = [];
      this.erroresForm.modalidad_inicio_trr = "";
      this.erroresForm.date1 = "";
      this.erroresForm.tipo_acceso = "";
      this.erroresForm.date2 = "";
      this.erroresForm.modalidad_inicio_trr = "";
      this.erroresForm.numero = "";
      this.erroresForm.etiologiaCodigo = "";
      this.erroresForm.modalidad_inicio_trr = "";
      this.erroresForm.modalidad_inicio_trr = "";
      this.erroresForm.modalidad_inicio_trr = "";
      this.pacienteData = {
        documento: null,
        tipo_documento: null,
        autogenerado: null,
        paciente: null,
        fecha_nacimiento: null,
        genero: null,
        grado_instruccion: null,
      };
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    formatDates(dateString) {
      const parts = dateString.split("-");
      const day = parts[2];
      const month = parts[1];
      const year = parts[0];
      return `${day}-${month}-${year}`;
    },
    calculateAge(dateString) {
      const parts = dateString.split("-");
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Los meses en JavaScript se cuentan desde 0
      const day = parseInt(parts[2]);

      const birthDate = new Date(year, month, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
    submitForm() {
      this.datos.fecha_inicio_trr = this.date1;
      this.datos.fecha_creacion_acceso = this.date2;
      this.datos.fecha_primer_ingreso = this.date3;
      this.dialog = true;
      this.documento.id_usuario_ipress =
        sessionStorage.getItem("idUsuarioIpress");
      const dataEnvio = { ...this.documento, ...this.datos };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/pacientesDialisis/", dataEnvio, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              console.log("exito", res.status);
              this.dialog = false;
              this.clearForm();
              this.loadFecha();
              this.dialogEdit = false;
              this.e1 = 1;
            })
            .catch((res) => {
              console.log("Error: 88 ", res.response.data.non_field_errors[0]);
              if (
                res.response.data.non_field_errors[0] ==
                "Los campos id_fecha, id_paciente deben formar un conjunto único."
              ) {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡El paciente ya cuenta con un registro en el periodo actual!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                this.dialog = false;
                return;
              }
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
          this.dialog = false;
          Swal.fire({
            title: "¡Error!",
            text: "¡No se registró correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    },
    validarCampos() {
      let status = false;

      if (!this.datos.modalidad_inicio_trr) {
        this.erroresForm.modalidad_inicio_trr = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date1) {
        this.erroresForm.date1 = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.datos.subsistema_salud) {
        this.erroresForm.subsistema_salud = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.datos.tipo_acceso) {
        this.erroresForm.tipo_acceso = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date2) {
        this.erroresForm.date2 = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date3) {
        this.erroresForm.date3 = ["El campo es obligatorio."];
        status = true;
      }
      if (status) {
        Swal.fire({
          title: "¡Error!",
          text: "¡Se debe completar todos los campos!",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      this.submitForm();
    },
    updateComorbilidad() {
      // Reinicia todos los campos de comorbilidad
      this.documento.enf_ateroesclerotica_cardiaca = "";
      this.documento.enf_insuficiencia_cardiaca_congestiva = "";
      this.documento.enf_vascular_periferica = "";
      this.documento.enf_cerebro_vascular = "";
      this.documento.enf_cancer = "";
      this.documento.enf_diabetes = "";
      this.documento.enf_hipertension = "";
      this.documento.enf_tuberculosis = "";

      // Asigna los valores seleccionados a los campos correspondientes
      for (const comorbilidad of this.e6) {
        switch (comorbilidad) {
          case "Enfermedades Ateroescleróticas cardiacas":
            this.documento.enf_ateroesclerotica_cardiaca = 1;
            break;
          case "Insuficiencia cardíaca congestiva":
            this.documento.enf_insuficiencia_cardiaca_congestiva = 1;
            break;
          case "Enfermedad vascular periférica":
            this.documento.enf_vascular_periferica = 1;
            break;
          case "Accidente cerebro vascular / accidente isquémico transitorio":
            this.documento.enf_cerebro_vascular = 1;
            break;
          case "Cáncer":
            this.documento.enf_cancer = 1;
            break;
          case "Diabetes":
            this.documento.enf_diabetes = 1;
            break;
          case "Hipertensión":
            this.documento.enf_hipertension = 1;
            break;
          case "Tuberculosis":
            this.documento.enf_tuberculosis = 1;
            break;
          default:
            break;
        }
      }
    },
  },
  mounted() {
    var input = document.getElementById("Num_doc");
    console.log(input);
    input.focus();
    /* input.add("focus"); */
  },
  computed: {
    subtotal() {
      return this.products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
    },
    filteredData() {
      if (!this.searchRed && !this.searchIpress) {
        return this.dataIpress;
      }
      let filtered = this.dataIpress;
      if (this.searchIpress) {
        filtered = filtered.filter((item) =>
          item.ipress.toLowerCase().includes(this.searchIpress.toLowerCase())
        );
      }
      if (this.searchRed) {
        filtered = filtered.filter((item) =>
          item.red.toLowerCase().includes(this.searchRed.toLowerCase())
        );
      }
      return filtered;
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    computedDateFormatted1() {
      return this.formatDate(this.date1);
    },
    computedDateFormatted2() {
      return this.formatDate(this.date2);
    },
    computedDateFormatted3() {
      return this.formatDate(this.date3);
    },
    computedDateFormatted4() {
      return this.formatDate(this.date4);
    },
    customDateFormat() {
      return (val) => {
        const date = new Date(val);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Asegurarse de que el día y el mes tienen dos dígitos
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;

        return `${day}-${month}-${year}`;
      };
    },
    fechaFormateada: {
      get() {
        return this.datos.fecha_creacion_acceso;
      },
      set(value) {
        // Convierte la fecha al formato "dd-mm-yyyy"
        const date = new Date(value);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Asegurarse de que el día y el mes tienen dos dígitos
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;

        // Establece la fecha formateada de nuevo en el modelo
        this.datos.fecha_creacion_acceso = `${day}-${month}-${year}`;
      },
    },
  },
  created() {
    this.loadFecha();
    this.loadEti();
    this.loadPaciente();
    this.dataInit();
    /* console.log("el formulario de Registro de paciente de dialisis esta iniciando"); */
  },
  components: {},
};
</script>