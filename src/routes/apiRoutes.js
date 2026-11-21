const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');
const authController = require('../controllers/authController');
const { uploadSingleMedia } = require('../services/uploadService');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// فحص سلامة النظام
router.get('/health', commonController.healthCheck);

// تغيير لغة الواجهة
router.post('/set-lang', commonController.setLanguage);

// تغيير الثيم اللوني
router.post('/set-theme', commonController.setTheme);

// التحقق من كلمة المرور الرئيسية
router.post('/verify-master-password', authController.verifyMasterPasswordApi);

// الاشتراك في صفحة قريباً
router.post('/subscribe-coming-soon', commonController.subscribeComingSoon);

// رفع وسائط من خلال API (للمسؤولين)
router.post('/upload', isAuthenticated, uploadSingleMedia, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'لم يتم استلام أي ملف' });
  }

  const relativePath = req.file.path
    .replace(/\\/g, '/')
    .split('public')[1];

  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      path: relativePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

module.exports = router;
