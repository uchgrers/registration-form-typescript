import { serialize } from "cookie";
import { users } from "../data";

if (!globalThis.users) {
    globalThis.users = []; // Инициализируем пользователей глобально
}

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { userId } = req.body;
    const user = users.find(u => u.userId === userId);

    if (user) {
        user.isAuth = false;
    }

    res.setHeader("Set-Cookie", serialize("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1,
        path: "/"
    }));

    return res.json({ message: "Logout successful" });
}