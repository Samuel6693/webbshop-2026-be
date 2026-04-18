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

const clients = []; // Array to hold connected clients for SSE

// function to send events for alla clients 
export function sendProductEvent(payload) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
}

productsRouter.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
  
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

productsRouter.get("/events", (req, res) => {
  res.header("Content-Type", "text/event-stream"); // Set the content type for SSE not json or html
  res.header("Cache-control", "no-cache"); // Disable caching to ensure clients receive real-time updates
  res.header("Connection", "keep-alive"); // Keep the connection open for continuous updates

  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`); // \n\n is required to indicate the end of an SSE message 

  clients.push(res); // Add the new client to the list of connected clients

  // Handle client disconnection
  req.on("close", () => {
    const index = clients.indexOf(res); // Find the index of the disconnected client
    if (index !== -1) { //index is -1 if the client is not found in the array, so we check if it's not -1 before trying to remove it
      clients.splice(index, 1);
    }
  })
})

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
