import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
    nombre: { 
        type: String, 
        required: true, 
        unique: true 
    },
    descripcion: { 
        type: String 
    },
    estado: { 
        type: Boolean, default: true 
    }
});

import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});

export default model('Categoria',CategoriaSchema)