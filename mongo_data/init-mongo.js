// init-mongo.js

// Definir la base de datos y colecciones que se crearán
var dbName = 'db_surveys';
var collectionName = 'surveys';
var collectionName2 = 'edition_logs';
var collectionName3 = 'edition_users';

// Crea una conexión a la base de datos 'admin' para realizar operaciones de administración
var adminDb = db.getSiblingDB('admin');

// Autentica con un usuario administrador que tenga permisos para crear bases de datos y colecciones
adminDb.auth('root', 'password');

// Crea la base de datos db_surveys
adminDb.createCollection(dbName);

// Usa la base de datos recién creada
var dbSurveys = db.getSiblingDB(dbName);

// Crea la colección surveys dentro de la base de datos db_surveys
dbSurveys.createCollection(collectionName);
dbSurveys.createCollection(collectionName2);
dbSurveys.createCollection(collectionName3);

// Datos de prueba 
// Se generan las encuestas
dbSurveys[collectionName].insertMany([
{"id_survey": 1,
    "creator": 'creador',
    "name": "Testing survey",
    "description": "This is just testing survey",
    "published": false,
    "edition_mode":false,
    "questions": [
        {
            "id_question": 1,
            "question_text": 'Why is sisyphus happy?',
            "question_type": 'abierta'
        },{
            "id_question": 2,
            "question_text": 'Is the earth flat?',
            "question_type": 'si/no'
        },{
            "id_question": 3,
            "question_text": ' Which one is better?',
            "options": ['Computer science', 'Systems engineering', 'Computer engineering'],
            "question_type": 'eleccion simple'
        },{
            "id_question": 4,
            "question_text": 'Why is docker the best virtual enviroment?',
            "question_type": 'abierta'
        },{
            "id_question": 5,
            "question_text": 'Is Linux just better?',
            "question_type": 'si/no'
        },{
            "id_question": 6,
            "question_text": 'What day is today?',
            "question_type": 'numericas'
        },{
            "id_question": 7,
            "question_text": 'would rather have unlimited bacon but no games?',
            "question_type": 'si/no'
        },{
            "id_question": 8,
            "question_text": 'Which place is better to go for vacations?',
            "options": ['The beach', 'The mountain', 'River', 'None'],
            "question_type": 'eleccion multiple'
        },{
            "id_question": 9,
            "question_text": 'How much would you rate this survey?',
            "question_type": 'calificacion'
        }

    ]
},{"id_survey": 2,
    "creator": 'creador',
    "name": "Testing survey2",
    "description": "This is just testing survey",
    "published": false,
    "edition_mode":false,
    "questions": [
        {
            "id_question": 1,
            "question_text": "Do you like Python?",
            "question_type": "si/no"
        },
        {
            "id_question": 2,
            "question_text": "Which one is your favorite?",
            "options": ["Python", "Java", "C++", "JavaScript"],
            "question_type": "eleccion simple"
        },
        {
            "id_question":3,
            "question_text": "Is JavaScript a compiled language?",
            "question_type": "si/no"
        },
        {
            "id_question": 4,
            "question_text": "How many years of experience do you have in programming?",
            "question_type": "numericas"
        },
        {
            "id_question": 5,
            "question_text": "Would you rather work with front-end or back-end?",
            "question_type": "eleccion simple",
            "options": ["front-end", "back-end"]
        },
        {
            "id_question": 6,
            "question_text": "How much would you rate your programming skills?",
            "question_type": "calificacion"
        },
        {
            "id_question": 7,
            "question_text": "What is your favorite IDE?",
            "question_type": "abierta"
        },{
            "id_question": 8,
            "question_text": "Do you prefer cats or dogs?",
            "question_type": "si/no"
        },
        {
            "id_question": 9,
            "question_text": "Which one is your favorite pet?",
            "options": ["Dog", "Cat", "Bird", "Fish"],
            "question_type": "eleccion simple"
        },{
            "id_question": 10,
            "question_text": "How much would you rate your data analysis skills?",
            "question_type": "calificacion"
        },
        {
            "id_question": 11,
            "question_text": "How much would you rate your teamwork skills?",
            "question_type": "calificacion"
        }
    ]
    
},{"id_survey": 3,
    "creator": 'creador',
    "name": "Testing survey3",
    "description": "This is just testing survey",
    "published": false,
    "edition_mode":false,
    "questions": [
        {
            "id_question": 1,
            "question_text": 'why are the keys volatile?',
            "question_type": 'numericas'
        },
        {
            "id_question": 2,
            "question_text": 'is light fast?',
            "question_type": 'si/no'
        },
        {
            "id_question": 3,
            "question_text": 'is this a question?',
            "options": ['Maybe', 'Yes','No','I dont know'],
            "question_type": 'eleccion simple'
        },
        {
            "id_question": 4,
            "question_text": "Would you rather have a job with more responsibilities but higher pay?",
            "question_type": "si/no"
        },
        {
            "id_question": 5,
            "question_text": "Which one do you prefer for data analysis?",
            "options": ["Python", "R", "Excel", "SQL"],
            "question_type": "eleccion multiple"
        },
        {
            "id_question": 6,
            "question_text": "Which one is your favorite sport?",
            "options": ["Football", "Basketball", "Tennis", "Swimming"],
            "question_type": "eleccion simple"
        },{
            "id_question": 7,
            "question_text": "Do you like working in a team?",
            "question_type": "si/no"
        },
        {
            "id_question": 8,
            "question_text": "How many hours do you sleep per day?",
            "question_type": "numericas"
        }
    ]
},{"id_survey": 4,
    "creator": 'creador',
    "name": "Testing survey4",
    "description": "This is just testing survey",
    "published": false,
    "edition_mode": false,
    "questions": [
        {
            "id_question": 1,
            "question_text": 'why did the chicken crossed the road?',
            "question_type": 'calificacion'
        },{
            "id_question": 2,
            "question_text": 'is red a color?',
            "question_type": 'si/no'
        },{
            "id_question": 3,
            "question_text": "Do you prefer coffee or tea?",
            "options": ["Coffee", "Tea"],
            "question_type": 'eleccion simple'
        },
        {
            "id_question": 4,
            "question_text": "Which one is your favorite beverage?",
            "options": ["Coffee", "Tea", "Juice", "Water"],
            "question_type": "eleccion simple"
        },
        {
            "id_question": 5,
            "question_text": "Is Java a statically typed language?",
            "question_type": "si/no"
        },
        {
            "id_question": 6,
            "question_text": "How many hours do you work per day?",
            "question_type": "numericas"
        },
        {
            "id_question": 7,
            "question_text": "Would you rather work from home or in an office?",
            "question_type": "si/no"
        },
        {
            "id_question": 8,
            "question_text": "Which one do you prefer for mobile app development?",
            "options": ["React Native", "Flutter", "Swift", "Kotlin"],
            "question_type": "eleccion multiple"
        },
        {
            "id_question": 9,
            "question_text": "How much would you rate your mobile app development skills?",
            "question_type": "calificacion"
        },
        {
            "id_question": 10,
            "question_text": "Do you like working on weekends?",
            "question_type": "si/no"
        },
        {
            "id_question": 11,
            "question_text": "Which one is your favorite mobile operating system?",
            "options": ["Android", "iOS", "Windows Phone", "BlackBerry"],
            "question_type": "eleccion simple"
        },
        {
            "id_question": 12,
            "question_text": "How much would you rate your problem-solving skills?",
            "question_type": "calificacion"
        }
    ]
}])