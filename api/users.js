import dbConnect from "./../database/db";
import User from "./../database/models/User";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = "jwt_secret";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUser = await User.findOne({ userId: decoded.userId });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const users = await User.find({}, "userId email isAuth");

        return res.json({
            message: "Users fetched successfully",
            user: { userId: currentUser.userId, email: currentUser.email },
            users,
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}