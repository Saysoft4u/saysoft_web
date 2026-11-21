const { listMediaFiles, deleteMediaFile } = require('../services/mediaService');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض مكتبة الوسائط
 */
function index(req, res) {
  const category = req.query.category || '';
  const files = listMediaFiles(category);

  res.render('admin/media/index', {
    title: 'مكتبة الوسائط والملفات - لوحة الإدارة',
    files,
    category
  });
}

/**
 * رفع ملف جديد عبر مكتبة الوسائط
 */
function uploadFile(req, res) {
  if (!req.file) {
    return res.redirect('/admin/media?error=upload_failed');
  }
  const category = req.body.uploadCategory || '';
  res.redirect(`/admin/media?category=${category}&success=uploaded`);
}

/**
 * حذف ملف من مكتبة الوسائط
 */
async function destroyFile(req, res) {
  try {
    const { filePath, masterPassword } = req.body;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض الحذف.');
    }

    deleteMediaFile(filePath);
    res.redirect('/admin/media');
  } catch (error) {
    console.error('خطأ في حذف ملف الوسائط:', error);
    res.redirect('/admin/media');
  }
}

module.exports = {
  index,
  uploadFile,
  destroyFile
};
