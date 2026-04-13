import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    getUserById,
    findSafeUserByEmail,
    updateUser,
    deleteUser
} from '../db/users.js';

const userRouter = Router();

userRouter.use(authMiddleware); // Apply authentication middleware to all routes in this router

// Get all users (for admin use only)
userRouter.get('/', async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await getAllUsers();
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// Get user by email (for admin use only)
userRouter.get('/email/:email', async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await findSafeUserByEmail(req.params.email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// Get user by ID (for admin use only or the user themselves)
userRouter.get('/:id', async (req, res) => {
    try {
        if (req.user.isAdmin || req.user._id.toString() === req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// Update user by ID (for admin use only or the user themselves)
userRouter.put('/:id', async (req, res) => {
    try {
        if (req.user.isAdmin || req.user._id.toString() === req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const user = await updateUser(req.params.id, { name, email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user" });
    }
});

// Delete user by ID (for admin use only or the user themselves)
userRouter.delete('/:id', async (req, res) => {
    try {
        if (req.user.isAdmin || req.user._id.toString() === req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
});

export default userRouter;