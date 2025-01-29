import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: Number,
    email: String,
    password: String,
    isAuth: Boolean,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);