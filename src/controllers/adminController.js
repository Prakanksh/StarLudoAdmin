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
    const result = await adminService.getDashboard(req.admin.id); 
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const result = await adminService.createUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};