const prisma = require('../utils/prisma');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة الصفحات المخصصة
 */
async function index(req, res, next) {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { SortOrder: 'asc' }
    });
    res.render('admin/pages/index', {
      title: 'إدارة الصفحات المخصصة - لوحة الإدارة',
      pages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة إضافة صفحة جديدة
 */
function create(req, res) {
  res.render('admin/pages/form', {
    title: 'إنشاء صفحة جديدة',
    page: null,
    isEdit: false
  });
}

/**
 * حفظ صفحة جديدة
 */
async function store(req, res, next) {
  try {
    const {
      titleAr, titleEn, slug, contentAr, contentEn,
      showInHeader, showInFooter, sortOrder,
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, metaKeywordsAr, metaKeywordsEn
    } = req.body;

    const cleanSlug = (slug || titleEn || titleAr)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF-]/g, '-')
      .replace(/-+/g, '-');

    await prisma.page.create({
      data: {
        TitleAr: titleAr.trim(),
        TitleEn: titleEn.trim(),
        Slug: cleanSlug,
        ContentAr: contentAr || '',
        ContentEn: contentEn || '',
        ShowInHeader: showInHeader === 'on' || showInHeader === 'true',
        ShowInFooter: showInFooter === 'on' || showInFooter === 'true',
        SortOrder: parseInt(sortOrder) || 0,
        MetaTitleAr: metaTitleAr ? metaTitleAr.trim() : null,
        MetaTitleEn: metaTitleEn ? metaTitleEn.trim() : null,
        MetaDescAr: metaDescAr ? metaDescAr.trim() : null,
        MetaDescEn: metaDescEn ? metaDescEn.trim() : null,
        MetaKeywordsAr: metaKeywordsAr ? metaKeywordsAr.trim() : null,
        MetaKeywordsEn: metaKeywordsEn ? metaKeywordsEn.trim() : null
      }
    });

    res.redirect('/admin/pages');
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة تعديل صفحة
 */
async function edit(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const page = await prisma.page.findUnique({ where: { IDPage: id } });

    if (!page) {
      return res.status(404).send('الصفحة غير موجودة');
    }

    res.render('admin/pages/form', {
      title: `تعديل صفحة: ${page.TitleAr}`,
      page,
      isEdit: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تحديث الصفحة
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const {
      titleAr, titleEn, slug, contentAr, contentEn,
      showInHeader, showInFooter, sortOrder,
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, metaKeywordsAr, metaKeywordsEn
    } = req.body;

    await prisma.page.update({
      where: { IDPage: id },
      data: {
        TitleAr: titleAr.trim(),
        TitleEn: titleEn.trim(),
        Slug: slug.trim(),
        ContentAr: contentAr || '',
        ContentEn: contentEn || '',
        ShowInHeader: showInHeader === 'on' || showInHeader === 'true',
        ShowInFooter: showInFooter === 'on' || showInFooter === 'true',
        SortOrder: parseInt(sortOrder) || 0,
        MetaTitleAr: metaTitleAr ? metaTitleAr.trim() : null,
        MetaTitleEn: metaTitleEn ? metaTitleEn.trim() : null,
        MetaDescAr: metaDescAr ? metaDescAr.trim() : null,
        MetaDescEn: metaDescEn ? metaDescEn.trim() : null,
        MetaKeywordsAr: metaKeywordsAr ? metaKeywordsAr.trim() : null,
        MetaKeywordsEn: metaKeywordsEn ? metaKeywordsEn.trim() : null
      }
    });

    res.redirect('/admin/pages');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف صفحة (محمي بكلمة المرور الرئيسية)
 */
async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض عملية الحذف.');
    }

    await prisma.page.delete({ where: { IDPage: id } });
    res.redirect('/admin/pages');
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
  destroy
};
