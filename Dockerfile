FROM node:21-alpine AS builder

ARG BUILD
ARG BASE_HREF=/

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install #--legacy-peer-deps
COPY . .

RUN npm run build -- --base=${BASE_HREF}

FROM nginx:alpine AS deploy

ARG DIST_PATH=dist

WORKDIR /usr/share/nginx/html

RUN rm -rf *
COPY --from=builder /app/${DIST_PATH} .
COPY default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
