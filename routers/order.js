import { Router } from "express";
import {deleteOrder, addOrder, getAllorders, getOrdersByCustomer, updateStatus} from "../Controllers/order.js"

const orderRouter = Router();
orderRouter.get("/", getAllorders);
orderRouter.get("/:id", getOrdersByCustomer);
orderRouter.delete("/:id", deleteOrder);
orderRouter.put("/:id", updateStatus);
orderRouter.post("/", addOrder);

export default orderRouter;