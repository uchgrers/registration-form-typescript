import jwt from "jsonwebtoken";
import { users, addUser, findUserByEmail } from "./data";

const JWT_SECRET = "jwt_secret";

export default function handler(req, res) {
    if (req.method === "POST") {
        const { type, email, password } = req.body;

        if (type === "register") {
            if (findUserByEmail(email)) {
                return res.status(400).json({ message: "Email already taken" });
            }

            const newUser = {
                userId: users.length + 1,
                email,
                password,
                isAuth: true
            };

            addUser(newUser);

            const token = jwt.sign({ userId: newUser.userId, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

            res.setHeader("Set-Cookie", `auth_token=${token}; HttpOnly; Path=/`);
            return res.json({ message: "User registered", user: newUser });
        }

        if (type === "login") {
            const user = findUserByEmail(email);

            if (!user || user.password !== password) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

            res.setHeader("Set-Cookie", `auth_token=${token}; HttpOnly; Path=/`);
            return res.json({ message: "Login successful", user });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}