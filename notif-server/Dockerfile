FROM node:18.13.0-alpine
WORKDIR /notif
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 4000