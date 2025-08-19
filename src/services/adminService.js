const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const getUserModel = require("../models/Users");
const { statusCode, resMessage } = require("../config/constants");

exports.login = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error(resMessage.INVALID_CREDENTIALS);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error(resMessage.INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    status: statusCode.OK,
    message: resMessage.LOGIN_SUCCESS,
    data: { id: admin._id, email: admin.email, token },
  };
};

exports.getDashboard = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    throw new Error(resMessage.ADMIN_NOT_FOUND);
  }

  return {
    success: true,
    status: statusCode.OK,
    message: resMessage.DASHBOARD_FETCHED,
    data: admin,
  };
};

exports.createUser = async ({ phone }) => {
  const User = getUserModel();
  if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

  const existing = await User.findOne({ phone });
  if (existing) throw new Error(resMessage.USER_EXISTS);

  const newUser = await User.create({
    phone,
    isRegistered: false,
  });

  return {
    success: true,
    status: statusCode.CREATED,
    message: resMessage.USER_CREATED,
    data: newUser,
  };
};

exports.deleteUser = async (userId) => {
  const User = getUserModel();
  if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new Error(resMessage.USER_NOT_FOUND);

  return {
    success: true,
    status: statusCode.OK,
    message: resMessage.USER_DELETED,
  };
};
