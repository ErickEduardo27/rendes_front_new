// services/apiService.js
/* import { obtenerToken } from '@/services/authService/authTokenService'; */
import axios from "axios";
export const RUTA_API = import.meta.env.VITE_API;

// GET con autenticación
/* export async function apiGetAutenticado(endpoint) {
    const token = await obtenerToken();
    const response = await axios.get(RUTA_API + endpoint, {
        headers: { Authorization: token },
    });
    return response.data;
}

// POST con autenticación
export async function apiPostAutenticado(endpoint, payload) {
    const token = await obtenerToken();
    const response = await axios.post(RUTA_API + endpoint, payload, {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

// PATCH con autenticación
export async function apiPatchAutenticado(endpoint, payload) {
    const token = await obtenerToken();
    const response = await axios.patch(RUTA_API + endpoint, payload, {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}

// PUT con autenticación
export async function apiPutAutenticado(endpoint, payload) {
    const token = await obtenerToken();
    const response = await axios.put(RUTA_API + endpoint, payload, {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}

// DELETE con autenticación
export async function apiDeleteAutenticado(endpoint) {
    const token = await obtenerToken();
    const response = await axios.delete(RUTA_API + endpoint, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;
}

// POST con archivos (multipart/form-data)
export async function apiPostArchivoAutenticado(endpoint, formData) {
    const token = await obtenerToken();
    const response = await axios.post(RUTA_API + endpoint, formData, {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
} */