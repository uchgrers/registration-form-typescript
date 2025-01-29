import jwt from "jsonwebtoken";
import { users } from "./data";

const JWT_SECRET = "jwt_secret";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ users });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}