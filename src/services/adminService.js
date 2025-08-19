const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.login = async ({ email, password }) => {
  // 1. Check if admin exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 3. Generate JWT
  const token = jwt.sign(
    { id: admin._id, email: admin.email }, // payload
    process.env.JWT_SECRET,                // secret
    { expiresIn: "1d" }                    // options
  );

  // 4. Return data to controller
  return {
    success: true,
    message: "Login successful",
    data: { 
      id: admin._id, 
      email: admin.email, 
      token 
    },
  };
};
