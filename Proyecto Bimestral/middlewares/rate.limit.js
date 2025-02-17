//Middleware de limitación de solicitudes
import rateLimit from "express-rate-limit";

//Traemos la función de rateLimit
export const limiter =rateLimit(
    {
        windowMs: 15 * 60 * 1000, //rango de tiempo 15min * 60seg * 1000milisegundos
        max: 150, //Cantidad de peticiones permitidas en el rango de tiempo
        message: {
            message: 'You are blocked, wait 15 minutes'
        }
    }
)