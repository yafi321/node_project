import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

export function check(req, res, next) {
    let token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ title: "user unauthorized", messgae: "ראשית בצע כניסה" })
    try {

        let result = jwt.verify(token, process.env.SECRET_KEY);
        req.user = result;
        next()
    }
    catch (err) {
        return res.status(401).json({ title: "user unauthorized", messgae: err.message })
    }
}

export function checkManager(req, res, next) {
    let token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ title: "user unauthorized", messgae: "ראשית בצע כניסה" })
    try {

        let result = jwt.verify(token, process.env.SECRET_KEY);
        req.user = result;
        if (result.role == "MANAGER")
            next()
        return res.status(403).json({ title: "user unauthorized", messgae: "אין לך הרשאה" })
    }
    catch (err) {
        return res.status(401).json({ title: "user unauthorized", messgae: err.message })
    }
}
