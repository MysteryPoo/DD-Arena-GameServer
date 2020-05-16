FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY .env /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY build/src/ /usr/src/app/build/src/

RUN npm install

CMD ["npm", "start"]

EXPOSE 9000
