const prisma = require('../utils/prisma');

/**
 * تبديل لغة الموقع وحفظها في الجلسة (Session)
 */
function setLanguage(req, res) {
  const { lang } = req.body;
  const targetLang = (lang === 'en') ? 'en' : 'ar';
  req.session.lang = targetLang;

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({ success: true, lang: targetLang, dir: targetLang === 'ar' ? 'rtl' : 'ltr' });
  }

  const referrer = req.get('Referrer') || '/';
  res.redirect(referrer);
}

/**
 * تبديل الثيم اللوني وحفظه في الجلسة (Session)
 */
function setTheme(req, res) {
  const { theme } = req.body;
  const validThemes = ['tech-blue', 'dark-mode', 'modern-emerald', 'classic-slate', 'royal-gold'];
  const targetTheme = validThemes.includes(theme) ? theme : 'tech-blue';

  req.session.theme = targetTheme;

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({ success: true, theme: targetTheme });
  }

  const referrer = req.get('Referrer') || '/';
  res.redirect(referrer);
}

/**
 * فحص سلامة الخادم (Health Check)
 */
function healthCheck(req, res) {
  res.json({
    status: 'healthy',
    system: 'Saysoft Digital Solutions Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
}

/**
 * تسجيل مشترك جديد في صفحة قيد الإنشاء / قريباً
 */
async function subscribeComingSoon(req, res) {
  try {
    const { fullName, whatsappNumber, notes, systemSlug, systemName } = req.body;

    const redirectQuery = systemSlug ? `&system=${encodeURIComponent(systemSlug)}` : '';

    if (!fullName || !whatsappNumber) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(400).json({ success: false, message: 'يرجى إدخال الاسم ورقم الواتساب' });
      }
      return res.redirect(`/coming-soon?status=missing${redirectQuery}`);
    }

    const fullNotes = systemName 
      ? `طلب اشتراك لمنظومة (${systemName})${notes ? ` - ${notes.trim()}` : ''}`
      : (notes ? notes.trim() : null);

    await prisma.comingSoonSubscriber.create({
      data: {
        FullName: fullName.trim(),
        WhatsappNumber: whatsappNumber.trim(),
        Notes: fullNotes
      }
    });

    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, message: 'تم تسجيل بياناتك بنجاح، سنوافيك بالجديد فور الإطلاق!' });
    }

    res.redirect(`/coming-soon?status=success${redirectQuery}`);
  } catch (error) {
    console.error('خطأ أثناء تسجيل المشترك:', error);
    const systemSlug = req.body.systemSlug;
    const redirectQuery = systemSlug ? `&system=${encodeURIComponent(systemSlug)}` : '';
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(500).json({ success: false, message: 'تعذر الحفظ حالياً' });
    }
    res.redirect(`/coming-soon?status=error${redirectQuery}`);
  }
}

module.exports = {
  setLanguage,
  setTheme,
  healthCheck,
  subscribeComingSoon
};
