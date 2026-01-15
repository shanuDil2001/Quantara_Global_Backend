import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/", deleteUser);
userRouter.put("/", updateUser);

export default userRouter;
