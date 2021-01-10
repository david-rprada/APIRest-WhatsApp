// Importar módulos
const dotenv = require('dotenv');
const express = require('express');
const cliente = require('./client');

// Cargamos variables de entorno del archivo .env
dotenv.config();

// Set del puerto del web server al establecido por variable de entorno o por defecto 3000 
const puerto = process.env.PORT || 3000;

// Instanciamos una web server de Express
const app = new express();

// Rutas definidas
const routerApp = require('./routes');

// Indicamos al web server que utilice el router con las rutas definidas en él
app.use(routerApp);

// Iniciar el web server de Express en el puerto establecido en las variables de entorno o por defecto 3000
app.listen(puerto, () => {
    console.log("Servidor escuchando en el puerto " + puerto + "...");
});



// Peticiones de cliente
cliente.CrearMensajePOST();

