process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


if (process.env.NODE_ENV == 'dev') {

    process.env.DBNAME = 'centrode_lagomall';
    process.env.DBUSER = 'centrode_admin';
    process.env.DBPASSWORD = 'Lagomall2021';
    process.env.DBHOST = '138.128.182.50';
    process.env.SEED = 'token-SEED';
    process.env.CADUCIDAD_TOKEN = '5h';

}

// process.env.DBNAME = 'centrode_lagomall';
// process.env.DBUSER = 'centrode_administrador';
// process.env.DBPASSWORD = 'Lagomall2021';
// process.env.DBHOST = 'host.hostingmaracaibo.com';
// process.env.SEED = 'token-SEED';
// process.env.CADUCIDAD_TOKEN = '5h';
