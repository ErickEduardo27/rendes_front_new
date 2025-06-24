/* import { obtenerToken } from '@/services/authService/authTokenService'; */
import axios from "axios";
import { TokenService } from "@/services/api/token.service";
import { apiClient } from "../api/ApiClient";
import { ENDPOINTS } from "@/services/api/endpoints";

export const RUTA_API = import.meta.env.VITE_API; 


export async function apiGetPaginado(absoluteUrl) {
    const token = TokenService.getToken();
    const response = await axios.get(absoluteUrl, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;
}

export async function getAllIpress(url = "/ipress/") {
    const response = await apiClient.get(url);
    return response;
}
