<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important; padding: 0 !important">
      <v-card class="mx-auto" max-width="2500" style="padding: 1.5rem">
        <div style="max-height: 80vh">
          <v-form ref="form" v-model="valid" lazy-validation>
            <h4>Datos paciente</h4>
            <v-divider></v-divider>
            <br/>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field ref="Num_doc" id="Num_doc" v-model="dataPaciente.documento" label="Nro de documento"
                  :rules="rules.documento" :counter="maxCaracteres" :error-messages="erroresForm.documento"
                  :maxlength="maxCaracteres" @input="validateField"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="dataPaciente.autogenerado" label="Autogenerado"
                  :error-messages="erroresForm.autogenerado" :rules="rules.autogenerado"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="dataPaciente.tipo_documento" :items="['DNI', 'CARNET DE EXTRANJERÍA', 'RUC']"
                  label="Tipo de documento" :error-messages="erroresForm.tipo_documento"
                  :rules="rules.tipo_documento"></v-select>
              </v-col>
              <!-- 
                <v-col cols="12" md="6">
                  <v-text-field v-model="dataPaciente.autogenerado" label="Autogenerado"
                    :error-messages="erroresForm.autogenerado" :rules="rules.autogenerado">
                  </v-text-field>
                </v-col>
              -->
              <v-col cols="12" md="6">
                <v-text-field v-model="dataPaciente.paciente" label="Apellidos y nombres"
                  :error-messages="erroresForm.paciente" :rules="rules.paciente"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                  max-width="290px" min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="computedDateFormatted" label="Fecha de nacimiento" hint="" persistent-hint
                      prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                      :error-messages="erroresForm.fecha_nacimiento" :rules="rules.fecha_nacimiento"></v-text-field>
                  </template>
                  <v-date-picker v-model="dataPaciente.fecha_nacimiento" no-title @input="menu = false"
                    @change="calculateAge()" ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="dataPaciente.edad" label="Edad" :error-messages="erroresForm.edad"
                  :rules="rules.edad" disabled></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="dataPaciente.genero" :items="['Masculino', 'Femenino']" label="Genero"
                  :error-messages="erroresForm.genero" :rules="rules.genero" @change="changeAutogenerado"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="dataPaciente.grado_instruccion"
                  :items="['PRIMARIA', 'SECUNDARIA', 'SIN ESTUDIO', 'SUPERIOR']" label="Grado de instrucción"
                  :rules="rules.grado_instruccion" :error-messages="erroresForm.grado_instruccion"></v-select>
              </v-col>
             <!--  <v-col cols="12" md="6">
                <v-select v-model="dataPaciente.id_modalidad" :items="arrayModalidades" label="Modalidad"
                  item-text="modalidad" item-value="url" :error-messages="erroresForm.id_modalidad"
                  :rules="rules.id_modalidad"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="dataPaciente.id_tipo_paciente" :items="arrayTipoPaciente" label="Tipo paciente"
                  item-text="tipo_paciente" item-value="url" :error-messages="erroresForm.id_tipo_paciente"
                  :rules="rules.id_tipo_paciente"></v-select>
              </v-col> -->
            </v-row>
            <div class="d-flex justify-end ma-1">
              <v-btn color="secundary" @click="closeForm" style="margin-right: 1rem">
                Cancelar
              </v-btn>
              <v-btn color="primary" @click="validarCampos">
                Registro paciente
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
      <v-dialog v-model="dialogLoader" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Cargando Datos
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<style scoped>
.v-date-picker-years {
  display: block;
}

.v-date-picker-years li {
  width: inherit;
}

.v-dialog__content--active {
  background: #59595940;
  backdrop-filter: blur(1px);
}

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

.v-dialog__content--active {
  background: #59595940;
  backdrop-filter: blur(1px);
}

ul {
  list-style-type: disc;
  /* Asegura que los puntos se muestren */
  padding-left: 0;
  /* Remueve el padding por defecto */
  display: flex;
  /* Usa flexbox para centrar */
  justify-content: center;
}

li {
  margin-bottom: 5px;
  /* Opcional: añade espaciado entre los elementos de la lista */
  width: fit-content;
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
import { obtenerToken } from "@services/authService/authService";
import modalidadService from "@services/modalidad/modalidadService";
import tipoPacienteService from "@services/tipoPaciente/tipoPacienteService";
import pacienteService from "@services/pacientes/pacienteService";
export default {
  data() {
    return {
      valid: false,
      maxCaracteres: 10, // Número máximo de caracteres permitidos
      erroresForm: {
        documento: [],
        tipo_documento: [],
        autogenerado: [],
        paciente: [],
        fecha_nacimiento: [],
        edad: [],
        genero: [],
        grado_instruccion: [],
        id_modalidad: [],
        id_tipo_paciente: [],
      },
      rules: {
        documento: [(v) => !!v || "El número de documento es requerido"],
        tipo_documento: [(v) => !!v || "El tipo de documento es requerido"],
        autogenerado: [(v) => !!v || "El autogenerado es requerido"],
        paciente: [(v) => !!v || "Apellidos y nombres es requerido"],
        fecha_nacimiento: [(v) => !!v || "La fecha de nacimiento es requerido"],
        edad: [(v) => !!v || "La edad es requerida"],
        genero: [(v) => !!v || "El genero es requerido"],
        grado_instruccion: [
          (v) => !!v || "El grado de instrucción es requerido",
        ],
        id_modalidad: [(v) => !!v || "La modalidad es requerida"],
        id_tipo_paciente: [(v) => !!v || "El tipo paciente es requerido"],
      },
      dialogLoader: false,
      dialog: false,
      menu: false,
      dataPaciente: {
        documento: "",
        tipo: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: new Date().toISOString().substr(0, 10),
        edad: "",
        sexo: "",
        gradoInstruccion: "",
        id_modalidad: "",
        id_tipo_paciente: "",
        genero: ""
      },
      itemModalidad: null,
      itemPeriodo: null,
      itemUsuarioIpress: null,
      itemPaciente: null,
      arrayModalidades: [],
      arrayTipoPaciente: [],
    };
  },
  methods: {
    changeAutogenerado(){
      /* this.dataPaciente.autogenerado=`${this.dataPaciente.fecha_nacimiento.split("-")[2]}${this.dataPaciente.edad}${this.dataPaciente.genero}`;
      console.log("prueba de extraccion",this.dataPaciente.fecha_nacimiento.split("-")[0]); */
    },
      calculateAge() {
      const parts = this.dataPaciente.fecha_nacimiento.split("-");
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
      this.dataPaciente.edad = age;
      this.changeAutogenerado();
    },
    async create() {
      this.dataPaciente;
      const body = this.dataPaciente;
      this.dialogLoader = true;
      const token = await obtenerToken();
      
      pacienteService
        .postPacientes(token, body)
        .then((res) => {
          this.dialogLoader = false;
          Swal.fire({
            title: "¡Exito!",
            html: `¡Se completó la operación con exito!`,
            icon: "success",
            confirmButtonText: "Ok",
          });
          this.closeForm();
        })
        .catch((res) => {
          console.log("Error:", res.response.data.error);
          Swal.fire({
            title: "¡Error!",
            html: `${res.response.data.error}`,
            icon: "error",
            confirmButtonText: "Ok",
          });
          this.dialogLoader = false;
        });
    },
    closeForm() {
      this.$emit("closeNuevo");
    },
    validateField() {
      for (let i = 0; i < this.erroresForm.length; i++) {
        const element = this.erroresForm[i];
        const el = this.rules[i];
        const data = this.dataPaciente[i];
        element = el
          .map((rule) => rule(data))
          .filter((error) => error !== true);
      }
    },
    validarCampos() {
      this.$refs.form.validate();
      for (let i = 0; i < this.erroresForm.length; i++) {
        const element = this.erroresForm[i];
        const el = this.rules[i];
        const data = this.dataPaciente[i];
        if (!this.valid) {
          element = el
            .map((rule) => rule(data))
            .filter((error) => error !== true);
        } else {
          element = [];
        }
      }
      if (!this.valid) {
        Swal.fire({
          title: "¡Error!",
          html: `¡Debe compretar todos los campos requeridos!`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        this.create();
      }
    },
    formatDate(dateString) {
      const parts = dateString.split("-");
      const day = parts[2];
      const month = parts[1];
      const year = parts[0];
      return `${day}-${month}-${year}`;
    },
    async loadTipoPacientes() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      tipoPacienteService
        .getTipoPacientes(token)
        .then((res) => {
          this.dialogLoader = false;
          this.arrayTipoPaciente = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
    async loadModalidades() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      modalidadService
        .getModalidades(token)
        .then((res) => {
          this.dialogLoader = false;
          this.arrayModalidades = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.dataPaciente.fecha_nacimiento);
    },
  },
  created() {
    this.itemModalidad = sessionStorage.getItem("itemModalidad");
    this.itemPeriodo = sessionStorage.getItem("itemPeriodo");
    this.itemUsuarioIpress = sessionStorage.getItem("itemUsuarioIpress");
    this.itemPaciente = sessionStorage.getItem("itemPaciente");
    this.loadModalidades();
    this.loadTipoPacientes();
  },
  components: {},
};
</script>