const prisma = require('../utils/prisma');
const { hashPassword } = require('../utils/security');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');
const { createFullBackup, listBackups } = require('../services/backupService');
const { getSiteSettings } = require('../middlewares/siteSettingsMiddleware');
const path = require('path');
const fs = require('fs');

/**
 * عرض صفحة إعدادات المنصة والنسخ الاحتياطي
 */
async function index(req, res, next) {
  try {
    const settings = await getSiteSettings(true); // تحديث إجباري
    const backups = listBackups();
    const systems = await prisma.system.findMany({
      orderBy: { IDSystem: 'asc' }
    });

    res.render('admin/settings/index', {
      title: 'إعدادات المنصة والنسخ الاحتياطي - لوحة الإدارة',
      settings,
      backups,
      systems,
      status: req.query.status || null
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تحديث إعدادات الهوية والتواصل والعملة
 */
async function updateSettings(req, res, next) {
  try {
    const fields = [
      'SiteNameAr', 'SiteNameEn', 'QuotationHeader',
      'WhatsappNumber', 'ContactEmail', 'ContactPhone',
      'PrimaryCurrency', 'ComingSoonMode',
      'ComingSoonMessageAr', 'ComingSoonMessageEn',
      'SocialFacebook', 'SocialTwitter', 'SocialLinkedin', 'SocialYoutube',
      'ShowAdminAccessLink'
    ];

    for (const key of fields) {
      if (typeof req.body[key] !== 'undefined') {
        let val = req.body[key];
        if (key === 'ComingSoonMode' || key === 'ShowAdminAccessLink') {
          val = (val === 'on' || val === 'true') ? 'true' : 'false';
        }
        await prisma.setting.upsert({
          where: { SettingKey: key },
          update: { SettingValue: val.toString() },
          create: { SettingKey: key, SettingValue: val.toString() }
        });
      }
    }

    // معالجة إلغاء تفعيل خيار إظهار زر الإدارة في حال عدم تحديده
    if (typeof req.body['SiteNameAr'] !== 'undefined' && typeof req.body['ShowAdminAccessLink'] === 'undefined') {
      await prisma.setting.upsert({
        where: { SettingKey: 'ShowAdminAccessLink' },
        update: { SettingValue: 'false' },
        create: { SettingKey: 'ShowAdminAccessLink', SettingValue: 'false' }
      });
    }

    // إعدادات الرموز المرفوعة إذا تم رفع شعار جديد
    if (req.file) {
      const logoPath = `/uploads/logos/${req.file.filename}`;
      await prisma.setting.upsert({
        where: { SettingKey: 'SiteLogo' },
        update: { SettingValue: logoPath },
        create: { SettingKey: 'SiteLogo', SettingValue: logoPath }
      });
    }

    await getSiteSettings(true); // تفريغ وتحديث الكاش
    res.redirect('/admin/settings?status=saved');
  } catch (error) {
    next(error);
  }
}

/**
 * تغيير كلمة المرور الرئيسية (Master Password)
 */
async function updateMasterPassword(req, res, next) {
  try {
    const { currentMasterPassword, newMasterPassword, confirmMasterPassword } = req.body;

    if (!newMasterPassword || newMasterPassword !== confirmMasterPassword) {
      return res.redirect('/admin/settings?status=pwd_mismatch');
    }

    const isCurrentValid = await verifyMasterPassword(currentMasterPassword);
    if (!isCurrentValid) {
      return res.redirect('/admin/settings?status=pwd_invalid');
    }

    const newHash = await hashPassword(newMasterPassword);
    await prisma.setting.upsert({
      where: { SettingKey: 'MasterPasswordHash' },
      update: { SettingValue: newHash },
      create: { SettingKey: 'MasterPasswordHash', SettingValue: newHash }
    });

    await getSiteSettings(true);
    res.redirect('/admin/settings?status=pwd_success');
  } catch (error) {
    next(error);
  }
}

/**
 * إنشاء نسخة احتياطية كاملة (ZIP)
 */
async function triggerBackup(req, res, next) {
  try {
    const result = await createFullBackup();
    console.log('✅ تم إنشاء نسخة احتياطية:', result.filename);
    res.redirect('/admin/settings?status=backup_created');
  } catch (error) {
    console.error('فشل إنشاء النسخة الاحتياطية:', error);
    res.redirect('/admin/settings?status=backup_failed');
  }
}

/**
 * تحميل نسخة احتياطية
 */
function downloadBackup(req, res) {
  const filename = req.params.filename;
  // منع directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, '../../public/uploads/backups', safeFilename);

  if (fs.existsSync(filePath)) {
    return res.download(filePath, safeFilename);
  }
  res.status(404).send('ملف النسخة الاحتياطية غير موجود');
}

/**
 * تحديث الأسماء التجارية وأكواد البورتات للمنظومات من لوحة الإعدادات
 */
async function updateSystemBrands(req, res, next) {
  try {
    const { brands } = req.body;
    if (brands && typeof brands === 'object') {
      for (const idStr of Object.keys(brands)) {
        const id = parseInt(idStr);
        const b = brands[idStr];
        await prisma.system.update({
          where: { IDSystem: id },
          data: {
            BrandNameAr: b.BrandNameAr ? b.BrandNameAr.trim() : null,
            BrandNameEn: b.BrandNameEn ? b.BrandNameEn.trim() : null,
            AppCode: b.AppCode ? b.AppCode.trim() : null,
            AppType: b.AppType || 'SAAS_CLOUD'
          }
        });
      }
    }
    res.redirect('/admin/settings?status=saved');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  updateSettings,
  updateSystemBrands,
  updateMasterPassword,
  triggerBackup,
  downloadBackup
};
