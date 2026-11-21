const path = require('path');
const fs = require('fs');

const BASE_UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

/**
 * جلب قائمة الملفات من مجلد معين داخل مجلد الوسائط
 */
function listMediaFiles(category = '') {
  const targetDir = category ? path.join(BASE_UPLOAD_DIR, category) : BASE_UPLOAD_DIR;

  if (!fs.existsSync(targetDir)) {
    return [];
  }

  const results = [];
  
  function scan(dir, relativeFolder = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = relativeFolder ? `${relativeFolder}/${item.name}` : item.name;

      if (item.isDirectory() && !category) {
        // فحص المجلدات الفرعية
        scan(fullPath, relPath);
      } else if (item.isFile()) {
        const stats = fs.statSync(fullPath);
        const ext = path.extname(item.name).toLowerCase();
        
        results.push({
          filename: item.name,
          category: relativeFolder.split('/')[0] || category || 'media',
          path: `/uploads/${relPath.replace(/\\/g, '/')}`,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          extension: ext,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      }
    }
  }

  scan(targetDir, category);
  return results.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

/**
 * حذف ملف وسائط مع الحماية من Directory Traversal
 */
function deleteMediaFile(relativeFilePath) {
  if (!relativeFilePath) return false;

  // تنظيف المسار
  const cleanPath = relativeFilePath.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
  const fullPath = path.join(BASE_UPLOAD_DIR, cleanPath);

  // التأكد من أن المسار داخل BASE_UPLOAD_DIR لمنع الاختراق
  if (!fullPath.startsWith(BASE_UPLOAD_DIR)) {
    throw new Error('محاولة وصول غير مصرح بها للمسار');
  }

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
}

/**
 * تحويل الحجم بالبايت إلى صيغة مقروءة (KB, MB)
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  listMediaFiles,
  deleteMediaFile,
  formatBytes,
  BASE_UPLOAD_DIR
};
