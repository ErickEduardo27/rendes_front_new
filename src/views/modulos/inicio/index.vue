<template>
  <div>
    <div class="mx-auto" max-width="1000" style="width: 100%; max-width: 2000px !important">
      <v-card class="mx-auto my-3" max-width="2500">
        <v-system-bar class="py-5 px-3"
          style="color: #fff ;background: linear-gradient(135deg, rgb(25 115 165), rgb(20 145 215), #0d67aa, #00304e) !important;"
          dark>
          Inicio
        </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-3" max-width="2500" style="padding: 1rem">
        <v-row class="table-main" style="width: 100% !important">
          <v-col cols="6" sm="3" md="3">
            <v-text-field v-model="documentoSelect" label="N° documento"></v-text-field>
          </v-col>
          <v-col cols="6" sm="3" md="3">
            <v-text-field v-model="nombreSelect" label="Nombre"></v-text-field>
          </v-col>
          <v-col cols="6" sm="2" md="2">
            <v-select v-model="modalidadSelect" :items="arrayModalidad" label="Modalidad" item-value="url"
              item-text="modalidad"></v-select>
          </v-col>
          <v-col cols="6" sm="4" md="4" style="
              display: flex;
              justify-content: space-around;
              align-items: center;
            ">
            <v-btn color="primary" @click="openCarga"> Cargar información</v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mx-auto my-5" max-width="1600">
        <v-tabs class="background-theme" center-active dark>
          <v-tab @click="dataInit()">General</v-tab>
          <v-tab @click="listaForm1()">F. 1</v-tab>
          <v-tab @click="listaForm2()">F. 2</v-tab>
          <v-tab @click="listaForm3()">F. 3</v-tab>
          <v-tab @click="listaForm4()">F. 4</v-tab>
          <v-tab @click="listaForm5()">F. 5</v-tab>
          <v-tab @click="listaForm6()">F. 6</v-tab>
          <v-tab @click="listaForm7()">F. 7</v-tab>

        </v-tabs>
      </v-card>
      <v-card class="mx-auto my-5" max-width="1600">
        <v-row style="width: 100% !important">
          <v-col cols="12" sm="12" md="12" class="mx-3">
            <v-data-table :items-per-page="10" :headers="headers" :items="desserts" class="elevation-1 scroll">
              <template v-slot:[`item.actions`]="{}">
                <!-- <v-btn
                  color="secondary"
                  @click="closeForm(item)"
                  v-if="status != 2"
                  style="margin-right: 1rem"
                >
                  Editar
                </v-btn>
                <v-btn
                  color="secondary"
                  @click="closeForm(item)"
                  v-if="status != 2"
                >
                  Dar baja
                </v-btn> -->
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span style="font-size: .8rem;padding-left: 1rem;font-style: italic; ">Para visualizar registros debe cargar
              información al menos en los dos primeros formularios</span>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-dialog v-model="dialogLoader" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Cargando Datos
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNuevo" v-if="dialogNuevo" persistent width="900">
      <NuevoPaciente @closeNuevo="closeNuevo" />
    </v-dialog>
    <v-dialog v-model="dialogCarga" v-if="dialogCarga" persistent width="900">
      <CargaMasiva @closeCarga="closeCarga" />
    </v-dialog>
    <v-dialog v-model="dialogPeriodo" v-if="dialogPeriodo" persistent width="500">
      <Periodo @closePeriodo="closePeriodo" />
    </v-dialog>
  </div>
</template>
<style scoped>

.theme--dark.v-tabs > .v-tabs-bar {
    background-color: #1E1E1E;
}
.table-main {
  width: 100%;
}

.v-btn__content {
  font-size: 0.675rem;
}

.scroll {
  overflow-y: hidden;
}
</style>
<script>
import { obtenerToken } from "../../../services/authService/authService";
import NuevoPaciente from "../gestion/pacientes/create.vue";
import Swal from "sweetalert2";
import reportes from "@services/script/reportes";
import modalidadService from "@services/modalidad/modalidadService";
import { periodoIpress } from "../../../services/periodoIpress/periodoIpress";
import CargaMasiva from "./carga_masiva.vue";
import Periodo from "./periodo.vue";
export default {
  data() {
    return {
      status: null,
      dialogPeriodo: true,
      dialogLoader: false,
      headers: [
        { text: "N° documento", align: "center", value: "documento" },
        { text: "Paciente", align: "center", value: "paciente" },
        { text: "Tipo paciente", align: "center", value: "tipo_paciente" },
        { text: "Modalidad", align: "center", value: "modalidad" },
        /* { text: "Acciones", align: "center", value: "actions" }, */
      ],
      desserts: [],
      documentoSelect: null,
      periodosSelect: null,
      modalidadSelect: null,
      nombreSelect: null,
      Select: null,
      dialogEdit: true,
      dialogNuevo: false,
      perfil: "",
      nombre: "",
      arrayModalidad: [],
      dialogCarga: false,
    };
  },
  methods: {
    async listaForm1() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reportePacientesDialisis(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "General", align: "center", value: "general" },
            { text: "Especifica", align: "center", value: "especifica" },
            { text: "Modalidad inicio", align: "center", value: "modalidad_inicio_trr" },
            { text: "Fecha inicio", align: "center", value: "fecha_inicio_trr" },
            { text: "Subsistema", align: "center", value: "subsistema_salud" },
            { text: "Tipo acceso", align: "center", value: "tipo_acceso" },
            { text: "Fecha creación", align: "center", value: "fecha_creacion_acceso" },
            { text: "Fecha primer ingreso", align: "center", value: "fecha_primer_ingreso" },
            { text: "Ateroesclerotica", align: "center", value: "enf_ateroesclerotica_cardiaca" },
            { text: "Insuficiencia cardiaca", align: "center", value: "enf_insuficiencia_cardiaca_congestiva" },
            { text: "Vascular periferica", align: "center", value: "enf_vascular_periferica" },
            { text: "Cerebro vascular", align: "center", value: "enf_cerebro_vascular" },
            { text: "Cancer", align: "center", value: "enf_cancer" },
            { text: "Diabetes", align: "center", value: "enf_diabetes" },
            { text: "Hipertensión", align: "center", value: "enf_hipertension" },
            { text: "Tuberculosis", align: "center", value: "enf_tuberculosis" },
            { text: "Otra", align: "center", value: "enf_otra" },
            { text: "Acciones", align: "center", value: "actions" },
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm2() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteUnidadesActuales(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Red", align: "center", value: "red" },
            { text: "Fecha ingreso", align: "center", value: "fecha_ingreso" },
            { text: "VHB", align: "center", value: "VHB" },
            { text: "VHC", align: "center", value: "VHC" },
            { text: "VHI", align: "center", value: "VHI" },
            { text: "AcHBs", align: "center", value: "AcHBs" },
            { text: "Tipo acceso", align: "center", value: "tipo_acceso" },
            { text: "Motivo acceso ", align: "center", value: "motivo_cambio_acceso" },
            { text: "Fecha creación ", align: "center", value: "fecha_creacion_acceso" }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm3() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteEventosAsociados(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Tipo acceso", align: "center", value: "tipo_acceso_vascular" },
            { text: "Fecha evento", align: "center", value: "fecha_evento" },
            { text: "Inicio antmicrobial", align: "center", value: "inicio_antmicrobial" },
            { text: "Inicio vancomicina", align: "center", value: "inicio_vancomicina" },
            { text: "Hemocultivo positivo", align: "center", value: "hemocultivo_positivo" },
            { text: "Acceso vascular", align: "center", value: "estado_acceso_vascular" },
            { text: "Observaciones", align: "center", value: "observaciones " }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm4() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteMorbilidadHospitalaria(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Diagnostico", align: "center", value: "diagnostico" },
            { text: "Codigo diagnostico", align: "center", value: "codigo_diagnostico" },
            { text: "Fecha hospitalización", align: "center", value: "fecha_hospitalizacion" },
            { text: "Fecha alta", align: "center", value: "fecha_alta" },
            { text: "Fuente", align: "center", value: "fuente" },
            { text: "Observaciones", align: "center", value: "observaciones" }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm5() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteResultadosClinicos(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Hb", align: "center", value: "Hb" },
            { text: "Calcio", align: "center", value: "calcio" },
            { text: "Fosforo", align: "center", value: "fosforo" },
            { text: "PTHi", align: "center", value: "PTHi" },
            { text: "Alb", align: "center", value: "Alb" },
            { text: "Calcio corregido", align: "center", value: "calcio_corregido" },
            { text: "Ktv", align: "center", value: "ktv" },
            { text: "Tiempo dialisis", align: "center", value: "tiempo_dialisis" },
            { text: "Eritoproyetina", align: "center", value: "eritoproyetina" },
            { text: "Hierro", align: "center", value: "hierro" },
            { text: "Hiperparatioidismo", align: "center", value: "hiperparatioidismo" }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm6() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteCalidadMicrobiologica(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Control", align: "center", value: "control" },
            { text: "Salida osmosis ufc", align: "center", value: "salida_osmosis_ufc" },
            { text: "Anillo circulación ufc", align: "center", value: "anillo_circulacion_ufc" },
            { text: "Salida osmosis ue", align: "center", value: "salida_osmosis_ue" },
            { text: "Anillo circulación ue", align: "center", value: "anillo_circulacion_ue" },
            { text: "Maquina 1 ufc", align: "center", value: "maquina_1_ufc" },
            { text: "Maquina 2 ufc", align: "center", value: "maquina_2_ufc" },
            { text: "Maquina 1 ue", align: "center", value: "maquina_1_ue " },
            { text: "Maquina 2 ue", align: "center", value: "maquina_2_ue " }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async listaForm7() {
      const token = await obtenerToken();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteVacunaciones(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Red", align: "center", value: "red" },
            { text: "Turno", align: "center", value: "turno" },
            { text: "Frecuencia", align: "center", value: "frecuencia" }
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    closePeriodo() {
      this.dialogPeriodo = false;
    },
    openPeriodo() {
      this.dialogPeriodo = true;
    },
    closeNuevo() {
      this.dialogNuevo = false;
    },
    openNuevo() {
      this.dialogNuevo = true;
    },
    closeCarga() {
      this.dialogCarga = false;
      this.dataInit();
    },
    openCarga() {
      this.$router.push("/go/pre-carga");
    },
    async loadModalidad() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      modalidadService
        .getModalidades(token)
        .then((res) => {
          this.dialogLoader = false;
          this.arrayModalidad = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async dataInit() {
      const token = await obtenerToken();
      console.log("itemIpres", sessionStorage.getItem("itemPeriodo"));
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: sessionStorage.getItem("estadoPeriodoIpress"),
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      reportes
        .reporteInicio(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
          this.headers = [
            { text: "N° documento", align: "center", value: "documento" },
            { text: "Paciente", align: "center", value: "paciente" },
            { text: "Tipo paciente", align: "center", value: "tipo_paciente" },
            { text: "Modalidad", align: "center", value: "modalidad" },/* 
            { text: "Acciones", align: "center", value: "actions" }, */
          ]
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
  },
  created() {
    /* MODO_SIN_BACK */
    this.loadModalidad();
    this.dataInit();
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.dialogPeriodo = sessionStorage.getItem("itemPeriodo") ? false : true;
    this.status = sessionStorage.getItem("estadoPeriodoIpress");
    console.log("estados", this.status);
  },
  components: {
    NuevoPaciente,
    CargaMasiva,
    Periodo,
  },
};
</script>