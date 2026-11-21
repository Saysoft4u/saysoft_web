const prisma = require('../utils/prisma');
const { hashPassword } = require('../utils/security');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة مسؤولي ومحرري النظام
 */
async function index(req, res, next) {
  try {
    const currentUserId = req.session.userId || (req.session.user ? req.session.user.IDUser : 0);
    const users = await prisma.user.findMany({
      orderBy: { IDUser: 'asc' }
    });

    res.render('admin/users/index', {
      title: 'إدارة مسؤولي ومديري الموقع - لوحة التحكم',
      users,
      currentUserId: currentUserId,
      query: req.query
    });
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة إضافة مسؤول جديد
 */
async function create(req, res, next) {
  try {
    res.render('admin/users/form', {
      title: 'إضافة مسؤول جديد - لوحة التحكم',
      user: null,
      isEdit: false,
      error: null
    });
  } catch (error) {
    next(error);
  }
}

/**
 * حفظ المسؤول الجديد
 */
async function store(req, res, next) {
  try {
    const { fullName, username, email, password, role, isActive } = req.body;

    // التحقق من الحقول الإلزامية
    if (!username || !email || !password) {
      return res.render('admin/users/form', {
        title: 'إضافة مسؤول جديد - لوحة التحكم',
        user: req.body,
        isEdit: false,
        error: 'يرجى ملء جميع الحقول الإلزامية (اسم المستخدم، البريد، كلمة المرور)'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // التحقق من عدم تكرار اسم المستخدم أو البريد
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { Username: cleanUsername },
          { Email: cleanEmail }
        ]
      }
    });

    if (existing) {
      return res.render('admin/users/form', {
        title: 'إضافة مسؤول جديد - لوحة التحكم',
        user: req.body,
        isEdit: false,
        error: 'اسم المستخدم أو البريد الإلكتروني مسجل بالفعل لمسؤول آخر'
      });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        FullName: fullName ? fullName.trim() : null,
        Username: cleanUsername,
        Email: cleanEmail,
        PasswordHash: hashedPassword,
        Role: role || 'ADMIN',
        IsActive: isActive === 'on' || isActive === 'true' || isActive === true
      }
    });

    res.redirect('/admin/users?msg=created');
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة تعديل بيانات المسؤول
 */
async function edit(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { IDUser: id }
    });

    if (!user) {
      return res.status(404).send('المسؤول غير موجود');
    }

    res.render('admin/users/form', {
      title: `تعديل المسؤول: ${user.FullName || user.Username}`,
      user,
      isEdit: true,
      error: null
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تحديث بيانات المسؤول وكلمة مروره
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { fullName, username, email, password, role, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { IDUser: id }
    });

    if (!existingUser) {
      return res.status(404).send('المسؤول غير موجود');
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // التحقق من التكرار مع حسابات أخرى
    const duplicate = await prisma.user.findFirst({
      where: {
        AND: [
          { IDUser: { not: id } },
          {
            OR: [
              { Username: cleanUsername },
              { Email: cleanEmail }
            ]
          }
        ]
      }
    });

    if (duplicate) {
      return res.render('admin/users/form', {
        title: `تعديل المسؤول: ${existingUser.FullName || existingUser.Username}`,
        user: { ...existingUser, ...req.body, IDUser: id },
        isEdit: true,
        error: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل بحساب مسؤول آخر'
      });
    }

    const updateData = {
      FullName: fullName ? fullName.trim() : null,
      Username: cleanUsername,
      Email: cleanEmail,
      Role: role || existingUser.Role,
      IsActive: isActive === 'on' || isActive === 'true' || isActive === true
    };

    const currentUserId = req.session.userId || (req.session.user ? req.session.user.IDUser : 0);

    // منع المسؤول من تعطيل حسابه الشخصي المسجل به حالياً
    if (currentUserId === id) {
      updateData.IsActive = true;
    }

    // تحديث كلمة المرور فقط إذا تم إدخال كلمة مرور جديدة
    if (password && password.trim().length > 0) {
      updateData.PasswordHash = await hashPassword(password.trim());
    }

    await prisma.user.update({
      where: { IDUser: id },
      data: updateData
    });

    res.redirect('/admin/users?msg=updated');
  } catch (error) {
    next(error);
  }
}

/**
 * تفعيل أو تجميد حساب المسؤول
 */
async function toggleActive(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = req.session.userId || (req.session.user ? req.session.user.IDUser : 0);

    // منع تجميد الحساب الشخصي النشط
    if (currentUserId === id) {
      return res.redirect('/admin/users?err=self_deactivate');
    }

    const user = await prisma.user.findUnique({ where: { IDUser: id } });
    if (!user) {
      return res.redirect('/admin/users');
    }

    await prisma.user.update({
      where: { IDUser: id },
      data: { IsActive: !user.IsActive }
    });

    res.redirect('/admin/users?msg=status_changed');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف حساب مسؤول
 */
async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { masterPassword } = req.body;
    const currentUserId = req.session.userId || (req.session.user ? req.session.user.IDUser : 0);

    // التحقق من كلمة المرور الرئيسية للحماية القصوى
    const isMasterValid = await verifyMasterPassword(masterPassword);
    if (!isMasterValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة!');
    }

    // منع حذف الحساب الحالي المسجل به الدخول
    if (currentUserId === id) {
      return res.redirect('/admin/users?err=self_delete');
    }

    // التحقق من عدم حذف آخر مدير للنظام
    const adminCount = await prisma.user.count({ where: { Role: 'ADMIN' } });
    const targetUser = await prisma.user.findUnique({ where: { IDUser: id } });

    if (targetUser && targetUser.Role === 'ADMIN' && adminCount <= 1) {
      return res.redirect('/admin/users?err=last_admin');
    }

    await prisma.user.delete({ where: { IDUser: id } });

    res.redirect('/admin/users?msg=deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  create,
  store,
  edit,
  update,
  toggleActive,
  destroy
};
