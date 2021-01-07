// Incluimos los módulos necesarios
const dotenv = require('dotenv');
const Twilio = require('twilio');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// Cargamos variables de configuración del archivo .env
dotenv.config();

// Leemos credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Instanciamos un cliente de Twilio con las credenciales
const client = new Twilio(accountSid, authToken);

// Instanciamos una web server de Express
const app = express();

// Set del puerto del web server al establecido por variable de entorno o por defecto 3000 
const puerto = process.env.PORT || 3000;

// Iniciar el web server de Express en el puerto establecido en las variables de entorno o por defecto 3000
app.listen(puerto, () => {
    console.log("Servidor escuchando en el puerto " + puerto + "...");
});

// Servimos el favicon
app.use(favicon(__dirname + '/public/images/favicon.png'));

// Servimos todo el contenido static de /public/api/changelog con el virtual path /api en la url
app.use('/api', express.static(__dirname + '/public/api/changelog'));

// GET / o bien GET /api
app.get("/:var(api)?", (req, res) => {

    res.sendFile(path.resolve("./index.html"));
    //res.send('API Rest de mensajería en WhatsApp!')
});

// GET /GetMensaje/:sid
app.get("/api/GetMensaje/:sid", (req, res) => {

    client.messages(req.params.sid).fetch()
        .then(message => res.status(200).send(message))
        .catch(error => res.status(500).send(error));
});

// GET /GetAllMensajes
app.get("/api/GetAllMensajes", (req, res) => {
    
    client.messages.list()
    .then(messages => res.send(messages))
    .catch(error => res.status(500).send(error));
});


// GET /GetAllMensajes
app.get("/api/GetAllMensajes/:propiedad", (req, res) => {

    client.messages.list()
    .then(messages => res.send(messages.map((msg) => eval("msg." + req.params.propiedad))))
    .catch(error => res.status(500).send(error));
});

// DELETE /BorrarMensaje/:sid
app.get("/api/BorrarMensaje/:sid", (req, res) => {

    client.messages(req.params.sid).remove()
        .then(res.send("Mensaje eliminado!"))
        .catch(error => res.status(500).send(error));
});

// GET /GetUltimoMensaje
app.get("/api/GetUltimoMensaje", (req, res) => {
    
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
app.get("/api/CrearMensaje/:texto/:to/:mediaUrl?", (req, res) => {

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
app.post("/api/MsgEntrante", (req, res) => {
    
    console.log("Mensaje entrante!");
        
    // Twilio espera de vuelta en la respuesta un TwiML XML format diciendole como responder al mensaje (normalmente un texto)
    let twiml = new Twilio.twiml.MessagingResponse();
    twiml.message("¡Buen intento! pero soy Alexia no Alexa. Esta API Rest es solo para notificaciones automáticas. Tal vez más adelante tendremos un bot que nos ayude a responder...");

    // Enviamos el twiml de vuelta a Twilio
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

});

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




