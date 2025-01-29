import dbConnect from "./../database/db";
import User from "./../database/models/User";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "POST") {
        const { type, email, password } = req.body;

        if (type === "register") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already taken" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                userId: Date.now(),
                email,
                password: hashedPassword,
                isAuth: true,
            });

            return res.json({ message: "User registered successfully", user: newUser });
        }

        if (type === "login") {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            return res.json({ message: "Login successful", user });
        }
    }
}