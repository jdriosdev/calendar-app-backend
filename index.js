const express = require ('express');
const cors = require('cors')
const { dbConnection } = require('./database/config');
require('dotenv').config();

//Crear el servidor de express
const app = express();

//Base de Datos
dbConnection()

//CORS: quien puede hacer peticiones a mi API?
app.use(cors());


//directorio publico
app.use( express.static('public'))

//Lectura y parseo del body
app.use( express.json());


//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))



//escuchar peticiones
app.listen( process.env.PORT, () => {
  console.log(`servidor corriendo en http://localhost:${process.env.PORT}`)
})
