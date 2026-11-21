const prisma = require('../utils/prisma');

// ذاكرة تخزين مؤقتة للإعدادات لتسريع الاستجابة وتفادي الاستعلام المتكرر
let cachedSettings = null;
let lastSettingsFetch = 0;
const CACHE_TTL_MS = 60 * 1000; // دقيقة واحدة

async function getSiteSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedSettings && (now - lastSettingsFetch < CACHE_TTL_MS)) {
    return cachedSettings;
  }

  try {
    const settingsList = await prisma.setting.findMany();
    const settingsObj = {};
    for (const item of settingsList) {
      settingsObj[item.SettingKey] = item.SettingValue;
    }
    cachedSettings = settingsObj;
    lastSettingsFetch = now;
    return cachedSettings;
  } catch (error) {
    console.error('تعذر جلب إعدادات الموقع من قاعدة البيانات:', error);
    return cachedSettings || {};
  }
}

/**
 * وسيط تحميل إعدادات الموقع العامة واللغة والثيم وسلة المشتريات
 */
async function siteSettingsMiddleware(req, res, next) {
  try {
    const settings = await getSiteSettings();

    // 1. إدارة اللغة (العربية افتراضياً) مع دعم تبديلها عبر query param
    if (req.query.lang && ['ar', 'en'].includes(req.query.lang)) {
      req.session.lang = req.query.lang;
    }
    if (!req.session.lang) {
      req.session.lang = 'ar';
    }
    const currentLang = req.session.lang;
    const isRtl = currentLang === 'ar';

    // 2. إدارة الثيم اللوني (tech-blue افتراضياً)
    const validThemes = ['tech-blue', 'dark-mode', 'modern-emerald', 'classic-slate', 'royal-gold'];
    if (!req.session.theme || !validThemes.includes(req.session.theme)) {
      req.session.theme = 'tech-blue';
    }
    const currentTheme = req.session.theme;

    // 3. إدارة السلة
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const cartCount = req.session.cart.reduce((total, item) => total + (item.quantity || 1), 0);

    // 4. دالة مساعدة لاختيار النص المناسب حسب اللغة الحالية
    const t = (arText, enText) => {
      if (currentLang === 'en' && enText) return enText;
      return arText || enText || '';
    };

    // 5. تمرير المتغيرات العامة لجميع قوالب EJS
    res.locals.settings = settings;
    res.locals.lang = currentLang;
    res.locals.isRtl = isRtl;
    res.locals.dir = isRtl ? 'rtl' : 'ltr';
    res.locals.theme = currentTheme;
    res.locals.cart = req.session.cart;
    res.locals.cartCount = cartCount;
    res.locals.currentUser = req.session.user || null;
    res.locals.currentPath = req.path;
    res.locals.currentYear = new Date().getFullYear();
    res.locals.t = t;

    // 6. التحقق من وضع "قريباً / قيد الإنشاء" (Coming Soon Mode)
    const isComingSoonActive = settings.ComingSoonMode === 'true';
    if (isComingSoonActive) {
      const isAdminLoggedIn = req.session.user && (req.session.user.Role === 'ADMIN' || req.session.user.Role === 'EDITOR');
      const isAllowedRoute = 
        req.path.startsWith('/admin') ||
        req.path.startsWith('/auth') ||
        req.path.startsWith('/api') ||
        req.path === '/coming-soon' ||
        req.path.startsWith('/uploads') ||
        req.path.startsWith('/css') ||
        req.path.startsWith('/js') ||
        req.path.startsWith('/images');

      if (!isAdminLoggedIn && !isAllowedRoute) {
        return res.redirect('/coming-soon');
      }
    }

    next();
  } catch (error) {
    console.error('خطأ في وسيط الإعدادات العامة:', error);
    next(error);
  }
}

module.exports = {
  siteSettingsMiddleware,
  getSiteSettings
};
