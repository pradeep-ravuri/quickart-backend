import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional now (OTP users may not have password)

    cartData: { type: Object, default: {} },

    // 🔐 OTP AUTH
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
