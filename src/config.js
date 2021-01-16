/*
// Importamos módulos
const dotenv = require('dotenv');
const assert = require('assert');

// Cargamos variables de entorno
dotenv.config();

// Variables de configuración a obtener según entorno
const TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, WHATSAPP_SANDBOX_NUMBER;

// Según entorno cargamos variables de configuración de la app
switch (process.env.NODE_ENV) {
    case 'development':
        TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        WHATSAPP_SANDBOX_NUMBER = process.env.WHATSAPP_SANDBOX_NUMBER;
        break;

    case 'production':
        TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID_PROD;
        TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN_PROD;
        WHATSAPP_SANDBOX_NUMBER = process.env.WHATSAPP_NUMBER_PROD;
        break;
}

// Verificamos
assert(TWILIO_ACCOUNT_SID, 'TWILIO_ACCOUNT_SID es obligatorio configurar');
assert(TWILIO_AUTH_TOKEN, 'TWILIO_AUTH_TOKEN es obligatorio configurar');
assert(WHATSAPP_SANDBOX_NUMBER, 'WHATSAPP_SANDBOX_NUMBER es obligatorio configurar');

// Exportamos configuración
module.exports = {
    TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: TWILIO_AUTH_TOKEN,
    WHATSAPP_SANDBOX_NUMBER: WHATSAPP_SANDBOX_NUMBER
}

*/