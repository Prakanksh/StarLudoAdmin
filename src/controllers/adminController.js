const adminService = require('../services/adminService');

exports.loginAdmin = async (req, res) => {
  try {
    const result = await adminService.login(req.body);
    res.json(result); // service now returns token too
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const result = await adminService.getDashboard(req.admin.id); // req.admin set in middleware
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};