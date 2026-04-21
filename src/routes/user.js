import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
    getAllUsers,
    getUserById,
    findSafeUserByEmail,
    updateUser,
    deleteUser, 
    getUserWishlist,
    addToWishlist,
    removeFromWishlist
} from '../db/users.js';
import Product from '../models/Product.js';
import Variant from '../models/Variant.js';

const userRouter = Router();

userRouter.use(authMiddleware); // Apply authentication middleware to all routes in this router

// Get current authenticated user info
userRouter.get('/me', async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch current user" });
    }
});

// Update own user
userRouter.put('/me', async (req, res) => {
    try {
        const { name, email, address } = req.body;

        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (address) {
            if (address.street) updateData["address.street"] = address.street;
            if (address.city) updateData["address.city"] = address.city;
            if (address.postalCode) updateData["address.postalCode"] = address.postalCode;
            if (address.country) updateData["address.country"] = address.country;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const user = await updateUser(req.user._id, updateData);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already in use" });
        }
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Get current authenticated user's wishlist
userRouter.get('/me/wishlist', async (req, res) => {
    try {
        const user = await getUserWishlist(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json( {wishlist: user.wishlist} );
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
});

// Add a product (and optional variant) to the current authenticated user's wishlist
userRouter.post('/me/wishlist', async (req, res) => {
    try {
        const { product, variant } = req.body;

        if (!product) {
            return res.status(400).json({ error: "Product is required" });
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (variant) {
            const variantExists = await Variant.findById(variant);

            if (!variantExists) {
                return res.status(404).json({ error: "Variant not found" });
            }

            if (variantExists.productId.toString() !== productExists._id.toString()) {
                return res.status(400).json({ error: "Variant does not belong to the specified product" });
            }
        }

        const updatedUser = await addToWishlist(req.user._id, product, variant);
        
        res.status(200).json({
            message: "Added to wishlist",
            wishlist: updatedUser.wishlist
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});

// Remove a product (and optional variant) from the current authenticated user's wishlist
userRouter.delete('/me/wishlist', async (req, res) => {
    try {
        const { product, variant } = req.body;

        if (!product) {
            return res.status(400).json({ error: "Product is required" });
        }

        const updatedUser = await removeFromWishlist(req.user._id, product, variant);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Removed from wishlist",
            wishlist: updatedUser.wishlist
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove from wishlist" });
    }
});


// Get user by ID (for admin use only or the user themselves)
userRouter.get('/:id', async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});


export default userRouter;