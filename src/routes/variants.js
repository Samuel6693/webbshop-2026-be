import { Router } from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
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



export default variantsRouter;
