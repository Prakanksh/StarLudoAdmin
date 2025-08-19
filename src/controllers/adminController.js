const adminService = require('../services/adminService');

exports.loginAdmin = async (req, res) => {
  try {
    const result = await adminService.login(req.body);
    res.json(result); // service now returns token too
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
