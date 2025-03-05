import Cart from '../cart/cart.model.js'
import Invoice from '../factura/factura.model.js'
import Product from '../product/product.model.js'

export const completePurchase = async (req, res) => {
    try {
        const userId = req.user.uid

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId })
        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ message: 'El carrito está vacío' })
        }

        let totalAmount = 0
        const productsToInvoice = []

        // Verificar stock y calcular el total
        for (const item of cart.products) {
            const product = await Product.findById(item.productId)
            if (!product || product.stock < item.quantity) {
                return res.status(400).send({ message: `Stock insuficiente para el producto con ID ${item.productId}` })
            }
            totalAmount += product.price * item.quantity

            // Agregar información del producto a la factura
            productsToInvoice.push({
                productId: product._id,
                productName: product.name, 
                price: product.price, 
                quantity: item.quantity
            })
        }

        // Crear la factura
        const invoice = new Invoice({
            userId,
            products: productsToInvoice,
            totalAmount,
            status: 'COMPLETADA' // Estado de la factura como COMPLETADA
        })
        await invoice.save()

        // Actualizar el stock de los productos
        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
        }

        // Limpiar el carrito después de la compra
        await Cart.findOneAndDelete({ userId })

        return res.send({ message: 'Compra completada exitosamente', invoice })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al completar la compra', error })
    }
}

export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.uid 

        // Buscar todas las facturas del usuario
        const invoices = await Invoice.find({ userId }).populate('products.productId')

        if (!invoices || invoices.length === 0) {
            return res.status(404).send({ message: 'No se encontró historial de compras' })
        }

        return res.send(invoices)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener el historial de compras', error })
    }
}

export const editInvoice = async (req, res) => {
    const { id: invoiceId } = req.params
    const { updatedItems } = req.body
    const userId = req.user?.uid // Verifica que el ID del usuario esté definido

    // Verificar si updatedItems es un array
    if (!Array.isArray(updatedItems)) {
        return res.status(400).send({ message: 'Los productos actualizados deben estar en un array' })
    }

    try {
        // Buscar la factura por ID
        const invoice = await Invoice.findById(invoiceId)
        if (!invoice) {
            return res.status(404).send({ message: 'Factura no encontrada' })
        }

        // Verificar que la factura pertenezca al usuario autenticado
        if (invoice.userId.toString() !== userId.toString()) {
            return res.status(403).send({ message: 'No tienes permiso para editar esta factura' })
        }

        let totalAmount = 0

        // Recorrer los productos actualizados
        for (const item of updatedItems) {
            const product = await Product.findById(item.productId)
            if (!product) {
                return res.status(400).send({ message: `Producto no encontrado: ${item.productId}` })
            }

            // Verificar si hay suficiente stock
            if (item.quantity > product.stock) {
                return res.status(400).send({ message: `Stock insuficiente para el producto ${item.productId}` })
            }

            // Calcular la diferencia de cantidad
            const existingProduct = invoice.products.find(p => p.productId.toString() === item.productId.toString())
            const existingQuantity = existingProduct ? existingProduct.quantity : 0

            if (item.quantity > existingQuantity) {
                const quantityToDeduct = item.quantity - existingQuantity
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -quantityToDeduct } })
            } else if (item.quantity < existingQuantity) {
                const quantityToAdd = existingQuantity - item.quantity
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: quantityToAdd } })
            }

            // Actualizar el total de la factura
            totalAmount += product.price * item.quantity

            // Modificar el producto dentro de la factura
            if (existingProduct) {
                existingProduct.quantity = item.quantity
                existingProduct.price = product.price
                existingProduct.productName = product.name
            } else {
                // Si el producto no existe en la factura, agregarlo
                invoice.products.push({
                    productId: product._id,
                    productName: product.name,
                    price: product.price,
                    quantity: item.quantity
                })
            }
        }

        // Actualizar el total de la factura
        invoice.totalAmount = totalAmount

        // Guardar la factura actualizada
        await invoice.save()

        return res.send({ message: 'Factura actualizada exitosamente', invoice })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al actualizar la factura', error: error.message })
    }
}