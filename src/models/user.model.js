import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, min: 6, require: true },
    role: { type: String, enum: ["member", "admin"], default: "member" },
});

const UserModel = mongoose.model("Users", User);

export default UserModel;
