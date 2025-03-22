import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    let token = jwt.sign({
        userId: user._id,
        username: user.username,
        role: user.role
    }, process.env.SECRET_KEY, { expiresIn: 3 * 60 })

    return token;
}
