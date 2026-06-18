FROM node:25-alpine AS build

WORKDIR /src

ARG VITE_API_BASE=/api
ENV VITE_API_BASE=$VITE_API_BASE

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:1.29-alpine

ENV AUTHENTIK_OUTPOST_UPSTREAM=http://authentik-server:9000
ENV SSO_BRIDGE_TOKEN=

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80
