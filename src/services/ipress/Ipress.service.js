/* import { obtenerToken } from '@/services/authService/authTokenService'; */
import axios from "axios";
import { TokenService } from "@/services/api/token.service";
import { apiClient } from "../api/ApiClient";
import { ENDPOINTS } from "@/services/api/endpoints";
import { data } from "autoprefixer";

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

export async function postAllIpress(url = "/ipress/", data) {
    const response = await apiClient.post(url, data);
    return response;
}

export async function putAllIpress(url = "/ipress/", data) {
    const response = await apiClient.put(url, data);
    return response;
}

export async function patchAllIpress(url = "/ipress/", data) {
    const response = await apiClient.patch(url, data);
    return response;
}

export async function deleteAllIpress(url = "/ipress/") {
    const response = await apiClient.delete(url);
    return response;
}
