import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authMiddleware(req, res, next) {
    try {

        // Check for the presence of the Authorization header and validate its format
        const authHeader = req.headers.authorization;

        // The header should be in the format "Bearer <token>"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Extract the token from the header
        const token = authHeader.split(" ")[1];

        // Verify the token and decode its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token's userId and exclude the password field
        const user = await User.findById(decoded.userId).select("-password");

        // If no user is found, return an unauthorized error
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach the user object to the request for use in subsequent middleware or route handlers
        req.user = user;
        next();

    // Handle any errors that occur during token verification or user retrieval
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}