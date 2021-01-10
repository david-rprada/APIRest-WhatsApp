
// Importamos módulos
const Twilio = require('twilio');

// Leemos credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Instanciamos un cliente de Twilio con las credenciales
const client = new Twilio(accountSid, authToken);

/**
 * @class WhatsAppController
 * @description class que implementará la mensajería con WhatsApp
 */
class WhatsAppController {
  
  static async getMensaje(req, res) {
    
    client.messages(req.params.sid).fetch()
        .then(message => res.status(200).json(message))
        .catch(error => res.status(500).send(error));
  }

  static async getAllMensajes (req, res) {
    
    client.messages.list()
      .then(messages => res.json(messages))
      .catch(error => res.status(500).send(error));
  }

  static async getAllMensajesPropiedad (req, res){
    
    client.messages.list()
      .then(messages => res.json(messages.map((msg) => eval("msg." + req.params.propiedad))))
      .catch(error => res.status(500).send(error));
  }
  
  static async borrarMensaje(req, res){
    client.messages(req.params.sid).remove()
      .then(res.send("Mensaje eliminado!"))
      .catch(error => res.status(500).send(error));
  }

  static async getUltimoMensaje (req, res) {
    
    client.messages.list()
      .then(messages => {

          // Comprueba si no hay mensajes y avisa
          if (!messages || messages.length == 0)
              res.send("No hay mensajes enviados!");
         
          // Ordena los mensajes por Fecha de Envío de más nuevos a más antiguos
          let mensajesOrden = messages.sort((a,b) => new Date(b.dateSent) - new Date(a.dateSent));

          // Devolvemos el último mensaje
          res.json(mensajesOrden[0]);
      })
      .catch(error => res.status(500).send(error));
    }

    static async crearMensajeGET(req, res) {
        
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
        res.send("Enviado! El SID del mensaje es: " + message.sid + " (texto: " + req.params.texto + ")");
        //console.log("Enviado! El SID del mensaje es: " + message.sid + " (" + req.params.texto + ")");
      })
      .catch(error => res.status(500).send(error));
    
      console.log("Enviando mensaje...");
    }

    static async crearMensajePOST(req, res) {
          
      // Leemos el número de pruebas del SandBox de WhatsApp
      let sandbox_number = process.env.WHATSAPP_SANDBOX_NUMBER;
    
      // Crea el mensaje en WhatsApp
      client.messages.create({
        from: sandbox_number,
        body: req.body.texto,
        to: 'whatsapp:' + req.body.to,
        mediaUrl: req.body.mediaUrl
      })
      .then(message => { 
        res.json("Enviado! El SID del mensaje es: " + message.sid + " (texto: " + req.body.texto + ")");
        //console.log("Enviado! El SID del mensaje es: " + message.sid + " (" + req.body.texto + ")");
      })
      .catch(error => res.status(500).send(error));
    
      console.log("Enviando mensaje...");
    }

    static async recibirMensaje(req, res) {
    
      console.log("Mensaje entrante!");
          
      // Twilio espera de vuelta en la respuesta un TwiML XML format diciendole como responder al mensaje (normalmente un texto)
      let twiml = new Twilio.twiml.MessagingResponse();
      twiml.message("¡Buen intento! pero soy Alexia no Alexa. Esta API Rest es solo para notificaciones automáticas. Tal vez más adelante tendremos un bot que nos ayude a responder...");

      // Enviamos el twiml de vuelta a Twilio
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
}

module.exports = WhatsAppController;