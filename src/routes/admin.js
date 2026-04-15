import { Router } from "express";
import { getAllOrders, updateOrderStatusById, updateOrderById, deleteOrderById } from "../db/order.js";
import { getAllUsers, findSafeUserByEmail, getUserById, updateUser, deleteUser} from "../db/users.js";
import { createProduct, updateProductById, deleteProductById } from "../db/products.js";
import { createVariant, updateVariantStock, deleteVariant } from "../db/variant.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware); // Apply authentication and admin middleware to all routes in this router

//Get all orders - Admin only
adminRouter.get("/orders", async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

//Update order status - Admin only
adminRouter.put("/orders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        if (!["pending", "confirmed", "shipped"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedOrder = await updateOrderStatusById(req.params.id, status);

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Failed to update order status" });
    }
});


//Update order info - Admin only
adminRouter.put("/orders/:id", async (req, res) => {
    try {
        const { user, status } = req.body;

        const updateData = {};

        if (user) {
        if (user.name) updateData["user.name"] = user.name;
        if (user.email) updateData["user.email"] = user.email;

        if (user.address) {
            if (user.address.name) updateData["user.address.name"] = user.address.name;
            if (user.address.street) updateData["user.address.street"] = user.address.street;
            if (user.address.city) updateData["user.address.city"] = user.address.city;
            if (user.address.postalCode) updateData["user.address.postalCode"] = user.address.postalCode;
            if (user.address.country) updateData["user.address.country"] = user.address.country;
        }
    }

        if (status) {
            if (!["pending", "confirmed", "shipped"].includes(status)) {
                return res.status(400).json({ error: "Invalid status value" });
            }

            updateData.status = status;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const updatedOrder = await updateOrderById(req.params.id, updateData);

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({
            message: "Order updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
});


//Delete order - Admin only
adminRouter.delete("/orders/:id", async (req, res) => {
    try {
        const deletedOrder = await deleteOrderById(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Failed to delete order" });
    }
});


//Get all users - Admin only
adminRouter.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//Get user by email - Admin only
adminRouter.get('/users/email/:email', async (req, res) => {
    try {
        const user = await findSafeUserByEmail(req.params.email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

//Get user by ID - Admin only
adminRouter.get('/users/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

//Update user by ID - Admin only
adminRouter.put('/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const user = await updateUser(req.params.id, { name, email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

//Delete user by ID - Admin only
adminRouter.delete('/users/:id', async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

//Post new product - Admin only
adminRouter.post("/products", async (req, res) => {
  try {
    const {name, description, price, image, dropDate, status} = req.body;

    if (!name || !description || !image || !dropDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (price == null || price < 0) {
      return res.status(400).json({ error: "Price must be 0 or higher" });
    }

    if (status && !["upcoming", "live", "sold_out"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      message: "Failed to create product",
      error: error.message});
  }
});

//Put update product - Admin only
adminRouter.put("/products/:id", async (req, res) => {
  try {
    const { name, description, price, image, dropDate, status } = req.body;

    if (!name || !description || !image || !dropDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (price == null || price < 0) {
      return res.status(400).json({ error: "Price must be 0 or higher" });
    }

    if (status && !["upcoming", "live", "sold_out"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedProduct = await updateProductById(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});

//Delete product - Admin only
adminRouter.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});

//Post new variant - Admin only
adminRouter.post("/variants", async (req, res) => {
  try {
    const { productId, size, stock } = req.body;

    if (!productId || size == null) {
      return res.status(400).json({ error: "productId and size are required" });
    }

    if (stock != null && stock < 0) {
      return res.status(400).json({ error: "Stock must be 0 or higher" });
    }

    const newVariant = await createVariant({
      productId,
      size,
      stock,
    });

    res.status(201).json(newVariant);
  } catch (error) {
    console.error("Error creating variant:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Variant already exists for this product and size" });
    }

    res.status(500).json({
      error: "Failed to create variant",
      message: error.message,
    });
  }
});

//Put update variant stock - Admin only
adminRouter.put("/variants/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock == null || stock < 0) {
      return res.status(400).json({ error: "Stock must be 0 or higher" });
    }

    const updatedVariant = await updateVariantStock(req.params.id, stock);

    if (!updatedVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json(updatedVariant);
  } catch (error) {
    console.error("Error updating variant stock:", error);
    res.status(500).json({
      error: "Failed to update variant stock",
      message: error.message,
    });
  }
});

//Delete variant - Admin only
adminRouter.delete("/variants/:id", async (req, res) => {
  try {
    const deletedVariant = await deleteVariant(req.params.id);

    if (!deletedVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({
      message: "Failed to delete variant",
      error: error.message,
    });
  }
});

export default adminRouter;