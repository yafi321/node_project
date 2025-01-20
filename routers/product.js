import { Router } from "express";
import {add, deleteById,getAllProducts,getById,updateById} from "../Controllers/product.js"

const productRouter = Router();
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getById);
productRouter.delete("/:id", deleteById);
productRouter.put("/:id", updateById);
productRouter.post("/", add);

export default productRouter;