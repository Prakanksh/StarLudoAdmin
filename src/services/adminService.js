const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const getUserModel = require("../models/Users");
const { statusCode, resMessage } = require("../config/constants");
const { verifyEKYC, maskAadhaar } = require("../utils/ekycUtils");

exports.login = async ({ email, password }) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return {
        status: statusCode.UNAUTHORIZED,
        success: false,
        message: resMessage.INVALID_CREDENTIALS
      };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return {
        status: statusCode.UNAUTHORIZED,
        success: false,
        message: resMessage.INVALID_CREDENTIALS
      };
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
      data: { id: admin._id, email: admin.email, token }
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.getDashboard = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.ADMIN_NOT_FOUND
      };
    }

    return {
      success: true,
      status: statusCode.OK,
      message: resMessage.DASHBOARD_FETCHED,
      data: admin
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.createUser = async ({ phone }) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const existing = await User.findOne({ phone });
    if (existing) {
      return {
        status: statusCode.CONFLICT,
        success: false,
        message: resMessage.USER_EXISTS
      };
    }

    const newUser = await User.create({ phone, isRegistered: false });

    return {
      success: true,
      status: statusCode.CREATED,
      message: resMessage.USER_CREATED,
      data: newUser
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.deleteUser = async (userId) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.USER_NOT_FOUND
      };
    }

    return {
      success: true,
      status: statusCode.OK,
      message: resMessage.USER_DELETED
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.getUserById = async (userId) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const user = await User.findById(userId);
    if (!user) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.USER_NOT_FOUND
      };
    }

    return {
      success: true,
      status: statusCode.OK,
      message: resMessage.USER_FETCHED,
      data: user
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.getAllUsers = async () => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const users = await User.find();
    return {
      success: true,
      status: statusCode.OK,
      message: resMessage.USERS_FETCHED,
      data: users
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.banUnbanUser = async (userId, isBanned) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const user = await User.findById(userId);
    if (!user) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.USER_NOT_FOUND
      };
    }

    user.isBanned = isBanned;
    await user.save();

    return {
      success: true,
      status: statusCode.OK,
      message: isBanned ? resMessage.USER_BANNED : resMessage.USER_UNBANNED,
      data: user
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const user = await User.findById(userId);
    if (!user) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.USER_NOT_FOUND
      };
    }

    const fieldsToUpdate = [
      "fullName",
      "dob",
      "gender",
      "aadhaarNumber",
      "address",
      "email"
    ];

    for (const field of fieldsToUpdate) {
      if (userData[field] !== undefined) {
        if (field === "aadhaarNumber") {
          const existing = await User.findOne({ aadhaarNumber: userData.aadhaarNumber, _id: { $ne: userId } });
          if (existing) {
            return {
              success: false,
              status: statusCode.CONFLICT,
              message: "Aadhaar number already exists for another user"
            };
          }
        }
        user[field] = userData[field];
      }
    }

    await user.save();

    return {
      success: true,
      status: statusCode.OK,
      message: resMessage.USER_UPDATED,
      data: user
    };
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};

exports.verifyUserKYC = async (userId) => {
  try {
    const User = getUserModel();
    if (!User) throw new Error(resMessage.USER_MODEL_NOT_INITIALIZED);

    const user = await User.findById(userId);
    if (!user) {
      return {
        status: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.USER_NOT_FOUND
      };
    }

    if (!user.aadhaarNumber || !user.fullName || !user.dob) {
      return {
        status: statusCode.BAD_REQUEST,
        success: false,
        message: "User must have Aadhaar number, full name, and DOB to verify KYC"
      };
    }

    // Check if KYC is already verified
    if (user.kycStatus === "Active") {
      return {
        status: statusCode.BAD_REQUEST,
        success: false,
        message: "KYC is already verified for this user",
        data: { ...user.toObject(), aadhaarNumber: maskAadhaar(user.aadhaarNumber) }
      };
    }

    // Call eKYC API
    const ekycResult = await verifyEKYC(user.aadhaarNumber, user.fullName, user.dob);

    if (ekycResult.success) {
      user.kycStatus = "Active";
      await user.save();

      return {
        status: statusCode.OK,
        success: true,
        message: resMessage.KYC_UPDATED,
        data: { ...user.toObject(), aadhaarNumber: maskAadhaar(user.aadhaarNumber) }
      };
    } else {
      user.kycStatus = "Rejected";
      await user.save();

      return {
        status: statusCode.BAD_REQUEST,
        success: false,
        message: ekycResult.message || "KYC verification failed",
        data: { ...user.toObject(), aadhaarNumber: maskAadhaar(user.aadhaarNumber) }
      };
    }
  } catch (error) {
    return {
      status: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error
    };
  }
};
