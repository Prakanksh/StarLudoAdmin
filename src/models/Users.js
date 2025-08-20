const mongoose = require("mongoose");
const connectUsersDB = require("../config/dbUsers");

const userConnection = connectUsersDB();

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    otp: { type: String },
    otpExpire: { type: Date },
    isRegistered: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    fullName: { type: String },         
    dob: { type: Date },                
    gender: { type: String },           
    aadhaarNumber: { type: String },    
    address: { type: String },        
    email: { type: String },            
    kycStatus: { 
      type: String, 
      enum: ["Pending", "Active" , "Rejected"], 
      default: "Pending" 
    } 
  },
  { timestamps: true }
);

// Attach model to user DB connection
let User;
userConnection.then((conn) => {
  User = conn.model("User", userSchema, "users"); 
});

module.exports = () => User;
