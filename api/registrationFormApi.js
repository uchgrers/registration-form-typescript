import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const redis = new Redis(process.env.REDIS_URL);
const JWT_SECRET = "jwt_secret";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "https://registration-form-typescript.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        if (req.body.type === 'register' || req.body.type === 'login') {
            return handleAuth(req, res);
        } else {
            return handleLogout(req, res);
        }
    } else if (req.method === 'GET') {
        return handleGetUsers(req, res);
    }

    res.status(404).json({ message: "Not Found" });
}

async function handleAuth(req, res) {
    const { type, email, password } = req.body;

    let users = JSON.parse(await redis.get("users")) || [];

    if (type === "register") {
        if (users.find(u => u.email === email)) {
            return res.json({
                statusCode: 1,
                messages: ["Email is already taken"]
            });
        }

        const newUser = { userId: users.length + 1, email, password, isAuth: true };
        users.push(newUser);
        await redis.set("users", JSON.stringify(users));

        const token = jwt.sign({ userId: newUser.userId, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

        res.setHeader("Set-Cookie", serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/"
        }));

        return res.json({
            userData: {
                userId: newUser.userId,
                email: newUser.email,
                isAuth: true,
            },
            statusCode: 0
        });
    }

    if (type === "login") {
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.json({
                statusCode: 1,
                messages: ["Invalid email or password"]
            });
        }

        const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.setHeader("Set-Cookie", serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/"
        }));

        return res.json({
            userData: {
                userId: user.userId,
                email: user.email,
                isAuth: true,
            },
            statusCode: 0
        });
    }
}

async function handleLogout(req, res) {
    let users = JSON.parse(await redis.get("users")) || [];
    const { userId } = req.body;
    const user = users.find(u => u.userId === userId);

    if (user) {
        user.isAuth = false;
        await redis.set("users", JSON.stringify(users));
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

async function handleGetUsers(req, res) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = JSON.parse(await redis.get("users")) || [];

        const currentUser = users.find(u => u.userId === decoded.userId);

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