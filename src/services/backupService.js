const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const BACKUP_DIR = path.join(__dirname, '../../public/uploads/backups');
const DB_FILE = path.join(__dirname, '../../prisma/dev.db');
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// التأكد من وجود مجلد النسخ الاحتياطية مع حماية البيئة السحابية
try {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
} catch (err) {
  // بيئة سحابية للقراءة فقط
}

/**
 * إنشاء نسخة احتياطية مضغوطة تشمل قاعدة البيانات ومجلد المرفقات
 */
function createFullBackup() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFileName = `saysoft-backup-${timestamp}.zip`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);

    const output = fs.createWriteStream(backupFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // أقصى ضغط
    });

    output.on('close', () => {
      resolve({
        filename: backupFileName,
        filepath: backupFilePath,
        url: `/uploads/backups/${backupFileName}`,
        sizeBytes: archive.pointer(),
        createdAt: new Date()
      });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // 1. إضافة ملف قاعدة البيانات SQLite
    if (fs.existsSync(DB_FILE)) {
      archive.file(DB_FILE, { name: 'dev.db' });
    }

    // 2. إضافة مجلدات المرفقات (مع استثناء مجلد backups لتجنب التكرار الذاتي)
    if (fs.existsSync(UPLOADS_DIR)) {
      archive.directory(UPLOADS_DIR, 'uploads', (entry) => {
        if (entry.name.startsWith('backups/') || entry.name === 'backups') {
          return false; // تجاهل مجلد النسخ الاحتياطية
        }
        return entry;
      });
    }

    archive.finalize();
  });
}

/**
 * جلب قائمة النسخ الاحتياطية المتوفرة
 */
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];

  const files = fs.readdirSync(BACKUP_DIR);
  return files
    .filter(file => file.endsWith('.zip'))
    .map(file => {
      const fullPath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(fullPath);
      return {
        filename: file,
        url: `/uploads/backups/${file}`,
        sizeBytes: stats.size,
        createdAt: stats.birthtime
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

module.exports = {
  createFullBackup,
  listBackups
};
