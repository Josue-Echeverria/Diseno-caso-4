const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
const express = require("express");
const app = express();

const mongoUrl = 'mongodb://root:password@mongo:27017'; // Cambia esto si es necesario
const dbName = 'db_Tvet';
const mongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

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

