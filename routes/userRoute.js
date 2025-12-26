import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const userRouter = express.Router();

/* ---------------- PASSWORD AUTH (existing) ---------------- */
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

/* ---------------- OTP AUTH (new) ---------------- */
userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);

export default userRouter;
