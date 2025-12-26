import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  allOrders,
  userOrders,
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

// Payment placeholders
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

export default orderRouter;
