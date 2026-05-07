import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}