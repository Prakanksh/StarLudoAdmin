const express = require('express');
const {loginAdmin  ,getAdminDashboard } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/dashboard', protect, getAdminDashboard);
module.exports = router;
