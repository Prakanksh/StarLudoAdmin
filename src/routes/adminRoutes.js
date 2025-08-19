const express = require('express');
const { loginAdmin, getAdminDashboard, createUser, deleteUser , updateUser , banUnbanUser , verifyKYC} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { responseHandler } = require('../utils/responseHandler');

const router = express.Router();

router.post('/login', responseHandler(loginAdmin));
router.get('/dashboard', protect, responseHandler(getAdminDashboard));

// Admin -> manage users
router.post("/users", protect, responseHandler(createUser));
router.delete("/users/:id", protect, responseHandler(deleteUser));
// router.put("/users/:id", protect, responseHandler(updateUser)); 
// router.patch("/users/:id/ban", protect, responseHandler(banUnbanUser)); 
// router.patch("/users/:id/kyc", protect, responseHandler(verifyKYC)); 


module.exports = router;
