import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'

export const agregarAlCarrito = async (req, res) => {
    try {
        const { productName } = req.body
        const userId = req.user.uid

        if (!userId) {
            return res.status(400).send({ message: 'El ID de usuario es requerido' })
        }

        // Buscar el producto por su nombre para obtener su id y que no se vea tan mal
        const product = await Product.findOne({ name: productName })
        if (!product) {
            return res.status(404).send({ message: 'Producto no encontrado' })
        }

        let cart = await Cart.findOne({ userId })

        if (cart) {
            // Buscar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.productId.equals(product._id))

            if (existingProduct) {
                // Si el producto ya existe, solo incrementar la cantidad
                existingProduct.quantity += 1
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ 
                    productId: product._id, 
                    productName: product.name, // Guardar el nombre opcionalmente
                    quantity: 1 // Inicializar la cantidad en 1
                })
            }
            await cart.save()
        } else {
            // Si no existe un carrito para el usuario, crearlo
            const newCart = new Cart({
                userId,
                products: [{ 
                    productId: product._id, 
                    productName: product.name,
                    quantity: 1
                }]
            })
            await newCart.save()
        }

        return res.send({ message: 'Producto agregado al carrito' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al agregar al carrito', error })
    }
}