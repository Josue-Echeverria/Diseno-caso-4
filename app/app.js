const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const express = require("express");
const app = express();

const mongoUrl = 'mongodb://root:password@mongo:27017'; // Cambia esto si es necesario
const dbName = 'db_Tvet';
const mongoClient = new MongoClient(mongoUrl, {
  maxPoolSize: 25, // Tamaño del pool de conexiones
  minPoolSize: 5,  // Tamaño mínimo del pool de conexiones
  maxIdleTimeMS: 30000, // Tiempo máximo de inactividad antes de cerrar una conexión
  waitQueueTimeoutMS: 5000 // Tiempo máximo de espera en la cola para obtener una conexión
});

async function connectToMongo() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

const redisClient = createClient({
  url: 'redis://redis-master:6379' // Cambia esto a la URL de tu contenedor de Redis
});
redisClient.connect().then(async () => {
  await redisClient.set('key', 'value');
  const value = await redisClient.get('key');
  console.log(value); // Debería imprimir 'value'
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


app.get("/documents", async (req, res) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const database = client.db('db_Tvet');
    const collection = database.collection('Pets');
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.35);
    const result = await collection.aggregate([
      { $sample: { size: sampleSize } }
    ]).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    await client.close();
  }
});

app.get("/documentsPool", async (req, res) => {
  try {
    const database = mongoClient.db(dbName);
    const collection = database.collection('Pets');
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.35);
    const result = await collection.aggregate([
      { $sample: { size: sampleSize } }
    ]).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  }
});


app.get("/documents/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const database = mongoClient.db('db_Tvet');
    const collection = database.collection('Pets');
    let idAleatorio
    idAleatorio = generarNumeroAleatorio();
    const documento = await collection.findOne(
      {id: parseInt(idAleatorio, 10) },
      { projection: { _id: 0 } }  
    );
    res.json(documento);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  }
});


app.get("/documentsredis", async (req, res) => {
  try{
    const database = mongoClient.db('db_Tvet');
    const collection = database.collection('Pets');
    let idAleatorio
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.35);
    let totalData = [];
    for (let i = 1; i<= sampleSize; i++){
      idAleatorio = generarNumeroAleatorio();
      const idString = idAleatorio.toString();
      const value = await redisClient.get(idString);
      if (value === null) {
        const documento = await collection.findOne(
          { id: parseInt(idAleatorio, 10) },
          { projection: { _id: 0 } }  
        );
        await redisClient.set(idString, JSON.stringify(documento));
        totalData.push(documento)
      } else {
        totalData.push(value)
      }
    }
    res.json(totalData)
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  }
});


function generarNumeroAleatorio() {
  return Math.floor(Math.random() * 60000) + 1;
}