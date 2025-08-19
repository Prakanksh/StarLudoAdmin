const express = require('express');
const { loginAdmin, getAdminDashboard, createUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { responseHandler } = require('../utils/responseHandler');

const router = express.Router();

router.post('/login', responseHandler(loginAdmin));
router.get('/dashboard', protect, responseHandler(getAdminDashboard));

// Admin -> manage users
router.post("/users", protect, responseHandler(createUser));
router.delete("/users/:id", protect, responseHandler(deleteUser));

module.exports = router;
