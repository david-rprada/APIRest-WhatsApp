
// Importante! Node.js siempre busca por default un archivo index.js en una carpeta, por eso
// carga primero el index.js que a su vez carga los demás enrutadores: api.js, users.js, products.js, etc...

// Importamos modulos
const favicon = require('serve-favicon');
const path = require('path');

// Requerimos solo el objeto Router de express y lo instanciamos
const { Router, static } = require('express');
const router = new Router();
const expressStatic = new static(path.resolve('./public/api/changelog'));

// Router para la api (un módulo es siempre un archivo .js por eso encuentra el api.js sin poner ".js")
const apiRouter = require('./api');

// Le indicamos al router que utilice el router apiRouter para las url: / o bien /api (opcional)
router.use('/:var(api)?', apiRouter);

// Otros ejemplos
// Le indicamos al router que utilice el router usersRouter para las url: /users
//router.use('/users', usersRouter);

// Le indicamos al router que utilice el router productsRouter para las url: /users
//router.use('/products', productsRouter);

//#region  Middleware general
// Servimos el favicon
router.use(favicon(path.resolve('./public/images/favicon.png')));

// Servimos todo el contenido static de /public/api/changelog con el virtual path /changelog en la url
router.use('/changelog', expressStatic);

// Middleware para manejo de errores
router.use((req, res, next) => {
    const err = new Error('Recurso no encontrado!');
    err.status = 404;
    next(err); // Llama a la siguiente función de middleware
  });
  
router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      errors: {
        message: err.message
      }
    });
});
//#endregion

// Exportamos el router
module.exports = router;




