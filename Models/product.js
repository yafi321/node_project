import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    ProductioDate: Date,
    url: String,
    price: Number,
    colors: [String],
    



})
export const productModel = mongoose.model("product", productSchema);