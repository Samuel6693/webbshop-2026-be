import { Router } from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getAllProducts,
  getProductById,
  getProductVariant,
  createProduct,
  updateProductById,
  deleteProductById
} from "../db/products.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
  
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

productsRouter.get("/:id/variants", async (req, res) => {
  try {
    const variants = await getProductVariant(req.params.id);

    if (variants.length === 0) {
      return res.status(404).json({ message: "No variants found for this product" });
    }
    
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch variants" });
  }
});







export default productsRouter;
