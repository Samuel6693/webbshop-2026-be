import { Router } from "express";
import { createOrder, getAllOrdersByUserId } from "../db/order.js";
import Product from "../models/product.js";
import Variant from "../models/variant.js";

const router = Router();

// Create a new order
router.post("/", async (req, res) => {
    try {
        const { product, variant, quantity, shippingAddress } = req.body;

        // Validate required fields
        if ( !product || !variant || quantity == null || !shippingAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (quantity < 1) {
            return res.status(400).json({ error: "Quantity must be at least one" });
        }

        // Validate product and variant existence
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ error: "Product not found" });
        }

        //Check if product is live
        if (productExists.status !== "live") {
            return res.status(400).json({ error: "Product is not available for purchase yet" });
        }

        // Check if variant exists and belongs to the product
        const variantExists = await Variant.findById(variant);
        if (!variantExists) {
            return res.status(404).json({ error: "Variant not found" });
        }

        // Ensure the variant belongs to the specified product
        if (variantExists.productId.toString() !== productExists._id.toString()) {
            return res.status(400).json({ error: "Variant does not belong to the specified product" });
        }

        // Check stock availability
        if (variantExists.stock < quantity) {
            return res.status(400).json({ error: "Insufficient stock for the requested variant" });
        }

        // Deduct stock and save the variant
        variantExists.stock -= quantity;
        await variantExists.save();

        // If all variants are sold out, update product status to "sold_out"
        const allVariants = await Variant.find({ productId: product });
        const isSoldOut = allVariants.every((v) => v.stock === 0);
        if (isSoldOut) {
            productExists.status = "sold_out";
            await productExists.save();
        }

        // Calculate total price in backend to prevent manipulation from client side
        const totalPrice = productExists.price * quantity;

        // Create the order
        const order = await createOrder({
            user: req.user._id,
            product,
            variant,
            quantity,
            totalPrice,
            shippingAddress,
        });

        res.status(201).json(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all orders for the authenticated user, requires authentication middleware to set req.user in order to work
router.get("/me", async (req, res) => {
    try {
        const orders = await getAllOrdersByUserId(req.user._id);
        res.json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;