const mongoose = require("mongoose");

const connectUsersDB = async () => {
  try {
    if (!process.env.USERS_MONGO_URI) {
      throw new Error("USERS_MONGO_URI is not defined in .env");
    }

    const conn = await mongoose.createConnection(process.env.USERS_MONGO_URI);
    console.log(`✅ Users MongoDB Connected: ${conn.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Users MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectUsersDB;
