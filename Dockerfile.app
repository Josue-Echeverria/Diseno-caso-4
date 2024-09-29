FROM node:18-alpine

WORKDIR .

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app/app.js"]
