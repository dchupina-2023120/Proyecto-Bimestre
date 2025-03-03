import Carrito from "../carrito/carrito.model.js";
import Product from "../product/product.model.js";


/**
 * Obtener o crear el carrito del usuario autenticado
*/
export const getCarrito = async (req, res) => {
  try {
    let Carrito = await Carrito.findOne({ user: req.user.id }).populate("items.product");
    if (!Carrito) {
      Carrito = new Carrito({ user: req.user.id, items: [] });
      await Carrito.save();
      Carrito = await Carrito.populate("items.product");
    }
    res.status(200).json({ Carrito });
  } catch (error) {
    console.error("❌ Error in getCarrito:", error);
    res.status(500).json({ message: "Error retrieving Carrito", error: error.message });
  }
};

/**
 * Agregar un ítem al carrito
*/
export const addItemToCarrito = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Verifica que el producto exista y esté activo
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let Carrito = await Carrito.findOne({ user: req.user.id });
    if (!Carrito) {
      Carrito = new Carrito({ user: req.user.id, items: [] });
    }

    const existingItem = Carrito.items.find(item => item.product.equals(productId));
    if (existingItem) {
      // Actualiza la cantidad
      existingItem.quantity += quantity;
    } else {
      Carrito.items.push({ product: productId, quantity });
    }

    await Carrito.save();
    await Carrito.populate("items.product");
    res.status(200).json({ message: "Item added to Carrito", Carrito });
  } catch (error) {
    console.error("❌ Error in addItemToCarrito:", error);
    res.status(500).json({ message: "Error adding item to Carrito", error: error.message });
  }
};

/**
 * Actualizar la cantidad de un ítem en el carrito
 */
export const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const Carrito = await Carrito.findOne({ user: req.user.id });
    if (!Carrito) {
      return res.status(404).json({ message: "Carrito not found" });
    }

    const itemIndex = Carrito.items.findIndex(item => item.product.equals(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in Carrito" });
    }

    // Si la cantidad es menor o igual a 0, se elimina el ítem
    if (quantity <= 0) {
      Carrito.items.splice(itemIndex, 1);
    } else {
      Carrito.items[itemIndex].quantity = quantity;
    }

    await Carrito.save();
    await Carrito.populate("items.product");
    res.status(200).json({ message: "Carrito updated", Carrito });
  } catch (error) {
    console.error("❌ Error in updateItemQuantity:", error);
    res.status(500).json({ message: "Error updating Carrito", error: error.message });
  }
};

/**
 * Eliminar un ítem del carrito
 */
export const removeItemFromCarrito = async (req, res) => {
  try {
    const { productId } = req.body;
    const Carrito = await Carrito.findOne({ user: req.user.id });
    if (!Carrito) {
      return res.status(404).json({ message: "Carrito not found" });
    }

    Carrito.items = Carrito.items.filter(item => !item.product.equals(productId));
    await Carrito.save();
    await Carrito.populate("items.product");
    res.status(200).json({ message: "Item removed from Carrito", Carrito });
  } catch (error) {
    console.error("❌ Error in removeItemFromCarrito:", error);
    res.status(500).json({ message: "Error removing item from Carrito", error: error.message });
  }
};

/**
 * Vaciar el carrito por completo
 */
export const clearCarrito = async (req, res) => {
  try {
    const Carrito = await Carrito.findOne({ user: req.user.id });
    if (!Carrito) {
      return res.status(404).json({ message: "Carrito not found" });
    }
    Carrito.items = [];
    await Carrito.save();
    res.status(200).json({ message: "Carrito cleared", Carrito });
  } catch (error) {
    console.error("❌ Error in clearCarrito:", error);
    res.status(500).json({ message: "Error clearing Carrito", error: error.message });
  }
     
};
