import Categoria from "../categorias/category.model.js";
import Producto from "../product/product.model.js";


// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria 
        } = req.body

        // Verificar si una  categoría existe
         const categoryExists = await Categoria.findById(categoria);
         if (!categoryExists) return res.status(404).json({ 
            message: "Categoría no encontrada" 
        })

        // Crear un producto nuevo 
        const newProduct = new Producto({ 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria 
        })
        await newProduct.save();

        res.status(201).json({
            message: "Producto agregado",
            product: newProduct
        })
    } catch (err) {
        console.error("Error al agregar el producto:", err);
        res.status(500).json({ 
            message: "Error al agregar el producto", err
        })
    }
}

//Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Producto.find().populate("categoria", "nombre");
        if (products.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No hay productos disponibles" 
            })
        }
        res.json({ 
            success: 
            true, 
            products 
        });
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ message: "Error al obtener productos", err });
    }
}

//Obtener un producto por el ID
export const getProductById = async (req, res) => {
    try {
        const product = await Producto.findById(req.params.id).populate("categoria", "nombre");
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        res.json(product);
    } catch (err) {
        console.error("Error al obtener el producto:", err);
        res.status(500).json({ message: "Error al obtener el producto", err });
    }
};

//Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Si se quiere cambiar de categoría, validar que exista
        if (data.categoria) {
            const categoryExists = await Categoria.findById(data.categoria);
            if (!categoryExists) return res.status(404).json({ message: "❌ Categoría no encontrada" });
        }

        const updatedProduct = await Producto.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });

        res.json({
            message: "Producto actualizado",
            product: updatedProduct
        });
    } catch (err) {
        console.error("Error al actualizar el producto:", err);
        res.status(500).json({ message: "Error al actualizar el producto", err });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Producto.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });

        res.json({ message: "Producto eliminado exitosamente" });
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
        res.status(500).json({ message: "Error al eliminar el producto", err });
    }
};

// Obtener productos agotados
export const getOutOfStockProducts = async (req, res) => {
    try {
        const outOfStockProducts = await Producto.find({ stock: 0 });
        res.json(outOfStockProducts);
    } catch (err) {
        console.error("Error al obtener productos agotados:", err);
        res.status(500).json({ message: "Error al obtener productos agotados", err });
    }
};

// Obtener productos más vendidos
export const getTopSellingProducts = async (req, res) => {
    try {
        const topProducts = await Producto.find().sort({ vendidos: -1 }).limit(5);
        res.json(topProducts);
    } catch (err) {
        console.error(" Error al obtener productos más vendidos:", err);
        res.status(500).json({ message: "Error al obtener productos más vendidos", err });
    }
};
