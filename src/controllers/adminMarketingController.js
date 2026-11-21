const prisma = require('../utils/prisma');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة الأسئلة الشائعة العامة وآراء العملاء
 */
async function index(req, res, next) {
  try {
    const [faqs, testimonials] = await Promise.all([
      prisma.generalFAQ.findMany({ orderBy: { SortOrder: 'asc' } }),
      prisma.testimonial.findMany({ orderBy: { SortOrder: 'asc' } })
    ]);

    res.render('admin/marketing/index', {
      title: 'إدارة الأسئلة الشائعة وآراء العملاء',
      faqs,
      testimonials
    });
  } catch (error) {
    next(error);
  }
}

/**
 * حفظ سؤال شائع عام جديد
 */
async function storeFaq(req, res, next) {
  try {
    const { questionAr, questionEn, answerAr, answerEn, sortOrder } = req.body;
    await prisma.generalFAQ.create({
      data: {
        QuestionAr: questionAr.trim(),
        QuestionEn: questionEn.trim(),
        AnswerAr: answerAr.trim(),
        AnswerEn: answerEn.trim(),
        SortOrder: parseInt(sortOrder) || 0
      }
    });
    res.redirect('/admin/marketing');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف سؤال شائع (محمي بكلمة المرور الرئيسية)
 */
async function destroyFaq(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) return res.status(403).send('كلمة المرور الرئيسية غير صحيحة');

    await prisma.generalFAQ.delete({ where: { IDFAQ: id } });
    res.redirect('/admin/marketing');
  } catch (error) {
    next(error);
  }
}

/**
 * حفظ رأي عميل جديد
 */
async function storeTestimonial(req, res, next) {
  try {
    const { clientNameAr, clientNameEn, clientTitleAr, clientTitleEn, contentAr, contentEn, rating } = req.body;
    await prisma.testimonial.create({
      data: {
        ClientNameAr: clientNameAr.trim(),
        ClientNameEn: clientNameEn.trim(),
        ClientTitleAr: clientTitleAr ? clientTitleAr.trim() : null,
        ClientTitleEn: clientTitleEn ? clientTitleEn.trim() : null,
        ContentAr: contentAr.trim(),
        ContentEn: contentEn.trim(),
        Rating: parseInt(rating) || 5
      }
    });
    res.redirect('/admin/marketing');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف رأي عميل (محمي بكلمة المرور الرئيسية)
 */
async function destroyTestimonial(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) return res.status(403).send('كلمة المرور الرئيسية غير صحيحة');

    await prisma.testimonial.delete({ where: { IDTestimonial: id } });
    res.redirect('/admin/marketing');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  storeFaq,
  destroyFaq,
  storeTestimonial,
  destroyTestimonial
};
