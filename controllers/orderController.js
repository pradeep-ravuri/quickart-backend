import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ================= PLACE ORDER (COD) =================
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= ALL ORDERS (ADMIN) =================
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= USER ORDERS =================
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= UPDATE ORDER STATUS (ADMIN) =================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updateData = { status };

    // OPTIONAL: auto-mark COD as paid on delivery
    if (status === "Delivered") {
      updateData.payment = true;
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= PLACEHOLDERS =================
const placeOrderStripe = async (req, res) => {
  res.json({ success: false, message: "Stripe not implemented yet" });
};

const placeOrderRazorpay = async (req, res) => {
  res.json({ success: false, message: "Razorpay not implemented yet" });
};

// ✅ EXPORTS MUST MATCH ROUTES
export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  updateStatus,
  userOrders,
};
