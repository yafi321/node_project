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

    if (!Object.keys(req.body).length) {//בדיקה שיש שדה כלשהוא בBODY לעדכון
        return res.status(404).json({
            title: "Missing details",
            message: "At least one field is required to update",
        });
    }
    if ((req.body.name&&req.body.name.length < 2 )|| (req.body.price &&req.body.price < 1))//בדיקות תקינות
    return res.status(404).json({ title: "wornge name or price", message: "missing data" });

    try {
        let data = await productModel.findByIdAndUpdate(id,
            req.body, 
            { new: true }) ;
        if (!data)
            return res.status(404).json({ title: "error canot update by id", message: "not parameter from this id" });
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot update by id", message: "something worng" });
    }
}

export const add = async (req, res) => {
    if (!req.body.name || !req.body.price||!req.body.description||!req.body.ProductioDate||!req.body.url||!req.body.colors)//שדות חובה
        return res.status(404).json({ title: "missing data", message: "missing name or price or description or ProductioDate or url or colors" });
    if (req.body.name.length < 2 || req.body.price <= 0)//בדיקות תקינות
        return res.status(404).json({ title: "wornge name or price", message: "missing data" });
    try {
        let newProde = new productModel(req.body);
        let data = await newProde.save();
        res.json(data);

    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot add by id", message: "something worng" });
    }


}


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



