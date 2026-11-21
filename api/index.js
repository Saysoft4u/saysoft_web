const fs = require('fs');
const path = require('path');
const os = require('os');

let app;
let initError = null;

try {
  // 1. تأمين مسار قاعدة بيانات SQLite
  const tmpDb = path.join(os.tmpdir(), 'saysoft_dev.db');
  
  if (!fs.existsSync(tmpDb)) {
    const candidatePaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(__dirname, '..', 'prisma', 'dev.db'),
      path.join(__dirname, 'prisma', 'dev.db')
    ];
    for (const src of candidatePaths) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDb);
          break;
        } catch (e) {
          console.warn('Copy db to tmp failed:', e.message);
        }
      }
    }
  }

  if (fs.existsSync(tmpDb)) {
    process.env.DATABASE_URL = `file:${tmpDb}`;
  } else {
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  }

  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = 'saysoft-secret-key-super-secure-2026';
  }

  app = require('../src/server');
} catch (err) {
  initError = err;
  console.error('Initialization error in api/index.js:', err);
}

module.exports = (req, res) => {
  if (initError) {
    res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<h2>خطأ في تشغيل الخادم السحابي:</h2><pre>${initError.stack}</pre>`);
  }
  return app(req, res);
};
