FROM node:24.12.0-alpine3.22 AS build

WORKDIR /fc-web

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]
