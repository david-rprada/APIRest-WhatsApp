// Cargamos variables de entorno del archivo .env
const dotenv = require('dotenv');
dotenv.config();

// Requerimos modulos
const app  = require('./src/app');
//const cliente = require('./src/client');

// Set del puerto del web server al establecido por variable de entorno o por defecto 3000 
const puerto = process.env.PORT || 3000;

// Iniciar el web server de Express en el puerto establecido en las variables de entorno o por defecto 3000
app.listen(puerto, () => {
    console.log(`Worker ${process.pid} started...`);
    console.log('Servidor escuchando en el puerto ' + puerto + '...');
});

// Peticion de cliente
//cliente.CrearMensajePOST();

