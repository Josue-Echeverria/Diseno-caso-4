# Diseno-caso-4
Instituto tecnológico de Costa Rica, escuela de computación
diseño de Software
Profesor: Rodrigo Núñez
Estudiantes: 
- Josué Echeverría Pérez
- Harlen Quirós Gómez
- Luany Masís Aagesen



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

