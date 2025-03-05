import { Router } from "express"
import { 
    listarUsuario, 
    buscarUsuarioId, 
    editarUsuario,
} from "./user.controllerAdmin.js"
import { 
    isAdmin, 
    validateJwt 
} from "../../middlewares/validate.jwt.js"
import { updateUserValidator } from "../../middlewares/validators.js"


const api = Router()

api.get(
    '/',
    validateJwt,
    isAdmin,
    listarUsuario
)

api.get(
    '/:id', 
    validateJwt,
    buscarUsuarioId
)

api.put(
    '/:id', 
    [
        validateJwt, 
        updateUserValidator
    ], 
    editarUsuario
)

export default api

