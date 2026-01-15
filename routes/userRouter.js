import express from "express";
import { createUser, deleteUser, loginUser, updateUser } from "../controllers/userController.js";
import authenticateUser from "../middleware/userAuthenticator.js";

const userRouter = express.Router();

userRouter.post("/", authenticateUser, createUser);
userRouter.post("/login", authenticateUser, loginUser);
userRouter.delete("/", authenticateUser, deleteUser);
userRouter.put("/", authenticateUser, updateUser);

export default userRouter;
