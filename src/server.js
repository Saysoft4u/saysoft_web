const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { siteSettingsMiddleware } = require('./middlewares/siteSettingsMiddleware');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================================================
// 1. الإعدادات الأساسية وبرمجيات الوسائط (Middlewares)
// ==============================================================================

// تمكين CORS للطلبات المسموحة
app.use(cors());

// معالجة البيانات القادمة بصيغة JSON أو نماذج النماذج (URL-encoded)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// قراءة ملفات تعريف الارتباط (Cookies)
app.use(cookieParser());

// تمكين الثقة في البروكسي عند النشر السحابي (Reverse Proxy / Cloud)
app.set('trust proxy', 1);

// إدارة الجلسات (Sessions)
app.use(session({
  name: 'saysoft.sid',
  secret: process.env.SESSION_SECRET || 'saysoft-default-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // صلاحية الجلسة أسبوع كامل
  }
}));

// إعداد مجلد الملفات الثابتة (Public: CSS, JS, Images, Uploads)
app.use(express.static(path.join(__dirname, '../public')));

// إعداد محرك القوالب (EJS Engine)
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// تطبيق وسيط إعدادات الموقع العامة واللغة والثيم
app.use(siteSettingsMiddleware);

// ==============================================================================
// 2. المسارات وتوجيه الطلبات (Routes)
// ==============================================================================
app.use(routes);

// ==============================================================================
// 3. معالجة الأخطاء (Error Handlers)
// ==============================================================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==============================================================================
// 4. تشغيل الخادم والإنصات (Start Server)
// ==============================================================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 خادم منصة سايسوفت يعمل بنجاح!`);
    console.log(`📍 الرابط المحلي: http://localhost:${PORT}`);
    console.log(`🛡️  لوحة الإدارة: http://localhost:${PORT}/admin/login`);
    console.log(`⚙️  البيئة الحالية: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
