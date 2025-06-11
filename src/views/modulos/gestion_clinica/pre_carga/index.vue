<template>
    <div style="margin-top: 2rem;">
      <v-container max-width="2500" style="width:100%">
        <v-card class="mx-auto my-5" max-width="2500">
          <v-system-bar  class="py-5 px-3" color="#1973a5" style="color:#fff" dark> Pre carga de periodos </v-system-bar>
        </v-card>
        <v-card class="mx-auto my-5" max-width="2500">
          <v-row>
            <v-col cols="6" sm="6" md="3" class="mx-3">
              <v-btn color="primary" @click="validarCarga" :disabled="statusButton==1">
                      Pre cargar
                      </v-btn>
            </v-col>
            <v-col
            cols="6"
            sm="4"
            md="4"
            style="
              display: flex;
              justify-content: space-around;
              align-items: center;
            "
          >
            <v-btn color="primary" @click="openCarga"> Carga Masiva </v-btn>
          </v-col>
          </v-row>
        </v-card>
        <v-card class="mx-auto my-5" max-width="2500">
          <v-row style="width: 100%">
            <v-col cols="12" sm="12" md="12" class="mx-3">
              <v-data-table
          :items-per-page="5"
          :headers="headers"
          :items="desserts"
          class="elevation-1"
        >
        <template v-slot:[`item.actions`]="{  }">

                <v-btn
                  color="secondary"
                  @click="routerInicio"
                >Detalle
                 
                </v-btn>
              </template>
        </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
      <v-dialog v-model="dialogCarga" v-if="dialogCarga" persistent width="900">
      <CargaMasiva @closeCarga="closeCarga" />
    </v-dialog>
    </div>
  </template>
  <style>
      .main-responsive{
        margin-left: 18rem;
      }
      @media (max-width: 1024px) {
        .main-responsive {
          margin-left: 0rem;
          padding-left: 1.5rem;
        }
      }
      tbody tr td{
        font-size: .7rem;
      }
      .v-expansion-panel-header{
        padding: .5rem !important;
      }
      @media (max-width: 1024px) {
        .drawer-bar {
          display: none;
        }
      }
    
      /* Opcional: Mostrar el botón solo en pantallas mayores a 1024px (ej. desktops) */
      @media (min-width: 1024px) {
        .drawer-bar {
          display: block;
        }
      }
      .draggable-card {
        cursor: move;
      }
  </style>
    <script>
import { obtenerToken } from '../../../../services/authService/authService';
import preCarga from '@services/script/preCarga';
import cantidadRegistros from '@services/script/cantidadRegistros';
import consultaPeriodo from '@services/script/consultaPeriodo';
import Swal from 'sweetalert2';
import registrarPeriodoIpress from '../../../../services/script/registrarPeriodoIpress';
import { periodoIpress } from '../../../../services/periodoIpress/periodoIpress';
import CargaMasiva from "../../inicio/carga_masiva.vue"
    export default {
      data() {
        return {
          periodoSelect:null,
          headers: [
            { text: "Número", value: "numero" },
            { text: "Formulario", value: "nombre_form" },
            { text: "Cantidad", value: "cantidad" },
            { text: "Detalle", value: "actions" },
          ],
          desserts:[],
          dialogEdit:true,
          perfil: "",
          nombre: "",
          itemsPeriodos:[],
          statusButton:null,
          dialogCarga:false
        };
      },
      methods: {
        routerInicio(){
          this.$router.push("/go/inicio")
        },
        openCarga() {
          this.dialogCarga = true;
        },
        closeCarga() {
          this.dialogCarga = false;
        },
        async registrarPeriodoIpress(){
          this.dialogLoader=true;
          const body={
            id_ipress:sessionStorage.getItem("itemIpress").split("/")[4],
            id_periodo:this.periodoSelect
          };
          const token = await obtenerToken();
          registrarPeriodoIpress.registrarPeriodoIpress(token,body)
              .then((res) => {
                this.dialogLoader=false;            
          
              })
              .catch((res) => {
                this.dialogLoader=false;
              });
        },
        validarCarga(){
          Swal.fire({
            title: "¡Alerta!",
            text: "Al cargar se perderá toda la información preexistente en dicho periodo ¿Desea continuar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogLoader=true;
              this.preCarga();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
              console.log("El usuario hizo clic en No o cerró el modal");
            }
          });
          return;
        },
        async preCarga(){
          console.log("itemPeriodo",sessionStorage.getItem("itemPeriodo"))
          const body={
              id_ipress:sessionStorage.getItem("itemIpress").split("/")[4],
              id_periodo:sessionStorage.getItem("itemPeriodo").split("/")[4],
              id_estado:null
          };
          console.log("body",body)
          const idPeriodoIpress = await periodoIpress(body);
          const array={
              id_periodo_ipress:idPeriodoIpress,
              id_usuario_ipress:sessionStorage.getItem("itemUsuarioIpress").split("/")[4],
              id_periodo:this.periodosSelect
          }
          this.dialogLoader=true;
          const token = await obtenerToken();
          preCarga.preCarga(token,array)
          .then((res) => {
            Swal.fire({
              title: "¡Exito!",
              text: "Se pre cargaron los datos exitosamente",
              icon: "success",
              showCancelButton: true,
            });
            this.dialogLoader = false;
            this.consultaPeriodoEstado();
          })
          .catch((res) => {
              Swal.fire({
                title: "¡Error!",
                text: "Se produjo un error",
                icon: "error",
                showCancelButton: true,
              });
              console.log('Error:', res);
              this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
          });
        },
        async loadResumen(){
          const body={
              id_ipress:sessionStorage.getItem("itemIpress").split("/")[4],
              id_periodo:sessionStorage.getItem("itemPeriodo").split("/")[4],
              id_estado:null
          };
          const idPeriodoIpress = await periodoIpress(body);
          const array={
            id_usuario_ipress:sessionStorage.getItem("itemUsuarioIpress").split("/")[4],
            id_periodo_ipress:idPeriodoIpress
          }
          this.dialogLoader=true;
          const token = await obtenerToken();
          cantidadRegistros.cantidadRegistros(token,array)
          .then((res) => {
              this.dialogLoader = false;
              this.desserts=res.data;
          })
          .catch((res) => {
              console.log('Error:', res);
              this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
          });
        },
        async loadPeriodos(){
          const array={
            id_ipress:sessionStorage.getItem("itemIpress").split("/")[4]
          }
          this.dialogLoader=true;
          const token = await obtenerToken();
          consultaPeriodo.consultaPeriodoInactivo(token,array)
          .then((res) => {
              this.dialogLoader = false;
              this.itemsPeriodos=res.data;
          })
          .catch((res) => {
              console.log('Error:', res);
              this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
          });
        },
        /* async loadItemsPeriodo(){
          this.registrarPeriodoIpress();
          const array={
              id_modalidad:sessionStorage.getItem("itemModalidad").split("/")[4],
              usuario_ipress:sessionStorage.getItem("itemUsuarioIpress").split("/")[4]
          }
          this.dialogLoader=true;
          const token = await obtenerToken();
          cantidadRegistros.cantidadRegistros(token,array)
          .then((res) => {
              this.dialogLoader = false;
              this.desserts=res.data;
          })
          .catch((res) => {
              console.log('Error:', res);
              this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
          });
        }     */
       async consultaPeriodoEstado(){
        const body={
              id_ipress:sessionStorage.getItem("itemIpress").split("/")[4],
              id_periodo:sessionStorage.getItem("itemPeriodo").split("/")[4],
              id_estado:null
          };
          const idPeriodoIpress = await periodoIpress(body);
          const array={
            id_periodo_ipress:idPeriodoIpress
          }
          this.dialogLoader=true;
          const token = await obtenerToken();
          consultaPeriodo.consultaPeriodoEstado(token,array)
          .then((res) => {
              this.dialogLoader = false;
              this.statusButton=res.data[0].numero;

          })
          .catch((res) => {
              console.log('Error:', res);
              this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
          });
       }
      },
      created() {
        this.loadPeriodos();
        this.perfil = sessionStorage.getItem("perfil");
        this.nombre = sessionStorage.getItem("nombre");
        this.loadResumen();
        this.consultaPeriodoEstado();
      },
      components: {
        CargaMasiva
      },
    };
    </script>
    