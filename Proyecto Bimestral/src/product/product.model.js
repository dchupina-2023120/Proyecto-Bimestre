import { Schema, model } from "mongoose";

const ProductoSchema =Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: {
        type: String
    },
    precio: { 
        type: Number, 
        required: true,
        min: 0 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0 
    },
    categoria: { 
        type:Schema.Types.ObjectId, 
        ref: 'Categoria',
        required: true 
    },
    masVendida: { 
        type: Number, 
        default: 0 
    },
},
    { timestamps: true, versionKey: false }
);

export default model('Product',ProductoSchema)