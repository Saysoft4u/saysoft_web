const prisma = require('../utils/prisma');
const { comparePassword } = require('../utils/security');

/**
 * التحقق من تسجيل دخول المسؤول
 */
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  
  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.status(401).json({ success: false, message: 'غير مصرح لك، يرجى تسجيل الدخول أولاً' });
  }

  req.session.returnTo = req.originalUrl;
  return res.redirect('/admin/login');
}

/**
 * التحقق من صلاحيات وأدوار المستخدم (مثال: ADMIN, EDITOR)
 */
function hasRole(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ success: false, message: 'يرجى تسجيل الدخول' });
      }
      return res.redirect('/admin/login');
    }

    const userRole = req.session.user.Role || 'EDITOR';
    if (roles.length > 0 && !roles.includes(userRole)) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(403).json({ success: false, message: 'ليس لديك الصلاحية لتنفيذ هذا الإجراء' });
      }
      return res.status(403).render('pages/error', {
        title: 'غير مصرح',
        errorCode: 403,
        errorMessage: 'ليس لديك صلاحية كافية للوصول إلى هذه الصفحة'
      });
    }

    next();
  };
}

/**
 * التحقق من كلمة المرور الرئيسية (Master Password) لحماية عمليات الحذف الحساسة
 */
async function verifyMasterPassword(masterPasswordInput) {
  if (!masterPasswordInput) return false;

  try {
    const setting = await prisma.setting.findUnique({
      where: { SettingKey: 'MasterPasswordHash' }
    });

    if (!setting || !setting.SettingValue) {
      // كلمة مرور احتياطية افتراضية في حالة عدم وجود الإعداد
      return masterPasswordInput === 'SaysoftMaster2026#';
    }

    return await comparePassword(masterPasswordInput, setting.SettingValue);
  } catch (error) {
    console.error('خطأ أثناء التحقق من كلمة المرور الرئيسية:', error);
    return false;
  }
}

/**
 * وسيط (Middleware) لفحص كلمة المرور الرئيسية في طلبات الحذف الحساسة
 */
async function requireMasterPassword(req, res, next) {
  const masterPassword = req.body.masterPassword || req.headers['x-master-password'];
  
  const isValid = await verifyMasterPassword(masterPassword);
  if (!isValid) {
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(403).json({ 
        success: false, 
        message: 'كلمة المرور الرئيسية غير صحيحة، تم إلغاء العملية لحماية البيانات' 
      });
    }
    return res.status(403).send('كلمة المرور الرئيسية غير صحيحة');
  }

  next();
}

module.exports = {
  isAuthenticated,
  hasRole,
  verifyMasterPassword,
  requireMasterPassword
};
