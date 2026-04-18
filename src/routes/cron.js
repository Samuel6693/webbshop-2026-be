import { Router } from "express";
import { publishScheduledProducts } from "../db/products.js";
import { sendProductEvent } from "./products.js";

const cronRouter = Router();

cronRouter.get("/publish-scheduled-products", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const publishedProducts = await publishScheduledProducts();

    publishedProducts.forEach((product) => {
      sendProductEvent({
        type: "product-status-updated",
        productId: product._id,
        status: "live",
        product
      });
    });

    res.status(200).json({
      message: "Scheduled products published",
      modifiedCount: publishedProducts.length
    });
  } catch (error) {
    console.error("Error publishing scheduled products:", error);
    res.status(500).json({ error: "Failed to publish scheduled products" });
  }
});

export default cronRouter;
