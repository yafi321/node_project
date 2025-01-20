import { Router } from "express";
import {getAllusers, getById, addUser, loginUser, updateById,updatePasswordById
} from "../Controllers/user.js"


const userRouter = Router();
userRouter.get("/", getAllusers);
userRouter.get("/:id", getById);
userRouter.post("/register", addUser);
userRouter.put("/:id", updateById);
userRouter.put("/password/:id", updatePasswordById);
userRouter.post("/login", loginUser);

export default userRouter;