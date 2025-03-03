import Categoria from "../categorias/category.model.js";
import Product from "../product/product.model.js";


// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria 
        } = req.body;

        const existingProduct = await Product.findOne({ nombre });
        if (existingProduct) {
            return res.status(400).json({ message: "El producto ya existe" });
        }

        const product = new Product({ nombre, descripcion, precio, stock, categoria });
        await product.save();

        res.status(201).json({ message: "Producto creado con éxito", product });
    } catch (error) {
        console.error("Error en createProduct:", error);
        res.status(500).json({ message: "Error al crear el producto", error: error.message });
    }
};


// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
      
      const { nombre, categoria } = req.query;
      const filter = {};
  
      if (nombre) {
        // Búsqueda parcial, sin distinción entre mayúsculas y minúsculas
        filter.nombre = { $regex: nombre, $options: "i" };
      }
  
      if (categoria) {
        // Filtra por el ID de la categoría
        filter.categoria = categoria;
      }
  
      const products = await Product.find(filter).populate("categoria");
      res.status(200).json({ products });
    } catch (error) {
      console.error("❌ Error en getProducts:", error);
      res
        .status(500)
        .json({ message: "Error al obtener los productos", error: error.message });
    }
  };

// Obtener un producto por el ID
export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("category");
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  
      res.status(200).json({ product });
    } catch (error) {
      console.error("Error en getProductById:", error);
      res
        .status(500)
        .json({ message: "Error al obtener el producto", error: error.message });
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
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
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
        const outOfStockProducts = await Product.find({ stock: 0 });
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


const agregarProductosPorDefecto = async () => {
    const productosExistentes = await Product.countDocuments();

    if (productosExistentes === 0) {
        // Busca una categoría existente para asociar productos
        const categoria = await Categoria.findOne(); 
        if (!categoria) {
            console.error("Error: No hay categorías disponibles para asignar productos.");
            return;
        }

        const productosPorDefecto = [
            {
                nombre: "Escritorio Moderno",
                descripcion: "Escritorio de madera con acabado minimalista, ideal para oficinas y estudios.",
                precio: 150.99,
                stock: 10,
                categoria: categoria._id, // Asigna la categoría encontrada
                masVendida: 5
            },
            {
                nombre: "Silla Ergonómica",
                descripcion: "Silla de oficina con soporte lumbar ajustable y diseño ergonómico.",
                precio: 89.99,
                stock: 15,
                categoria: categoria._id,
                masVendida: 8
            }
        ];

        try {
            await Product.insertMany(productosPorDefecto);
            console.log("Productos por defecto agregados.");
        } catch (error) {
            console.error("Error al agregar productos por defecto: ", error);
        }
    }
};

// Ejecutar la función al importar el archivo
agregarProductosPorDefecto();