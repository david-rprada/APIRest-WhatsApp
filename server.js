// Incluimos los módulos necesarios
const express = require('express');
const favicon = require('serve-favicon');

// Instanciamos una web server de Express
const app = express();

// Rutas definidas
const router = require('./routes');

// Set del puerto del web server al establecido por variable de entorno o por defecto 3000 
const puerto = process.env.PORT || 3000;

// Indicamos al web server que utilice el router con las rutas definidas en el
app.use(router);

// Iniciar el web server de Express en el puerto establecido en las variables de entorno o por defecto 3000
app.listen(puerto, () => {
    console.log("Servidor escuchando en el puerto " + puerto + "...");
});


//#region  Middleware general

// Servimos el favicon
app.use(favicon(__dirname + '/public/images/favicon.png'));

// Servimos todo el contenido static de /public/api/changelog con el virtual path /api en la url
app.use('/api', express.static(__dirname + '/public/api/changelog'));

// Finalmente (importa el orden!) catch de error 404 y forward al error handler
app.use((req, res, next) => {
    const err = new Error('Recurso no encontrado!');
    err.status = 404;
    next(err);
  });
  
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      errors: {
        message: err.message
      }
    });
});

//#endregion
