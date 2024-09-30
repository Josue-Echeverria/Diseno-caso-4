const fs = require('fs');
const { createClient } = require('redis');
const express = require("express");
const app = express();

const { MongoClient } = require('mongodb');

const url = 'mongodb://root:password@mongo:27017'; // Cambia esto si es necesario
const dbName = 'db_Tvet';
const collectionName = 'Pets';

const redisClient = createClient({
  url: 'redis://redis-master:6379' // Cambia esto a la URL de tu contenedor de Redis
});
redisClient.connect().then(async () => {
  await redisClient.set('key', 'value');
  const value = await redisClient.get('key');
  console.log(value); // Debería imprimir 'value'
});
const PORT = process.env.PORT || 3000;
// Leer el archivo JSON
let jsonData;
try {
    jsonData = JSON.parse(fs.readFileSync('./app/Tvet.json', 'utf8'));
} catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    process.exit(1);
}

(async () => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Inserción de datos
        const chunkSize = 5000;
        for (let i = 0; i < jsonData.length; i += chunkSize) {
            const chunk = jsonData.slice(i, i + chunkSize);
            await collection.insertMany(chunk);
            console.log(`Insertados registros ${i + 1} - ${i + chunk.length}`);
        }

        console.log('Todos los registros han sido insertados.');
    } catch (error) {
        console.error('Error al insertar los registros:', error);
    } finally {
        await client.close();
    }
})();
app.get("/documents", async (req, res) => {
  try{
    await client.connect();
    const database = client.db('TPet');
    const collection = database.collection('HistorialMascotas');
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.35);
    const result = await collection.aggregate([
      { $sample: { size: sampleSize } }
  ]).toArray();
    res.json(result);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    await client.close();
}
});

// Middleware para verificar el caché
function checkCache(req, res, next) {
  const { param1, param2 } = req.query;
  const cacheKey = `${param1}:${param2}`;

  redisClient.get(cacheKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

app.get("/documents/redis",  checkCache, async (req, res) => {
  try{
    await client.connect();
    const database = client.db('TPet');
    const collection = database.collection('HistorialMascotas');
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.3);
    const result = await collection.aggregate([
      { $sample: { size: sampleSize } }
  ]).toArray();
    redisClient.setex(cacheKey, 60, JSON.stringify(result.slice(0,10)));
    res.json(result);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    await client.close();
}
});

