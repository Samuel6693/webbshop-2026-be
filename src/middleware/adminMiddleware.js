export function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" }); 
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    next();
}