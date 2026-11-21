const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const publicController = require('../controllers/publicController');

/**
 * صفحة قريباً أو قيد التصميم والتطوير البرمجي (Coming Soon / Under Design)
 */
router.get(['/coming-soon', '/under-design', '/under-construction'], async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const systemSlug = req.query.system || null;

    let targetSystem = null;
    if (systemSlug) {
      targetSystem = await prisma.system.findFirst({
        where: { Slug: systemSlug },
        include: { Sector: true }
      });
    }

    const title = targetSystem
      ? res.locals.t(
          `قريباً وقيد التصميم | ${targetSystem.BrandNameAr || targetSystem.NameAr} - سايسوفت`,
          `Coming Soon & Under Design | ${targetSystem.BrandNameEn || targetSystem.NameEn} - Saysoft`
        )
      : res.locals.t('قريباً أو قيد التصميم - شركة سايسوفت للحلول الرقمية', 'Coming Soon & Under Design - Saysoft Digital Solutions');

    res.render('pages/coming-soon', {
      title,
      status,
      targetSystem,
      systemSlug: systemSlug || ''
    });
  } catch (error) {
    next(error);
  }
});

/**
 * الصفحة الرئيسية
 */
router.get('/', async (req, res, next) => {
  try {
    const featuredSystems = await prisma.system.findMany({
      where: { IsFeatured: true, IsActive: true },
      include: {
        Sector: true,
        Packages: true
      },
      orderBy: { SortOrder: 'asc' },
      take: 6
    });

    const testimonials = await prisma.testimonial.findMany({
      where: { IsActive: true },
      orderBy: { SortOrder: 'asc' },
      take: 6
    });

    const faqs = await prisma.generalFAQ.findMany({
      where: { IsActive: true },
      orderBy: { SortOrder: 'asc' },
      take: 8
    });

    const sectors = await prisma.sector.findMany({
      where: { IsActive: true },
      orderBy: { SortOrder: 'asc' }
    });

    res.render('pages/home', {
      title: res.locals.t('سايسوفت للحلول الرقمية وتطبيقات السحابية', 'Saysoft Digital Solutions & Cloud Apps'),
      featuredSystems,
      testimonials,
      faqs,
      sectors
    });
  } catch (error) {
    next(error);
  }
});

/**
 * كتالوج المنظومات
 */
router.get('/systems', publicController.getSystems);

/**
 * تفاصيل المنظومة والاستفسار الخاص بها
 */
router.get('/system/:slug', publicController.getSystemDetails);
router.post('/system/:slug/inquiry', publicController.submitSystemInquiry);

/**
 * سلة المبيعات والطلب
 */
router.get('/cart', publicController.getCart);
router.post('/cart/add', publicController.addToCart);
router.post('/cart/remove', publicController.removeFromCart);
router.post('/cart/clear', publicController.clearCart);
router.post('/cart/checkout', publicController.checkout);
router.get('/order/confirmation/:orderNumber', publicController.orderConfirmation);

/**
 * صفحة اتصل بنا
 */
router.get('/contact', publicController.getContact);
router.post('/contact', publicController.submitContact);

/**
 * صفحة خدماتنا (Our Services)
 */
router.get('/services', publicController.getServices);
router.post('/services', publicController.submitServicesInquiry);

/**
 * اختصارات مباشرة للصفحات التعريفية
 */
router.get('/about-us', (req, res) => res.redirect('/page/about-us'));
router.get('/licensing', (req, res) => res.redirect('/page/licensing'));

/**
 * عرض صفحة ديناميكية مخصصة
 */
router.get('/page/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const page = await prisma.page.findFirst({
      where: {
        Slug: slug,
        IsActive: true
      }
    });

    if (!page) {
      return res.status(404).render('pages/error', {
        title: res.locals.t('الصفحة غير موجودة', 'Page Not Found'),
        errorCode: 404,
        errorMessage: res.locals.t('الصفحة المطلوبة غير متوفرة أو تم تعديل مسارها.', 'The requested page was not found.')
      });
    }

    res.render('pages/single-page', {
      title: res.locals.lang === 'en' ? (page.MetaTitleEn || page.TitleEn) : (page.MetaTitleAr || page.TitleAr),
      page
    });
  } catch (error) {
    next(error);
  }
});

/**
 * ملف Sitemap.xml لمحركات البحث
 */
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`;

    const systems = await prisma.system.findMany({
      select: { Slug: true, UpdatedAt: true }
    });

    const pages = await prisma.page.findMany({
      where: { IsActive: true },
      select: { Slug: true, UpdatedAt: true }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/systems</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    systems.forEach(s => {
      xml += `  <url>\n    <loc>${baseUrl}/system/${s.Slug}</loc>\n    <lastmod>${s.UpdatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    pages.forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}/page/${p.Slug}</loc>\n    <lastmod>${p.UpdatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

/**
 * ملف robots.txt
 */
router.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const content = `User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /\nSitemap: ${protocol}://${host}/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

module.exports = router;
