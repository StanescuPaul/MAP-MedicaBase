#Specificam de unde dam pull la compilator si la modulul pentru librarii si versiunea . AS builder ajuta la separarea dintre procesul de build si de rulare , la build folosim mai multe dependinte care ingreuneaza procesul de rulare
FROM node:20-alpine AS builder

#Specificam directorul pentru aplicatie (din interiorul containerului docker)
WORKDIR /app/frontend

#Copiem fisierele de dependinte pentru frontend in ./ (/app/frontend (declarat mai sus))
COPY ./my-app/package.json ./my-app/package-lock.json ./

#Comanda pentru a instala toate dependintele
RUN npm install

#Copiem restul codului sursa
COPY ./my-app ./

#Comanda pentru build la cod
RUN npm run build

#production si builder sunt doar etichete pot fi numite altfel
#Acum facem partea de run/produtie
FROM node:20-alpine AS production

WORKDIR /app

#Copiem ./BackEnd in /app/BackEnd in container si si creeaza /BackEnd in /app
COPY ./BackEnd ./BackEnd

#Trecem in directorul BackEnd sa lucram
WORKDIR /app/BackEnd
#Instalam dependintele din BackEnd dar evitam dependintele de dev
RUN npm install --omit=dev

#Revin la director sursa ca sa compilez tot codul (frontend + backend)
WORKDIR /app

#Spunem pentru compilare de unde vrem sa luam codul (builder (eticheta)) si ce mai exact (/app/frontend/build) care este frontend-ul builduit si unde sa il puna 
COPY --from=builder /app/frontend/build /app/BackEnd/public/app

#Deschidem pe portul 5000 pentru ca pe asta ruleaza serverul
EXPOSE 5000

CMD [ "node", "./BackEnd/index.js" ]
