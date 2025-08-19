const express = require('express');
const {loginAdmin  ,getAdminDashboard , createUser , deleteUser} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/dashboard', protect, getAdminDashboard);

// Admin -> manage users
router.post("/users", protect, createUser);
router.delete("/users/:id", protect, deleteUser);


module.exports = router;
