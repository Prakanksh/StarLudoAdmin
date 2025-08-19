const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', adminRoutes);

module.exports = app;
