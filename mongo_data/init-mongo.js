// Definir la base de datos y colección
var dbName = 'db_Tvet';
var collectionName = 'Pets';

// Crear una conexión a la base de datos 'admin' para realizar operaciones administrativas
var adminDb = db.getSiblingDB('admin');

// Autenticar con un usuario administrador
var authResult = adminDb.auth('root', 'password');
if (!authResult) {
    print('Error: No se pudo autenticar en la base de datos');
} else {
    print('Autenticación exitosa');
}

// Crear la base de datos y la colección si no existen
var dbTvet = db.getSiblingDB(dbName);

// Verificar si la colección ya existe
if (!dbTvet.getCollectionNames().includes(collectionName)) {
    dbTvet.createCollection(collectionName);
    print('Colección "' + collectionName + '" creada.');
} else {
    print('Colección "' + collectionName + '" ya existe.');
}

// Leer el archivo JSON
try {
    var data = JSON.parse(cat('/ruta_a_tu_archivo.json')); // Asegúrate de que la ruta sea correcta
    print('Archivo JSON leído correctamente');
} catch (e) {
    print('Error al leer el archivo JSON: ' + e);
}

// Tamaño del lote para la inserción
var chunkSize = 5000;

// Función para insertar los datos en lotes
try {
    for (var i = 0; i < data.length; i += chunkSize) {
        var chunk = data.slice(i, i + chunkSize);
        dbTvet[collectionName].insertMany(chunk);
        print('Insertados registros ' + (i + 1) + ' - ' + (i + chunk.length));
    }
    print('Todos los registros han sido insertados con éxito.');
} catch (e) {
    print('Error al insertar los registros: ' + e);
}
