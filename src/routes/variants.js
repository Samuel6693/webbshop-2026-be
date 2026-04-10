import { Router } from "express";
import {
  getAllVariants,
  getVariantById,
  getVariantsByProductId,
  createVariant,
  updateVariantStock,
  deleteVariant,
} from "../db/variants.js";

const variantsRouter = Router();

variantsRouter.get("/", async (req, res) => {
  try {
    const variants = await getAllVariants();
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch variants" });
  }
});

variantsRouter.get("/product/:productId", async (req, res) => {
  try {
    const variants = await getVariantsByProductId(req.params.productId);

    if (variants.length === 0) {
      return res.status(404).json({ message: "No variants found for this product" });
    }

    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch variants" });
  }
});

variantsRouter.get("/:id", async (req, res) => {
  try {
    const variant = await getVariantById(req.params.id);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch variant" });
  }
});

variantsRouter.post("/", async (req, res) => {
  try {
    const { productId, size, stock } = req.body;

    if (!productId || size == null) {
      return res.status(400).json({ message: "productId and size are required" });
    }

    if (stock != null && stock < 0) {
      return res.status(400).json({ message: "Stock must be 0 or higher" });
    }

    const newVariant = await createVariant({
      productId,
      size,
      stock,
    });

    res.status(201).json(newVariant);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Variant already exists for this product and size" });
    }

    res.status(500).json({
      message: "Failed to create variant",
      error: error.message,
    });
  }
});

variantsRouter.put("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock == null || stock < 0) {
      return res.status(400).json({ message: "Stock must be 0 or higher" });
    }

    const updatedVariant = await updateVariantStock(req.params.id, stock);

    if (!updatedVariant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json(updatedVariant);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update variant stock",
      error: error.message,
    });
  }
});

variantsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedVariant = await deleteVariant(req.params.id);

    if (!deletedVariant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete variant",
      error: error.message,
    });
  }
});

export default variantsRouter;
