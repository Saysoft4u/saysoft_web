const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orderCount = await prisma.order.count();
  const messageCount = await prisma.message.count();

  console.log(`Current Orders: ${orderCount}, Messages: ${messageCount}`);

  if (orderCount === 0) {
    const now = new Date();
    const sampleOrders = [
      {
        OrderNumber: 'ORD-2026-1001',
        ClientName: 'شركة الأفق للحراسات الأمنية',
        CompanyName: 'مجموعة الأفق الأمنية المحدودة',
        WhatsappNumber: '966501234567',
        Email: 'info@alofoq-security.com',
        Notes: 'طلب ترخيص سحابي سنوي مع تدريب المشرفين',
        Status: 'ACTIVATED',
        TotalAmount: 2400,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي جارد لإدارة الحراسات الأمنية', packageNameAr: 'الباقة المتقدمة', period: 'سنوي', price: 2400 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 4, 12)
      },
      {
        OrderNumber: 'ORD-2026-1002',
        ClientName: 'مكتب المحامي خالد التميمي',
        CompanyName: 'شركة التميمي للمحاماة والاستشارات',
        WhatsappNumber: '966559876543',
        Email: 'law@altamimi.sa',
        Notes: 'تفعيل الربط مع ناجز وبوابة القضاء',
        Status: 'ACTIVATED',
        TotalAmount: 1800,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي ليجال لإدارة مكاتب المحاماة', packageNameAr: 'باقة المكاتب الكبرى', period: 'سنوي', price: 1800 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 3, 18)
      },
      {
        OrderNumber: 'ORD-2026-1003',
        ClientName: 'مدارس النخبة الأهلية',
        CompanyName: 'مجمع مدارس النخبة الحديثة',
        WhatsappNumber: '966543210987',
        Email: 'admin@nokhbah-edu.sa',
        Notes: 'منظومة هجينة لإدارة شؤون 1200 طالب وبوابة أولياء الأمور',
        Status: 'PENDING',
        TotalAmount: 3200,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي إديو لإدارة المدارس والمنشآت التعليمية', packageNameAr: 'باقة الصروح الأكاديمية', period: 'سنوي', price: 3200 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 5)
      },
      {
        OrderNumber: 'ORD-2026-1004',
        ClientName: 'مجموعة صيدليات ومراكز الشفاء',
        CompanyName: 'شركة الشفاء الطبية المتخصصة',
        WhatsappNumber: '201012345678',
        Email: 'contact@alshifa-clinics.com',
        Notes: 'ربط 3 فروع طبية مع الملف الطبي الإلكتروني',
        Status: 'CONTACTED',
        TotalAmount: 2100,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي كلينيك لإدارة المراكز الطبية', packageNameAr: 'باقة المراكز المتعددة', period: 'سنوي', price: 2100 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 24)
      },
      {
        OrderNumber: 'ORD-2026-1005',
        ClientName: 'شركة أسمنت الدلتا للخرسانة',
        CompanyName: 'مصانع الدلتا لمواد البناء',
        WhatsappNumber: '201198765432',
        Email: 'sales@deltaconcrete.net',
        Notes: 'ربط محطتي خلط أوتوماتيك مع موازين الشاحنات',
        Status: 'ACTIVATED',
        TotalAmount: 2900,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي كونكريت لإدارة محطات الخرسانة', packageNameAr: 'باقة المحطات والمصانع', period: 'ترخيص دائم', price: 2900 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth(), 8)
      },
      {
        OrderNumber: 'ORD-2026-1006',
        ClientName: 'أسواق ومخابز الواحة المركزية',
        CompanyName: 'سلسلة متاجر الواحة',
        WhatsappNumber: '966567890123',
        Email: 'ops@alwaha-markets.com',
        Notes: 'تطبيق كاشير سطح مكتب لعدد 6 نقاط بيع مع ربط سحابي',
        Status: 'PENDING',
        TotalAmount: 1550,
        Currency: 'USD',
        ItemsJson: JSON.stringify([
          { systemNameAr: 'منظومة ساي كاشير للمبيعات والمخازن', packageNameAr: 'باقة نقاط البيع المتعددة', period: 'سنوي', price: 1550 }
        ]),
        CreatedAt: new Date(now.getFullYear(), now.getMonth(), 19)
      }
    ];

    for (const ord of sampleOrders) {
      await prisma.order.create({ data: ord });
    }
    console.log(`✓ تم إضافة ${sampleOrders.length} طلبات تجريبية واقعية بنجاح.`);
  }

  if (messageCount === 0) {
    const now = new Date();
    const sampleMessages = [
      {
        SenderName: 'أ. عبد الله الشهري',
        WhatsappNumber: '966512345678',
        Email: 'a.alshehri@gmail.com',
        Subject: 'استفسار عن النسخة التجريبية لمنظومة المدارس',
        Message: 'السلام عليكم، نرغب في حجز جلسة استعراض حية للنسخة السحابية من منظومة ساي إديو لتجربة بوابة المعلمين والطلاب.',
        IsRead: true,
        SystemName: 'إدارة المدارس والمنشآت التعليمية',
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 2, 14)
      },
      {
        SenderName: 'أ. ماجد القحطاني',
        WhatsappNumber: '966598765432',
        Email: 'maj@qahtani-law.sa',
        Subject: 'طلب عرض سعر لمنظومة المحاماة لفرعين',
        Message: 'نود الاستفسار عن كلفة ترخيص منظومة ساي ليجال مع ميزة مزامنة الجلسات وإشعارات الواتساب لموكلينا.',
        IsRead: true,
        SystemName: 'إدارة مكاتب المحاماة والاستشارات القانونية',
        CreatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 10)
      },
      {
        SenderName: 'م. حسام السيد',
        WhatsappNumber: '201099887766',
        Email: 'hossam@alhandasya.eg',
        Subject: 'الربط مع طابعات الباركود الحرارية وموازين الكاشير',
        Message: 'هل تدعم منظومة ساي كاشير الربط المباشر مع موازين الباركود وأجهزة الدفع الإلكتروني في مصر والسعودية؟',
        IsRead: false,
        SystemName: 'إدارة المبيعات والمشتريات والمخازن',
        CreatedAt: new Date(now.getFullYear(), now.getMonth(), 16)
      },
      {
        SenderName: 'د. سارة المنصور',
        WhatsappNumber: '966533445566',
        Email: 'dr.sarah@elitecare.med',
        Subject: 'استفسار عن الربط مع منصة نفيس والتأمين الطبي',
        Message: 'نرحب بالتواصل معكم لمعرفة تفاصيل منظومة ساي كلينيك وخاصية إدارة مواعيد المرضى والمطالبات التأمينية.',
        IsRead: false,
        SystemName: 'إدارة المراكز الطبية والعيادات',
        CreatedAt: new Date(now.getFullYear(), now.getMonth(), 20)
      }
    ];

    for (const msg of sampleMessages) {
      await prisma.message.create({ data: msg });
    }
    console.log(`✓ تم إضافة ${sampleMessages.length} استفسارات ورسائل تواصل واقعية بنجاح.`);
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
