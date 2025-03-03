//Rutas de autenticación
import { Router } from "express";
import { 
    login,
    register, 
    test 
} from "./auth.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()


api.post('/register',register)

api.post('/login', login)

api.get('/test', validateJwt, test)


export default api