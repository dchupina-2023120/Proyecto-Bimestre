//Rutas de autenticación
import { Router } from "express"
import { 
    deleteUser,
    login,
    register,
    editarcontrasena,
    updateUser,  
} from "./auth.controllerUser.js"
import { registerValidator,userUpdate } from "../../middlewares/validators.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"


const api = Router()

api.post(
    '/register', 
    registerValidator,
    register,

)

api.post('/login', login)

api.put(
    '/updatePassword',
    [
        validateJwt, 
        
    ], 
    editarcontrasena
)

api.put('/:id', 
    [
        validateJwt, 
        userUpdate
    ], 
    updateUser
)

api.delete('/:id', 
    [
        validateJwt
    ], 
    deleteUser 
)

//Exporto las rutas
export default api