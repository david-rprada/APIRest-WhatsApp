
// Importamos módulos
const path = require('path');
const bodyParser = require('body-parser');
const WhatsAppController = require('../controllers/WhatsAppController');

// Requerimos solo el objeto Router y lo instanciamos
const { Router } = require('express');
const router = new Router();

// Crear instancia de application/json parser
const jsonParser = bodyParser.json()

//#region Definición de rutas

// GET /
router.get("/", (req, res) => {

    res.sendFile(path.resolve("./index.html"));
    //res.send('API Rest de mensajería en WhatsApp!')
});

// GET /GetMensaje/:sid
router.get("/GetMensaje/:sid", WhatsAppController.getMensaje);

// GET /GetAllMensajes
router.get("/GetAllMensajes", WhatsAppController.getAllMensajes);

// GET /GetAllMensajes 
router.get("/GetAllMensajes/:propiedad", WhatsAppController.getAllMensajesPropiedad);

// DELETE /BorrarMensaje/:sid
router.get("/BorrarMensaje/:sid", WhatsAppController.borrarMensaje);

// GET /GetUltimoMensaje
router.get("/GetUltimoMensaje", WhatsAppController.getUltimoMensaje);

// GET /CrearMensaje/:texto/:to/:mediaUrl? (los params con ? son opcionales)
router.get("/CrearMensaje/:texto/:to/:mediaUrl?", WhatsAppController.crearMensajeGET);

// POST /CrearMensaje {'texto': texto, 'to': to, 'mediaUrl': mediaUrl}
router.post("/CrearMensaje", jsonParser, WhatsAppController.crearMensajePOST);

// POST /MsgEntrante. Esta es la webhook url configurada en la consola de Twilio para llamar cuando llegue un WhatsApp a Twilio
router.post("/MsgEntrante", WhatsAppController.recibirMensaje);

//#endregion

// Exportamos el enrutador
module.exports = router;
