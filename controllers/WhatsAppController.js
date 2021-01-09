
// Importamos módulos
const dotenv = require('dotenv');
const Twilio = require('twilio');

// Cargamos variables de configuración del archivo .env
dotenv.config();

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
        .then(message => res.status(200).send(message))
        .catch(error => res.status(500).send(error));
  }

  static async getAllMensajes (req, res) {
    
    client.messages.list()
      .then(messages => res.send(messages))
      .catch(error => res.status(500).send(error));
  }

  static async getAllMensajesPropiedad (req, res){
    
    client.messages.list()
      .then(messages => res.send(messages.map((msg) => eval("msg." + req.params.propiedad))))
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
          res.send(mensajesOrden[0]);
      })
      .catch(error => res.status(500).send(error));
    }

    static async crearMensaje(req, res) {
        
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