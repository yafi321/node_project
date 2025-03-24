import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
    let token = jwt.sign({
        userId: user._id,
        username: user.username,
        role: user.role
    }, process.env.SECRET_KEY, { expiresIn: "24h" })

    return token;
}
