# Build stage
#FROM node:20-alpine AS builder

#WORKDIR /app

#COPY package*.json ./
#RUN npm install

#COPY . .
#RUN npm run build

# Deploy stage
#FROM nginx:alpine

#COPY --from=builder /app/dist /usr/share/nginx/html

#COPY default.conf /etc/nginx/conf.d/default.conf


FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build