// Incluimos los módulos necesarios
const express = require('express');

// Instanciamos una web server de Express
const app = new express();

// Rutas definidas
const routerApp = require('./routes');

// Set del puerto del web server al establecido por variable de entorno o por defecto 3000 
const puerto = process.env.PORT || 3000;

// Indicamos al web server que utilice el router con las rutas definidas en el
app.use(routerApp);

// Iniciar el web server de Express en el puerto establecido en las variables de entorno o por defecto 3000
app.listen(puerto, () => {
    console.log("Servidor escuchando en el puerto " + puerto + "...");
});


