FROM node:25-alpine AS build

WORKDIR /src

ARG VITE_API_BASE=/api
ARG VITE_SITE_URL=
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:1.29-alpine

ENV AUTHENTIK_OUTPOST_UPSTREAM=http://authentik-server:9000
ENV SSO_BRIDGE_TOKEN=
ENV SITE_PUBLIC_SCHEME=https
ENV SITE_CANONICAL_HOST=localhost
ENV SITE_REDIRECT_HOST=

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80
