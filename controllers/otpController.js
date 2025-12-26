import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendOtpEmail from "../config/mailer.js";

// 🔹 SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({ email, name });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || !user.otp || !user.otpExpiry) {
      return res.json({ success: false, message: "Invalid request" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
