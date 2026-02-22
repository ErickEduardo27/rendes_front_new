<template>
    <div class="min-h-screen bg-gray-50/50 p-6">
        
        <div class="max-w-7xl mx-auto mb-6">
            <div class="flex items-center text-sm font-medium cursor-pointer text-slate-500 hover:text-cyan-700 transition-colors mb-4" @click="$emit('cancelar')">
                <span class="bg-white p-1 rounded-full shadow-sm mr-2 border border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </span>
                Volver al inicio
            </div>

            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <FiltroSuperior
                    v-model:periodo="periodoSeleccionado"
                    v-model:clinica="clinicaFiltro"
                    v-model:modalidad="modalidadFiltro"
                    @change="procesarCambioFiltro"
                />
            </div>
        </div>

        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            
            <div class="flex-1 space-y-8">
                
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
                        Acceso de Diálisis
                    </h2>
                    <p class="text-slate-500 mt-1 ml-4 text-sm">A continuación se presenta el Acceso Vascular Actual del paciente.</p>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">Acceso Vascular Vigente</h3>
                        <span class="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded">Solo Lectura</span>
                    </div>
                    
                    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Acceso</label>
                            <div class="relative">
                                <select disabled v-model="form.tipo_acceso_actual" 
                                    class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 appearance-none cursor-not-allowed font-medium">
                                    <option disabled value="">Sin registro</option>
                                    <option value="Catéter Venoso Central Temporal">Catéter Venoso Central Temporal</option>
                                    <option value="Catéter Venoso Central de Larga Permanencia">Catéter Venoso Central de Larga Permanencia</option>
                                    <option value="Fístula Arteriovenosa">Fístula Arteriovenosa</option>
                                    <option value="Injerto Autólogo">Injerto Autólogo</option>
                                    <option value="Injerto Protésico">Injerto Protésico</option>
                                    <option value="Catéter peritoneal">Catéter peritoneal</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Localización</label>
                            <div class="relative">
                                <select disabled v-model="form.localizacion_acceso_actual" 
                                    class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 appearance-none cursor-not-allowed font-medium">
                                    <option disabled value="">Sin registro</option>
                                    <option v-for="op in opcionesLocalizacion" :key="op.value" :value="op.label">{{ op.label }}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Creación</label>
                            <input disabled v-model="form.fecha_creacion_acceso_actual" type="date"
                                class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 cursor-not-allowed font-medium" />
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg border border-cyan-100 p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                    
                    <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <label class="block text-sm font-bold text-slate-800 mb-2">¿Se requiere cambiar el acceso?</label>
                            <select v-model="form.cambio_acceso" 
                                class="w-full border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 bg-white shadow-sm transition-all"
                                :class="form.cambio_acceso == 'true' ? 'border-cyan-500 ring-1 ring-cyan-500 bg-cyan-50/30' : ''">
                                <option value="true">SÍ, Registrar cambio</option>
                                <option value="false">NO, Mantener actual</option>
                            </select>
                        </div>

                        <div v-if="form.cambio_acceso == 'true'" class="animate-fadeIn">
                            <label class="block text-sm font-bold text-slate-800 mb-2">Motivo del Cambio</label>
                            <select v-model="form.motivo_cambio" class="w-full border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 shadow-sm">
                                <option value="">-- Seleccione motivo --</option>
                                <option value="1">Complicación mecánica</option>
                                <option value="2">Complicación infecciosa</option>
                                <option value="3">Prescripción Médica</option>
                            </select>
                        </div>
                    </div>
                </div>

                <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                    <div v-if="form.cambio_acceso == 'true'" class="bg-white rounded-xl shadow-md border border-cyan-200 overflow-hidden">
                        <div class="bg-cyan-600 px-6 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            <h3 class="font-bold text-white text-sm uppercase tracking-wide">Registro de Nuevo Acceso</h3>
                        </div>

                        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-cyan-50/10">
                            <div>
                                <label class="block text-xs font-bold text-cyan-800 uppercase mb-1">Tipo Nuevo Acceso</label>
                                <select v-model="form.tipo_acceso_nuevo" class="w-full border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5 shadow-sm bg-white">
                                    <option disabled value="">Seleccione tipo</option>
                                    <option v-for="tipo in tiposAccesoNuevoFiltrados" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-cyan-800 uppercase mb-1">Nueva Localización</label>
                                <select v-model="form.localizacion_acceso_nuevo" 
                                    class="w-full border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5 shadow-sm bg-white"
                                    :disabled="!form.tipo_acceso_nuevo">
                                    <option disabled value="">Seleccione localización</option>
                                    <option v-for="op in opcionesLocalizacionNuevoFiltradas" :key="op.value" :value="op.label">{{ op.label }}</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-cyan-800 uppercase mb-1">Fecha de Creación</label>
                                <input v-model="form.fecha_creacion_acceso_nuevo" type="date"
                                    class="w-full border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5 shadow-sm bg-white" />
                            </div>
                        </div>
                    </div>
                </transition>

                <div class="pt-4">
                    <h3 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Historial de Cambios
                    </h3>
                    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div v-if="historialAcceso.length === 0" class="text-slate-400 text-center py-8 italic bg-slate-50">
                            No se encontraron registros previos de cambios.
                        </div>
                        <div v-else class="divide-y divide-slate-100">
                            <div v-for="(cambio, index) in historialAcceso" :key="index" class="p-4 hover:bg-slate-50 transition-colors">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div class="flex items-start gap-3">
                                        <div class="bg-blue-100 text-blue-600 p-2 rounded-lg mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-slate-800">{{ cambio.tipo_acceso }}</p>
                                            <p class="text-xs text-slate-500">{{ cambio.localizacion }}</p>
                                            <p v-if="cambio.motivo" class="text-xs text-slate-600 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">Motivo: {{ cambio.motivo }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-semibold text-slate-700">{{ cambio.fecha }}</p>
                                        <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="cambio.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                                            {{ cambio.estado }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-80 space-y-6">
                
                <div v-if="pacienteSeleccionado" class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group" @click="abrirHistorico">
                    <div class="h-2 bg-cyan-500 w-full"></div>
                    <div class="p-6 flex flex-col items-center">
                        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 border-2 border-white shadow-sm group-hover:border-cyan-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h3 class="text-center font-bold text-slate-800 leading-tight">{{ pacienteSeleccionado.paciente }}</h3>
                        <p class="text-center text-xs text-slate-500 font-medium mt-1 bg-slate-100 px-2 py-0.5 rounded">DNI: {{ pacienteSeleccionado.documento }}</p>
                        
                        <div class="w-full mt-4 border-t border-slate-100 pt-4 space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-500">Edad:</span>
                                <span class="font-semibold text-slate-700">{{ edadPaciente }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-500">Sexo:</span>
                                <span class="font-semibold text-slate-700">{{ pacienteSeleccionado.genero == "M" ? "Masculino" : "Femenino" }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-500">Estado:</span>
                                <span class="font-semibold px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{{ pacienteSeleccionado.estado }}</span>
                            </div>
                        </div>
                        <div class="mt-4 text-xs text-cyan-600 font-bold flex items-center gap-1 group-hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Ver Historial Clínico
                        </div>
                    </div>
                </div>

                </div>
        </div>

        <div v-if="mostrarHistorico" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn">
                <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800">Historial del Paciente</h3>
                    <button class="text-slate-400 hover:text-red-500 transition-colors" @click="cerrarHistorico">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <div v-if="historico.length === 0" class="text-slate-400 text-center py-8">No hay registros.</div>
                    <ul v-else class="space-y-3">
                        <li v-for="item in historicoOrdenado" :key="item.id_registro" class="border border-slate-100 rounded-lg p-3 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                            <div class="text-xs text-slate-400 font-bold uppercase mb-1">{{ item.fecha }}</div>
                            <div class="text-sm text-slate-700">{{ item.detalle }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="mostrarModalCaptar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                <div class="bg-green-600 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Captar Paciente
                    </h3>
                    <button class="text-white/70 hover:text-white" @click="cerrarModalCaptar">&times;</button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Condición</label>
                        <select v-model="formCaptar.condicion" class="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-700" disabled>
                            <option value="">{{ condicionAutomatica }}</option>
                        </select>
                        <p class="text-xs text-green-600 mt-1 font-medium">{{ mensajeCondicion }}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                        <input v-model="formCaptar.fecha" type="date" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-green-500 focus:border-green-500" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                        <textarea v-model="formCaptar.observaciones" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-green-500 focus:border-green-500" rows="3"></textarea>
                    </div>
                </div>
                <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                    <button @click="cerrarModalCaptar" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button @click="captarPaciente" class="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors">Confirmar Captación</button>
                </div>
            </div>
        </div>

        <div v-if="mostrarModalEgresar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                <div class="bg-red-600 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
                        Egresar Paciente
                    </h3>
                    <button class="text-white/70 hover:text-white" @click="cerrarModalEgresar">&times;</button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                        <input v-model="formEgresar.fecha" type="date" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Egreso</label>
                        <select v-model="formEgresar.tipo_egreso" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500">
                            <option value="Hospitalización">Hospitalización</option>
                            <option value="Fallecimiento">Fallecimiento</option>
                            <option value="Trasplante">Trasplante</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div v-if="formEgresar.tipo_egreso === 'Otros'">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Especificar</label>
                        <input v-model="formEgresar.motivo_especifico" type="text" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500" />
                    </div>
                </div>
                <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                    <button @click="cerrarModalEgresar" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button @click="egresarPaciente" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">Confirmar Egreso</button>
                </div>
            </div>
        </div>

        <div v-if="mostrarModuloInfeccion" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleIn">
                <div class="bg-slate-800 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <span>🦠</span> Módulo de Infección
                    </h3>
                    <button class="text-white/70 hover:text-white" @click="cerrarModuloInfeccion">&times;</button>
                </div>
                <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">¿Presenta infecciones?</label>
                        <select v-model="formInfeccion.presentaInfecciones" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    
                    <div v-if="formInfeccion.presentaInfecciones === 'si'" class="p-4 bg-red-50 rounded-xl border border-red-100 space-y-4 animate-fadeIn">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                                <select v-model="formInfeccion.tipoInfeccion" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                                    <option value="bacteriana">Bacteriana</option>
                                    <option value="viral">Viral</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Localización</label>
                                <select v-model="formInfeccion.localizacion" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                                    <option value="acceso_vascular">Acceso Vascular</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Inicio</label>
                            <input v-model="formInfeccion.fechaInicio" type="date" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                            <textarea v-model="formInfeccion.observaciones" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Detalles clínicos..." rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                    <button @click="cerrarModuloInfeccion" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cerrar</button>
                    <button @click="guardarInfeccion" class="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-colors">Guardar Datos</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed, watch } from 'vue'; 
import { getAllIpress, patchAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';
import FiltroSuperior from '@/components/FiltroSuperior.vue'; 

const { paciente, periodo, periodoIpress } = defineProps({
    paciente: { type: Object, required: true },
    periodo: { type: Number, required: true },
    periodoIpress: { type: Number, required: true }
})

const router = useRouter()

const form = reactive({
    fecha_creacion_acceso_actual: null,
    tipo_acceso_actual: null,
    localizacion_acceso_actual: null,
    cambio_acceso: 'false',
    motivo_cambio: null,
    fecha_creacion_acceso_nuevo: null,
    tipo_acceso_nuevo: null,
    localizacion_acceso_nuevo: null,
    id_periodo_ipress: periodoIpress,
    id_red: 1,
    id_paciente: paciente.id_paciente
})

const clinicaFiltro = ref(null);
const modalidadFiltro = ref(null);

const procesarCambioFiltro = (evento) => {
    console.log("Filtro cambió:", evento);
};

const formInfeccion = reactive({ presentaInfecciones: '', tipoInfeccion: '', localizacion: '', fechaInicio: '', fechaResolucion: '', tratamiento: '', observaciones: '' })
const formCaptar = reactive({ condicion: '', fecha: '', observaciones: '' })
const formEgresar = reactive({ fecha: '', tipo_egreso: '', motivo_especifico: '', observaciones: '' })

const pacienteSeleccionado = ref(null); 
const periodoSeleccionado = periodo
const idPeriodoIpress = periodoIpress
const periodoActual = ref([])
const historialAcceso = ref([])
const periodos = ref([])
const mostrarHistorico = ref(false);
const historico = ref([]);
const mostrarModuloInfeccion = ref(false);
const historialInfecciones = ref([]);
const mostrarModalCaptar = ref(false);
const mostrarModalEgresar = ref(false);
const historialMovimientos = ref([]);
const condicionAutomatica = ref('');
const mensajeCondicion = ref('');
const ultimoEgreso = ref(null);

const opcionesLocalizacion = [
  { value: '1', label: '1. FAV radial derecha' }, { value: '2', label: '2. FAV radial izquierda' },
  { value: '3', label: '3. FAV braquial o cubital derecha' }, { value: '4', label: '4. FAV braquial o cubital izquierda' },
  { value: '5', label: '5. CVCT yugular derecha' }, { value: '6', label: '6. CVCT yugular izquierdo' },
  { value: '7', label: '7. CVCT subclavio derecho' }, { value: '8', label: '8. CVCT subclavio izquierdo' },
  { value: '9', label: '9. CVCT femoral derecho' }, { value: '10', label: '10. CVCT femoral izquierdo' },
  { value: '11', label: '11. CVCLP yugular derecha' }, { value: '12', label: '12. CVCLP yugular izquierdo' },
  { value: '13', label: '13. CVCLP femoral derecho' }, { value: '14', label: '14. CVCLP femoral izquierdo' },
  { value: '15', label: '15. CVCLP translumbar' }, { value: '16', label: '16. CVCLP transhepático' },
  { value: '17', label: '17. Injerto autólogo' }, { value: '18', label: '18. Injerto protésico' },
  { value: '19', label: '19. Catéter peritoneal' }
];

const listaTiposNuevo = [
  { value: 'Catéter Venoso Central Temporal', label: 'Catéter Venoso Central Temporal' },
  { value: 'Catéter Venoso Central de Larga Permanencia', label: 'Catéter Venoso Central de Larga Permanencia' },
  { value: 'Fístula Arteriovenosa', label: 'Fístula Arteriovenosa' },
  { value: 'Injerto Autólogo', label: 'Injerto Autólogo' },
  { value: 'Injerto Protésico', label: 'Injerto Protésico' },
  { value: 'Catéter peritoneal', label: 'Catéter peritoneal' }
];

const listaLocalizacionesNuevo = [
  { value: '1. FAV radial derecha', label: '1. FAV radial derecha', tipo: 'Fístula Arteriovenosa' },
  { value: '2. FAV radial izquierda', label: '2. FAV radial izquierda', tipo: 'Fístula Arteriovenosa' },
  { value: '3. FAV braquial o cubital derecha', label: '3. FAV braquial o cubital derecha', tipo: 'Fístula Arteriovenosa' },
  { value: '4. FAV braquial o cubital izquierda', label: '4. FAV braquial o cubital izquierda', tipo: 'Fístula Arteriovenosa' },
  { value: '5. CVCT yugular derecha', label: '5. CVCT yugular derecha', tipo: 'Catéter Venoso Central Temporal' },
  { value: '6. CVCT yugular izquierdo', label: '6. CVCT yugular izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '7. CVCT subclavio derecho', label: '7. CVCT subclavio derecho', tipo: 'Catéter Venoso Central Temporal' },
  { value: '8. CVCT subclavio izquierdo', label: '8. CVCT subclavio izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '9. CVCT femoral derecho', label: '9. CVCT femoral derecho', tipo: 'Catéter Venoso Central Temporal' },
  { value: '10. CVCT femoral izquierdo', label: '10. CVCT femoral izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '11. CVCLP yugular derecha', label: '11. CVCLP yugular derecha', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '12. CVCLP yugular izquierdo', label: '12. CVCLP yugular izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '13. CVCLP femoral derecho', label: '13. CVCLP femoral derecho', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '14. CVCLP femoral izquierdo', label: '14. CVCLP femoral izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '15. CVCLP translumbar', label: '15. CVCLP translumbar', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '16. CVCLP transhepático', label: '16. CVCLP transhepático', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '17. Injerto autólogo', label: '17. Injerto autólogo', tipo: 'Injerto Autólogo' },
  { value: '18. Injerto protésico', label: '18. Injerto protésico', tipo: 'Injerto Protésico' },
  { value: '19. Catéter peritoneal', label: '19. Catéter peritoneal', tipo: 'Catéter peritoneal' }
];

const tiposAccesoNuevoFiltrados = computed(() => {
  const idModalidad = pacienteSeleccionado.value?.id_modalidad || 1;
  if (idModalidad == 1) { 
    return listaTiposNuevo.filter(t => t.value !== 'Catéter peritoneal');
  } else { 
    return listaTiposNuevo.filter(t => t.value === 'Catéter peritoneal');
  }
});

const opcionesLocalizacionNuevoFiltradas = computed(() => {
  const tipoElegido = form.tipo_acceso_nuevo;
  if (!tipoElegido) return [];
  return listaLocalizacionesNuevo.filter(op => op.tipo === tipoElegido);
});

watch(() => form.tipo_acceso_nuevo, (val) => {
    form.localizacion_acceso_nuevo = '';
    if (val === 'Catéter peritoneal') form.localizacion_acceso_nuevo = '19. Catéter peritoneal';
});

const localizacionesFiltradas = computed(() => {
    return opcionesLocalizacion;
});

const historicoOrdenado = computed(() => {
    return [...(historico.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialInfeccionesOrdenado = computed(() => {
    return [...(historialInfecciones.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialMovimientosOrdenado = computed(() => {
    return [...(historialMovimientos.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const minFechaNuevoAcceso = computed(() => {
    if (!form.fecha_creacion_acceso_actual) return null;
    const fecha = new Date(form.fecha_creacion_acceso_actual);
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0]; 
});
const validarFormulario = () => {
    const camposObligatorios = ['fecha_creacion_acceso_nuevo', 'tipo_acceso_nuevo', 'localizacion_acceso_nuevo'];
    for (const campo of camposObligatorios) {
        if (!form[campo]) {
            ElMessage({ message: `Por favor complete el campo: ${campo}`, type: 'warning', plain: true })
            return false;
        }
    }
    return true;
};

const postForm = async (url = null) => {
    if (!validarFormulario()) return;
    const formEnvio = {
        fecha_creacion_acceso_actual: form.fecha_creacion_acceso_nuevo,
        tipo_acceso_actual: form.tipo_acceso_nuevo,
        localizacion_acceso_actual: form.localizacion_acceso_nuevo,
        cambio_acceso: null, motivo_cambio: null,
        fecha_creacion_acceso_nuevo: null, tipo_acceso_nuevo: null, localizacion_acceso_nuevo: null,
        id_periodo_ipress: periodoIpress, id_red: 1, id_paciente: paciente.id_paciente
    }
    try {
        await postAllIpress(url ?? "/unidadesActuales/", formEnvio);
        if (periodoActual.value[0]) await editForm();
        else { alert("Se registro con exito"); window.location.reload(); }
    } catch (error) { console.error(error); }
};

const editForm = async (url = null) => {
    try {
        await patchAllIpress(url ?? "/unidadesActuales/" + periodoActual.value[0].id_unidad_actual + "/", form);
        alert("Se registro con exito"); window.location.reload();
    } catch (error) { console.error(error); }
};

const normalizarLocalizacion = (valor) => {
    if (!valor) return null;
    const str = String(valor).trim();
    const op = opcionesLocalizacion.find(o => o.value === str || o.value === valor);
    if (op) return op.value;
    const porNumero = opcionesLocalizacion.find(o => o.value.startsWith(str + '.') || o.value.startsWith(str + ' '));
    return porNumero?.value ?? valor;
};

const fetchPeriodoActual = async (url = null) => {
    try {
        const respuesta = await getAllIpress("/unidadesActuales/?id_periodo_ipress=" + periodoIpress);
        periodoActual.value = respuesta;
        if (periodoActual.value && periodoActual.value.length > 0) {
            form.fecha_creacion_acceso_actual = periodoActual.value[0].fecha_creacion_acceso_actual;
            form.tipo_acceso_actual = periodoActual.value[0].tipo_acceso_actual;
            const locApi = periodoActual.value[0].localizacion_acceso_actual;
            form.localizacion_acceso_actual = normalizarLocalizacion(locApi) ?? locApi;
        }
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchHistorialAcceso = async () => {
    try {
        // Datos de ejemplo para demostración
        historialAcceso.value = [
            { fecha: '2024-01-15', tipo_acceso: 'Catéter Venoso Central Temporal', localizacion: '5. CVCT yugular derecha', motivo: 'Inicio de tratamiento', estado: 'Activo' }
        ];
    } catch (error) { historialAcceso.value = []; }
};

const fetchPaciente = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
    } catch (error) { console.error(error); }
};

const fetchPeriodo = async (url = null) => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = respuesta;
    } catch (error) { console.error(error); }
};

const abrirHistorico = async () => { mostrarHistorico.value = true; };
const cerrarHistorico = () => { mostrarHistorico.value = false; };
const abrirModuloInfeccion = () => { mostrarModuloInfeccion.value = true; fetchHistorialInfecciones(); };
const cerrarModuloInfeccion = () => { mostrarModuloInfeccion.value = false; };
const guardarInfeccion = async () => { cerrarModuloInfeccion(); };
const fetchHistorialInfecciones = async () => { historialInfecciones.value = []; };
const abrirModalCaptar = async () => { await determinarCondicionPaciente(); mostrarModalCaptar.value = true; };
const cerrarModalCaptar = () => { mostrarModalCaptar.value = false; };
const captarPaciente = async () => { cerrarModalCaptar(); };
const determinarCondicionPaciente = async () => { condicionAutomatica.value = 'NUEVO'; };
const abrirModalEgresar = () => { mostrarModalEgresar.value = true; };
const cerrarModalEgresar = () => { mostrarModalEgresar.value = false; };
const egresarPaciente = async () => { cerrarModalEgresar(); };
const fetchHistorialMovimientos = async () => { };
const validarFechaPeriodo = async () => ({ valido: true });
const validarCierreMesAnterior = async () => ({ valido: true });

onMounted(() => {
    fetchPaciente();
    fetchPeriodo();
    fetchPeriodoActual();
    fetchHistorialAcceso();
    fetchHistorialMovimientos();
});
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
}
.animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}
</style>