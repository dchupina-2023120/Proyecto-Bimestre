import { Schema, model } from "mongoose";

const ProductoSchema =Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    precio: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        default: 0 
    },
    categoria: { 
        type:Schema.Types.ObjectId, 
        ref: 'Categoria',
        required: true 
    }
});

export default model('Product',ProductoSchema)