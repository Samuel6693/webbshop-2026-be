import { Router } from "express";
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

productsRouter.post("/", async (req, res) => {
  try {
    const {name, description, price, image, dropDate, status} = req.body;

    if (!name || !description || !image || !dropDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (price == null || price < 0) {
      return res.status(400).json({ message: "Price must be 0 or higher"});
    }

    if (status && !["Upcoming", "live", "sold_out"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create product",
      error: error.message});
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { name, description, price, image, dropDate, status } = req.body;

    if (!name || !description || !image || !dropDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (price == null || price < 0) {
      return res.status(400).json({ message: "Price must be 0 or higher" });
    }

    if (status && !["Upcoming", "live", "sold_out"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedProduct = await updateProductById(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});



export default productsRouter;
