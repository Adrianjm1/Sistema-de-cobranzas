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

process.env.PORT = process.env.PORT || 3000;


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
    dbName = 'epiz_30111988_lagotest';
    dbUser = 'epiz_30111988';
    //dbPassword = 'y1ONARfdkaJG3gI';
    dbPassword = 'Lagomall2021';
    dbHost = 'sql305.epizy.com';
}

process.env.DBNAME = dbName;
process.env.DBUSER = dbUser;
process.env.DBPASSWORD = dbPassword;
process.env.DBHOST = dbHost;