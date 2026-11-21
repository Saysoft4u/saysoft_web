const prisma = require('../utils/prisma');
const { comparePassword } = require('../utils/security');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض صفحة تسجيل دخول الإدارة
 */
function showLogin(req, res) {
  // إذا كان المستخدم مسجلاً بالفعل، يتم توجيهه للوحة التحكم
  if (req.session && req.session.user) {
    return res.redirect('/admin');
  }

  const error = req.session.loginError || null;
  delete req.session.loginError;

  res.render('admin/login', {
    title: 'تسجيل دخول لوحة الإدارة - سايسوفت',
    error: error
  });
}

/**
 * معالجة تسجيل دخول الإدارة
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
      }
      req.session.loginError = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      return res.redirect('/admin/login');
    }

    const cleanInput = username.trim();

    // البحث عن المستخدم بواسطة اسم المستخدم أو البريد الإلكتروني (غير حساس لحالة الأحرف)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { Username: cleanInput },
          { Username: cleanInput.toLowerCase() },
          { Email: cleanInput.toLowerCase() }
        ]
      }
    });

    if (!user || !user.IsActive) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة أو الحساب غير مفعّل' });
      }
      req.session.loginError = 'بيانات الدخول غير صحيحة أو الحساب معطل';
      return res.redirect('/admin/login');
    }

    // مطابقة كلمة المرور المشفرة
    const isPasswordValid = await comparePassword(password, user.PasswordHash);
    if (!isPasswordValid) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
      }
      req.session.loginError = 'بيانات الدخول غير صحيحة، يرجى التأكد من كلمة المرور';
      return res.redirect('/admin/login');
    }

    // حفظ بيانات المستخدم في الجلسة (Session)
    req.session.userId = user.IDUser;
    req.session.user = {
      IDUser: user.IDUser,
      Username: user.Username,
      Email: user.Email,
      FullName: user.FullName,
      Role: user.Role
    };

    const redirectUrl = req.session.returnTo || '/admin';
    delete req.session.returnTo;

    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, redirectUrl });
    }

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('خطأ أثناء تسجيل الدخول:', error);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
    }
    req.session.loginError = 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً';
    return res.redirect('/admin/login');
  }
}

/**
 * تسجيل الخروج وإنهاء الجلسة
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('خطأ أثناء تسجيل الخروج:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
}

/**
 * واجهة برمجية للتحقق من كلمة المرور الرئيسية (Master Password API)
 */
async function verifyMasterPasswordApi(req, res) {
  try {
    const { masterPassword } = req.body;
    const isValid = await verifyMasterPassword(masterPassword);

    if (isValid) {
      return res.json({ success: true, message: 'كلمة المرور الرئيسية صحيحة' });
    } else {
      return res.status(403).json({ success: false, message: 'كلمة المرور الرئيسية غير صحيحة' });
    }
  } catch (error) {
    console.error('خطأ في التحقق من كلمة المرور الرئيسية:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق' });
  }
}

module.exports = {
  showLogin,
  login,
  logout,
  verifyMasterPasswordApi
};
