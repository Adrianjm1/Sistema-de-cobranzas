/* ====================
Vencimiento del token
======================= */

process.env.CADUCIDAD_TOKEN = '5h';

/* ====================
SEED de Autenticación
======================= */

process.env.SEED = process.env.SEED || 'token-SEED'


/* =========
Puerto
========= */

process.env.PORT = process.env.PORT || 5000;


/* =========
Entorno
========= */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/* ====================
BASE DE DATOS
======================= */

let dbUser;
let dbPassword;
let dbHost;
let dbName;

if (process.env.NODE_ENV === 'dev') {
    dbName = 'lagomall';
    dbUser = 'root';
    dbPassword = '';
    dbHost = 'localhost'
} else {
    dbName = 'bp430b1ijxtxpf3grgc7';
    dbUser = 'ujcooqp0twjfxwgq';
    dbPassword = 'SVVIHK3G0oypEagtkyxn';
    dbHost = 'bp430b1ijxtxpf3grgc7-mysql.services.clever-cloud.com';
}

process.env.DBNAME = dbName;
process.env.DBUSER = dbUser;
process.env.DBPASSWORD = dbPassword;
process.env.DBHOST = dbHost;