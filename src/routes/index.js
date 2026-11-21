const express = require('express');
const router = express.Router();

const publicRoutes = require('./publicRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const apiRoutes = require('./apiRoutes');

// ربط المسارات المنظمة
router.use('/admin', authRoutes);
router.use('/admin', adminRoutes);
router.use('/api', apiRoutes);
router.use('/', publicRoutes);

module.exports = router;
