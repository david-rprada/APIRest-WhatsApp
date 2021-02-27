/**
 * @description módulo que define todas las funciones de Middleware
 */

// Importante! Node.js siempre busca por default un archivo index.js en una carpeta, por eso
// carga primero el index.js que a su vez carga los demás enrutadores: api.js, sms.js, emails.js, etc...

// Importamos modulos
const favicon = require("serve-favicon");
const path = require("path");

// Router para la api (un módulo es siempre un archivo .js por eso encuentra el api.js sin poner ".js")
const apiRouter = require("./api");

// Requerimos solo los objetos { Router , static } (destructuring) de express y lo instanciamos
const { Router, static } = require("express");
const router = new Router();
const expressStatic = new static(path.resolve("./public/api/changelog"));

// Aplicamos favicon como función de middleware para servir favicon.png
router.use(favicon(path.resolve("./public/images/favicon.png")));

// Aplicamos expressStatic como función de middleware para la ruta /changelog
// Servimos todo el contenido static de /public/api/changelog con el virtual path /changelog en la url
router.use("/changelog", expressStatic);

// Le indicamos al router que utilice el router apiRouter para las url: / o bien /api (opcional)
router.use("/:var(api)?", apiRouter);

// Otros ejemplos
// Le indicamos al router que utilice el router usersRouter para las url: /sms
//router.use('/sms', smsRouter);

// Le indicamos al router que utilice el router productsRouter para las url: /email
//router.use('/emails', emailsRouter);

// Middleware para manejo de errores 404 (urls not found) y 500
// La definición del orden importa. Esto hará que toda req cuya ruta nos sea encontrada
// pase por esta función, por eso las ponemos al final de las funciones de middleware
router.use((req, res, next) => {
  const err = new Error("Recurso no encontrado!");
  err.status = 404;
  next(err); // Llama a la siguiente función de middleware
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
    },
  });
});

// Exportamos el router para este webserver
module.exports = router;
