// Importamos módulos
const Twilio = require("twilio");
const emoji = require("node-emoji");
//const isFuture = require("date-fns/isFuture");
//var addDays = require("date-fns/addDays");
const { isFuture, addDays } = require("date-fns");

// Leemos credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Instanciamos un cliente de Twilio con las credenciales
const client = new Twilio(accountSid, authToken);

/**
 * @class Botuccio
 * @description class que implementará el bot (Botuccio) para las reservas de piscina
 */
class Botuccio {
  static async processCommand(cmd, from, res) {
    if (!cmd) throw Error("Comando vacío para Botuccio!");

    // Twilio espera de vuelta en la respuesta un TwiML XML format diciendole como responder al mensaje (normalmente un texto)
    let twiml = new Twilio.twiml.MessagingResponse();

    // Aplicamos expresiones regulares para detectar comandos de Botuccio
    const cmdMisReservas = /reservas/i;
    const isCmdMisReservas = cmdMisReservas.test(cmd);

    // CmdMisReservas
    if (isCmdMisReservas) {
      // Leemos todos los mensajes de reserva OK! enviados al usuario en los últimos 3 días
      client.messages
        .list({ limit: 100 }) // Solo consultamos los últimos 100 mensajes por rapidez
        .then((messages) => {
          let reservas = messages.filter(
            (item) =>
              item.body.includes("OK!") && // Mensajes OK! de reserva
              item.to.replace("whatsapp:", "") === from && // Destinados a mi
              isFuture(addDays(new Date(item.dateSent), 3)) // Los 3 últimos días
          );

          // Y respondemos con las reservas
          if (reservas.length !== 0) {
            twiml.message(
              emoji.get("robot_face") +
                " Estas son tus reservas para los *3 próximos días*: "
            );
            for (let reserva of reservas) twiml.message(reserva.body);
          } else
            twiml.message(
              emoji.get("robot_face") +
                " No tienes reservas para los *3 próximos días*"
            );

          // Enviamos el twiml de vuelta a Twilio
          res.writeHead(200, { "Content-Type": "text/xml" });
          res.end(twiml.toString());
        })
        .catch((error) => res.status(500).send(error));
    }
  }
}

module.exports = Botuccio;
