const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const marketingSummaries = {
  // 1. ساي جارد - إدارة شركات الأمن والحراسة
  'sayguard-security': {
    SummaryAr: 'منظومة سحابية متقدمة لإدارة شركات الحراسة والأمن؛ تتيح جدولة الورديات بدقة، وتتبع دوريات الحراس الميدانية لحظياً عبر الـ GPS ورموز الـ QR، مع توثيق بلاغات الحوادث الفورية وإدارة عقود المواقع والرواتب بأعلى كفاءة تشغيلية.',
    SummaryEn: 'An advanced cloud ERP for security and guarding firms; empowering live GPS and QR checkpoint patrol tracking, dynamic guard shift rostering, instant incident reporting, and streamlined client site billing.'
  },

  // 2. ساي ليجال - إدارة مكاتب المحاماة والاستشارات القانونية
  'saylegal-law-practice': {
    SummaryAr: 'منظومة سحابية متخصصة لمكاتب المحاماة والاستشارات القانونية؛ تنظم أرشيف القضايا الرقمي، وتوفر تقويماً ذكياً للجلسات ومواعيد الطعون مع تنبيهات واتساب للموكلين، وإدارة مرنة للأتعاب والمصروفات القضائية.',
    SummaryEn: 'Smart cloud legal ERP engineered for law firms and legal counsels; streamlining case dockets across all litigation stages, automated court hearing calendars, client WhatsApp alerts, and retainer fee accounting.'
  },

  // 3. ساي ملاك - إدارة اتحاد الملاك والعقارات
  'saymollak-hoa': {
    SummaryAr: 'المنظومة الرقمية الرائدة لإدارة اتحادات الملاك والكمبوندات السكنية؛ تضمن شفافية مالية مطلقة في تحصيل الاشتراكات، ومتابعة فواتير الصيانة والخدمات، مع بوابة إلكترونية لإعلانات وتصويت الجمعية العمومية.',
    SummaryEn: 'The premier digital platform for HOA syndicates and residential compounds; delivering absolute financial transparency in dues collection, facility maintenance auditing, and tenant voting portals.'
  },

  // 4. ساي كاشير - إدارة المبيعات والمشتريات والمخازن
  'say-cashier-pos': {
    SummaryAr: 'برنامج كاشير ومخازن فائق السرعة يعمل بكفاءة كاملة حتى مع انقطاع الإنترنت؛ يدعم الفاتورة الإلكترونية المعتمدة، الربط مع موازين الباركود، وإدارة الجرد والمستودعات المتعددة بحسابات أرباح فورية.',
    SummaryEn: 'High-speed offline-first POS and inventory software; fully compliant with certified electronic invoicing, barcode scale integration, multi-warehouse stock auditing, and instant profit analytics.'
  },

  // 5. ساي إديو - إدارة المدارس والمنشآت التعليمية
  'sayedu-education': {
    SummaryAr: 'منظومة تعليمية سحابية متكاملة للمدارس والمعاهد؛ تؤتمت شؤون الطلاب والقبول والامتحانات، مع إشعارات واتساب فورية للحضور والدرجات، وبوابة تفاعلية لأولياء الأمور ونظام ذكي لإدارة الأقساط والحافلات.',
    SummaryEn: 'All-inclusive educational cloud ERP for schools and academies; automating student admissions, official grade reporting, daily attendance alerts via WhatsApp, parent portals, tuition fees, and bus fleet routing.'
  },

  // 6. ساي كلينيك - إدارة المراكز الطبية والعيادات
  'say-clinic-medical': {
    SummaryAr: 'منظومة طبية ذكية لإدارة العيادات والمراكز الصحية؛ تقدم ملفاً طبياً إلكترونياً موحداً (EMR)، وروشتة علاجية ترسل عبر واتساب، مع تنظيم دقيق للمواعيد وحسابات نسب الأطباء وإيرادات العيادة.',
    SummaryEn: 'Intelligent health tech ERP for clinics and healthcare centers; featuring unified electronic medical records (EMR), instant digital prescriptions via WhatsApp, smart appointment scheduling, and physician split billing.'
  },

  // 7. ساي كونكريت - نظام إدارة محطات الخرسانة المسلحة
  'sayconcrete-plant': {
    SummaryAr: 'الحل التكنولوجي المتخصص لمحطات الخرسانة الجاهزة وشركات المقاولات؛ يربط خطوط الإنتاج بموازين البسكول، ويجدول حركة أسطول الخلاطات ومضخات الصب لحظياً مع ضبط الخلطات التصميمية ومستخلصات الصب.',
    SummaryEn: 'Specialized heavy industrial ERP for ready-mix concrete plants and contractors; integrating weighbridges, batch mix designs, real-time mixer fleet dispatching, and automated project pouring certificates.'
  }
};

async function main() {
  console.log('--- بدء تحديث النبذات التسويقية السريعة للمنظومات ---');

  for (const [slug, data] of Object.entries(marketingSummaries)) {
    const updated = await prisma.system.updateMany({
      where: { Slug: slug },
      data: {
        SummaryAr: data.SummaryAr,
        SummaryEn: data.SummaryEn,
        MetaDescAr: data.SummaryAr,
        MetaDescEn: data.SummaryEn
      }
    });
    console.log(`✓ تم تحديث المنظومة (${slug}): ${updated.count} سجل.`);
  }

  console.log('--- اكتمل التحديث بنجاح ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
