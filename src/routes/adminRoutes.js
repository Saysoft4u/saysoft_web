const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const prisma = require('../utils/prisma');
const { uploadSingleLogo, uploadSingleMedia, uploadSystemGallery } = require('../services/uploadService');

const systemsController = require('../controllers/adminSystemsController');
const ordersController = require('../controllers/adminOrdersController');
const pagesController = require('../controllers/adminPagesController');
const messagesController = require('../controllers/adminMessagesController');
const marketingController = require('../controllers/adminMarketingController');
const mediaController = require('../controllers/adminMediaController');
const settingsController = require('../controllers/adminSettingsController');
const usersController = require('../controllers/adminUsersController');

// حماية كافة مسارات لوحة الإدارة بالمصادقة
router.use(isAuthenticated);

// ==============================================================================
// 1. الرئيسية والإحصائيات العامة والرسوم البيانية التفاعلية
// ==============================================================================
router.get('/', async (req, res, next) => {
  try {
    const [
      systemsCount,
      ordersCount,
      messagesCount,
      subscribersCount,
      systems,
      orders,
      messages
    ] = await Promise.all([
      prisma.system.count(),
      prisma.order.count(),
      prisma.message.count(),
      prisma.comingSoonSubscriber.count(),
      prisma.system.findMany({
        select: {
          IDSystem: true,
          NameAr: true,
          BrandNameAr: true,
          ViewsCount: true,
          AppType: true,
          ProductStatus: true,
          Sector: { select: { NameAr: true } }
        },
        orderBy: { ViewsCount: 'desc' }
      }),
      prisma.order.findMany({
        select: {
          IDOrder: true,
          OrderNumber: true,
          ClientName: true,
          WhatsappNumber: true,
          Status: true,
          TotalAmount: true,
          Currency: true,
          CreatedAt: true
        },
        orderBy: { CreatedAt: 'desc' }
      }),
      prisma.message.findMany({
        select: {
          IDMessage: true,
          IsRead: true,
          CreatedAt: true
        },
        orderBy: { CreatedAt: 'desc' }
      })
    ]);

    const recentOrders = orders.slice(0, 5);

    // حساب إجمالي المشاهدات ومبالغ المبيعات
    const totalViews = systems.reduce((acc, cur) => acc + (cur.ViewsCount || 0), 0);
    const totalRevenue = orders
      .filter(o => o.Status === 'ACTIVATED')
      .reduce((acc, cur) => acc + (cur.TotalAmount || 0), 0);
    const pendingOrdersCount = orders.filter(o => o.Status === 'PENDING').length;
    const unreadMessagesCount = messages.filter(m => !m.IsRead).length;

    // 1. بيانات مخطط المشاهدات لكل منظومة (Bar Chart)
    const viewsChartData = {
      labels: systems.map(s => s.BrandNameAr || s.NameAr),
      views: systems.map(s => s.ViewsCount || 0),
      appTypes: systems.map(s => s.AppType || 'SAAS_CLOUD')
    };

    // 2. بيانات مخطط توزيع نوع التطبيق (Doughnut Chart)
    const appTypeLabelsMap = {
      SAAS_CLOUD: 'سحابي ساس (SaaS)',
      DESKTOP_APP: 'سطح مكتب (Desktop)',
      WEB_APP: 'ويب مخصص (Web App)',
      HYBRID_SUITE: 'منظومة هجينة (Hybrid)',
      MOBILE_APP: 'تطبيق جوال (Mobile)'
    };
    const appTypesCounts = {
      SAAS_CLOUD: 0,
      DESKTOP_APP: 0,
      WEB_APP: 0,
      HYBRID_SUITE: 0,
      MOBILE_APP: 0
    };
    systems.forEach(s => {
      const type = s.AppType || 'SAAS_CLOUD';
      if (appTypesCounts[type] !== undefined) {
        appTypesCounts[type]++;
      } else {
        appTypesCounts['SAAS_CLOUD']++;
      }
    });

    const appTypesChartData = {
      labels: Object.keys(appTypesCounts).map(k => appTypeLabelsMap[k]),
      data: Object.values(appTypesCounts),
      keys: Object.keys(appTypesCounts)
    };

    // 3. بيانات مخطط حالات الطلبات (Order Statuses Pie/Doughnut)
    const statusLabelsMap = {
      PENDING: 'جديد (قيد المراجعة)',
      CONTACTED: 'تم التواصل',
      ACTIVATED: 'مفعل ومكتمل',
      CANCELLED: 'ملغي'
    };
    const statusCounts = {
      PENDING: 0,
      CONTACTED: 0,
      ACTIVATED: 0,
      CANCELLED: 0
    };
    orders.forEach(o => {
      const st = o.Status || 'PENDING';
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      }
    });

    const orderStatusChartData = {
      labels: Object.keys(statusCounts).map(k => statusLabelsMap[k]),
      data: Object.values(statusCounts),
      colors: ['#f59e0b', '#0284c7', '#10b981', '#ef4444']
    };

    // 4. بيانات الخط الزمني لآخر 6 أشهر (Monthly Trend Line Chart)
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const now = new Date();
    const timelineLabels = [];
    const monthlyOrdersCount = [0, 0, 0, 0, 0, 0];
    const monthlyMessagesCount = [0, 0, 0, 0, 0, 0];
    const monthlyRevenue = [0, 0, 0, 0, 0, 0];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = arabicMonths[d.getMonth()] + ' ' + d.getFullYear();
      timelineLabels.push(mName);
    }

    orders.forEach(o => {
      const oDate = new Date(o.CreatedAt);
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        if (oDate.getFullYear() === d.getFullYear() && oDate.getMonth() === d.getMonth()) {
          const idx = 5 - i;
          monthlyOrdersCount[idx]++;
          if (o.Status === 'ACTIVATED') {
            monthlyRevenue[idx] += (o.TotalAmount || 0);
          }
          break;
        }
      }
    });

    messages.forEach(m => {
      const mDate = new Date(m.CreatedAt);
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        if (mDate.getFullYear() === d.getFullYear() && mDate.getMonth() === d.getMonth()) {
          const idx = 5 - i;
          monthlyMessagesCount[idx]++;
          break;
        }
      }
    });

    const timelineChartData = {
      labels: timelineLabels,
      orders: monthlyOrdersCount,
      messages: monthlyMessagesCount,
      revenue: monthlyRevenue
    };

    res.render('admin/dashboard', {
      title: 'لوحة التحكم والإحصائيات - سايسوفت',
      stats: {
        systemsCount,
        ordersCount,
        messagesCount,
        subscribersCount,
        totalViews,
        totalRevenue,
        pendingOrdersCount,
        unreadMessagesCount
      },
      recentOrders,
      chartData: {
        views: viewsChartData,
        appTypes: appTypesChartData,
        orderStatus: orderStatusChartData,
        timeline: timelineChartData
      }
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 2. إدارة المنظومات والنسخ السريع
// ==============================================================================
router.get('/systems', systemsController.index);
router.get('/systems/credentials', systemsController.getOwnerCredentials);
router.get('/credentials', (req, res) => res.redirect('/admin/systems/credentials'));
router.get('/systems/new', systemsController.create);
router.post('/systems/new', uploadSystemGallery, systemsController.store);
router.get('/systems/edit/:id', systemsController.edit);
router.post('/systems/edit/:id', uploadSystemGallery, systemsController.update);
router.post('/systems/duplicate/:id', systemsController.duplicate);
router.post('/systems/delete/:id', systemsController.destroy);
router.post('/systems/images/delete/:id', systemsController.deleteImage);

// ==============================================================================
// 3. إدارة طلبات الشراء وعروض الأسعار PDF
// ==============================================================================
router.get('/orders', ordersController.index);
router.get('/orders/view/:id', ordersController.view);
router.post('/orders/status/:id', ordersController.updateStatus);
router.get('/orders/quotation/:id', ordersController.quotation);
router.post('/orders/delete/:id', ordersController.destroy);

// ==============================================================================
// 4. إدارة الصفحات المخصصة
// ==============================================================================
router.get('/pages', pagesController.index);
router.get('/pages/new', pagesController.create);
router.post('/pages/new', pagesController.store);
router.get('/pages/edit/:id', pagesController.edit);
router.post('/pages/edit/:id', pagesController.update);
router.post('/pages/delete/:id', pagesController.destroy);

// ==============================================================================
// 5. إدارة الرسائل والمشتركين
// ==============================================================================
router.get('/messages', messagesController.index);
router.post('/messages/toggle-read/:id', messagesController.toggleRead);
router.post('/messages/delete/:id', messagesController.destroyMessage);
router.post('/subscribers/delete/:id', messagesController.destroySubscriber);

// ==============================================================================
// 6. إدارة المحتوى التسويقي (الأسئلة والآراء)
// ==============================================================================
router.get('/marketing', marketingController.index);
router.post('/marketing/faqs/new', marketingController.storeFaq);
router.post('/marketing/faqs/delete/:id', marketingController.destroyFaq);
router.post('/marketing/testimonials/new', marketingController.storeTestimonial);
router.post('/marketing/testimonials/delete/:id', marketingController.destroyTestimonial);

// ==============================================================================
// 7. مكتبة الوسائط
// ==============================================================================
router.get('/media', mediaController.index);
router.post('/media/upload', uploadSingleMedia, mediaController.uploadFile);
router.post('/media/delete', mediaController.destroyFile);

// ==============================================================================
// 8. إعدادات المنصة والنسخ الاحتياطي
// ==============================================================================
router.get('/settings', settingsController.index);
router.post('/settings/update', uploadSingleLogo, settingsController.updateSettings);
router.post('/settings/brands', settingsController.updateSystemBrands);
router.post('/settings/master-password', settingsController.updateMasterPassword);
router.post('/settings/backup/create', settingsController.triggerBackup);
router.get('/settings/backup/download/:filename', settingsController.downloadBackup);

// ==============================================================================
// 9. إدارة المسؤولين والمستخدمين وتعديل الأسماء وكلمات المرور
// ==============================================================================
router.get('/users', usersController.index);
router.get('/users/new', usersController.create);
router.post('/users/new', usersController.store);
router.get('/users/edit/:id', usersController.edit);
router.post('/users/edit/:id', usersController.update);
router.post('/users/toggle-active/:id', usersController.toggleActive);
router.post('/users/delete/:id', usersController.destroy);

module.exports = router;
