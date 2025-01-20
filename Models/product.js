import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    ProductioDate: Date,
    url: String,
    price: Number,
    colors: [String],
    stock: Number,



})
export const productModel = mongoose.model("product", productSchema);