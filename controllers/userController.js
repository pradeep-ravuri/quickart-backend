import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ---------------- JWT ----------------
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------- EMAIL CONFIG ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASSWORD, // app password
  },
});

// ---------------- PASSWORD LOGIN ----------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ---------------- REGISTER ----------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- SEND OTP ----------------
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    let user = await userModel.findOne({ email });

    // Auto-create user if not exists
    if (!user) {
      user = await userModel.create({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await transporter.sendMail({
      from: `"QuicKart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your QuicKart Login OTP",
      html: `
        <h2>QuicKart Login OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- VERIFY OTP ----------------
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.otp) {
      return res.json({ success: false, message: "OTP not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN LOGIN ----------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, sendOtp, verifyOtp };
