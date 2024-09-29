const express = require("express");
const app = express();

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lmaagesen:L8Jn62DDIw3EVENj@clustercaso4ds.3megf.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCaso4DS";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


app.get("/documents", async (req, res) => {
  try{
    await client.connect();
    const database = client.db('TPet');
    const collection = database.collection('HistorialMascotas');
    const totalDocuments = await collection.countDocuments();
    const sampleSize = Math.ceil(totalDocuments * 0.3);
    const result = await collection.aggregate([
      { $sample: { size: sampleSize } }
  ]).toArray();
    console.log(result);
    res.json(result);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    await client.close();
}
});

