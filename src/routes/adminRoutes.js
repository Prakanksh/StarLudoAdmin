const express = require('express');
const { loginAdmin, getAdminDashboard, createUser, deleteUser , getUserById , getAllUsers , banUnbanUser ,updateUser , verifyKYC} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { responseHandler } = require('../utils/responseHandler');

const router = express.Router();

router.post('/login', responseHandler(loginAdmin));
router.get('/dashboard', protect, responseHandler(getAdminDashboard));

// Admin -> manage users
router.post("/users", protect, responseHandler(createUser));
router.delete("/users/:id", protect, responseHandler(deleteUser));
router.get("/users/:id", protect, responseHandler(getUserById));
router.get("/users", protect, responseHandler(getAllUsers));
router.patch("/users/:id/ban", protect, responseHandler(banUnbanUser));
router.put("/users/:id", protect, responseHandler(updateUser));
router.patch("/users/:id/kyc", protect, responseHandler(verifyKYC));

module.exports = router;
