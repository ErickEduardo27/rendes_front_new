<template>
  <div>
    <v-container
      max-width="2500"
      style="max-width: 3000px !important; padding: 0 !important"
    >
      <v-card class="mx-auto" max-width="2500" style="padding: 1.5rem">
        <h4>Seleccione el periodo</h4>
        <v-divider></v-divider>
        <v-card-text>
          <div>Debe seleccionar el periodo para continuar.</div>
          <v-col cols="8" md="8">
            <v-select
              :items="arrayPeriodos"
              v-model="selectedPeriodo"
              item-text="periodo"
              item-value="id_periodo"
              label="Seleccione el periodo"
              @change="loadPeriodo"
            ></v-select>
          </v-col>
        </v-card-text>
        <div class="d-flex justify-end ma-1">
          <v-btn
            color="primary"
            @click="postPeriodo"
            style="margin-right: 1rem"
          >
            Aceptar
          </v-btn>
        </div>
      </v-card>
      <v-dialog v-model="dialogLoader" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Cargando Datos
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
    <style>
</style>
    <script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
import { obtenerToken } from "@services/authService/authService";
import consultaPeriodo from "../../../services/script/consultaPeriodo";
import preCarga from "../../../services/script/preCarga";
import { mapActions, mapState } from "vuex";
import crearPeriodoIpress from "../../../services/script/crearPeriodoIpress";
export default {
  data() {
    return {
      files: [],
      valid: false,
      uploading: false,
      dialogLoader: false,
      dialog: false,
      selectedPeriodo: null,
      ipressSelect: null,
      modalidadSelect: null,
      arrayModalidad: [],
      itemModalidad: null,
      itemPeriodo: null,
      itemUsuarioIpress: null,
      itemPaciente: null,
      ipressUsuarioSelect: null,
      arrayPeriodos:[],
      arrayIpress: [],
    };
  },
  methods: {
    ...mapActions(['fetchArrayPeriodos', 'setPeriodoSelect']),
    /* loadPeriodo(value) {
      const itemPeriodo = this.arrayPeriodos.filter(
        (e) => e.id_periodo === this.selectedPeriodo
      );
      sessionStorage.setItem("estadoPeriodoIpress", itemPeriodo[0].estado);
      sessionStorage.setItem(
        "itemPeriodo",
        `${sessionStorage.getItem("dominioActual")}/${this.selectedPeriodo}/`
      );
      this.setPeriodoSelect(Number(value));
    }, */
    loadPeriodo() {
      const itemPeriodo = this.arrayPeriodos.filter(
        (e) => e.id_periodo === this.selectedPeriodo
      );
      sessionStorage.setItem("estadoPeriodoIpress", itemPeriodo[0].estado);
      sessionStorage.setItem(
        "itemPeriodo",
        `${sessionStorage.getItem("dominioActual")}/${this.selectedPeriodo}/`
      );
    },
    async postPeriodo() {
      /* this.$emit("closePeriodo"); */
      /* MODO_SIN_BACK */
      if (this.selectedPeriodo == null) {
        return;
      }
      this.dialogLoader = true;
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
      };
      const token = await obtenerToken();
      preCarga
        .consultaPreCarga(token, body)
        .then((res) => {
          this.dialogLoader = false;
          if (res.data[0].i == "No tiene mes en edición") {
            Swal.fire({
              title: "Alerta!",
              text: "¡Usted no cuenta con una pre carga!¿Desea realizar la pre carga?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Ok",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push("/go/pre-carga");
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.$emit("closePeriodo");
                window.location.reload();
              }
            });
          } else {
            this.$emit("closePeriodo");
            window.location.reload();
          }
        })
        .catch((res) => {
          this.dialogLoader = false;
        });
    },
    async loadPeriodos() {
      console.log("periodos",sessionStorage.getItem("itemIpress").split("/")[4])
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      consultaPeriodo
        .consultaPeriodo(token, body)
        .then((res) => {
          this.dialogLoader = false;
          this.arrayPeriodos = res.data;
          if(this.arrayPeriodos.length==0){
            this.crearPeriodoIpress();
          };
        })
        .catch((res) => {
          this.dialogLoader = false;
        });
    },
    async crearPeriodoIpress(){
      this.dialogLoader = true;
      const body = {
        id_ipress:sessionStorage.getItem("itemIpress").split("/")[4]
      }; 
      const token = await obtenerToken();
      crearPeriodoIpress
        .crearPeriodoIpress(token, body)
        .then((res) => {
          window.location.reload();
          this.dialogLoader = false;
        })
        .catch((res) => {
          this.dialogLoader = false;
        });
    }
  },
  computed: { 
    /* ...mapState(['arrayPeriodos', 'periodoSelect']), */
    /* selectedPeriodo: {
      get() {
        return this.$store.state.periodoSelect;
      },
      set(value) {
        this.setPeriodoSelect(value);
      },
    }, */
  },
  created() {
    this.itemModalidad = sessionStorage.getItem("itemModalidad");
    /* this.itemPeriodo = sessionStorage.getItem("itemPeriodo"); */
    this.itemUsuarioIpress = sessionStorage.getItem("itemUsuarioIpress");
    this.itemPaciente = sessionStorage.getItem("itemPaciente");
    this.usuario = sessionStorage.getItem("usuario");
    this.loadPeriodos();
    /* this.fetchArrayPeriodos(); */
  },
  components: {},
};
</script>