<template>
    <div>
      <v-container max-width="2500" style="max-width: 3000px !important; padding: 0 !important;">
        <v-card class="mx-auto" max-width="2500" style="padding: 1.5rem;">
          <div style="max-height: 80vh" >
              <h4>Carga masiva</h4>
              <v-divider></v-divider>
              <br />
                        <v-col cols="6" md="6">
                          <v-select
                            :items="arrayModalidad"
                            v-model="modalidadSelect"
                            item-text="modalidad"
                            item-value="url"
                            label="Seleccione el modalidad"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            :items="arrayIpress"
                            v-model="ipressUsuarioSelect"
                            item-value="url"
                            item-text="datosIpress.ipress"
                            label="Seleccione la ipress"
                            @change="updateIpress"
                            @input="updateIpress"

                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            :items="arrayPeriodos"
                            v-model="periodoSelect"
                            item-text="periodo"
                            item-value="id_periodo"
                            label="Seleccione el periodo"
                            :disabled="this.ipressSelect==null"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="8" md="6">
                          <v-file-input
                            v-model="files"
                            label="Seleccionar archivos"
                            multiple
                            accept=".xlsx"
                          ></v-file-input>
                        </v-col>
                        <v-row justify="center">
                            <v-col cols="12" sm="8" md="6">
                                <v-btn
                                  color="primary"
                                  dark
                                  :disabled="files.length === 0 || uploading"
                                  @click="handleFileUpload"
                                  >
                                  {{ uploading ? "Subiendo..." : "Subir archivos" }}
                                </v-btn>
                            </v-col>
                        </v-row>
                       

              <div class="d-flex justify-end ma-1">
                <v-btn color="secundary" @click="closeCarga" style="margin-right: 1rem;">
                  Cancelar
                </v-btn>
              </div>
          </div>
        </v-card>
        <v-dialog v-model="dialogLoader"  persistent width="300">
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
    import { obtenerToken } from '@services/authService/authService';
  import modalidadService from "../../../services/modalidad/modalidadService";
  import tipoPacienteService from "../../../services/tipoPaciente/tipoPacienteService";
  import pacienteService from "../../../services/pacientes/pacienteService";
import consultaPeriodo from "../../../services/script/consultaPeriodo";
import consultaIpress from "../../../services/script/consultaIpress";
import { periodoIpress } from "../../../services/periodoIpress/periodoIpress";
import registrarPeriodoIpress from "../../../services/script/registrarPeriodoIpress";
    export default {
      data() {
        return {
          files:[],
          valid: false,  
          uploading: false,       
          dialogLoader:false,
          dialog: false,
          periodoSelect:null,
          ipressSelect:null,
          modalidadSelect:null,
          arrayModalidad:[],
          itemModalidad:null,
          itemPeriodo:null,
          itemUsuarioIpress:null,
          itemPaciente:null,
          ipressUsuarioSelect:null,
          arrayPeriodos:[],
          arrayIpress:[]
        };
      },
      methods: {
        async registrarPeriodoIpress(){
          this.dialogLoader=true;
          const body={
            id_ipress:this.ipressSelect.split("/")[4],
            id_periodo:this.periodoSelect
          }
          const token = await obtenerToken();
          registrarPeriodoIpress.registrarPeriodoIpress(token,body)
              .then((res) => {
                this.dialogLoader=false;            
          
              })
              .catch((res) => {
                this.dialogLoader=false;
              });
        },
        updateIpress(){
          const ipressSelect = this.arrayIpress.find(e => e.url === this.ipressUsuarioSelect);
          this.ipressSelect = ipressSelect.id_ipress;
          console.log(this.ipressSelect)
          this.loadPeriodos();
        },
        async handleFileUpload() {
          this.registrarPeriodoIpress();
            if(this.ipressSelect==null&&this.periodoSelect==null){
              Swal.fire({
                title: "¡Error!",
                text: "¡Debe seleccionar una ipress y un periodo!",
                icon: "error",
                confirmButtonText: "Ok",
              });
              return;
            }
            const formData = new FormData();
            this.dialogLoader=true;
            formData.append("file", this.files[0]);
            const token = await obtenerToken();
            const body={
              id_ipress:this.ipressSelect.split("/")[4],
              id_periodo:this.periodoSelect,
              id_estado:null
            }
            const idPeriodoIpress = await periodoIpress(body);
            this.dialogLoader=true;
              try {
                  this.dialogLoader=true;
                  axios
                  .post(RUTA_API + "/api/token/", {
                  username: USUARIO,
                  password: PASSWORD,
                  }).then((response) => {
                      axios.post
                      (
                      RUTA_API + `/pre_carga_f1/?id_modalidad=${this.modalidadSelect.split("/")[4]}&id_tipo_paciente=${null}&id_periodo_ipress=${idPeriodoIpress}&id_usuario_ipress=${this.ipressUsuarioSelect.split("/")[4]}`,
                      formData,
                      {
                          headers:
                          { Authorization: this.auth }
                      }
                      ).then((res)=>{
                        this.dialo
                      Swal.fire({
                          title: "¡Exito!",
                          text: "¡Se registró correctamente!",
                          icon: "success",
                          confirmButtonText: "Ok",
                      });
                      this.files=[];
                      this.dialogLoader=false;
                      this.closeCarga();
                      })
                      .catch((res)=>{
                      Swal.fire({
                          title: "¡Error!",
                          text: "¡No se registró correctamente!",
                          icon: "error",
                          confirmButtonText: "Ok",
                      });
                      this.dialogLoader=false;
                      })
                  })
                  .catch((res) => {
                      console.log("Error:", res);
                  });
              } catch (error) {
                  console.error("Error al enviar el archivo:", error);
              }
        },
        closeCarga(){
          this.$emit("closeCarga");
        },
        async loadPeriodos (){
          const body={
            id_ipress:null
          };
          this.dialogLoader=true;
          const token = await obtenerToken();
          consultaPeriodo.consultaPeriodo(token,body)
          .then((res) => {
            this.dialogLoader=false;
            this.arrayPeriodos=res.data;
          })
          .catch((res) => {
            this.dialogLoader=false;
          });
        },
        async loadModalidad(){
          this.dialogLoader=true;
          const token = await obtenerToken();
          modalidadService.getModalidades(token)
          .then((res) => {
            this.dialogLoader=false;
            this.arrayModalidad=res.data;
          })
          .catch((res) => {
            this.dialogLoader=false;
          });
        },
        loadIpress(){
          axios
            .post(RUTA_API + "/api/token/", {
              username: USUARIO,
              password: PASSWORD,
            })
            .then((response) => {
              this.auth = "Bearer " + response.data.access;
              axios
                .get(RUTA_API + "/usuarioIpress/?search=" + this.usuario, {
                  headers: { Authorization: this.auth },
                })
                .then((res) => {
                  this.arrayIpress=res.data;
                  
                });
            })
            .catch((response) => {
              response === 404
                ? console.warn("Lo siento, no tenemos servicios")
                : console.warn("Error: ", response);
            });
        },

      },
      computed: {
      },
      created() {
        this.itemModalidad=sessionStorage.getItem("itemModalidad");
        this.itemPeriodo = sessionStorage.getItem("itemPeriodo");
        this.itemUsuarioIpress = sessionStorage.getItem("itemUsuarioIpress");
        this.itemPaciente = sessionStorage.getItem("itemPaciente");
        this.usuario = sessionStorage.getItem("usuario");
        this.loadIpress();
        this.loadModalidad();
      },
      components: {},
    };
    </script>