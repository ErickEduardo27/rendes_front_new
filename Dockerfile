# Etapa 1: Build de la aplicación
FROM node:21-alpine AS builder

# Variables build-arg
ARG BASE_HREF=/
ARG BUILD=prod

# Directorio de trabajo
WORKDIR /app

# Copiamos los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Construimos la app con Vite, configurando la base
# Usa una variable de entorno para definir la base pública
ENV BASE=${BASE_HREF}
RUN npm run build

# Etapa 2: Imagen de producción usando Nginx
FROM nginx:alpine AS deploy

# Variable ARG para cambiar el path del build
ARG DIST_PATH=dist

# Eliminamos configuración default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos el build generado
COPY --from=builder /app/${DIST_PATH} /usr/share/nginx/html

# Copiamos configuración custom de Nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponemos el puerto por defecto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

