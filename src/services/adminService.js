const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const getUserModel = require("../models/Users");

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

exports.getDashboard = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    throw new Error("Admin not found");
  }

  return {
    success: true,
    message: "Admin dashboard fetched",
    data: admin,
  };
};


exports.createUser = async ({ phone }) => {
  const User = getUserModel();
  if (!User) throw new Error("User model not initialized yet");

  const existing = await User.findOne({ phone });
  if (existing) throw new Error("User already exists");

  const newUser = await User.create({
    phone,
    isRegistered: false,
  });

  return { success: true, message: "User created successfully", data: newUser };
};

exports.deleteUser = async (userId) => {
  const User = getUserModel();
  if (!User) throw new Error("User model not initialized yet");

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new Error("User not found");

  return { success: true, message: "User deleted successfully" };
};