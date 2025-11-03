FROM node:22.12-alpine
WORKDIR /usr/src/front_server

COPY package*.json ./

RUN npm install --force

COPY . .