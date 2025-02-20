import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getOutOfStockProducts,
    getTopSellingProducts
} from "../product/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/agotados", getOutOfStockProducts);
router.get("/mas-vendidos", getTopSellingProducts);

export default router;
