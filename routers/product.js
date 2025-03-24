import { Router } from "express";
import {add, deleteById,getAllProducts,getById,updateById, getTotalPages} from "../Controllers/product.js"
import { check ,checkManager,} from "../Middlewares/check.js";
import uploadImage from "../Middlewares/files.js";

const productRouter = Router();
productRouter.get("/", getAllProducts);
productRouter.get("/totalPages", getTotalPages);
productRouter.get("/:id", getById);
productRouter.delete("/:id",checkManager, deleteById);
productRouter.put("/:id",checkManager,uploadImage, updateById);
productRouter.post("/",checkManager,uploadImage, add);


export default productRouter;