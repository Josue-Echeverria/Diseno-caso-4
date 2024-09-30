# Diseno-caso-4
Instituto tecnológico de Costa Rica, escuela de computación
diseño de Software
Profesor: Rodrigo Núñez
Estudiantes: 
- Josué Echeverría Pérez
- Harlen Quirós Gómez
- Luany Masís Aagesen


## Datos 
Se utilizó mongodb como base de datos, en donde se registraron 60000 documentos JSON con el siguiente formato:
```bash

{ "id": 43949,
  "firstname": "Alexis",
  "lastname": "Mena Santana",
  "city": "San Cristobal de las Casas",
  "direction": "West",
  "age": 4,
  "sex": "male",
  "med_record": "Fichar Gemíparo Increíble Gemiqueo Fiducia Incruentamente ."
}
```
Simmulando el registro medico que tendria una mascota en la veterinaria
## Servicio REST 
Se utilizó javascript junto con express para la implementación del servicio rest

## Endpoints
### Conexion simple
```bash
(GET) http://localhost:3000/documents
```
Esta programado para obtener exactamente el 35% de los registros de mongo lo cual equivale a 21000 documentos JSON. Se realizaron 

#### Prueba
Se realizo una prueba con 20 hilos en una laptop con un Core i5 12th gen y 12GB de RAM, cada hilo toma 0.5s en levantar por lo que para tener los 20 hilos trabajando en paralelo, toma 10 segundos
* Rendimiento del cpu del contenedor de mongo:

![image](https://github.com/user-attachments/assets/0b400b45-79d4-489a-9565-8c06d0cd080a)

* Rendimiento del cpu del contenedor del servicio de REST:
  
![image](https://github.com/user-attachments/assets/73e50ac3-bf23-460d-83a6-74860390f6fb)

* Rendimiento de la maquina;

![image](https://github.com/user-attachments/assets/f0b636c6-25e1-4246-99e2-e1378451c901)

Como se puede apreciar en las graficas, se obtuvo un 200% de uso de la CPU del contenedor del Rest service, mientras que el contenedor de mongo tuvo dos picos de ejecucion, los cuales resultaron en el ~100% de uso del CPU del contenedor de mongo, la ejecucucion de ambos siempre resulta en el 100% del uso del CPU de la maquina, la respuesta media de este endpoint resultó en 21.781 segundos


### Conexion pool 
```bash
(GET) http://localhost:3000/documentspool
```
Se utilizó una conexion en pool con un maximo de 25 conexiones para manejar las pruebas con los 20 usaurios concurrentes. Esta programado para obtener exactamente el 35% de los registros de mongo lo cual equivale a 21000 documentos JSON.
Conexion pool:
```Javascript
const mongoClient = new MongoClient(mongoUrl, {
  maxPoolSize: 25, // Tamaño del pool de conexiones
  minPoolSize: 5,  // Tamaño mínimo del pool de conexiones
  maxIdleTimeMS: 30000, // Tiempo máximo de inactividad antes de cerrar una conexión
  waitQueueTimeoutMS: 5000 // Tiempo máximo de espera en la cola para obtener una conexión
});
```
#### Prueba 
Se realizo una prueba con 20 hilos en una laptop con un Core i5 12th gen y 12GB de RAM, cada hilo toma 0.5s en levantar por lo que para tener los 20 hilos trabajando en paralelo, toma 10 segundos
* Rendimiento del cpu del contenedor de mongo:

![image](https://github.com/user-attachments/assets/c3afc66f-f2dc-4e7f-9bbc-9b2082f59f8d)

* Rendimiento del cpu del contenedor del servicio de REST:
  
![image](https://github.com/user-attachments/assets/0494a3a3-9bac-4a21-bdf6-b70b591ca90e)

* Redimiento de la maquina

![image](https://github.com/user-attachments/assets/df1ad543-5cba-4a12-bc4c-83ec6456a9a4)

Como se puede observar se obtuvo una reduccion del 20% del uso de CPU del contenedor de mongo, debido al hecho que con las conexiones pool, se ahorra la creacion de nuevas conexiones cada vez que se hace un request ya que estas se mantienen abiertas, la respuesta media de este endpoint resultó en 20.308 segundos.

### Conexion pool con redis
```bash
(GET) http://localhost:3000/documentsredis
```
Genera numeros 18000 aleatorios y por cada numero aleatorio realiza un rquest a: 
```bash
(GET) http://localhost:3000/documents/{idAleatorio}
```
El cual esta programado para primeramente sacar el documento de Redis y retonarlo. Si la llave no existe en redis, se obtiene el documento desde mongo para guardarlo en Redis con el formato: ```{int id:string documento}``` y retornarlo. Finalmente, se reunen todos los documentos con el id aleatorio en un array y los retorna.

#### Prueba
Se realizo una prueba con 20 hilos en una laptop con un Core i5 12th gen y 16GB de RAM, cada hilo toma 0.5s en levantar por lo que para tener los 20 hilos trabajando en paralelo, toma 10 segundos

* Rendimiento del contenedor de mongo:
  
![image](https://github.com/user-attachments/assets/0eada9a3-6436-4649-8494-4792ecfe78a7)

* Rendimiento del contenedor del servicio de REST:
  
![image](https://github.com/user-attachments/assets/ee270bb1-3716-4bc3-85bc-6dfcd0fd2370)

* Rendimiento del cpu del contenedor del servicio de REST:

![image](https://github.com/user-attachments/assets/75c8cc21-9cc9-4e42-b0d9-2e30d149d3a1)

Para este endpoint se obtuvieron resultados distintos ya que para aprovechar la memoria cache, debemos de programar el endpoint de forma distinta ya que inicialmente, los enpoints no recibian parametros y por lo tanto solo retornaban la cantidad de documentos requeridos en un solo chunk, mientra que con este se realizaron peticiones individuales por cada archivo, por lo que el tiempo de respuesta es mayor. pero como se puede apreciar en el uso de CPU del contenedor de mongo, se estabiliza despues de un tiempo, esto se debe a que conforme pasa el tiempo se guardan mas documentos en el cache de redis por lo que se debend e realizar menos peticiones a la base d e datos.


# Test a los 3 endpoints
Para este test se configura el Jmeter con 20 hilos que hacen los distintos request HTTP a cada endpoint, el uso de CPU aumenta debido a que se estan haciendo varias pruebas a la vez:
En esta imagen se obseerva las métricas obtneidad por el contenedor que almacena la base de datos mongo:

![Screenshot 2024-09-30 170523](https://github.com/user-attachments/assets/fd694117-f929-49d6-acc0-51f5e32b2eae)

En esta imagen se obseerva las métricas obtneidad por el contenedor que almacena la app:

![Screenshot 2024-09-30 170642](https://github.com/user-attachments/assets/10088393-c6d9-404c-bf62-2cb9d345cb1a)

En esta imagen se obseerva las métricas obtneidad por el contenedor que almacena redis:

![Screenshot 2024-09-30 170618](https://github.com/user-attachments/assets/082aa37d-ad18-4912-bc94-77115ac6caa0)

En la siguiente tabla se observa las diferentes métricas obtenidas por los threaths, tanto endpoints, tipo de petición, si fue exitosa, además de la latencia y duración de las request.

|     timeStamp |   elapsed | label         |   responseCode | responseMessage   | threadName   | dataType   | success   |   failureMessage |    bytes |   sentBytes |   grpThreads |   allThreads | URL                                  |   Latency |   IdleTime |   Connect |
|--------------:|----------:|:--------------|---------------:|:------------------|:-------------|:-----------|:----------|-----------------:|---------:|------------:|-------------:|-------------:|:-------------------------------------|----------:|-----------:|----------:|
| 1727736648258 |      4435 | Petición HTTP |            200 | OK                | Hilos 1-16   | text       | True      |              nan | 10908215 |         181 |           20 |           20 | http://localhost:3000/documents      |      4271 |          0 |         1 |
| 1727736648255 |      5920 | Petición HTTP |            200 | OK                | Hilos 1-9    | text       | True      |              nan | 10907953 |         181 |           20 |           20 | http://localhost:3000/documents      |      4394 |          0 |         2 |
| 1727736648257 |      6458 | Petición HTTP |            200 | OK                | Hilos 1-11   | text       | True      |              nan | 10906103 |         181 |           20 |           20 | http://localhost:3000/documents      |      4577 |          0 |         1 |
| 1727736648258 |      6492 | Petición HTTP |            200 | OK                | Hilos 1-15   | text       | True      |              nan | 10911176 |         181 |           20 |           20 | http://localhost:3000/documents      |      4180 |          0 |         0 |
| 1727736648256 |      6495 | Petición HTTP |            200 | OK                | Hilos 1-14   | text       | True      |              nan | 10908687 |         181 |           20 |           20 | http://localhost:3000/documents      |      4499 |          0 |         1 |
| 1727736648256 |      6572 | Petición HTTP |            200 | OK                | Hilos 1-7    | text       | True      |              nan | 10905972 |         181 |           20 |           20 | http://localhost:3000/documents      |      4579 |          0 |         1 |
| 1727736648257 |      6581 | Petición HTTP |            200 | OK                | Hilos 1-12   | text       | True      |              nan | 10906615 |         181 |           20 |           20 | http://localhost:3000/documents      |      4283 |          0 |         0 |
| 1727736648256 |      6639 | Petición HTTP |            200 | OK                | Hilos 1-8    | text       | True      |              nan | 10910898 |         181 |           20 |           20 | http://localhost:3000/documents      |      4204 |          0 |         1 |
| 1727736648256 |      6649 | Petición HTTP |            200 | OK                | Hilos 1-6    | text       | True      |              nan | 10906790 |         181 |           20 |           20 | http://localhost:3000/documents      |      4401 |          0 |         1 |
| 1727736648256 |      6664 | Petición HTTP |            200 | OK                | Hilos 1-5    | text       | True      |              nan | 10908111 |         181 |           20 |           20 | http://localhost:3000/documents      |      4179 |          0 |         1 |
| 1727736648257 |      6680 | Petición HTTP |            200 | OK                | Hilos 1-2    | text       | True      |              nan | 10907983 |         181 |           20 |           20 | http://localhost:3000/documents      |      4380 |          0 |         2 |
| 1727736648258 |      6733 | Petición HTTP |            200 | OK                | Hilos 1-18   | text       | True      |              nan | 10907862 |         181 |           20 |           20 | http://localhost:3000/documents      |      4590 |          0 |         1 |
| 1727736648258 |      6735 | Petición HTTP |            200 | OK                | Hilos 1-19   | text       | True      |              nan | 10907800 |         181 |           20 |           20 | http://localhost:3000/documents      |      4284 |          0 |         1 |
| 1727736660519 |    173902 | Petición HTTP |            200 | OK                | Hilos 1-12   | text       | True      |              nan | 10206690 |         126 |            9 |            9 | http://localhost:3000/documentsredis |    173786 |          0 |         0 |
| 1727736660535 |    173895 | Petición HTTP |            200 | OK                | Hilos 1-2    | text       | True      |              nan | 10204377 |         126 |            8 |            8 | http://localhost:3000/documentsredis |    173774 |          0 |         0 |
| 1727736660345 |    173809 | Petición HTTP |            200 | OK                | Hilos 1-3    | text       | True      |              nan | 10201102 |         126 |            7 |            7 | http://localhost:3000/documentsredis |    173719 |          0 |         0 |
| 1727736659269 |    175093 | Petición HTTP |            200 | OK                | Hilos 1-1    | text       | True      |              nan | 10214060 |         126 |            6 |            6 | http://localhost:3000/documentsredis |    174976 |          0 |         0 |
| 1727736660498 |    173907 | Petición HTTP |            200 | OK                | Hilos 1-14   | text       | True      |              nan | 10206562 |         126 |            5 |            5 | http://localhost:3000/documentsredis |    173813 |          0 |         0 |
| 1727736660598 |    173973 | Petición HTTP |            200 | OK                | Hilos 1-17   | text       | True      |              nan | 10211865 |         126 |            4 |            4 | http://localhost:3000/documentsredis |    173846 |          0 |         0 |
| 1727736660457 |    174153 | Petición HTTP |            200 | OK                | Hilos 1-13   | text       | True      |              nan | 10203508 |         126 |            3 |            3 | http://localhost:3000/documentsredis |    174057 |          0 |         0 |
| 1727736660479 |    174202 | Petición HTTP |            200 | OK                | Hilos 1-20   | text       | True      |              nan | 10213000 |         126 |            2 |            2 | http://localhost:3000/documentsredis |    174114 |          0 |         0 |
| 1727736660307 |    174497 | Petición HTTP |            200 | OK                | Hilos 1-10   | text       | True      |              nan | 10219691 |         126 |            1 |            1 | http://localhost:3000/documentsredis |    174420 |          0 |         0 |

Conclusiones:
- Todas las solicitudes HTTP fueron exitosas: Todas las respuestas tienen un código 200, lo que indica que no hubo fallos en las peticiones.

- Consistencia en el tiempo de respuesta: Los tiempos de respuesta están dentro de un rango similar.

- Uso constante de recursos: El número de bytes enviados y recibidos varía ligeramente, pero se mantiene dentro de un rango controlado para cada petición.

- Sin mensajes de error: No se reportan errores en el campo failureMessage, lo que refuerza que todas las peticiones fueron exitosas.

- Simulación con múltiples hilosee prueban cargas concurrentes en el servidor.
