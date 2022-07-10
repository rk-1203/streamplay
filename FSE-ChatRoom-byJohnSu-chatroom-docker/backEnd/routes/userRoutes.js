import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    authUser,
} from "../controllers/userControllers.js";
import { validUser } from "../middlewares/validateUserMiddlewares.js";
const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(validUser, logoutUser);
userRouter.route("/verify").post(validUser, authUser);

export default userRouter;
