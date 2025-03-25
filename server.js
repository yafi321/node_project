import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import { connectToDB } from "./config/DB.js";
import orderRouter from "./routers/order.js"
import productRouter from "./routers/product.js"
import userRouter from "./routers/user.js"


dotenv.config();
connectToDB();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/staticFile', express.static('staticFile'));


app.use("/api/furniture", productRouter)
app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)

let port = process.env.PORT;
app.listen(port, '0.0.0.0',()=>{
    console.log("app is runinig in port: "+port)
})