const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://root:password@mongo:27017'; // Cambia esto si es necesario
const dbName = 'db_Tvet';
const collectionName = 'Pets';

// Leer el archivo JSON
let jsonData;
try {
    jsonData = JSON.parse(fs.readFileSync('./datos_mongo/Tvet.json', 'utf8'));
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