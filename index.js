require('./src/config/config');
const express = require('express');
const app = express();
const db = require('./src/database/controller/index');
const cors = require('cors');
const bodyParser = require('body-parser');
// Configuración del servidor
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(require('morgan')(':method :url :status :res[content-length] - :response-time ms'))

// Router
app.use('/api', require('./src/router'));

app.listen(process.env.PORT, db)
