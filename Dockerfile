FROM node:20.13.1-alpine

WORKDIR /fc-services

COPY package.json .

RUN npm install --quiet

COPY . .