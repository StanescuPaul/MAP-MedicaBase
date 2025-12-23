FROM node:20-alpine AS builder
WORKDIR /app_frontend
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./ ./
#Variabila de mediu care se v-a completa in .env.production la build si v-a fi primita din docker-compose
#Folosim ARG pentru ca build-ul de frotnend o sa devina un fisier static si avem nevoie sa stim inca de la build care este URL-ul pentru fetch
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

FROM node:20-alpine AS production 
WORKDIR /app_frontend
RUN npm install -g serve
COPY --from=builder /app_frontend/build ./build
EXPOSE 5000
#comanda ruleaza un server static web pentru ca am builduit deja frontul in fisiere html,js si css si stie sa itoarca tot timpul html.index nu o eraore apoi spunem protul pe care asculta 
CMD ["serve", "-s", "build", "-l", "5000"]
