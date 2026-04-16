import { Router } from "express";
import { createOrder, getAllOrdersByUserId } from "../db/order.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { products, address } = req.body;

        // Validate the presence of products and address in the request body
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products are required" });
        }

        if (
            !address ||
            !address.name ||
            !address.street ||
            !address.city ||
            !address.postalCode ||
            !address.country
        ) {
            return res.status(400).json({ error: "Complete address is required" });
        }

        
        const orderProducts = [];
        let numOfItems = 0;
        let totalCost = 0;

        const variantsToUpdate = [];
        const productsToCheckSoldOut = new Map();

        for (const item of products) {
            const { productId, variantId, quantity } = item;

            if (!productId || !variantId || quantity == null) {
                return res.status(400).json({
                    error: "Each product must include productId, variantId, and quantity",
                });
            }

            if (quantity < 1) {
                return res.status(400).json({
                    error: "Quantity must be at least 1",
                });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    error: `Product not found` });
            }

            if (product.status !== "live") {
                return res.status(400).json({
                    error: `Product ${product.name} is not available for purchase` });
            }

            const variant = await Variant.findById(variantId);
            if (!variant) {
                return res.status(404).json({
                    error: `Variant not found` });
            }

            if (variant.productId.toString() !== product._id.toString()) {
                return res.status(400).json({
                    error: `Variant does not belong to the specified product` });
            }

            if (variant.stock < quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for variant ${product.name}`, size: `${variant.size}`
                });
            }

            orderProducts.push({
                productId: product._id,
                variantId: variant._id,
                name: product.name,
                size: variant.size,
                price: product.price,
                quantity,
            });

            numOfItems += quantity;
            totalCost += product.price * quantity;

            variantsToUpdate.push({ variant, quantity });
            productsToCheckSoldOut.set(product._id.toString(), product);
        }

        //Update stock only after all items have passed validation
        for (const item of variantsToUpdate) {
            item.variant.stock -= item.quantity;
            await item.variant.save();
        }

        //Update product status to sold out if all variants are out of stock
        for (const product of productsToCheckSoldOut.values()) {
            const remainingVariants = await Variant.find({productId: product._id});
            const isSoldOut = remainingVariants.every(variant => variant.stock === 0);

            if (isSoldOut) {
                product.status = "sold_out";
                await product.save();
            }
        }

        const order = await createOrder({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                address,
            },
            products: orderProducts,
            numOfItems,
            totalCost,
            status: "pending",
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Could not create order" });
    }
});



// Get all orders for the authenticated user, requires authentication middleware to set req.user in order to work
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const orders = await getAllOrdersByUserId(req.user._id);
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Could not fetch orders" });
    }
});

export default router;