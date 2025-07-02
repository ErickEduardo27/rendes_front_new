<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-content">
            <h2 class="modal-title">Buscar Paciente</h2>
            <p class="modal-subtitle">
                Complete la información básica del paciente para crear su expediente médico.
            </p>
            <form @submit.prevent="handleSubmit" class="form-grid">
                <div class="form-group">
                    <label for="tipoId">Tipo de Documento *</label>
                    <select id="tipoId" v-model="formData.tipoId">
                        <option disabled value="">Tipo de ID</option>
                        <option>DNI</option>
                        <option>CE</option>
                        <option>PASAPORTE</option>
                    </select>
                </div>
                <div class="form-group input-with-suggestions">
                    <label for="numeroId">Número de Documento *</label>
                    <input 
                    id="numeroId" 
                    v-model="formData.numeroId" 
                    @input="handleDocumentInput" 
                    :maxlength="maxDocumentLength"
                    :pattern="documentPattern"
                    inputmode="numeric" 
                     />
                    <ul v-if="showSuggestions" class="suggestions-list">
                        <li v-for="paciente in pacientesEncontrados" :key="paciente.numeroId"
                            @click="seleccionarPaciente(paciente)">
                            {{ paciente.nombres }} {{ paciente.apellidos }} ({{ paciente.numeroId }})
                        </li>
                        <li v-if="pacientesEncontrados.length === 0" class="no-results">
                            No se encontraron pacientes
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="apellidos">Apellidos *</label>
                    <input id="apellidos" v-model="formData.apellidos" readonly />
                </div>
                <div class="form-group">
                    <label for="nombres">Nombres *</label>
                    <input id="nombres" v-model="formData.nombres" readonly />
                </div>

                <div class="form-group">
                    <label for="fechaNacimiento">Fecha de Nacimiento *</label>
                    <input id="fechaNacimiento" type="date" v-model="formData.fechaNacimiento" readonly />
                </div>
                <div class="form-group">
                    <label for="genero">Sexo *</label>
                    <input id="genero" v-model="formData.genero" readonly />
                </div>

                <div class="form-group">
                    <label for="edad">Edad *</label>
                    <input id="edad" v-model="formData.edad" readonly />
                </div>
                <div class="form-group">
                    <label for="gradoInstruccion">Grado de Instrucción *</label>
                    <input id="gradoInstruccion" v-model="formData.gradoInstruccion" readonly />
                </div>

                <div class="form-group full-width">
                    <label for="tipoDialisis">Modalidad de Diálisis *</label>
                    <select id="tipoDialisis" v-model="formData.tipoDialisis">
                        <option disabled value="">Seleccione la modalidad de diálisis</option>
                        <option value="hemodialisis">Hemodiálisis</option>
                        <option value="peritoneal">Diálisis Peritoneal</option>
                    </select>
                </div>

                <div class="form-actions full-width">
                    <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
                    <button type="submit" class="btn-submit">Siguiente</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue-sonner';

export default {
    name: 'PatientRegistrationModal',
    props: {
        isOpen: Boolean,
        onPatientRegistered: Function
    },
    emits: ['close'],
    data() {
        return {
            formData: {
                tipoId: "",
                numeroId: "",
                apellidos: "",
                nombres: "",
                fechaNacimiento: "",
                genero: "",
                edad: "",
                gradoInstruccion: "",
                tipoDialisis: ""
            },
            pacientesEncontrados: [],
            showSuggestions: false
        };
    },
    computed: {
        maxDocumentLength() {
            switch (this.formData.tipoId) {
                case "DNI":
                    return 8;
                case "CE":
                    return 12;
                case "PASAPORTE":
                    return 20;
                default:
                    return null; 
            }
        },
        documentPattern() {
            switch (this.formData.tipoId) {
                case "DNI":
                    return "[0-9]{8}"; 
                case "CE":
                    return "[a-zA-Z0-9]{12}";
                case "PASAPORTE":
                    return "[a-zA-Z0-9]{1,20}"; 
                default:
                    return "[a-zA-Z0-9]*";
            }
        }
    },
    methods: {
        handleDocumentTypeChange() {
            this.formData.numeroId = "";
            this.pacientesEncontrados = [];
            this.showSuggestions = false;
            this.clearPatientFields();
        },
        async handleDocumentInput() {
            const { tipoId, numeroId } = this.formData;

            if (numeroId.length === 0 || tipoId === "") {
                this.pacientesEncontrados = [];
                this.showSuggestions = false;
                this.clearPatientFields();
                return;
            }

            if (numeroId.length >= 3) {
                this.pacientesEncontrados = await this.buscarPacientes(tipoId, numeroId);
                this.showSuggestions = true;
            } else {
                this.pacientesEncontrados = [];
                this.showSuggestions = false;
            }
        },
        async buscarPacientes(tipo, numero) {
            const base = [
                {
                    tipoId: "DNI",
                    numeroId: "12345678",
                    apellidos: "Ramírez López",
                    nombres: "Carlos Alberto",
                    fechaNacimiento: "1985-07-12",
                    genero: "Masculino",
                    edad: "38",
                    gradoInstruccion: "Superior"
                },
                {
                    tipoId: "DNI",
                    numeroId: "12345679",
                    apellidos: "Gonzales Pérez",
                    nombres: "Ana María",
                    fechaNacimiento: "1990-04-21",
                    genero: "Femenino",
                    edad: "34",
                    gradoInstruccion: "Secundaria"
                },
                {
                    tipoId: "CE",
                    numeroId: "123456789012",
                    apellidos: "Fernández Quispe",
                    nombres: "Luis Miguel",
                    fechaNacimiento: "1975-11-05",
                    genero: "Masculino",
                    edad: "48",
                    gradoInstruccion: "Técnico"
                },
                {
                    tipoId: "PASAPORTE",
                    numeroId: "ABC123456789DEF",
                    apellidos: "Smith Johnson",
                    nombres: "Emily Rose",
                    fechaNacimiento: "1995-02-28",
                    genero: "Femenino",
                    edad: "29",
                    gradoInstruccion: "Universitario"
                }
            ];

            return new Promise(resolve => {
                setTimeout(() => {
                    const filtrados = base.filter(p =>
                        p.tipoId === tipo && p.numeroId.includes(numero)
                    );
                    resolve(filtrados);
                }, 500);
            });
        },
        seleccionarPaciente(paciente) {
            this.formData = {
                ...this.formData,
                ...paciente
            };
            this.showSuggestions = false;
        },
        clearPatientFields() {
            this.formData.apellidos = "";
            this.formData.nombres = "";
            this.formData.fechaNacimiento = "";
            this.formData.genero = "";
            this.formData.edad = "";
            this.formData.gradoInstruccion = "";
        },
        validateDocument() {
            const { tipoId, numeroId } = this.formData;
            let errorMessage = "";

            if (!tipoId) {
                errorMessage = "Por favor, seleccione un Tipo de Documento.";
            } else if (!numeroId) {
                errorMessage = "Por favor, ingrese el Número de Documento.";
            } else {
                switch (tipoId) {
                    case "DNI":
                        if (numeroId.length !== 8 || !/^\d+$/.test(numeroId)) {
                            errorMessage = "El DNI debe tener 8 dígitos numéricos.";
                        }
                        break;
                    case "CE":
                        if (numeroId.length !== 12 || !/^[a-zA-Z0-9]+$/.test(numeroId)) {
                            errorMessage = "El CE debe tener 12 caracteres alfanuméricos.";
                        }
                        break;
                    case "PASAPORTE":
                        if (numeroId.length === 0 || numeroId.length > 20 || !/^[a-zA-Z0-9]+$/.test(numeroId)) {
                            errorMessage = "El PASAPORTE debe tener entre 1 y 20 caracteres alfanuméricos.";
                        }
                        break;
                    default:
                        errorMessage = "Tipo de documento no válido.";
                        break;
                }
            }

            if (errorMessage) {
                toast.error(errorMessage);
                return false; 
            }
            return true;
        },
        handleSubmit() {
            if (!this.validateDocument()) {
                return;
            }

            const patientData = {
                ...this.formData,
                id: Date.now().toString(),
                fechaRegistro: new Date().toISOString()
            };
            this.onPatientRegistered(patientData);
            this.$emit('close');

            this.formData = {
                tipoId: "",
                numeroId: "",
                apellidos: "",
                nombres: "",
                fechaNacimiento: "",
                genero: "",
                edad: "",
                gradoInstruccion: "",
                tipoDialisis: ""
            };
            this.pacientesEncontrados = [];
        }
    }
};
</script>



<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    padding: 20px;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 100%;
    max-width: 700px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
}

.modal-subtitle {
    color: #666;
    margin-bottom: 20px;
}

.form-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.form-group {
    flex: 1 1 48%;
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    flex: 1 1 100%;
}

.form-group label {
    font-weight: 500;
    margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    resize: vertical;
}

textarea {
    min-height: 60px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-cancel {
    background: #f3f3f3;
    border: 1px solid #ccc;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-submit {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

input[readonly] {
    background-color: #f5f5f5;
    color: #555;
    cursor: not-allowed;
    border: 1px solid #ddd;
}

.input-with-suggestions {
    position: relative;
}

.suggestions-list {
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 8px;
    max-height: 180px;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 20;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
    padding: 10px 14px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
}

.suggestions-list li:last-child {
    border-bottom: none;
}

.suggestions-list li:hover {
    background-color: #f0f0f0;
}

.suggestions-list .no-results {
    padding: 10px 14px;
    color: #999;
    text-align: center;
    font-style: italic;
}
</style>
