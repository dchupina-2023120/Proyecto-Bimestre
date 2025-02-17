import Categoria from "../categorias/category.model.js";
import Producto from "../product/product.model.js";

// Crear una nueva categoría
export const createCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Verificar si la categoría ya existe
        const existingCategory = await Categoria.findOne({ nombre });
        if (existingCategory) return res.status(400).json({
             message: "La categoría ya existe" 
            });

        // Crear nueva categoría
        const newCategory = new Categoria({
             nombre, 
             descripcion 
            });
        await newCategory.save();

        res.status(201).json({
            message: "Categoría agregada",
            category: newCategory
        });
    } catch (err) {
        console.error("Error al agregar la categoría:", err);
        res.status(500).json({ 
            message: "Error al agregar la categoría", err 
        });
    }
};

// Obtener todas las categorías
export const getCategories = async (req, res) => {
    try {
        const categories = await Categoria.find();
        if (categories.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No hay categorías disponibles" 
            });
        }
        res.json({ success: true, categories });
    } catch (err) {
        console.error(" Error al obtener categorías:", err);
        res.status(500).json({ 
            message: "Error al obtener categorías", err 
        });
    }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Categoria.findById(req.params.id);
        if (!category) return res.status(404).json({ 
            message: "Categoría no encontrada" 
        });

        res.json(category);
    } catch (err) {
        console.error("Error al obtener la categoría:", err);
        res.status(500).json({ 
            message: "Error al obtener la categoría", err 
        });
    }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedCategory = await Categoria.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCategory) return res.status(404).json({ 
            message: "Categoría no encontrada" 
        });

        res.json({
            message: " Categoría actualizada",
            category: updatedCategory
        });
    } catch (err) {
        console.error(" Error al actualizar la categoría:", err);
        res.status(500).json({ 
            message: "Error al actualizar la categoría", err 
        });
    }
};


export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

 
        const category = await Categoria.findById(id);
        if (!category) return res.status(404).json({ 
            message: "Categoría no encontrada" 
        });


        let defaultCategory = await Categoria.findOne({ 
            nombre: "Sin categoría" 
        });
        if (!defaultCategory) {
            defaultCategory = new Categoria({ 
                nombre: "Sin categoría", 
                descripcion: "Categoría por defecto" 
            });
            await defaultCategory.save();
        }


        await Producto.updateMany({ categoria: id }, { categoria: defaultCategory._id });

        await Categoria.findByIdAndDelete(id);

        res.json({ message: " Categoría eliminada" });
    } catch (err) {
        console.error(" Error al eliminar la categoría:", err);
        res.status(500).json({ 
            message: "Error al eliminar la categoría", err 
        });
    }
};


const agregarCategoriasPorDefecto = async () => {
    const categoriasExistentes = await Categoria.countDocuments();
    if (categoriasExistentes === 0) {
      const categoriasPorDefecto = [
        {
          nombre: "Muebles",
          descripcion: "Una amplia variedad de muebles para el hogar y oficina, diseñados para combinar funcionalidad y estilo. Encuentra desde sofás cómodos y sillas ergonómicas, hasta mesas, estanterías y camas que se adaptan a tus necesidades y espacio. Los muebles ideales para crear ambientes acogedores y modernos"
        },
      ];
   
      try {
        await Categoria.insertMany(categoriasPorDefecto);
        console.log("Categorias por defecto agregados");
      } catch (error) {
        console.error("Error al agregar categorias por defecto: ", error);
      }
    }
  };
  agregarCategoriasPorDefecto();
   