<template>
  <div>
    <v-card class="mx-auto draggable-card" max-width="245" outlined :style="cardStyle" @mousedown="onMouseDown">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline">Paciente</div>
          <v-list-item-title class="text-h6 mb-3 d-flex" style="flex-wrap: nowrap; align-items: center">
            <div style="white-space: pre-wrap; margin-top: 1rem">
              {{ dataPaciente.apellidosNombres }}
            </div>
            <img width="50"
              src="https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_white_tone_icon_159368.png"
              alt="foto_photo" />
          </v-list-item-title>
          <br />
          <br />
          <v-list-item-subtitle>
            Número documento: {{ dataPaciente.numero }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            Autogenerado: {{ dataPaciente.autogenerado }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>Edad: {{ dataPaciente.edad }}</v-list-item-subtitle>
          <v-list-item-subtitle>
            Fecha Nacimiento: {{ dataPaciente.fecha_nacimiento }}
            {{ dataPaciente.genero }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions></v-card-actions>
    </v-card>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in itemsFormulario" :key="i">
        <v-expansion-panel-header @click="updateSlide(i)"
          v-if="(statusForm !== 2 && i !== 5) || (statusForm == 1 && i == 5)">
          <v-card class="" max-width="2500">
            <v-system-bar class="py-5 px-3" color="#1973a5" style="color: #fff" dark>
              <div class="d-flex" style="justify-content: space-between; width: 100%">
                {{ item.nombre }}
                <v-progress-linear color="white" :value="item.porcentaje" :height="15" style="width: 10%">
                  <template v-slot:default>
                    <div style="
                        position: absolute;
                        width: 100%;
                        text-align: center;
                        color: #002a6e;
                        font-size: 0.76rem;
                        font-weight: 600;
                      ">
                      {{ item.porcentaje }}%
                    </div>
                  </template>
                </v-progress-linear>
              </div>
            </v-system-bar>
          </v-card>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="padding: 0">
          <component :is="item.componente" v-if="item.itemSelect == selectedItem" @porcentajeForm="porcentajeForm"
            @loadPorcentajeForm="loadPorcentajeForm" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="d-flex justify-space-between ma-3">
      <v-btn color="primary" @click="openRegister"> Nuevo Paciente </v-btn>
    </div>
    <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="900px" persistent>
      <RegistroPaciente @closeForm="closeForm" @updatePaciente="updatePaciente" @porcentajeForm="porcentajeForm"
        @updateNavBar="updateItemBar" />
    </v-dialog>
  </div>
</template>
<style>
.main-responsive {
  margin-left: 18rem;
}

@media (max-width: 1024px) {
  .main-responsive {
    margin-left: 0rem;
    padding-left: 1.5rem;
  }
}

tbody tr td {
  font-size: 0.7rem;
}

.v-expansion-panel-header {
  padding: 0.5rem !important;
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
import PacienteDialisis from "./pacientes_dialisis/index.vue";
import UnidadActual from "./unidad_actual/index.vue";
import EventosAsocInfec from "./eventos_asociados/index.vue";
import MorbilidadHospitalaria from "./morbilidad_hospitalaria/index.vue";
import ResultadosClinicos from "./resultados_clinicos/index.vue";
import CalidadMicrobiologica from "./calidad_microbiologica/index.vue";
import Vacunacion from "./vacunacion/index.vue";
import RegistroPaciente from "../gestion/pacientes/search.vue";
import { periodoIpress } from "../../../services/periodoIpress/periodoIpress";
import avancePacienteService from "../../../services/script/avancePacienteService";
export default {
  data() {
    return {
      dataPaciente: {
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
      dialogEdit: true,
      statusRegistroPaciente: true,
      open: ["Users"],
      admins: [
        ["Cupos disponibles", "mdi-folder"],
        ["Asistencia Pacientes", "mdi-folder"],
        ["Informe Nutrición", "mdi-folder"],
      ],
      perfil: "",
      nombre: "",
      selectedItem: null,
      items2: [{ text: "Formularios", icon: "mdi-folder" }],
      cardPosition: { top: 0, left: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      porcentajeGroup: {
        porcentaje_1: 0,
        porcentaje_2: 0,
        porcentaje_3: 0,
        porcentaje_4: 0,
        porcentaje_5: 0,
        porcentaje_6: 0,
        porcentaje_7: 0,
      },
      statusForm: null,
      trigger: 0
    };
  },
  methods: {
    loadPorcentajeForm() {
      console.log("hlaaaaaaaa")
      this.calculateFormPorcentaje();
    },
    async calculateFormPorcentaje() {
      this.dialogLoader = true;
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
        paciente: this.dataPaciente.id_paciente.split("/")[4],
      };
      avancePacienteService
        .postCalcularAvance(array)
        .then((res) => {
          this.updatePacientes();
          this.trigger++;
          this.porcentajeGroup = res.data[0];
          console.log("this.porcentajeGroup", this.porcentajeGroup)
          this.dialogLoader = false;
        })
        .catch((res) => {
          this.dialogLoader = false;
        });
    },
    updateItemBar(datos) {
      const body = { index: datos, tipo: "todos" };
      this.$emit("updateItemBar", body);
    },
    openRegister() {
      this.dialogEdit = true;
    },
    porcentajeForm(item) {
      this.porcentajeGroup = item;
    },
    onMouseDown(event) {
      this.isDragging = true;
      this.dragStart.x = event.clientX - this.cardPosition.left;
      this.dragStart.y = event.clientY - this.cardPosition.top;
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseMove(event) {
      if (this.isDragging) {
        this.cardPosition.left = event.clientX - this.dragStart.x;
        this.cardPosition.top = event.clientY - this.dragStart.y;
      }
    },
    onMouseUp() {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    },
    setInitialPosition() {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      this.cardPosition.top = (70 / 100) * windowHeight;
      this.cardPosition.left = (0.3 / 100) * windowWidth;
    },
    updatePaciente(item) {
      this.dataPaciente = item;
      sessionStorage.setItem("itemPaciente", this.dataPaciente.id_paciente)
      console.log("datos del paciente", this.dataPaciente)
    },
    closeForm() {
      this.dialogEdit = false;
    },
    updateSlide(index) {
      this.selectedItem = index;
      console.log("holasssssss", index);
    },
  },
  computed: {
    itemsFormulario() {
      this.trigger;
      console.log("holasssss")
      return [
        {
          nombre: "Formulario de registro del paciente con diálisis",
          porcentaje: this.porcentajeGroup.porcentaje_1 * 100,
          componente: "PacienteDialisis",
          itemSelect: 0,
        },
        {
          nombre: "Formulario de unidad actual",
          porcentaje: this.porcentajeGroup.porcentaje_2 * 100,
          componente: "UnidadActual",
          itemSelect: 1,
        },
        {
          nombre:
            "Formulario de eventos asociados a infecciones de acceso vascular",
          porcentaje: this.porcentajeGroup.porcentaje_3 * 100,
          componente: "EventosAsocInfec",
          itemSelect: 2,
        },
        {
          nombre: "Formulario de morbilidad hospitalaria",
          porcentaje: this.porcentajeGroup.porcentaje_4 * 100,
          componente: "MorbilidadHospitalaria",
          itemSelect: 3,
        },
        {
          nombre: "Formulario de resultados clínicos",
          porcentaje: this.porcentajeGroup.porcentaje_5 * 100,
          componente: "ResultadosClinicos",
          itemSelect: 4,
        },
        {
          nombre: "Formulario de calidad microbiologica",
          porcentaje: this.porcentajeGroup.porcentaje_6 * 100,
          componente: "CalidadMicrobiologica",
          itemSelect: 5,
        },
        {
          nombre: "Formulario de vacunación",
          porcentaje: this.porcentajeGroup.porcentaje_7 * 100,
          componente: "Vacunacion",
          itemSelect: 6,
        },
      ];
    },
    cardStyle() {
      return {
        position: "fixed",
        top: `${this.cardPosition.top}px`,
        left: `${this.cardPosition.left}px`,
        zIndex: 10,
        marginBottom: "1rem",
      };
    },
  },
  mounted() {
    this.setInitialPosition();
    window.addEventListener("resize", this.setInitialPosition);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setInitialPosition);
  },
  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.statusForm = sessionStorage.getItem("itemModalidad").split("/")[4];
  },
  components: {
    PacienteDialisis,
    UnidadActual,
    EventosAsocInfec,
    MorbilidadHospitalaria,
    ResultadosClinicos,
    CalidadMicrobiologica,
    Vacunacion,
    RegistroPaciente,
  },
};
</script>