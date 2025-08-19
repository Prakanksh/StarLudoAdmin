const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const resMessage = {
  INVALID_CREDENTIALS: "Invalid email or password",
  LOGIN_SUCCESS: "Login successful",
  ADMIN_NOT_FOUND: "Admin not found",
  DASHBOARD_FETCHED: "Admin dashboard fetched",
  USER_MODEL_NOT_INITIALIZED: "User model not initialized yet",
  USER_EXISTS: "User already exists",
  USER_CREATED: "User created successfully",
  USER_NOT_FOUND: "User not found",
  USER_DELETED: "User deleted successfully",
  USER_UPDATED : "User updated successfully",
  USER_BANNED : "User has been banned",
  USER_UNBANNED : "User has been unbanned",
  KYC_UPDATED : "KYC status updated successfully"
};

module.exports = { statusCode, resMessage };
