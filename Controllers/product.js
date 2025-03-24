import {productModel } from "../Models/product.js"

export const getAllProducts = async (req, res) => {
    let limit = req.query.limit || 20;
    let page = req.query.page || 1;

    try {
        let data = await productModel.find().skip((page-1)*limit).limit(limit);
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
        let data = await productModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "error canot get product by id", message: "not parameter from this id" });
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot get by id", message: "something worng" });
    }
}
export const deleteById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await productModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ title: "error canot delete by id", message: "not parameter from this id" });
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot delete by id", message: "something worng" });
    }
}

export const updateById = async (req, res) => {
    let { id } = req.params;

    if (!Object.keys(req.body).length && !req.file) { // בדיקה אם יש שדה ב-req.body או תמונה ב-req.file
        return res.status(404).json({
            title: "Missing details",
            message: "At least one field or image is required to update",
        });
    }

    if ((req.body.name && req.body.name.length < 2) || (req.body.price && req.body.price < 1)) { // בדיקות תקינות
        return res.status(404).json({ title: "wrong name or price", message: "Missing or invalid data" });
    }

    try {
        // אם הועלתה תמונה חדשה, נוסיף את ה-URL שלה
        if (req.file) {
            req.body.url = req.file.originalname;
        }

        let data = await productModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ title: "Error", message: "No product found with this ID" });
        }

        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "Error", message: "Something went wrong" });
    }
};

export const add = async (req, res) => {
    try {
        let originalFileName = req.file?.originalname; // שם הקובץ שהועלה

        if (!req.body.name || !req.body.price || !req.body.description || !req.body.ProductioDate || !req.body.colors) {
            return res.status(400).json({ title: "missing data", message: "Missing required fields" });
        }

        if (req.body.name.length < 2 || req.body.price <= 0) {
            return res.status(400).json({ title: "Invalid name or price", message: "Check input values" });
        }

        // יצירת המוצר ושמירת ה-URL החדש של התמונה
        let newProduct = new productModel({
            ...req.body,
            url: originalFileName // הוספת שם הקובץ לשדה ה-URL
        });

        let data = await newProduct.save();
        res.json(data);

    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ title: "Error", message: "Something went wrong" });
    }
};



export const getTotalPages = async (req, res)=>{
    try{
        let limit = parseInt(req.query.limit) || 20; // ברירת מחדל 20 אם לא נשלח
        let count = await productModel.countDocuments(); // סופר את כל המוצרים
        let totalPages = Math.ceil(count / limit); // מחשב כמה עמודים יש

        res.json({ totalPages });
    }
    catch(err){
        console.log("Error:", err);
        res.status(500).json({ message: "Error calculating total pages" });
    }
}



