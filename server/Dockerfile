FROM node:20.8.1

WORKDIR ./server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]