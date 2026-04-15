import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectroute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/profile-update", protectroute, updateProfile);
// alias: client expects /update-profile
userRouter.put("/update-profile", protectroute, updateProfile);
userRouter.get("/check", protectroute, checkAuth);

export default userRouter;