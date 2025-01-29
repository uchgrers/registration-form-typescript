import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { users } from "./data";

const JWT_SECRET = "jwt_secret";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.json({
            statusCode: 1,
            messages: ["Method Not Allowed"]
        })
    }

    const { type, email, password } = req.body;

    if (type === "register") {
        if (users.find((u) => u.email === email)) {
            return res.status(400).json({
                statusCode: 1,
                messages: ["Email is already taken"]
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            userId: users.length + 1,
            email,
            password: hashedPassword,
            isAuth: true
        };
        users.push(newUser);

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
        const user = users.find((u) => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
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

    res.status(400).json({ message: "Invalid request type" });
}