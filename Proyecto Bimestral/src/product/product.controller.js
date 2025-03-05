import Product from './product.model.js'
import Category from '../category/category.model.js'

export const agregarProduct = async (req, res) => {
    try {
        const data = req.body

        const newProduct = new Product(data)
        
        await newProduct.save()

        return res.send({
            success: true,
            message: 'Producto guardado exitosamente',
            product: newProduct
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error: err.message
        })
    }
}

export const listarProducto = async (req, res) => {
    const { limit, skip } = req.query
    try {
        const products = await Product.find()
            .populate({
                path: 'category',
                select: 'name -_id'
            })
            .skip(skip)
            .limit(limit)
        
        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron productos'
            })
        }
        return res.send({
            success: true,
            message: 'Productos encontrados:',
            total: products.length,
            products
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error general al obtener productos',
            error: err
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        let { id } = req.params

        let product = await Product.findById(id)
            .populate({
                path: 'category',
                select: 'name -_id'
            })

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Producto no encontrado'
            })
        }

        return res.send({
            success: true,
            message: 'Producto encontrado',
            product
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error: err
        })
    }
}

export const editarProducto = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        const update = await Product.findByIdAndUpdate(id, data, { new: true })

        if (!update) return res.status(404).send({
            success: false,
            message: 'Producto no encontrado'
        })
        
        return res.send({
            success: true,
            message: 'Producto actualizado',
            product: update
        })

    } catch (err) {
        console.error('Error general', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error: err
        })
    }
}

export const stockProduct = async (req, res) => {
    try {
        const stockProduct = await Product.find({ stock: 0 })

        if (stockProduct.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No hay productos agotados'
            })
        }
        return res.send({
            success: true,
            message: 'Los productos agotados son:',
            product: stockProduct
        })
        
    } catch (err) {
        console.error('Error general', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error: err
        })
    }
}

export const bestSellers = async (req, res) => {
    try {
        const bestSellers = await Product.find()
            .sort({ sales: -1 }) // Orden descendente en las ventas
            .limit(10) // Fijar límite en productos mostrados
            .select("name sales stock") // Campos que queremos que se muestren

        if (!bestSellers.length) {
            return res.status(404).send({
                success: false,
                message: "No hay productos vendidos"
            })
        }
        return res.send({
            success: true,
            message: 'Los productos más vendidos son:',
            product: bestSellers
        })

    } catch (err) {
        console.error('Error general', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error: err
        })
    }
}

export const deletedProduct = async (req, res) => {
    try {
        let id = req.params.id
        let deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).send({ message: 'Producto no encontrado, no eliminado' })
        }

        return res.send({ message: 'Producto eliminado exitosamente', deletedProduct })
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send({ message: 'Error general', error })
    }
}

export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.params // Obtener el nombre del producto desde los parámetros de la ruta

        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'El nombre del producto es requerido'
            })
        }

        // Buscar productos que coincidan con el nombre (usando una expresión regular)
        const products = await Product.find({
            name: { $regex: name, $options: 'i' } // 'i' para hacer la búsqueda sin importar mayúsculas y minúsculas
        }).populate({
            path: 'category',
            select: 'name -_id'
        })

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron productos con ese nombre'
            })
        }

        return res.send({
            success: true,
            message: 'Productos encontrados:',
            products
        })
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error
        })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params 

        const category = await Category.findOne({ name: categoryName })

        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Categoría no encontrada'
            })
        }

        // Buscar productos que pertenecen a la categoría encontrada
        const products = await Product.find({ category: category._id }).populate({
            path: 'category',
            select: 'name -_id'
        })

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron productos en esta categoría'
            })
        }

        return res.send({
            success: true,
            message: 'Productos encontrados en la categoría:',
            products
        })
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error
        })
    }
}
