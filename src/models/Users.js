const mongoose = require("mongoose");
const connectUsersDB = require("../config/dbUsers");

const userConnection = connectUsersDB();

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    otp: { type: String },
    otpExpire: { type: Date },
    isRegistered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Attach model to user DB connection
let User;
userConnection.then((conn) => {
  User = conn.model("User", userSchema, "users"); // 👈 force collection = "users"
});

module.exports = () => User;
