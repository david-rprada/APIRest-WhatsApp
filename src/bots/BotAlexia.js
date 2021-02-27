// Importamos módulos
const Twilio = require("twilio");
const emoji = require("node-emoji");
const WhatsAppController = require("../controllers/WhatsAppController");

// Leemos credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Instanciamos un cliente de Twilio con las credenciales
const client = new Twilio(accountSid, authToken);

/**
 * @class BotAlexia
 * @description class que implementará el bot de Alexia
 */
class BotAlexia {
  static async processCommand(cmd, from, res) {
    if (!cmd) throw Error("Comando vacío para Alexia!");

    // Twilio espera de vuelta en la respuesta un TwiML XML format diciendole como responder al mensaje (normalmente un texto)
    let twiml = new Twilio.twiml.MessagingResponse();

    // Aplicamos expresiones regulares para detectar comandos en Alexia
    const cmdMisEntrevistas = /entrevista|entrevistas/i;
    const isCmdMisEntrevistas = cmdMisEntrevistas.test(cmd);

    const cmdMisTareas = /actividades|tareas/i;
    const isCmdMisTareas = cmdMisTareas.test(cmd);

    const cmdMisClases = /clases/i;
    const isCmdMisClases = cmdMisClases.test(cmd);

    const cmdContacto = /contacto/i;
    const isCmdContacto = cmdContacto.test(cmd);

    if (isCmdMisEntrevistas)
      twiml.message(
        "*Hoy* no tienes ninguna entrevista. Disfruta del día! " +
          emoji.get("coffee")
      );
    else if (isCmdMisTareas)
      twiml.message(
        "*Hoy* tienes muchas actividades/tareas pendientes. ¡Más adelante te daré la lista completa! " +
          emoji.get("clipboard")
      );
    else if (isCmdMisClases) {
      twiml.message("*Hoy* tienes: ");
      twiml.message(
        emoji.get("blue_book") + " Matemáticas 014A a las 10:00 hrs"
      );
      twiml.message(
        emoji.get("blue_book") + " Ciencias naturales 014B a las 12:00 hrs"
      );
    } else if (isCmdContacto) {
      twiml.message("¡Aquí tienes la información del contacto solicitado!");
      twiml.message(
        emoji.get("male-student") +
          "Roberto Diaz Lopez: +34 612345678. Padre: Andres Diaz +34 698765432. Madre: Laura Lopez: +34 654123987"
      );
      twiml.message("Domicilio: Calle Sainz de Baranda nº11 4ºA, Madrid");
    } else
      twiml.message(
        "¡Buen intento! pero no he encontrado ese comando *Alexia*. Prueba de nuevo..."
      );

    // Enviamos el twiml de vuelta a Twilio
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
}

module.exports = BotAlexia;
