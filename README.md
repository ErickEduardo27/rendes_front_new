# RENDES Online — Frontend (ess-25)

Cliente web **Vue 3** + **Vite** para el sistema RENDES: gestión de IPRESS, pacientes, periodos, formularios de diálisis (acceso vascular, morbilidad, resultados clínicos, vacunación, etc.), notificaciones, evaluación y descargas para analista.

## Requisitos

- Node.js (versión compatible con Vite 6 del proyecto)
- npm

## Instalación y scripts

```sh
npm install
npm run dev      # desarrollo con recarga en caliente
npm run build    # build de producción (modo por defecto de Vite)
npm run build:dev
npm run build:prod
npm run preview  # previsualizar el build
```

El servidor de desarrollo de Vite suele quedar en **http://localhost:5173/**.

## Variables de entorno

Crear `.env` o `.env.production` según el modo (no subir secretos al repositorio).

| Variable   | Descripción |
| ---------- | ----------- |
| `VITE_API` | URL base del backend (ej. `http://127.0.0.1:8000`). Si no se define, el código usa por defecto `http://127.0.0.1:8010` en `ApiClient.js` y `token.service.js`. **Recomendación:** definir `VITE_API` para que coincida con el puerto donde corre Django. |

Ejemplo (desarrollo local con Django en 8000):

```env
VITE_API=http://127.0.0.1:8000
```

### Proxy de Vite

En `vite.config.js`, el `server.proxy` reenvía peticiones que coincidan con ciertos prefijos (`/api`, `/ipress`, `/pacientes`, reportes, etc.) a **`http://127.0.0.1:8000`**. Si usas solo rutas relativas y el proxy, el navegador no necesita CORS adicional para esas rutas; si configuras `VITE_API` a una URL absoluta, las peticiones van directo a ese host (el backend debe permitir el origen del front en CORS).

## Base path y router

- **Base de la app:** `base: '/rendes#/'` en Vite (activos y rutas bajo ese prefijo).
- **Historial:** `createWebHistory('/rendes#/')` en `src/router/index.js`.

Despliegue y enlaces deben respetar ese prefijo.

## Estructura de carpetas (`src/`)

| Carpeta / archivo | Contenido |
| ----------------- | --------- |
| `main.js` | Arranque: Pinia, Vue Router, Vue Query, Naive UI, Element Plus, toasts |
| `App.vue` | Raíz de la aplicación |
| `router/index.js` | Rutas, guards de autenticación y perfiles |
| `layouts/principal.vue` | Layout autenticado con hijos |
| `pages/` | Pantallas por dominio (inicio, registros, ipress, pacientes, usuarios, evaluación, notificaciones, analista, etc.) |
| `views/modulos/` | Vistas adicionales por módulo (gestión, formularios, gestión clínica) |
| `components/` | UI reutilizable (sidebar, navbar, formularios, tablas, modales) |
| `services/` | Cliente HTTP (`api/ApiClient.js`), tokens, auth, servicios por dominio |
| `store/auth.js` | Estado de sesión (Pinia) |
| `composables/` | Composables Vue |
| `utils/` | Utilidades (p. ej. estadísticas de formularios) |
| `assets/` | Estilos globales (Tailwind, etc.) |

## Autenticación en el cliente

- Login y tokens: flujo JWT alineado con el backend (`/api/token/`, `/api/token/refresh/`, `/api/me/`).
- `src/services/api/ApiClient.js`: instancia Axios con interceptores (Bearer, reintento en 401 con refresh, logout y redirección a `/login`).
- `src/services/api/token.service.js`: lectura/escritura en `localStorage` y refresh explícito contra `${baseURL}/api/token/refresh/`.
- **Endpoints públicos** para el interceptor: por ejemplo `/login` (ajustar si se añaden más rutas sin token).

## Control de acceso por ruta (`router.beforeEach`)

- `meta.requiresAuth`: exige sesión válida.
- `meta.requiresEvaluador`: perfiles `supervisor` o `admin` (comparación en minúsculas).
- `meta.requiresAnalista`: perfil que contenga la palabra `analista`.
- `meta.mostrarNotificarRegistros`: usado en módulos de registros (UI/notificaciones según el layout).

## Stack principal

- **Vue 3**, **Vue Router**, **Pinia**
- **TanStack Vue Query** para datos remotos
- **Axios** para HTTP
- **Tailwind CSS**, **Element Plus**, **Naive UI**, **Headless UI**, **Heroicons**, etc. (ver `package.json`)

## Backend asociado

API en el repositorio **back_rendes_online** (Django + DRF). Consulta su `README.md` para rutas, autenticación y variables de base de datos.

## IDE recomendado

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur si aplica).

Configuración adicional de Vite: [documentación de Vite](https://vite.dev/config/).
