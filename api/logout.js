import dbConnect from "./../database/db";
import User from "./../database/models/User";
import cookie from "cookie";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({ userId });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.isAuth = false;
    await user.save();

    res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: -1,
            path: "/",
        })
    );

    return res.json({ message: "Logout successful" });
}