import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin role
    if (!decoded || decoded.role !== "admin") {
      return res.json({
        success: false,
        message: "Not Authorized, login again",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
