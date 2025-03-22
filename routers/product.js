import { Router } from "express";
import {add, deleteById,getAllProducts,getById,updateById, getTotalPages} from "../Controllers/product.js"
import { check } from "../Middlewares/check.js";

const productRouter = Router();
productRouter.get("/", getAllProducts);
productRouter.get("/totalPages", getTotalPages);
productRouter.get("/:id", getById);
productRouter.delete("/:id",check, deleteById);
productRouter.put("/:id",check, updateById);
productRouter.post("/",check, add);


export default productRouter;