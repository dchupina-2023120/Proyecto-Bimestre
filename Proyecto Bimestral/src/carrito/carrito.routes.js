import { Router } from "express";
import { 
  getCarrito, 
  addItemToCarrito, 
  updateItemQuantity, 
  removeItemFromCarrito, 
  clearCarrito 
} from "../carrito/carrito.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router();

// Todas las rutas requieren autenticación
api.use(validateJwt);

/**
 * GET /api/cart
 * Obtener el carrito del usuario autenticado.
 */
api.get("/", validateJwt, getCarrito);

/**
 * POST /api/cart
 * Agregar un ítem al carrito.
 * Body esperado: { "productId": "<id>", "quantity": <number> }
 */
api.post("/", validateJwt, addItemToCarrito);

/**
 * PUT /api/cart
 * Actualizar la cantidad de un ítem en el carrito.
 * Body esperado: { "productId": "<id>", "quantity": <number> }
 */
api.put("/", validateJwt, updateItemQuantity);

/**
 * DELETE /api/cart
 * Eliminar un ítem del carrito.
 * Body esperado: { "productId": "<id>" }
 */
api.delete("/", validateJwt, removeItemFromCarrito);

/**
 * DELETE /api/cart/clear
 * Vaciar el carrito completamente.
 */
api.delete("/clear", validateJwt, clearCarrito);

export default api;
