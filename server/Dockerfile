FROM node:18.17.1

WORKDIR ./server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm", "start"]