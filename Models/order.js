import mongoose from "mongoose";

const miniProductShema = mongoose.Schema({
    prodName: String,
    prodPrice: Number,
    cnt: Number,

})


const orderSchema = mongoose.Schema({
    orderDate: Date,
    Deadline: Date,
    address: String,
    custId: String,
    products: [miniProductShema] ,
    isGoToTheWay: Boolean,
    orderPrice: Number,
    finalPrice: Number,


})
export const orderModel = mongoose.model("order", orderSchema);