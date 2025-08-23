# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# Passar variável do backend para o build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Etapa de produção com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
