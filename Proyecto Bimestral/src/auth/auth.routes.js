//Rutas de autenticación
import { Router } from "express";
import { 
    login,
    register, 
    test 
} from "./auth.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
//import { UserValidator } from "../../middlewares/validators.js";

const api = Router()

// Rutas públicas (No requieren autenticación)
                      //Middlewares
api.post('/register', 
    [
        //UserValidator,
    ], register)
api.post('/login', login)


api.get('/test', validateJwt, test)

// Exportamos rutas
export default api