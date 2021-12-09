import express from "express";
import {
  editUser,
  deleteUser,
  seeUser,
  logoutUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", seeUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);

export default userRouter;
