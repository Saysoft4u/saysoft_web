const prisma = require('../utils/prisma');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة الرسائل والمشتركين
 */
async function index(req, res, next) {
  try {
    const [messages, subscribers] = await Promise.all([
      prisma.message.findMany({
        orderBy: { CreatedAt: 'desc' },
        include: { System: true }
      }),
      prisma.comingSoonSubscriber.findMany({
        orderBy: { CreatedAt: 'desc' }
      })
    ]);

    res.render('admin/messages/index', {
      title: 'الرسائل والمشتركون - لوحة الإدارة',
      messages,
      subscribers
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تبديل حالة قراءة الرسالة
 */
async function toggleRead(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const msg = await prisma.message.findUnique({ where: { IDMessage: id } });
    if (msg) {
      await prisma.message.update({
        where: { IDMessage: id },
        data: { IsRead: !msg.IsRead }
      });
    }
    res.redirect('/admin/messages');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف رسالة (محمي بكلمة المرور الرئيسية)
 */
async function destroyMessage(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض الحذف.');
    }

    await prisma.message.delete({ where: { IDMessage: id } });
    res.redirect('/admin/messages');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف مشترك من قائمة قريباً (محمي بكلمة المرور الرئيسية)
 */
async function destroySubscriber(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض الحذف.');
    }

    await prisma.comingSoonSubscriber.delete({ where: { IDSubscriber: id } });
    res.redirect('/admin/messages');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  toggleRead,
  destroyMessage,
  destroySubscriber
};
