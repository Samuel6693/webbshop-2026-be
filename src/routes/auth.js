import { Router } from "express";
import bcrypt from "bcrypt"; 
import { createUser, findUserByEmail, getUserById, getUserWishlist, addToWishlist, removeFromWishlist } from "../db/users.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";
import "dotenv/config";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await createUser({ name, email, password });
    
        const accessToken = jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
    
        const refreshToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    
    const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const accessToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });  

  } catch (error) {
    return res.status(500).json({ error: "Login failed" })
  }
  
});

// Endpoint to refresh access token using a valid refresh token
authRouter.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      accessToken
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// Protected route to get current user info
authRouter.get("/me", authMiddleware, async (req, res) => {
  return res.status(200).json({
    user: req.user
  });
});


export default authRouter;
