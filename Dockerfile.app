FROM node:18-alpine

WORKDIR .

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000

CMD ["sh", "-c", "node datos_mongo/init-mongo.js && node app/app.js"]

