const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Allow ALL origins, ALL IPs, ALL headers
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*'] // allow all headers
}));

// Routes
app.use('/api/admin', adminRoutes);

module.exports = app;
