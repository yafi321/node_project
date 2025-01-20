import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    role: String,
    RegistratioDate: Date,


})
export const userModel = mongoose.model("user", userSchema);