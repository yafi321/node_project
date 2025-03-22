import { userModel } from "../Models/user.js"
import { generateToken } from "../utils/jwt.js";

export const getAllusers = async (req, res) => {

    try {
        let data = await userModel.find();
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get all", message: "something worng" });
    }

}

export const getById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await userModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "error canot get user by id", message: "not parameter from this id" });
        
        delete data.password 
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot get by id", message: "something worng" });
    }
}


export const updateById = async (req, res) => {
    let { id } = req.params;

    if (!req.body.userName && !req.body.email)//שדות חובה
        return res.status(404).json({ title: "missing detailes", message: "worng data" });

    if ((req.body.userName && req.body.userName.length < 2 )||(req.body.email && !isValidEmail(req.body.email)) )//בדיקות תקינות
        return res.status(404).json({ title: "wornge userName or email", message: "missing data" });

    if (req.body.password) {//עדכון המשתמש חוץ מסיסמא
        delete req.body.password;
    }
    try {
        let data = await userModel.findByIdAndUpdate(id);
        if (!data)
            return res.status(404).json({ title: "error canot update by id", message: "not parameter from this id" });
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot update by id", message: "something worng" });
    }
}

export const updatePasswordById = async (req, res) => {
    let { id } = req.params;

    if (!req.body.password)//בדיקת שדה חובה
        return res.status(404).json({ title: "missing password", message: "worng data" });

    if (req.body.password.length < 5)//בדיקת תקינות
        return res.status(404).json({ title: "wornge password", message: "missing data" });

    try {
        let password = req.body.password;

        const isUsed = await chackPassword(password);//בדיקה אם לא קיימ כזאת סיסמא במערכת

        if (isUsed) {
            return res.status(400).json({
                title: "password in use",
                message: "This password is already used by another user."
            });
        }

        // עדכן את המשתמש ב-DB
        let data = await userModel.findByIdAndUpdate(
            id,
            { $set: { password } },
            { new: true } // מחזיר את האובייקט המעודכן
        );
        if (!data)
            return res.status(404).json({ title: "error canot update password by id", message: "not parameter from this id" });
        res.json(data);
    }
    catch (err) {
        console.log("err " + err.message);
        res.status(400).json({ title: "error canot update password by id", message: "something worng" });
    }
}

export const addUser = async (req, res) => {
    if (!req.body.userName || !req.body.password || !req.body.email)//שדות חובה
        return res.status(404).json({ title: "missing userName or password or email", message: "missing data" });

    const isUsed = await chackPassword(req.body.password);//בדיקת הסיסמא אם לא קיימת

    if (isUsed) {
        return res.status(400).json({
            title: "password in use",
            message: "This password is already used by another user."
        });
    }

    if (req.body.userName.length < 2 || req.body.password.length < 5 || !isValidEmail(req.body.email))//בדיקות תקינות
        return res.status(404).json({ title: "wornge userName or password or email", message: "missing data" });

    try {
        let newUser = new userModel(req.body);
        newUser.role ="USER"
        newUser.RegistratioDate = new Date();
        let data = await newUser.save();
        res.json(data);

    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot add by id", message: "something worng" });
    }


}

export const loginUser = async (req, res) => {
    const { userName, password } = req.body; // שם משתמש וסיסמה מהבקשה

    // בדיקה אם שם משתמש וסיסמה נשלחו בבקשה
    if (!userName || !password) {
        return res.status(400).json({
            title: "missing credentials",
            message: "username and password are required"
        });
    }

    try {
        // חיפוש המשתמש לפי שם משתמש וסיסמה
        let user = await userModel.findOne({ userName, password }).lean();
        if (!user) {
            return res.status(404).json({
                title: "login failed",
                message: "invalid userName or password"
            });
        }

   
        
       
                let { password: aa, ...other } = user;
                other.token = generateToken(user)
                res.json(other)



        // אם נמצא משתמש, מחזירים את פרטיו
        res.json({
            title: "login successful",
            message: "user authenticated successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role

            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({
            title: "error logging in",
            message: "something went wrong"
        });
    }
};

export const chackPassword = async (newPassword) => {//פונקציית עזר  לבדיקת סיסמא אם לא קיימת כבר במערכת
    try {
        // חפש משתמש עם הסיסמה החדשה
        const user = await userModel.findOne({ password: newPassword });

        // אם נמצא משתמש עם אותה סיסמה, החזר true
        return user !== null;
    } catch (err) {
        console.error("Error checking password:", err.message);
    }

}
function isValidEmail(email) {//בדיקת תקינות למייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

