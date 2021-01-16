// Importar módulos
const express = require('express');

// Instanciamos una web server de Express
const app = new express();

// Rutas definidas
const routerApp = require('./routes');

// Indicamos al web server que utilice el router con las rutas definidas en él
app.use(routerApp);

module.exports = app;