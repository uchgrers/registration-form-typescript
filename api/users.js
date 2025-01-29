import jwt from "jsonwebtoken";
import cookie from "cookie";
import { users } from "./data";

const JWT_SECRET = "jwt_secret";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const token = req.cookies.auth_token;

    if (!auth_token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(auth_token, JWT_SECRET);
        const currentUser = users.find((u) => u.userId === decoded.userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "Users fetched successfully",
            user: { userId: currentUser.userId, email: currentUser.email },
            users: users.map(user => ({ userId: user.userId, email: user.email }))
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}