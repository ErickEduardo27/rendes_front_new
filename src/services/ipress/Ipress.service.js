import { obtenerToken } from '@/services/authService/authTokenService';
import axios from "axios";
export const RUTA_API = import.meta.env.VITE_API; 


export async function apiGetPaginado(absoluteUrl) {
    const token = await obtenerToken();
    const response = await axios.get(absoluteUrl, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;
}