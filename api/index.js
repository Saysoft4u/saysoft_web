const fs = require('fs');
const path = require('path');

// في بيئة Vercel Serverless (AWS Lambda)، يكون نظام الملفات للقراءة فقط باستثناء مجلد /tmp
// نقوم بنسخ قاعدة بيانات SQLite إلى /tmp لضمان القراءة والكتابة السليمة
try {
  const destDb = path.join('/tmp', 'dev.db');
  if (!fs.existsSync(destDb)) {
    const candidatePaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(__dirname, '..', 'prisma', 'dev.db'),
      path.join(__dirname, 'prisma', 'dev.db')
    ];
    for (const src of candidatePaths) {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, destDb);
        break;
      }
    }
  }
  process.env.DATABASE_URL = `file:${destDb}`;
} catch (err) {
  console.error('Vercel SQLite init error:', err);
}

const app = require('../src/server');

module.exports = app;
