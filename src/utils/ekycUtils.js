const axios = require("axios");

exports.verifyEKYC = async (aadhaarNumber, fullName, dob) => {
  try {
    const response = await axios.post(
      process.env.EKYC_API_URL,
      { aadhaarNumber, fullName, dob },
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.EKYC_CLIENT_ID,
          "Client-Secret": process.env.EKYC_CLIENT_SECRET
        }
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

exports.maskAadhaar = (aadhaarNumber) => {
  if (!aadhaarNumber || aadhaarNumber.length !== 12) return aadhaarNumber;
  return "********" + aadhaarNumber.slice(-4);
};