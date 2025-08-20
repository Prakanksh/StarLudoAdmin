const adminService = require('../services/adminService');

exports.loginAdmin = async (req) => {
  const result = await adminService.login(req.body);
  return result;
};

exports.getAdminDashboard = async (req) => {
  const result = await adminService.getDashboard(req.admin.id);
  return result;
};

exports.createUser = async (req) => {
  const result = await adminService.createUser(req.body);
  return result;
};

exports.deleteUser = async (req) => {
  const result = await adminService.deleteUser(req.params.id);
  return result;
};

