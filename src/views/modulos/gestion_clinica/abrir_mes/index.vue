<template>
  <div style="margin-top: 2rem">
    <v-container max-width="2500" style="width: 100%">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar
          class="py-5 px-3"
          color="#1973a5"
          style="color: #fff"
          dark
        >
          Abrir mes
        </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-5" max-width="2500">
        <v-row>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-select
              v-model="periodosSelect"
              :items="itemsPeriodos"
              label="Periodos"
              item-value="id_periodo"
              item-text="periodo"
              @change="loadRegistros"
            ></v-select>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mx-auto my-5" max-width="2500">
        <v-row style="width: 100%">
          <v-col cols="12" sm="12" md="12" class="mx-3">
            <v-data-table
              :items-per-page="10"
              :headers="headers"
              :items="desserts"
              class="elevation-1"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn color="green" @click="openForm(item)"> Abrir </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
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
  </div>
</template>
  <style>
</style>
    <script>
import { obtenerToken } from "../../../../services/authService/authService";
import consultaPeriodo from "@services/script/consultaPeriodo";
import cantidadRegistros from "@services/script/cantidadRegistros";
import cerrarMes from "@services/script/cerrarMes";

import Swal from "sweetalert2";
export default {
  data() {
    return {
      dialogLoader: false,
      headers: [
        { text: "Formularios", value: "formulario" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Acciones", value: "actions" },
      ],
      desserts: [],
      periodosSelect: null,
      dialogEdit: true,
      perfil: "",
      nombre: "",
      itemsPeriodos: [],
    };
  },
  methods: {
    openForm(item) {
      Swal.fire({
        title: "¡Alerta!",
        text: "¿Esta seguro de abrir el formulario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialogLoader = true;
          this.actionOpenForm(item);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
    },
    async actionOpenForm(item) {
      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo: this.periodosSelect,
        id_formulario: item.numero,
        estado: 1,
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      cerrarMes
        .cerrarMes(token, array)
        .then((res) => {
          this.dialogLoader = false;
          Swal.fire({
            title: "¡Exito!",
            text: "Se abrió el formulario exitosamente",
            icon: "success",
            showCancelButton: true,
          });
          this.loadRegistros();
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async loadPeriodos() {
      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        estado: 2,
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      consultaPeriodo
        .consultaPeriodoActualizacion(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.itemsPeriodos = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async loadRegistros() {
      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo: this.periodosSelect,
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      cantidadRegistros
        .cantidadRegistrosCerrados(token, array)
        .then((res) => {
          this.dialogLoader = false;
          this.desserts = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
  },
  created() {
    this.loadPeriodos();
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
  },
  components: {},
};
</script>
    