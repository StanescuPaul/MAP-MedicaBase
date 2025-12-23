FROM node:20-alpine
WORKDIR /app_backend
COPY ./ ./
RUN npm install --omit=dev
#Se suprascrie in compose daca vreau daca nu ramane 8000 default 
ENV PORT_ENV=8000 
ENV NODE_ENV=production
#Expose are rol informativ nu are relevanta daca schimb PORT_ENV sau nu tot o sa functioneze 
EXPOSE 8000
CMD ["node", "./index"]
