
// Requerimos solo el objeto Router de express y lo instanciamos
const { Router } = require('express');
const router = Router();

// Router para la api
const apiRouter = require('./api');

// Le indicamos al router que utilice el router apiRouter para las url: / o bien /api (opcional)
router.use('/:var(api)?', apiRouter);

// Le indicamos al router que utilice el router usersRouter para las url: /users
//router.use('/users', usersRouter);

// Le indicamos al router que utilice el router productsRouter para las url: /users
//router.use('/products', productsRouter);

// Exportamos el router
module.exports = router;




