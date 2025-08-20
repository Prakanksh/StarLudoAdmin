const express = require('express');
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { responseHandler } = require('../utils/responseHandler');

const router = express.Router();

router.post('/login', responseHandler(adminController.loginAdmin));
router.get('/dashboard', protect, responseHandler(adminController.getAdminDashboard));

// Admin -> manage users
router.post("/users", protect, responseHandler(adminController.createUser));
router.delete("/users/:id", protect, responseHandler(adminController.deleteUser));
router.get("/users/:id", protect, responseHandler(adminController.getUserById));
router.get("/users", protect, responseHandler(adminController.getAllUsers));
router.patch("/users/:id/ban", protect, responseHandler(adminController.banUnbanUser));
router.put("/users/:id", protect, responseHandler(adminController.updateUser));
router.patch("/users/:id/kyc", protect, responseHandler(adminController.verifyKYC));

module.exports = router;
