const path = require('path');
const fs = require('fs');
const multer = require('multer');

// المجلد الأساسي للمرفقات
const BASE_UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// التأكد التلقائي من وجود المجلدات المنظمة مع حماية من أخطاء بيئات السحابة المقروءة فقط
const directories = ['logos', 'systems', 'pages', 'media', 'backups'];
directories.forEach(dir => {
  try {
    const fullPath = path.join(BASE_UPLOAD_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  } catch (err) {
    // بيئة سحابية (Read-only filesystem) مثل Vercel AWS Lambda
  }
});

/**
 * تحديد وجهة الملف تلقائياً بناءً على نوع الحقل أو المسار
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'media';

    if (file.fieldname === 'logo' || file.fieldname === 'appLogo' || req.baseUrl.includes('logo')) {
      subfolder = 'logos';
    } else if (file.fieldname === 'coverImage' || file.fieldname === 'screenshots' || file.fieldname === 'systemImages' || file.fieldname === 'system' || req.baseUrl.includes('systems')) {
      subfolder = 'systems';
    } else if (file.fieldname === 'pageImage' || req.baseUrl.includes('pages')) {
      subfolder = 'pages';
    } else if (req.body && req.body.uploadCategory && directories.includes(req.body.uploadCategory)) {
      subfolder = req.body.uploadCategory;
    }

    let destPath = path.join(BASE_UPLOAD_DIR, subfolder);
    try {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
    } catch (err) {
      destPath = require('os').tmpdir();
    }
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    // توليد اسم فريد ونظيف للملف
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    const ext = path.extname(file.originalname).toLowerCase();
    const originalBase = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')
      .substring(0, 30);
    
    cb(null, `${originalBase}-${uniqueSuffix}${ext}`);
  }
});

/**
 * فلترة الملفات المسموح بها (الصور بكافة أنواعها)
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|svg|gif|ico/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeType = file.mimetype.toLowerCase();

  const isExtAllowed = allowedExtensions.test(ext);
  const isMimeAllowed = mimeType.startsWith('image/') || mimeType === 'image/svg+xml' || mimeType === 'image/x-icon';

  if (isExtAllowed && isMimeAllowed) {
    return cb(null, true);
  }
  cb(new Error('الملف غير مدعوم! يرجى رفع ملفات صور فقط (JPG, PNG, WEBP, SVG, GIF)'));
};

// إنشاء مثيل multer الأساسي
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 ميجابايت كحد أقصى لكل صورة
  }
});

/**
 * وسيط رفع شعار واحد
 */
const uploadSingleLogo = upload.single('logo');

/**
 * وسيط رفع صور متعددة للمنظومات
 */
const uploadSystemGallery = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'appLogo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]);

/**
 * وسيط رفع ملف عام واحد
 */
const uploadSingleMedia = upload.single('mediaFile');

module.exports = {
  upload,
  uploadSingleLogo,
  uploadSystemGallery,
  uploadSingleMedia,
  BASE_UPLOAD_DIR
};
