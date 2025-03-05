import {Router} from "express"
import { 
    agregarCate, 
    listarCate, 
    buscarCateId,
    editarCate,
    categoryDelete 
} from "./category.controller.js"
import { 
    isAdmin, 
    validateJwt 
} from "../../middlewares/validate.jwt.js"
import { validarCatego, updateCategoryValidator } from "../../middlewares/validators.js"

const api = Router()

api.post(
    '/',
    [
        validateJwt, 
        isAdmin,
        validarCatego
    ], agregarCate
)

api.get(
    '/:id',
    [
        validateJwt, 
        isAdmin
    ], buscarCateId
)

api.get(
    '/',
    [
        validateJwt
    ], listarCate
)

api.put(
    '/:id', 
    [
        validateJwt, 
        isAdmin, 
        updateCategoryValidator
    ], editarCate
)

api.delete(
    '/:id', 
    [
        validateJwt, 
        isAdmin
    ], categoryDelete
)
export default api