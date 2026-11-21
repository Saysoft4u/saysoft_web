const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SayEdu system and education sector...');

  // 1. Sector
  const eduSector = await prisma.sector.upsert({
    where: { Slug: 'education-schools' },
    update: {},
    create: {
      NameAr: 'التعليم والمدارس والمعاهد الأكاديمية',
      NameEn: 'Education, Schools & Academic Institutes',
      Slug: 'education-schools',
      Icon: 'fa-graduation-cap',
      SortOrder: 5,
      IsActive: true
    }
  });
  console.log('Sector ready:', eduSector.IDSector, eduSector.NameAr);

  // 2. System
  const sayEdu = await prisma.system.upsert({
    where: { Slug: 'sayedu-education' },
    update: {
      SectorID: eduSector.IDSector,
      Logo: '/uploads/logos/saylogo.png',
      IsFeatured: true,
      SortOrder: 4
    },
    create: {
      SectorID: eduSector.IDSector,
      NameAr: 'منظومة ساي إديو لإدارة المدارس والمعاهد والمنشآت التعليمية',
      NameEn: 'SayEdu - Education & School Management Cloud System',
      Slug: 'sayedu-education',
      SummaryAr: 'منظومة سحابية متكاملة لإدارة شؤون الطلاب، الدرجات، الجداول، الأقساط، وبوابة أولياء الأمور.',
      SummaryEn: 'Comprehensive educational cloud ERP for student affairs, grading, timetables, parent portals, and tuition fees.',
      DescriptionAr: `<div class="system-rich-desc">
<h3>ريادة الحلول البرمجية التعليمية السحابية</h3>
<p>منظومة ساي إديو (SayEdu) هي الحل السحابي المتكامل لإدارة المدارس الأهلية، المعاهد الأكاديمية، ومراكز التدريب. تقدم المنظومة أتمتة كاملة لملفات الطلاب والقبول والتسجيل، إدارة الكادر التدريسي، رصد الدرجات والشهادات وفق المعايير الرسمية، إدارة الجداول والحصص، تتبع الحضور والغياب اليومي مع إشعارات فورية عبر واتساب، نظام مالي ذكي لمتابعة الأقساط والفواتير الإلكترونية، وبوابات تفاعلية مخصصة للطلاب وأولياء الأمور.</p>
<h4>أبرز المزايا والوظائف:</h4>
<ul>
  <li>إدارة شؤون الطلاب والملفات الأكاديمية والقبول والتسجيل الإلكتروني.</li>
  <li>نظام الامتحانات وإصدار الشهادات والتقارير المدرسية الرسمية.</li>
  <li>جدولة الحصص الدراسية وإدارة القاعات وتوزيع المعلمين.</li>
  <li>تتبع الحضور والغياب اليومي مع إرسال تنبيهات تلقائية لأولياء الأمور عبر واتساب.</li>
  <li>نظام مالي متكامل لإدارة الأقساط المدرسية وسندات القبض والفاتورة الإلكترونية.</li>
  <li>بوابة إلكترونية تفاعلية لولي الأمر والطالب وتطبيق للهاتف الذكي.</li>
  <li>إدارة خطوط النقل والحافلات المدرسية وسائقي الباصات وتتبع المسارات.</li>
</ul>
</div>`,
      DescriptionEn: `<div class="system-rich-desc">
<h3>Leading Cloud Education Management ERP</h3>
<p>SayEdu is an advanced cloud ERP engineered for private schools, training academies, and educational institutions. Features full automation of student admissions, academic records, grading systems, interactive parent/student portals, and installment invoicing.</p>
</div>`,
      Logo: '/uploads/logos/saylogo.png',
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/edu',
      IsFeatured: true,
      SortOrder: 4,
      IsActive: true
    }
  });
  console.log('System ready:', sayEdu.IDSystem, sayEdu.NameAr);

  // 3. Packages
  await prisma.package.deleteMany({ where: { SystemID: sayEdu.IDSystem } });
  await prisma.package.createMany({
    data: [
      {
        SystemID: sayEdu.IDSystem,
        NameAr: 'الباقة الأساسية (للمعاهد والمراكز)',
        NameEn: 'Standard Tier (Centers & Academies)',
        Price: 199,
        PeriodAr: 'سنوياً',
        PeriodEn: 'Yearly',
        FeaturesAr: 'حتى 300 طالب\nشؤون الطلاب والامتحانات\nطباعة الشهادات وكشوف الدرجات\nدعم فني عبر البريد الإلكتروني',
        FeaturesEn: 'Up to 300 students\nStudent affairs & grading\nCertificate printing\nEmail technical support',
        IsPopular: false,
        SortOrder: 1
      },
      {
        SystemID: sayEdu.IDSystem,
        NameAr: 'الباقة الاحترافية (للمدارس المتكاملة)',
        NameEn: 'Pro Tier (Full School)',
        Price: 480,
        PeriodAr: 'سنوياً',
        PeriodEn: 'Yearly',
        FeaturesAr: 'عدد غير محدود من الطلاب\nبوابة ولي الأمر والطالب\nإرسال تنبيهات واتساب التلقائية\nإدارة الأقساط والمحاسبة المدرسية\nإدارة خطوط الحافلات والنقل\nدعم فني مخصص 24/7',
        FeaturesEn: 'Unlimited students\nParent & student online portals\nAutomated WhatsApp alerts\nTuition installments & accounting\nBus fleet route management\n24/7 priority support',
        IsPopular: true,
        SortOrder: 2
      },
      {
        SystemID: sayEdu.IDSystem,
        NameAr: 'ترخيص النسخة المستقلة الدائمة',
        NameEn: 'Enterprise Dedicated License',
        Price: 1250,
        PeriodAr: 'ترخيص مدى الحياة',
        PeriodEn: 'Lifetime License',
        FeaturesAr: 'تنصيب كامل على سيرفر المؤسسة الخاص\nقاعدة بيانات سحابية مستقلة\nتخصيص كامل للهوية والتصميم\nتدريب مباشر للكادر الإداري والتربوي\nصيانة وتحديثات مجانية لمدة عام',
        FeaturesEn: 'Deployment on private dedicated server\nDedicated cloud database\nFull institutional branding\nStaff training & onboarding\n1 year free updates & maintenance',
        IsPopular: false,
        SortOrder: 3
      }
    ]
  });
  console.log('Packages created.');

  // 4. FAQs
  await prisma.systemFAQ.deleteMany({ where: { SystemID: sayEdu.IDSystem } });
  await prisma.systemFAQ.createMany({
    data: [
      {
        SystemID: sayEdu.IDSystem,
        QuestionAr: 'هل تدعم منظومة ساي إديو إرسال تنبيهات الغياب والدرجات عبر واتساب؟',
        QuestionEn: 'Does SayEdu support sending attendance and grade alerts to parents via WhatsApp?',
        AnswerAr: 'نعم، تحتوي المنظومة على ربط مباشر مع بوابات واتساب تمكّن الإدارة المدرسية من إرسال تقارير الغياب اليومية وكشوف الدرجات وتذكيرات الأقساط لأولياء الأمور تلقائياً.',
        AnswerEn: 'Yes, SayEdu integrates with WhatsApp gateways to deliver real-time notifications for daily attendance, report cards, and tuition payment reminders automatically.',
        SortOrder: 1
      },
      {
        SystemID: sayEdu.IDSystem,
        QuestionAr: 'هل يمكن استيراد وتصدير بيانات الطلاب من ملفات Excel السابقة؟',
        QuestionEn: 'Can existing student records and grades be imported from Excel spreadsheets?',
        AnswerAr: 'بكل تأكيد، تشتمل المنظومة على أداة استيراد ذكية تستقبل ملفات Excel و CSV مع التحقق التلقائي من صحة الحقول ومنع التكرار وسهولة ترحيل البيانات القديمة.',
        AnswerEn: 'Absolutely, the platform includes a smart import/export engine supporting Excel and CSV files with automated validation.',
        SortOrder: 2
      },
      {
        SystemID: sayEdu.IDSystem,
        QuestionAr: 'هل تتوافق المنظومة مع متطلبات الفاتورة الإلكترونية لسداد الأقساط؟',
        QuestionEn: 'Is the system compliant with e-invoicing regulations for tuition fees?',
        AnswerAr: 'نعم، المنظومة متوافقة بنسبة 100% مع معايير الفاتورة الإلكترونية وتصدر إيصالات السداد وسندات القبض بباركود QR معتمد رسمياً.',
        AnswerEn: 'Yes, SayEdu is 100% compliant with e-invoicing standards and generates payment receipts with official QR codes.',
        SortOrder: 3
      }
    ]
  });
  console.log('FAQs created.');
}

main()
  .then(() => {
    console.log('SayEdu seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding SayEdu:', err);
    process.exit(1);
  });
