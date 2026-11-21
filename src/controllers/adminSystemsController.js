const prisma = require('../utils/prisma');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة المنظومات
 */
async function index(req, res, next) {
  try {
    const { search, sectorId } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { NameAr: { contains: search } },
        { NameEn: { contains: search } },
        { Slug: { contains: search } }
      ];
    }
    if (sectorId) {
      where.SectorID = parseInt(sectorId);
    }

    const [systems, sectors] = await Promise.all([
      prisma.system.findMany({
        where,
        include: {
          Sector: true,
          Packages: true,
          _count: { select: { FAQs: true, Images: true } }
        },
        orderBy: { IDSystem: 'desc' }
      }),
      prisma.sector.findMany({ orderBy: { SortOrder: 'asc' } })
    ]);

    res.render('admin/systems/index', {
      title: 'إدارة المنظومات - لوحة تحكم سايسوفت',
      systems,
      sectors,
      search: search || '',
      sectorId: sectorId || ''
    });
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة إضافة منظومة جديدة
 */
async function create(req, res, next) {
  try {
    const sectors = await prisma.sector.findMany({ orderBy: { SortOrder: 'asc' } });
    res.render('admin/systems/form', {
      title: 'إضافة منظومة جديدة - سايسوفت',
      system: null,
      sectors,
      isEdit: false
    });
  } catch (error) {
    next(error);
  }
}

/**
 * حفظ منظومة جديدة
 */
async function store(req, res, next) {
  try {
    const {
      nameAr, nameEn, brandNameAr, brandNameEn, appCode, appType,
      slug, sectorId, summaryAr, summaryEn,
      descriptionAr, descriptionEn, youtubeUrl, demoUrl, isFeatured,
      productStatus,
      ownerAdminUrl, ownerUsername, ownerPassword, ownerNotes,
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, metaKeywordsAr, metaKeywordsEn,
      packagesJson, faqsJson, imagesJson
    } = req.body;

    let logoPath = '/uploads/logos/saylogo.png';
    if (req.file) {
      logoPath = `/uploads/logos/${req.file.filename}`;
    } else if (req.files && req.files['logo'] && req.files['logo'][0]) {
      logoPath = `/uploads/logos/${req.files['logo'][0].filename}`;
    } else if (req.body.existingLogo) {
      logoPath = req.body.existingLogo;
    }

    let appLogoPath = logoPath;
    if (req.files && req.files['appLogo'] && req.files['appLogo'][0]) {
      appLogoPath = `/uploads/logos/${req.files['appLogo'][0].filename}`;
    } else if (req.body.existingAppLogo) {
      appLogoPath = req.body.existingAppLogo;
    }

    let coverImagePath = null;
    if (req.files && req.files['coverImage'] && req.files['coverImage'][0]) {
      coverImagePath = `/uploads/systems/${req.files['coverImage'][0].filename}`;
    } else if (req.body.existingCoverImage) {
      coverImagePath = req.body.existingCoverImage;
    }

    const cleanSlug = (slug || nameEn || nameAr)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF-]/g, '-')
      .replace(/-+/g, '-');

    const isActiveVal = (req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === '1' || req.body.isActive === 'on');

    const createdSystem = await prisma.system.create({
      data: {
        SectorID: parseInt(sectorId),
        NameAr: nameAr.trim(),
        NameEn: nameEn.trim(),
        BrandNameAr: brandNameAr ? brandNameAr.trim() : null,
        BrandNameEn: brandNameEn ? brandNameEn.trim() : null,
        AppCode: appCode ? appCode.trim() : null,
        AppType: appType || 'SAAS_CLOUD',
        Slug: cleanSlug,
        SummaryAr: summaryAr.trim(),
        SummaryEn: summaryEn.trim(),
        DescriptionAr: descriptionAr || '',
        DescriptionEn: descriptionEn || '',
        Logo: logoPath,
        AppLogo: appLogoPath,
        CoverImage: coverImagePath,
        YoutubeUrl: youtubeUrl ? youtubeUrl.trim() : null,
        DemoUrl: demoUrl ? demoUrl.trim() : null,
        OwnerAdminUrl: ownerAdminUrl ? ownerAdminUrl.trim() : null,
        OwnerUsername: ownerUsername ? ownerUsername.trim() : null,
        OwnerPassword: ownerPassword ? ownerPassword.trim() : null,
        OwnerNotes: ownerNotes ? ownerNotes.trim() : null,
        IsFeatured: isFeatured === 'on' || isFeatured === 'true',
        IsActive: isActiveVal,
        ProductStatus: productStatus || 'PUBLISHED',
        MetaTitleAr: metaTitleAr ? metaTitleAr.trim() : null,
        MetaTitleEn: metaTitleEn ? metaTitleEn.trim() : null,
        MetaDescAr: metaDescAr ? metaDescAr.trim() : null,
        MetaDescEn: metaDescEn ? metaDescEn.trim() : null,
        MetaKeywordsAr: metaKeywordsAr ? metaKeywordsAr.trim() : null,
        MetaKeywordsEn: metaKeywordsEn ? metaKeywordsEn.trim() : null
      }
    });

    // إضافة الباقات إذا وجدت
    if (packagesJson) {
      try {
        const pkgs = JSON.parse(packagesJson);
        for (const p of pkgs) {
          if (p.nameAr && p.price) {
            await prisma.package.create({
              data: {
                SystemID: createdSystem.IDSystem,
                NameAr: p.nameAr,
                NameEn: p.nameEn || p.nameAr,
                Period: p.period || 'YEARLY',
                Price: parseFloat(p.price) || 0,
                FeaturesAr: p.featuresAr || '',
                FeaturesEn: p.featuresEn || '',
                IsPopular: !!p.isPopular
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في معالجة باقات المنظومة:', err);
      }
    }

    // إضافة الأسئلة الشائعة إذا وجدت
    if (faqsJson) {
      try {
        const faqs = JSON.parse(faqsJson);
        for (const f of faqs) {
          if (f.questionAr && f.answerAr) {
            await prisma.systemFAQ.create({
              data: {
                SystemID: createdSystem.IDSystem,
                QuestionAr: f.questionAr,
                QuestionEn: f.questionEn || f.questionAr,
                AnswerAr: f.answerAr,
                AnswerEn: f.answerEn || f.answerAr
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في معالجة أسئلة المنظومة:', err);
      }
    }

    // حفظ صور المعرض إن وجدت
    if (imagesJson) {
      try {
        const imgs = JSON.parse(imagesJson);
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const pathVal = img.ImagePath || img.imagePath;
          if (pathVal) {
            await prisma.systemImage.create({
              data: {
                SystemID: createdSystem.IDSystem,
                ImagePath: pathVal,
                CaptionAr: img.CaptionAr || img.captionAr || null,
                CaptionEn: img.CaptionEn || img.captionEn || null,
                SortOrder: parseInt(img.SortOrder || img.sortOrder || i + 1)
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في حفظ صور المنظومة:', err);
      }
    }

    if (req.files && req.files['screenshots']) {
      for (let i = 0; i < req.files['screenshots'].length; i++) {
        const file = req.files['screenshots'][i];
        await prisma.systemImage.create({
          data: {
            SystemID: createdSystem.IDSystem,
            ImagePath: `/uploads/systems/${file.filename}`,
            CaptionAr: file.originalname ? file.originalname.split('.')[0] : 'شاشة من النظام',
            CaptionEn: 'System Screenshot',
            SortOrder: 20 + i
          }
        });
      }
    }

    res.redirect('/admin/systems');
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة تعديل منظومة
 */
async function edit(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const [system, sectors] = await Promise.all([
      prisma.system.findUnique({
        where: { IDSystem: id },
        include: {
          Sector: true,
          Packages: true,
          FAQs: true,
          Images: true
        }
      }),
      prisma.sector.findMany({ orderBy: { SortOrder: 'asc' } })
    ]);

    if (!system) {
      return res.status(404).send('المنظومة غير موجودة');
    }

    res.render('admin/systems/form', {
      title: `تعديل منظومة: ${system.NameAr}`,
      system,
      sectors,
      isEdit: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تحديث بيانات المنظومة
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const {
      nameAr, nameEn, brandNameAr, brandNameEn, appCode, appType,
      slug, sectorId, summaryAr, summaryEn,
      descriptionAr, descriptionEn, youtubeUrl, demoUrl, isFeatured,
      productStatus,
      ownerAdminUrl, ownerUsername, ownerPassword, ownerNotes,
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, metaKeywordsAr, metaKeywordsEn,
      packagesJson, faqsJson, imagesJson, existingLogo, existingAppLogo, existingCoverImage
    } = req.body;

    let logoPath = existingLogo || '/uploads/logos/saylogo.png';
    if (req.file) {
      logoPath = `/uploads/logos/${req.file.filename}`;
    } else if (req.files && req.files['logo'] && req.files['logo'][0]) {
      logoPath = `/uploads/logos/${req.files['logo'][0].filename}`;
    }

    let appLogoPath = existingAppLogo || logoPath;
    if (req.files && req.files['appLogo'] && req.files['appLogo'][0]) {
      appLogoPath = `/uploads/logos/${req.files['appLogo'][0].filename}`;
    }

    let coverImagePath = existingCoverImage || null;
    if (req.files && req.files['coverImage'] && req.files['coverImage'][0]) {
      coverImagePath = `/uploads/systems/${req.files['coverImage'][0].filename}`;
    }

    const isActiveVal = (req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === '1' || req.body.isActive === 'on');

    await prisma.system.update({
      where: { IDSystem: id },
      data: {
        SectorID: parseInt(sectorId),
        NameAr: nameAr.trim(),
        NameEn: nameEn.trim(),
        BrandNameAr: brandNameAr ? brandNameAr.trim() : null,
        BrandNameEn: brandNameEn ? brandNameEn.trim() : null,
        AppCode: appCode ? appCode.trim() : null,
        AppType: appType || 'SAAS_CLOUD',
        Slug: slug.trim(),
        SummaryAr: summaryAr.trim(),
        SummaryEn: summaryEn.trim(),
        DescriptionAr: descriptionAr || '',
        DescriptionEn: descriptionEn || '',
        Logo: logoPath,
        AppLogo: appLogoPath,
        CoverImage: coverImagePath,
        YoutubeUrl: youtubeUrl ? youtubeUrl.trim() : null,
        DemoUrl: demoUrl ? demoUrl.trim() : null,
        OwnerAdminUrl: ownerAdminUrl ? ownerAdminUrl.trim() : null,
        OwnerUsername: ownerUsername ? ownerUsername.trim() : null,
        OwnerPassword: ownerPassword ? ownerPassword.trim() : null,
        OwnerNotes: ownerNotes ? ownerNotes.trim() : null,
        IsFeatured: isFeatured === 'on' || isFeatured === 'true',
        IsActive: isActiveVal,
        ProductStatus: productStatus || 'PUBLISHED',
        MetaTitleAr: metaTitleAr ? metaTitleAr.trim() : null,
        MetaTitleEn: metaTitleEn ? metaTitleEn.trim() : null,
        MetaDescAr: metaDescAr ? metaDescAr.trim() : null,
        MetaDescEn: metaDescEn ? metaDescEn.trim() : null,
        MetaKeywordsAr: metaKeywordsAr ? metaKeywordsAr.trim() : null,
        MetaKeywordsEn: metaKeywordsEn ? metaKeywordsEn.trim() : null
      }
    });

    // تحديث الباقات
    if (packagesJson) {
      try {
        const pkgs = JSON.parse(packagesJson);
        await prisma.package.deleteMany({ where: { SystemID: id } });
        for (const p of pkgs) {
          if (p.nameAr && p.price) {
            await prisma.package.create({
              data: {
                SystemID: id,
                NameAr: p.nameAr,
                NameEn: p.nameEn || p.nameAr,
                Period: p.period || 'YEARLY',
                Price: parseFloat(p.price) || 0,
                FeaturesAr: p.featuresAr || '',
                FeaturesEn: p.featuresEn || '',
                IsPopular: !!p.isPopular
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في تحديث الباقات:', err);
      }
    }

    // تحديث الأسئلة الشائعة
    if (faqsJson) {
      try {
        const faqs = JSON.parse(faqsJson);
        await prisma.systemFAQ.deleteMany({ where: { SystemID: id } });
        for (const f of faqs) {
          if (f.questionAr && f.answerAr) {
            await prisma.systemFAQ.create({
              data: {
                SystemID: id,
                QuestionAr: f.questionAr,
                QuestionEn: f.questionEn || f.questionAr,
                AnswerAr: f.answerAr,
                AnswerEn: f.answerEn || f.answerAr
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في تحديث أسئلة المنظومة:', err);
      }
    }

    // تحديث صور المعرض إن وجدت
    if (imagesJson) {
      try {
        const imgs = JSON.parse(imagesJson);
        await prisma.systemImage.deleteMany({ where: { SystemID: id } });
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const pathVal = img.ImagePath || img.imagePath;
          if (pathVal) {
            await prisma.systemImage.create({
              data: {
                SystemID: id,
                ImagePath: pathVal,
                CaptionAr: img.CaptionAr || img.captionAr || null,
                CaptionEn: img.CaptionEn || img.captionEn || null,
                SortOrder: parseInt(img.SortOrder || img.sortOrder || i + 1)
              }
            });
          }
        }
      } catch (err) {
        console.error('خطأ في تحديث صور المنظومة:', err);
      }
    }

    if (req.files && req.files['screenshots']) {
      for (let i = 0; i < req.files['screenshots'].length; i++) {
        const file = req.files['screenshots'][i];
        await prisma.systemImage.create({
          data: {
            SystemID: id,
            ImagePath: `/uploads/systems/${file.filename}`,
            CaptionAr: file.originalname ? file.originalname.split('.')[0] : 'شاشة من النظام',
            CaptionEn: 'System Screenshot',
            SortOrder: 20 + i
          }
        });
      }
    }

    res.redirect('/admin/systems');
  } catch (error) {
    next(error);
  }
}

/**
 * ميزة النسخ السريع لمنظومة (Duplicate System)
 */
async function duplicate(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const original = await prisma.system.findUnique({
      where: { IDSystem: id },
      include: {
        Packages: true,
        FAQs: true,
        Images: true
      }
    });

    if (!original) {
      return res.status(404).send('المنظومة غير موجودة');
    }

    const uniqueSuffix = Date.now().toString().slice(-4);
    const newSlug = `${original.Slug}-copy-${uniqueSuffix}`;

    const newSystem = await prisma.system.create({
      data: {
        SectorID: original.SectorID,
        NameAr: `${original.NameAr} (نسخة)`,
        NameEn: `${original.NameEn} (Copy)`,
        BrandNameAr: original.BrandNameAr ? `${original.BrandNameAr} (نسخة)` : null,
        BrandNameEn: original.BrandNameEn ? `${original.BrandNameEn} (Copy)` : null,
        AppCode: original.AppCode ? `${original.AppCode.slice(0, 4)}9` : null,
        AppType: original.AppType || 'SAAS_CLOUD',
        Slug: newSlug,
        SummaryAr: original.SummaryAr,
        SummaryEn: original.SummaryEn,
        DescriptionAr: original.DescriptionAr,
        DescriptionEn: original.DescriptionEn,
        Logo: original.Logo,
        AppLogo: original.AppLogo || original.Logo,
        CoverImage: original.CoverImage,
        YoutubeUrl: original.YoutubeUrl,
        DemoUrl: original.DemoUrl,
        OwnerAdminUrl: original.OwnerAdminUrl,
        OwnerUsername: original.OwnerUsername,
        OwnerPassword: original.OwnerPassword,
        OwnerNotes: original.OwnerNotes,
        IsFeatured: false,
        ProductStatus: original.ProductStatus || 'PUBLISHED',
        MetaTitleAr: original.MetaTitleAr,
        MetaTitleEn: original.MetaTitleEn,
        MetaDescAr: original.MetaDescAr,
        MetaDescEn: original.MetaDescEn,
        MetaKeywordsAr: original.MetaKeywordsAr,
        MetaKeywordsEn: original.MetaKeywordsEn
      }
    });

    // نسخ الباقات
    for (const p of original.Packages) {
      await prisma.package.create({
        data: {
          SystemID: newSystem.IDSystem,
          NameAr: p.NameAr,
          NameEn: p.NameEn,
          Period: p.Period,
          Price: p.Price,
          FeaturesAr: p.FeaturesAr,
          FeaturesEn: p.FeaturesEn,
          IsPopular: p.IsPopular
        }
      });
    }

    // نسخ الأسئلة الشائعة
    for (const f of original.FAQs) {
      await prisma.systemFAQ.create({
        data: {
          SystemID: newSystem.IDSystem,
          QuestionAr: f.QuestionAr,
          QuestionEn: f.QuestionEn,
          AnswerAr: f.AnswerAr,
          AnswerEn: f.AnswerEn
        }
      });
    }

    res.redirect(`/admin/systems/edit/${newSystem.IDSystem}`);
  } catch (error) {
    next(error);
  }
}

/**
 * حذف منظومة (مع التحقق من كلمة المرور الرئيسية)
 */
async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض عملية الحذف.');
    }

    // حذف الباقات والأسئلة والصور المرتبطة أولاً
    await prisma.package.deleteMany({ where: { SystemID: id } });
    await prisma.systemFAQ.deleteMany({ where: { SystemID: id } });
    await prisma.systemImage.deleteMany({ where: { SystemID: id } });
    await prisma.system.delete({ where: { IDSystem: id } });

    res.redirect('/admin/systems');
  } catch (error) {
    next(error);
  }
}

/**
 * حذف صورة من معرض المنظومة
 */
async function deleteImage(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await prisma.systemImage.delete({ where: { IDImage: id } });
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true });
    }
    res.redirect('back');
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة إدارة بيانات دخول واعتمادات مالكي المنظومات (سرية وخاصة بالمسؤولين فقط)
 */
async function getOwnerCredentials(req, res, next) {
  try {
    const systems = await prisma.system.findMany({
      include: {
        Sector: true
      },
      orderBy: { IDSystem: 'desc' }
    });

    res.render('admin/systems/credentials', {
      title: 'سجل حسابات وإدارة مالكي المنظومات - سري ومحمي',
      systems
    });
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
  duplicate,
  destroy,
  deleteImage,
  getOwnerCredentials
};
