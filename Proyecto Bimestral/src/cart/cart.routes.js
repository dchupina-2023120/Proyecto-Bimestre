import {Router} from "express"
import {  validateJwt } from "../../middlewares/validate.jwt.js"
import { agregarAlCarrito } from "./cart.controller.js"


const api = Router()

api.post('/', validateJwt, agregarAlCarrito)

export default api