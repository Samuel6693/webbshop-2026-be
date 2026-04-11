import { Router } from 'express'
import {
    getAllUsers,
    getUserById,
    findSafeUserByEmail,
    updateUser,
    deleteUser
} from '../db/users.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const user = await getAllUsers();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: " Failed to fetch users" });
    }
});

userRouter.get('/email/:email', async (req, res) => {
    try {
        const user = await findSafeUserByEmail(req.params.email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: " Failed to fetch user" });
    }
});

userRouter.get('/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: " Failed to fetch user" });
    }
});

userRouter.put('/:id', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "name or email required" });
        }

        const user = await updateUser(req.params.id, { name, email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: " Failed to update user" });
    }
});

userRouter.delete('/:id', async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: " Failed to delete user" });
    }
});

export default userRouter;