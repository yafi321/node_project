import { Router } from "express";
import {add, deleteById,getAllProducts,getById,updateById, getTotalPages} from "../Controllers/product.js"

const productRouter = Router();
productRouter.get("/", getAllProducts);
productRouter.get("/totalPages", getTotalPages);
productRouter.get("/:id", getById);
productRouter.delete("/:id", deleteById);
productRouter.put("/:id", updateById);
productRouter.post("/", add);


export default productRouter;