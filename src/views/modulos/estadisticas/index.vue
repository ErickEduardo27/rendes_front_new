<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div>
            <canvas ref="chart1"></canvas>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div>
            <canvas ref="chart2"></canvas>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div>
            <canvas ref="chart3"></canvas>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div>
            <canvas ref="chart4"></canvas>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="chart-card pa-4">
          <div>
            <canvas ref="patientChart"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  <style>
.canvas-container {
  position: relative;
  margin: auto;
  height: 600px;
  width: 600px;
}
.chart-card {
  height: 400px; /* Adjust this value to increase the height */
}

.chart-card canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
    <script>
import reporteHome from "@services/script/reporteHome";
import { Chart, registerables } from "chart.js";
import { obtenerToken } from "../../../services/authService/authService";
import axios from "axios";
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
const RUTA_API = process.env.VUE_APP_API;
Chart.register(...registerables);
export default {
  data() {
    return {
      months: [
        "Pacientes Diálisis",
        "Unidades Actuales",
        "Eventos Accesos Vasculares",
        "Morbilidades Hospitalarias",
        "Resultados Clínicos",
        "Calidad Microbiológica",
        "Vacunaciones",
      ],
      enrolledPatients: [2, 3, 4, 5, 6, 7, 8], // Example data
      notEnrolledPatients: [1, 2, 3, 1, 2, 1, 8], // Example data
      chart: null,
      chartData1: [10, 20, 30, 40],
      chartData2: [15, 25, 35, 45],
      chartData3: [20, 30, 40, 50],
      chartData4: [25, 35, 45, 55],
      dataPaciente: {
        chart: null,
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
        pacienteHemo: 0,
        unidadActual: 0,
        accesoVascular: 0,
        morbiHospi: 0,
        resultadosCli: 0,
        calidadMicro: 0,
        vacunacion: 0,
      },
    };
  },
  methods: {
    async reporteHome() {
      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("idUsuarioIpress")
          .split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
      };

      try {
        const token = await obtenerToken();
        const res = await reporteHome.reporteHome(token, array);

        const arrayData = res.data;

        /* arrayData.forEach(elemento => {
                  if (elemento.estado === "ACTIVO") {
                      this.enrolledPatients.push(elemento.cantidad);
                      this.notEnrolledPatients.push(0);
                  } else {
                      this.enrolledPatients.push(0);
                      this.notEnrolledPatients.push(elemento.cantidad);
                  }
              }); */

        this.renderCharts();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("Lo siento, no tenemos servicios");
        } else {
          console.warn("Error: ", error);
        }
      }
    },
    reporteHomes() {
      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("idUsuarioIpress")
          .split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
      };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/reporte_home/", array, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              const arrayData = res.data;

              /* arrayData.forEach(elemento => {
                this.months.push(elemento.formulario)
                  if (elemento.estado === "ACTIVO") {
                      this.enrolledPatients.push(elemento.cantidad);
                      this.notEnrolledPatients.push(0);
                  } else {
                      this.enrolledPatients.push(0);
                      this.notEnrolledPatients.push(elemento.cantidad);
                  }
                  
              }); */
              console.log(this.months);
              this.renderCharts();
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
        });
    },
    renderCharts() {
      // Asegurar que los datos estén listos antes de intentar renderizar el gráfico
      if (
        this.enrolledPatients.length !== 7 ||
        this.notEnrolledPatients.length !== 7
      ) {
        // Puedes manejar esto según tu lógica específica, como mostrar un mensaje de carga o error.
        console.warn("No hay datos disponibles para renderizar el gráfico.");
        return;
      }

      // Ahora puedes renderizar el gráfico con los datos actualizados
      const ctx = this.$refs.patientChart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.months,
          datasets: [
            {
              label: "Pacientes activos",
              data: this.enrolledPatients,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Pacientes inactivos",
              data: this.notEnrolledPatients,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    renderChart(canvas, data, label, type = "bar") {
      new Chart(canvas, {
        type: type,
        data: {
          labels: ["January", "February", "March", "April"],
          datasets: [
            {
              label: label,
              data: data,
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
  computed: {
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
    /*  this.$nextTick(() => {
          this.renderCharts();
        }); */
    this.renderChart(this.$refs.chart1, this.chartData1, "Bar Dataset 1");
    this.renderChart(
      this.$refs.chart2,
      this.chartData2,
      "Line Dataset 2",
      "line"
    );
    this.renderChart(
      this.$refs.chart3,
      this.chartData3,
      "Pie Dataset 3",
      "pie"
    );
    this.renderChart(
      this.$refs.chart4,
      this.chartData4,
      "Doughnut Dataset 4",
      "doughnut"
    );
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    /* console.log("Perfil", this.perfil);
        console.log("nombre", this.nombre); */
    this.reporteHomes();
  },
  components: {},
};
</script>
    