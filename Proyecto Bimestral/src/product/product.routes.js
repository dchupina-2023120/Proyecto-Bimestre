import { Router } from "express"
import { 
    bestSellers, 
    deletedProduct, 
    listarProducto, 
    getProduct, 
    getProductsByCategory, 
    agregarProduct, 
    searchProductsByName, 
    stockProduct, 
    editarProducto 
} from "./product.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"
import { productValidator,} from "../../middlewares/validators.js"
import { objectIdValid } from "../../utils/db.validators.js"

const api = Router()
api.post( '/', validateJwt, isAdmin,productValidator, agregarProduct)

api.get('/', validateJwt, listarProducto)

api.get('/get/:id', validateJwt, getProduct)

api.put('/:id',validateJwt, isAdmin, objectIdValid, editarProducto)

api.get('/stockProduct',validateJwt, stockProduct)

api.get('/productos/categoria/:categoryName', validateJwt, getProductsByCategory)

api.get('/bestSellers',validateJwt, bestSellers)

api.delete('/:id',validateJwt, isAdmin,objectIdValid, deletedProduct)

api.get('/productos/buscar/:name', validateJwt, searchProductsByName)


export default api