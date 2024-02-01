# Usa una imagen base con Node.js
FROM node:18 as builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de la aplicación al contenedor
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
