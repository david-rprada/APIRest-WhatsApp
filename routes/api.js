

// Incluimos los módulos necesarios
const dotenv = require('dotenv');
const Twilio = require('twilio');
const path = require('path');

// Requerimos solo el objeto Router de express y lo instanciamos
const { Router } = require('express');
const router = Router();

// Cargamos variables de configuración del archivo .env
dotenv.config();

// Leemos credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Instanciamos un cliente de Twilio con las credenciales
const client = new Twilio(accountSid, authToken);

//#region Definición de rutas

// GET /
router.get("/", (req, res) => {

    res.sendFile(path.resolve("./index.html"));
    //res.send('API Rest de mensajería en WhatsApp!')
});

// GET /GetMensaje/:sid
router.get("/GetMensaje/:sid", (req, res) => {

    client.messages(req.params.sid).fetch()
        .then(message => res.status(200).send(message))
        .catch(error => res.status(500).send(error));
});

// GET /GetAllMensajes
router.get("/GetAllMensajes", (req, res) => {
    
    client.messages.list()
    .then(messages => res.send(messages))
    .catch(error => res.status(500).send(error));
});


// GET /GetAllMensajes
router.get("/GetAllMensajes/:propiedad", (req, res) => {

    client.messages.list()
    .then(messages => res.send(messages.map((msg) => eval("msg." + req.params.propiedad))))
    .catch(error => res.status(500).send(error));
});

// DELETE /BorrarMensaje/:sid
router.get("/BorrarMensaje/:sid", (req, res) => {

    client.messages(req.params.sid).remove()
        .then(res.send("Mensaje eliminado!"))
        .catch(error => res.status(500).send(error));
});

// GET /GetUltimoMensaje
router.get("/GetUltimoMensaje", (req, res) => {
    
    client.messages.list()
        .then(messages => {

            // Comprueba si no hay mensajes y avisa
            if (!messages || messages.length == 0)
                res.send("No hay mensajes enviados!");
           
            // Ordena los mensajes por Fecha de Envío de más nuevos a más antiguos
            let mensajesOrden = messages.sort((a,b) => new Date(b.dateSent) - new Date(a.dateSent));

            // Devolvemos el último mensaje
            res.send(mensajesOrden[0]);
        })
        .catch(error => res.status(500).send(error));
});

// GET /CrearMensaje/:texto/:to/:mediaUrl? (los params con ? son opcionales)
router.get("/CrearMensaje/:texto/:to/:mediaUrl?", (req, res) => {

    // Leemos el número de pruebas del SandBox de WhatsApp
    let sandbox_number = process.env.WHATSAPP_SANDBOX_NUMBER;

    // Crea el mensaje en WhatsApp
    client.messages.create({
        from: sandbox_number,
        body: req.params.texto,
        to: 'whatsapp:' + req.params.to,
        mediaUrl: req.params.mediaUrl
        })
        .then(message => { 
            res.send("Enviado! El SID del mensaje es: " + message.sid);
            console.log("Enviado! El SID del mensaje es: " + message.sid)
        })
        .catch(error => res.status(500).send(error));

    console.log("Enviando mensaje...");
});

// POST /MsgEntrante. Esta es la webhook url configurada en la consola de Twilio para llamar cuando llegue un WhatsApp a Twilio
router.post("/MsgEntrante", (req, res) => {
    
    console.log("Mensaje entrante!");
        
    // Twilio espera de vuelta en la respuesta un TwiML XML format diciendole como responder al mensaje (normalmente un texto)
    let twiml = new Twilio.twiml.MessagingResponse();
    twiml.message("¡Buen intento! pero soy Alexia no Alexa. Esta API Rest es solo para notificaciones automáticas. Tal vez más adelante tendremos un bot que nos ayude a responder...");

    // Enviamos el twiml de vuelta a Twilio
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

});

//#endregion

// Exportamos el enrutador
module.exports = router;
