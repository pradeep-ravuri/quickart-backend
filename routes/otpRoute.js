import express from "express";
import { sendOtp, verifyOtp } from "../controllers/userController.js";

const otpRouter = express.Router();

// Send OTP to email
otpRouter.post("/send-otp", sendOtp);

// Verify OTP
otpRouter.post("/verify-otp", verifyOtp);

export default otpRouter;
