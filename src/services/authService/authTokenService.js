import axios from "axios";
export const USUARIO = import.meta.env.VITE_USERNAME;
export const PASSWORD = import.meta.env.VITE_PASSWORD;
export const RUTA_API = import.meta.env.VITE_API;

/* export async function obtenerToken() {
    const response = await axios.post(RUTA_API + "/api/token/", {
        username: USUARIO,
        password: PASSWORD,
    });
    return "Bearer " + response.data.access;
} */
/* export async function obtenerToken() {
    try {
        const response = await axios.post(RUTA_API + "/api/token/", {
            username: USUARIO,
            password: PASSWORD,
        });
        return "Bearer " + response.data.access;
    } catch (error) {
        console.error("Error obteniendo token:", error);
        throw error;
    }
} */