FROM node:18 as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY keys/ ./keys
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
EXPOSE 8080

CMD ["node", "dist/index.js"]
