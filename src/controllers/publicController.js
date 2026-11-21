const prisma = require('../utils/prisma');

// خريطة الروابط البديلة والموسعة للمنظومات لمنع أي خطأ 404
const slugAliases = {
  'sayguard-security-platform': 'sayguard-security',
  'sayedfa-property-management': 'saymollak-hoa',
  'saycashier-pos-system': 'say-cashier-pos',
  'sayclinic-medical-center': 'say-clinic-medical',
  'sayconcrete-batching-plant': 'sayconcrete-plant',
  'sayedu-schools-and-institutes': 'sayedu-education'
};

/**
 * كتالوج المنظومات والحلول السحابية (All Systems)
 */
async function getSystems(req, res, next) {
  try {
    const { search, sector: sectorSlug } = req.query;

    const where = { IsActive: true };
    if (search) {
      where.OR = [
        { NameAr: { contains: search } },
        { NameEn: { contains: search } },
        { SummaryAr: { contains: search } },
        { SummaryEn: { contains: search } }
      ];
    }

    let activeSector = null;
    if (sectorSlug) {
      activeSector = await prisma.sector.findUnique({
        where: { Slug: sectorSlug }
      });
      if (activeSector) {
        where.SectorID = activeSector.IDSector;
      }
    }

    const [systems, sectors] = await Promise.all([
      prisma.system.findMany({
        where,
        include: {
          Sector: true,
          Packages: true
        },
        orderBy: { IDSystem: 'desc' }
      }),
      prisma.sector.findMany({
        where: { IsActive: true },
        orderBy: { SortOrder: 'asc' }
      })
    ]);

    res.render('pages/systems', {
      title: res.locals.t('كتالوج المنظومات والحلول السحابية - سايسوفت', 'Systems & Cloud Solutions Catalog - Saysoft'),
      systems,
      sectors,
      activeSectorSlug: sectorSlug || '',
      searchQuery: search || ''
    });
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة تفاصيل منظومة واحدة (System Details)
 */
async function getSystemDetails(req, res, next) {
  try {
    const { slug } = req.params;
    const lookupSlug = slugAliases[slug] || slug;

    const system = await prisma.system.findUnique({
      where: { Slug: lookupSlug },
      include: {
        Sector: true,
        Packages: true,
        FAQs: true,
        Images: {
          orderBy: { SortOrder: 'asc' }
        }
      }
    });

    const isAdmin = req.session && req.session.userId;
    if (!system || (!system.IsActive && !isAdmin)) {
      return res.status(404).render('pages/error', {
        title: res.locals.t('المنظومة غير موجودة', 'System Not Found'),
        errorCode: 404,
        errorMessage: res.locals.t('عذراً، المنظومة المطلوبة غير متوفرة أو تم تغيير الرابط.', 'The requested system was not found.')
      });
    }

    // زيادة عداد المشاهدات
    await prisma.system.update({
      where: { IDSystem: system.IDSystem },
      data: { ViewsCount: { increment: 1 } }
    });

    res.render('pages/system-details', {
      title: res.locals.lang === 'en' ? (system.MetaTitleEn || system.NameEn) : (system.MetaTitleAr || system.NameAr),
      metaDescription: res.locals.lang === 'en' ? (system.MetaDescEn || system.SummaryEn) : (system.MetaDescAr || system.SummaryAr),
      metaKeywords: res.locals.lang === 'en' ? (system.MetaKeywordsEn || '') : (system.MetaKeywordsAr || ''),
      system,
      inquiryStatus: req.query.inquiry || null
    });
  } catch (error) {
    next(error);
  }
}

/**
 * إرسال استفسار سريع من صفحة المنظومة
 */
async function submitSystemInquiry(req, res, next) {
  try {
    const { slug } = req.params;
    const lookupSlug = slugAliases[slug] || slug;
    const { senderName, whatsappNumber, email, message, systemId, systemName } = req.body;

    if (!senderName || !whatsappNumber || !message) {
      return res.redirect(`/system/${lookupSlug}?inquiry=missing#inquiryForm`);
    }

    await prisma.message.create({
      data: {
        SystemID: systemId ? parseInt(systemId) : null,
        SystemName: systemName || null,
        SenderName: senderName.trim(),
        WhatsappNumber: whatsappNumber.trim(),
        Email: email ? email.trim() : null,
        Subject: `استفسار عن منظومة: ${systemName || lookupSlug}`,
        Message: message.trim()
      }
    });

    res.redirect(`/system/${lookupSlug}?inquiry=success#inquiryForm`);
  } catch (error) {
    next(error);
  }
}

/**
 * عرض سلة المبيعات (Cart)
 */
function getCart(req, res) {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  res.render('pages/cart', {
    title: res.locals.t('سلة المبيعات وإتمام الطلب - سايسوفت', 'Sales Cart & Checkout - Saysoft'),
    cart,
    totalAmount: total,
    currency: res.locals.settings.PrimaryCurrency || 'USD'
  });
}

/**
 * إضافة باقة منظومة للسلة
 */
async function addToCart(req, res) {
  try {
    const { packageId, systemSlug } = req.body;
    const pkg = await prisma.package.findUnique({
      where: { IDPackage: parseInt(packageId) },
      include: { System: true }
    });

    if (!pkg) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
      }
      return res.redirect(systemSlug ? `/system/${systemSlug}` : '/systems');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // التحقق هل العنصر مضاف مسبقاً
    const existingIndex = req.session.cart.findIndex(i => i.packageId === pkg.IDPackage);
    if (existingIndex > -1) {
      req.session.cart[existingIndex].quantity += 1;
    } else {
      req.session.cart.push({
        packageId: pkg.IDPackage,
        systemId: pkg.SystemID,
        systemNameAr: pkg.System.NameAr,
        systemNameEn: pkg.System.NameEn,
        systemSlug: pkg.System.Slug,
        systemLogo: pkg.System.Logo,
        packageNameAr: pkg.NameAr,
        packageNameEn: pkg.NameEn,
        period: pkg.Period,
        price: pkg.Price,
        quantity: 1
      });
    }

    if (req.xhr || req.headers.accept?.includes('json')) {
      const count = req.session.cart.reduce((s, i) => s + (i.quantity || 1), 0);
      return res.json({ success: true, cartCount: count });
    }

    res.redirect('/cart');
  } catch (error) {
    console.error('خطأ في إضافة العنصر للسلة:', error);
    res.redirect('/cart');
  }
}

/**
 * إزالة عنصر من السلة
 */
function removeFromCart(req, res) {
  const { packageId } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(i => i.packageId !== parseInt(packageId));
  }
  res.redirect('/cart');
}

/**
 * إفراغ السلة بالكامل
 */
function clearCart(req, res) {
  req.session.cart = [];
  res.redirect('/cart');
}

/**
 * تأكيد الطلب وحفظه بقاعدة البيانات
 */
async function checkout(req, res, next) {
  try {
    const { clientName, companyName, whatsappNumber, email, notes } = req.body;
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.redirect('/cart');
    }

    if (!clientName || !whatsappNumber) {
      return res.redirect('/cart?error=missing_fields');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const currency = res.locals.settings.PrimaryCurrency || 'USD';
    const uniqueNumber = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = await prisma.order.create({
      data: {
        OrderNumber: uniqueNumber,
        ClientName: clientName.trim(),
        CompanyName: companyName ? companyName.trim() : null,
        WhatsappNumber: whatsappNumber.trim(),
        Email: email ? email.trim() : null,
        Notes: notes ? notes.trim() : null,
        TotalAmount: total,
        Currency: currency,
        ItemsJson: JSON.stringify(cart),
        Status: 'PENDING'
      }
    });

    // تفريغ السلة بعد إتمام الطلب
    req.session.cart = [];

    // توجيه لصفحة تأكيد الطلب مع تجهيز رسالة الواتساب
    res.redirect(`/order/confirmation/${order.OrderNumber}`);
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة تأكيد الطلب
 */
async function orderConfirmation(req, res, next) {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { OrderNumber: orderNumber }
    });

    if (!order) {
      return res.status(404).render('pages/error', {
        title: 'الطلب غير موجود',
        errorCode: 404,
        errorMessage: 'لم يتم العثور على تفاصيل هذا الطلب.'
      });
    }

    let items = [];
    try {
      items = JSON.parse(order.ItemsJson);
    } catch (e) {
      items = [];
    }

    res.render('pages/order-confirmation', {
      title: res.locals.t(`تم تأكيد الطلب #${order.OrderNumber} - سايسوفت`, `Order #${order.OrderNumber} Confirmed - Saysoft`),
      order,
      items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة اتصل بنا (Contact Us)
 */
function getContact(req, res) {
  res.render('pages/contact', {
    title: res.locals.t('اتصل بنا - شركة سايسوفت للحلول الرقمية', 'Contact Us - Saysoft Digital Solutions'),
    status: req.query.status || null
  });
}

/**
 * إرسال رسالة من صفحة اتصل بنا
 */
async function submitContact(req, res, next) {
  try {
    const { senderName, whatsappNumber, email, subject, message } = req.body;

    if (!senderName || !whatsappNumber || !message) {
      return res.redirect('/contact?status=missing');
    }

    await prisma.message.create({
      data: {
        SenderName: senderName.trim(),
        WhatsappNumber: whatsappNumber.trim(),
        Email: email ? email.trim() : null,
        Subject: subject ? subject.trim() : 'استفسار عام من صفحة اتصل بنا',
        Message: message.trim()
      }
    });

    res.redirect('/contact?status=success');
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة خدماتنا (Our Services)
 */
async function getServices(req, res, next) {
  try {
    const status = req.query.status || null;
    res.render('pages/services', {
      title: res.locals.t('خدماتنا الرقمية والبرمجية - شركة سايسوفت', 'Our Digital & Software Services - Saysoft'),
      status
    });
  } catch (error) {
    next(error);
  }
}

/**
 * إرسال طلب خدمة من صفحة خدماتنا
 */
async function submitServicesInquiry(req, res, next) {
  try {
    const { senderName, whatsappNumber, email, serviceType, subject, message } = req.body;

    if (!senderName || !whatsappNumber || !message) {
      return res.redirect('/services?status=missing#service-form');
    }

    const fullSubject = serviceType ? `[طلب خدمة: ${serviceType}] ${subject ? subject.trim() : ''}` : (subject ? subject.trim() : 'طلب خدمة برمجية جديدة');

    await prisma.message.create({
      data: {
        SenderName: senderName.trim(),
        WhatsappNumber: whatsappNumber.trim(),
        Email: email ? email.trim() : null,
        Subject: fullSubject.trim(),
        Message: message.trim()
      }
    });

    res.redirect('/services?status=success#service-form');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSystems,
  getSystemDetails,
  submitSystemInquiry,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  checkout,
  orderConfirmation,
  getContact,
  submitContact,
  getServices,
  submitServicesInquiry
};
