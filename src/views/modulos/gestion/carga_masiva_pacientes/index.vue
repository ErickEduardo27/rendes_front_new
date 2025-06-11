<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar
          class="py-5 px-3"
          color="#1973a5"
          style="color: #fff"
          dark
        >
          Carga masiva de pacientes
        </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-5 elevation-1" max-width="2100" style="padding: 1rem;">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-select
              v-model="files"
              label="Tipo"
              multiple
              accept=".xlsx"
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
        </v-row>
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
.bg-primary-table {
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
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
export default {
  data() {
    return {
      files: [],
      dialogLoader:false,
      uploading: false,
      dialog: false,
      deleteUser: [],
      statusEdit: false,
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      dataEtiologia: [],
      dataPaciente: [],
    };
  },
  methods: {
    close(){
        this.$emit('closeDialog');
    },
    async handleFileUpload() {
      const formData = new FormData();
      this.dialogLoader=true;
      formData.append("file", this.files[0]);
      try {
         axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        }).then((response) => {
             axios.post
            (
            RUTA_API + "/carga_masiva/",
            formData,
            {
                headers:
                { Authorization: this.auth }
            }
            ).then((res)=>{
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.files=[];
              this.dialogLoader=false;
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
    uploadFiles() {
      this.uploading = true;
        // Simulating upload process, replace with actual upload logic
      setTimeout(() => {
        // Here you would implement the logic to upload files to your server
        this.uploading = false;
        this.files = []; // Reset files after upload
        this.close();
      }, 2000); // Simulated 2 second delay for demonstration
    },
    uploadData() {
      if (!this.file) return;
    },
    editClose() {
      console.log("reporte paciente", this.ipressData);
      this.clearForm();
      this.statusEdit = false;
      this.dialogEdit = false;
    },
    deleteOpen(item) {
      this.deleteUser = item;
      this.dialogDelete = true;
    },
    deleteClose() {
      this.dialogDelete = false;
    },
  },
  mounted() {},
  computed: {
  },
  created() {
  },
  components: {},
};
</script>