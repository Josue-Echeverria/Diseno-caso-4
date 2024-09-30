const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
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

app.get("/documentsage", async (req, res) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const database = client.db('db_Tvet');
    const collection = database.collection('Pets');
    const result = await collection.find(
      { age: { $lt: 10} }
    ).toArray();
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
      { $sample: { size: sampleSize } },  
      { $sort: { id: 1 } } 
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
    const idString = id.toString();
    const value = await redisClient.get(idString);
    if (value === null) {
      const documento = await collection.findOne(
        { id: parseInt(id, 10) },
        { projection: { _id: 0 } }  
      );
      await redisClient.set(idString, JSON.stringify(documento));
      res.json(documento);
    } else {
      res.json(JSON.parse(value));
    }
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
      const response = await fetch(`http://localhost:3000/documents/${idString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const document = await response.json();
      totalData.push(document)
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