import { Router } from "express";
import { 
        getUsers, 
        getUserById, 
        createUser, 
        deleteUser, 
        update
} from "./user.controller.js";
import { UserValidator } from "../../middlewares/validators.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()


api.get("/", getUsers); 
api.get("/:id", getUserById); 

// Rutas protegidas 
api.post("/", 
        [
                UserValidator,

        ],createUser

); 

api.put("/:id", 
        [
              //  validateJwt, 
        ], 
        update
); 



api.delete("/:id", deleteUser); 


export default api
