import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers["x-access-token"];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};
//# sourceMappingURL=authenticateToken.js.map