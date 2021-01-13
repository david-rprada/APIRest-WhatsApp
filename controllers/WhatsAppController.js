
// Importamos módulos
const Twilio = require('twilio');
const emoji = require('node-emoji');

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

      // Leemos el texto del WhatsApp
      const textoEntrada = req.body.Body;
  
      // Aplicamos expresiones regulares para detectar comandos en Alexia
      const cmdAlexia = /alexia/i;
      const isCmdAlexia = cmdAlexia.test(textoEntrada);
      
      const cmdMisEntrevistas = /entrevista|entrevistas/;
      const isCmdMisEntrevistas = cmdMisEntrevistas.test(textoEntrada);

      const cmdMisTareas = /actividades|tareas/i;
      const isCmdMisTareas = cmdMisTareas.test(textoEntrada);

      const cmdMisClases = /clases/;
      const isCmdMisClases = cmdMisClases.test(textoEntrada);

      const cmdContacto = /contacto/;
      const isCmdContacto = cmdContacto.test(textoEntrada);

      
      // Si es un comando Alexia, lo procesamos
      if (isCmdAlexia)
      {
        if (isCmdMisEntrevistas)
          twiml.message("*Hoy* no tienes ninguna entrevista. Disfruta del día! " + emoji.get('coffee'));
        
        else if (isCmdMisTareas)
          twiml.message("*Hoy* tienes muchas actividades/tareas pendientes. ¡Más adelante te daré la lista completa! " + emoji.get('clipboard'));
        
        else if (isCmdMisClases){
          twiml.message("*Hoy* tienes: ");
          twiml.message(emoji.get('blue_book') + " Matemáticas 014A a las 10:00 hrs");
          twiml.message(emoji.get('blue_book') + " Ciencias naturales 014B a las 12:00 hrs");
        }
        else if (isCmdContacto){
          twiml.message("¡Aquí tienes la información del contacto solicitado!");
          twiml.message(emoji.get('male-student') + "Roberto Diaz Lopez: +34 612345678. Padre: Andres Diaz +34 698765432. Madre: Laura Lopez: +34 654123987");
          twiml.message("Domicilio: Calle Sainz de Baranda nº11 4ºA, Madrid");
        }
        else
          twiml.message("¡Buen intento! pero no he encontrado ese comando *Alexia*. Prueba de nuevo...");
      }
      
      // En caso contrario, avisamos que no ha reconocido un comando Alexia
      else
        twiml.message("Para interactuar con el bot de Alexia " + emoji.get('robot_face') + ", por favor comienza tus comandos con la palabra *Alexia*");
      
      // Enviamos el twiml de vuelta a Twilio
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
  }
}

module.exports = WhatsAppController;