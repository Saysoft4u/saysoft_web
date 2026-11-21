const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/security');

const prisma = new PrismaClient();

async function main() {
  console.log('--- بدء تحديث وزرع البيانات التجريبية لمنصة سايسوفت ---');

  // 1. حساب المدير الافتراضي
  const adminPasswordHash = await hashPassword('Admin@Saysoft2026!');
  const masterPasswordHash = await hashPassword('SaysoftMaster2026#');

  const admin = await prisma.user.upsert({
    where: { Username: 'admin' },
    update: {
      PasswordHash: adminPasswordHash
    },
    create: {
      Username: 'admin',
      Email: 'admin@saysoft.tech',
      PasswordHash: adminPasswordHash,
      Role: 'ADMIN',
      FullName: 'مدير المنصة الرئيسي',
      IsActive: true
    }
  });
  console.log('✓ تم حفظ / تحديث حساب المدير الافتراضي:', admin.Username);

  // 2. إعدادات الموقع والجداول المرجعية
  const initialSettings = [
    { SettingKey: 'SiteNameAr', SettingValue: 'سايسوفت للحلول الرقمية', SettingGroup: 'identity' },
    { SettingKey: 'SiteNameEn', SettingValue: 'Saysoft Digital Solutions', SettingGroup: 'identity' },
    { SettingKey: 'SiteLogo', SettingValue: '/uploads/logos/saysoftlogo.png', SettingGroup: 'identity' },
    { SettingKey: 'SiteIcon', SettingValue: '/uploads/logos/saylogo.png', SettingGroup: 'identity' },
    { SettingKey: 'WhatsappNumber', SettingValue: '201000000000', SettingGroup: 'contact' },
    { SettingKey: 'ContactEmail', SettingValue: 'info@saysoft.tech', SettingGroup: 'contact' },
    { SettingKey: 'ContactPhone', SettingValue: '+20 100 000 0000', SettingGroup: 'contact' },
    { SettingKey: 'PrimaryCurrency', SettingValue: 'USD', SettingGroup: 'general' },
    { SettingKey: 'QuotationHeader', SettingValue: 'شركة سايسوفت للحلول الرقمية وتطبيقات السحابية SaaS - عرض سعر معتمد', SettingGroup: 'general' },
    { SettingKey: 'MasterPasswordHash', SettingValue: masterPasswordHash, SettingGroup: 'security' },
    { SettingKey: 'ComingSoonMode', SettingValue: 'false', SettingGroup: 'general' },
    { SettingKey: 'ComingSoonMessageAr', SettingValue: 'نستعد لإطلاق منصة سايسوفت الجديدة بأحدث منظومات وحلول إدارة الأعمال السحابية.', SettingGroup: 'general' },
    { SettingKey: 'ComingSoonMessageEn', SettingValue: 'We are preparing to launch the new Saysoft platform with cutting-edge SaaS enterprise solutions.', SettingGroup: 'general' },
    { SettingKey: 'SocialFacebook', SettingValue: 'https://facebook.com/saysoft', SettingGroup: 'contact' },
    { SettingKey: 'SocialTwitter', SettingValue: 'https://twitter.com/saysoft', SettingGroup: 'contact' },
    { SettingKey: 'SocialLinkedin', SettingValue: 'https://linkedin.com/company/saysoft', SettingGroup: 'contact' },
    { SettingKey: 'SocialYoutube', SettingValue: 'https://youtube.com/@saysoft', SettingGroup: 'contact' }
  ];

  for (const s of initialSettings) {
    await prisma.setting.upsert({
      where: { SettingKey: s.SettingKey },
      update: { SettingValue: s.SettingValue },
      create: s
    });
  }
  console.log('✓ تم ضبط وتحديث إعدادات النظام والهوية');

  // مسح المنظومات والقطاعات القديمة لتحديثها بالمنظومات الخمس المطلوبة
  await prisma.systemFAQ.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.systemImage.deleteMany({});
  await prisma.system.deleteMany({});
  await prisma.sector.deleteMany({});

  // 3. قطاعات الأعمال المحدثة (Sectors)
  const sectorsData = [
    {
      NameAr: 'الحراسة والأمن ونقاط المراقبة',
      NameEn: 'Security & Facility Guarding',
      Slug: 'security-guarding',
      Icon: 'bi-shield-check',
      SortOrder: 1
    },
    {
      NameAr: 'المحاماة وإدارة القضايا والاستشارات',
      NameEn: 'Law Firms & Legal Practice',
      Slug: 'legal-law-practice',
      Icon: 'bi-briefcase',
      SortOrder: 2
    },
    {
      NameAr: 'اتحادات الملاك والعمارات والمجمعات',
      NameEn: 'Property HOA & Syndicate Management',
      Slug: 'property-hoa',
      Icon: 'bi-building-gear',
      SortOrder: 3
    },
    {
      NameAr: 'التجاري ونقاط البيع السحابية',
      NameEn: 'Retail & POS Systems',
      Slug: 'retail-pos',
      Icon: 'bi-shop',
      SortOrder: 4
    },
    {
      NameAr: 'الطبي والعيادات والمراكز الصحية',
      NameEn: 'Medical & Healthcare Clinics',
      Slug: 'medical-healthcare',
      Icon: 'bi-hospital',
      SortOrder: 5
    }
  ];

  const createdSectors = {};
  for (const sec of sectorsData) {
    const s = await prisma.sector.create({
      data: sec
    });
    createdSectors[sec.Slug] = s.IDSector;
  }
  console.log('✓ تم إنشاء قطاعات الأعمال المحدثة بنجاح');

  // 4. المنظومات الخمس المتكاملة المطلوبة
  const systemsData = [
    // 1) منظومة الحراسة والأمن
    {
      SectorID: createdSectors['security-guarding'],
      NameAr: 'منظومة ساي جارد لإدارة شركات الحراسة والأمن والخدمات الأمنية',
      NameEn: 'SayGuard Security & Guarding Company Management ERP',
      Slug: 'sayguard-security',
      SummaryAr: 'منظومة سحابية متكاملة لشركات الحراسة والأمن لتوزيع الورديات، تتبع دوريات الحراس عبر GPS و QR، وإدارة مواقع العملاء والرواتب.',
      SummaryEn: 'All-in-one cloud ERP for security and guarding agencies: shift rostering, GPS & QR guard patrol checkpoints, and client site management.',
      DescriptionAr: `<h3>نظرة عامة على منظومة ساي جارد</h3>
<p>صُممت منظومة <strong>ساي جارد (SayGuard)</strong> خصيصاً لإدارة عمليات شركات الأمن والحراسة، من توزيع طواقم العمل على المواقع وحتى متابعة الدوريات الميدانية والفوترة الشهرية للعملاء.</p>
<h4>أهم المميزات:</h4>
<ul>
  <li>جدولة الورديات ونظام المناوبات وتوزيع أفراد الأمن مع كشف الغياب والبدائل.</li>
  <li>إثبات الدوريات الميدانية في الوقت الفعلي عبر مسح رموز QR ونقاط تفتيش GPS على الموبايل.</li>
  <li>إدارة عقود ومواقع العملاء، وتحديد المتطلبات الأمنية ومعدات الحراسة لكل موقع.</li>
  <li>تطبيق إشعار فوري للحوادث الأمنية والطوارئ مع إرفاق الصور والتقارير الميدانية.</li>
  <li>حساب رواتب الحراس، البدلات، الإضافي، والخصومات آلياً حسب ساعات التواجد الفعلية.</li>
</ul>`,
      DescriptionEn: `<h3>Overview of SayGuard Security ERP</h3>
<p><strong>SayGuard</strong> is engineered specifically for physical security agencies and guarding contractors to supervise on-site personnel, incident reporting, and recurring client invoicing.</p>
<h4>Key Features:</h4>
<ul>
  <li>Live shift scheduling, guard allocation, replacement dispatch, and attendance tracking.</li>
  <li>Real-time guard tour verification using GPS geofencing and NFC / QR checkpoint scanning.</li>
  <li>Client facility contracts, post orders, and equipment allocation ledgers.</li>
  <li>Instant incident alert dispatch with photo attachments and security incident logs.</li>
  <li>Automated guard payroll calculation integrating overtime, post allowances, and site bonuses.</li>
</ul>`,
      Logo: '/uploads/logos/saysoftlogo.png',
      ViewsCount: 1840,
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/sayguard',
      IsFeatured: true,
      SortOrder: 1,
      MetaTitleAr: 'منظومة ساي جارد لإدارة شركات الحراسة والأمن | سايسوفت',
      MetaTitleEn: 'SayGuard Security & Guard Tour Management ERP | Saysoft',
      MetaDescAr: 'برنامج إدارة شركات الأمن والحراسة وتوزيع الورديات وتتبع الدوريات وعقود العملاء.',
      MetaDescEn: 'Cloud security management software for guarding companies and patrol tracking.',
      MetaKeywordsAr: 'حراسة وأمن, دوريات حراس, شركات أمن, توزيع ورديات, ساي جارد',
      MetaKeywordsEn: 'security guarding, patrol management, security erp, sayguard',
      packages: [
        {
          NameAr: 'باقة الشركات الأمنية الناشئة',
          NameEn: 'Security Starter',
          Price: 69,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 10 مواقع وحراسات\nحتى 50 فرد أمن\nتطبيق متابعة الدوريات ونقاط QR\nسجل حوادث وتقارير ورديات',
          FeaturesEn: 'Up to 10 Client Sites\nUp to 50 Security Guards\nQR Patrol Checkpoint App\nIncident Log & Shift Reports',
          IsPopular: false,
          SortOrder: 1
        },
        {
          NameAr: 'باقة المؤسسات الأمنية المتقدمة',
          NameEn: 'Agency Pro Edition',
          Price: 159,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 50 موقعاً أمنياً\nحتى 250 فرد أمن\nتتبع مسار الحراس المباشر عبر GPS\nبوابة دخول العملاء لمتابعة مواقعهم\nحساب الرواتب والبدلات آلياً\nدعم فني وتدريب ميداني',
          FeaturesEn: 'Up to 50 Client Sites\nUp to 250 Security Guards\nLive GPS Guard Tracking\nClient Portal for Site Auditing\nAutomated Payroll & Allowances\nDedicated Technical Support & Training',
          IsPopular: true,
          SortOrder: 2
        },
        {
          NameAr: 'ترخيص سنوي مستقل للشركات الكبرى',
          NameEn: 'Enterprise Unlimited',
          Price: 1450,
          PeriodAr: 'سنوياً',
          PeriodEn: 'Yearly',
          FeaturesAr: 'مواقع وأفراد أمن غير محدودين\nسيرفر سحابي خاص ومستقل\nتخصيص كامل للهوية والتطبيقات\nربط مع كاميرات المراقبة وأجهزة الإنذار\nنسخ احتياطي يومي آلي',
          FeaturesEn: 'Unlimited Sites & Security Guards\nDedicated Private Cloud Server\nCustom White-Label Mobile App\nCCTV & Alarm System Integration\nDaily Automated Backups',
          IsPopular: false,
          SortOrder: 3
        }
      ],
      faqs: [
        {
          QuestionAr: 'كيف يتم التحقق من التزام الحارس بجدول المرور على النقاط؟',
          QuestionEn: 'How does the system ensure guards visit designated checkpoints on time?',
          AnswerAr: 'يقوم الحارس بمسح رمز QR أو شريحة NFC في كل نقطة عبر هاتفه، ويسجل النظام التوقيت والإحداثيات اللحظية فوراً في غرفة العمليات.',
          AnswerEn: 'Guards scan QR codes or NFC tags at each checkpoint using the mobile app, instantly recording time and GPS coordinates in the operations room.'
        },
        {
          QuestionAr: 'هل يمكن لعميل شركة الأمن الاطلاع على تقارير موقعه؟',
          QuestionEn: 'Can the security agency client view their facility guard reports?',
          AnswerAr: 'نعم، تتيح المنظومة بوابة مخصصة للعميل تمكنه من رؤية مواعيد الحضور، تقارير الحوادث، وإثباتات الجولات الأمنية في منشأته.',
          AnswerEn: 'Yes, SayGuard includes a client portal enabling property managers to review guard attendance, tours, and incident resolutions in real time.'
        }
      ]
    },

    // 2) منظومة مكتب المحامي
    {
      SectorID: createdSectors['legal-law-practice'],
      NameAr: 'منظومة ساي ليجال لإدارة مكاتب المحاماة والقضايا والاستشارات',
      NameEn: 'SayLegal Law Firm & Case Management ERP',
      Slug: 'saylegal-law-practice',
      SummaryAr: 'منظومة سحابية ذكية للمحامين ومكاتب الاستشارات القانونية لمتابعة ملفات القضايا، الجلسات، الأتعاب، والوثائق والعقود.',
      SummaryEn: 'Intelligent legal ERP for attorneys and law firms to manage case dockets, court hearings, legal drafting, and client retainers.',
      DescriptionAr: `<h3>نظرة عامة على منظومة ساي ليجال</h3>
<p>حل برمجي متخصص صُمم لتنظيم أعمال المحامين والإدارات القانونية ومكاتب الاستشارات، يتيح أرشفة رقمية آمنة للمستندات والتوكيلات ومتابعة مواعيد الجلسات والإنذارات.</p>
<h4>أهم المميزات:</h4>
<ul>
  <li>سجل رقمي شامل للقضايا يربط أرقام الدوائر، الرول، المحاكم، الخصوم، ومحامي المكتب المكلف.</li>
  <li>أجندة إلكترونية ذكية تنبه بمواعيد الجلسات، الطعون، ومواعيد سقوط الحق بالتقادم.</li>
  <li>إدارة أتعاب المحاماة ومصاريف الدعاوى، الدفعات المستلمة، وإصدار الفواتير وسندات القبض.</li>
  <li>أرشفة إلكترونية للتوكيلات، المذكرات، الأحكام القضائية، والعقود مع محرك بحث فوري.</li>
  <li>بوابة تواصل للعملاء والموكلين لمعرفة المستجدات في قضاياهم والاطلاع على القرارات.</li>
</ul>`,
      DescriptionEn: `<h3>Overview of SayLegal ERP</h3>
<p>A comprehensive practice management solution designed for attorneys, legal counsels, and law firms to automate case tracking and court calendars.</p>
<h4>Core Features:</h4>
<ul>
  <li>Full case docket registry with court names, claim details, opposing parties, and assigned counsel.</li>
  <li>Automated legal calendar alerting for court hearings, appeal deadlines, and prescription periods.</li>
  <li>Fee management, court expense logging, retainer invoicing, and payment receipts.</li>
  <li>Encrypted document vault for powers of attorney, legal briefs, judicial rulings, and contracts.</li>
  <li>Client portal enabling clients to track live updates and decisions on their cases.</li>
</ul>`,
      Logo: '/uploads/logos/saysoftlogo.png',
      ViewsCount: 1610,
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/saylegal',
      IsFeatured: true,
      SortOrder: 2,
      MetaTitleAr: 'منظومة ساي ليجال لإدارة مكاتب المحاماة والقضايا | سايسوفت',
      MetaTitleEn: 'SayLegal Law Practice & Case Management Software | Saysoft',
      MetaDescAr: 'برنامج إدارة مكاتب المحاماة والقضايا والجلسات وأتعاب المحامين والأرشفة القانونية.',
      MetaDescEn: 'Law practice management software for legal docketing, hearings, and billing.',
      MetaKeywordsAr: 'محاماة, قضايا, مكتب محامي, استشارات قانونية, ساي ليجال',
      MetaKeywordsEn: 'law firm software, case management, legal erp, saylegal',
      packages: [
        {
          NameAr: 'باقة المحامي الفردي',
          NameEn: 'Solo Practitioner',
          Price: 39,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'محامي ومساعد واحد\nحتى 150 ملف قضية نشط\nأجندة الجلسات وتنبيهات الواتساب\nإدارة التوكيلات والمصاريف',
          FeaturesEn: '1 Attorney & 1 Assistant\nUp to 150 Active Cases\nHearing Calendar & WhatsApp Alerts\nPOA & Expense Ledger',
          IsPopular: false,
          SortOrder: 1
        },
        {
          NameAr: 'باقة مكاتب المحاماة المتكاملة',
          NameEn: 'Law Firm Pro',
          Price: 99,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 10 محامين ومستشارين\nملفات قضايا غير محدودة\nحساب أتعاب ونسب المحامين بالملف\nأرشفة مستندات وسوابق قضائية مشفرة\nبوابة الموكلين لمتابعة الجلسات',
          FeaturesEn: 'Up to 10 Lawyers & Advisors\nUnlimited Case Files\nLawyer Fee Splitting per Matter\nEncrypted Digital Precedent Archive\nClient Case Tracking Portal',
          IsPopular: true,
          SortOrder: 2
        },
        {
          NameAr: 'ترخيص الشركات والمؤسسات القانونية',
          NameEn: 'Legal Enterprise',
          Price: 890,
          PeriodAr: 'سنوياً',
          PeriodEn: 'Yearly',
          FeaturesAr: 'محامون وفروع غير محدودة\nإدارة العقود والدمج والاستحواذ\nربط الفاتورة الإلكترونية المعتمدة\nسيرفر خاص عالي الأمان والتشفير\nدعم فني وتدريب طاقم المكتب',
          FeaturesEn: 'Unlimited Lawyers & Multi-Branches\nCorporate Contract & M&A Module\nCompliant E-Invoicing Integration\nDedicated High-Security Server\nFull Team Training & Support',
          IsPopular: false,
          SortOrder: 3
        }
      ],
      faqs: [
        {
          QuestionAr: 'هل يرسل النظام تنبيهات تلقائية قبل مواعيد الجلسات والطعون؟',
          QuestionEn: 'Does the system send automated reminders prior to hearing dates?',
          AnswerAr: 'نعم، يرسل النظام إشعارات على لوحة التحكم ورسائل واتساب للمحامي قبل موعد الجلسة بـ 24 و 48 ساعة.',
          AnswerEn: 'Yes, SayLegal sends in-app notifications and WhatsApp alerts 24 to 48 hours prior to every court docket.'
        },
        {
          QuestionAr: 'هل مستندات القضايا والتوكيلات مشفرة ومحمية من الاطلاع غير المصرح به؟',
          QuestionEn: 'Are legal documents and POAs encrypted and strictly access-controlled?',
          AnswerAr: 'نعم، جميع المستندات مشفرة في السيرفر وتخضع لنظام صلاحيات دقيق يحدده مدير المكتب لكل محامٍ.',
          AnswerEn: 'Yes, all sensitive case documents are encrypted at rest with role-based permission locks set by the managing partner.'
        }
      ]
    },

    // 3) منظومة اتحاد الملاك
    {
      SectorID: createdSectors['property-hoa'],
      NameAr: 'منظومة ساي ملاك لإدارة اتحادات الملاك والعمارات والمجمعات السكنية',
      NameEn: 'SayMollak HOA & Property Owners Syndicate ERP',
      Slug: 'saymollak-hoa',
      SummaryAr: 'منظومة إدارية ومالية شاملة لمجالس إدارات اتحادات الملاك والكمبوندات لتحصيل الاشتراكات، الصيانة، والمصاريف بشفافية تامة.',
      SummaryEn: 'Complete financial and administrative HOA platform for property syndicates and residential compounds to collect dues and manage maintenance.',
      DescriptionAr: `<h3>نظرة عامة على منظومة ساي ملاك</h3>
<p>صُممت منظومة <strong>ساي ملاك (SayMollak)</strong> لإنهاء الخلافات المالية وإحلال الشفافية في إدارة العمارات، الأبراج، والمجمعات السكنية والمنتجعات عبر أتمتة تحصيل اشتراكات الملاك والمصروفات الدورية.</p>
<h4>أهم المميزات:</h4>
<ul>
  <li>شجرة الوحدات والملاك والمستأجرين وتحديد نسب ملكية كل شقة وحصتها في الخدمات.</li>
  <li>توليد مطالبات الاشتراكات الشهرية أو السنوية ومصروفات الصيانة والحراسة والمصاعد آلياً.</li>
  <li>إرسال فواتير وإشعارات الاستحقاق وسندات التحصيل عبر واتساب الملاك فوراً.</li>
  <li>سجل دقيق لخزينة العمارة وحسابات البنك ومصروفات الكهرباء والمياه وأجور الحراسة والنظافة.</li>
  <li>تقرير شفافية مالي دوري يوضح الإيرادات والمصروفات والاشتراكات المتأخرة بالأسماء والأرقام.</li>
  <li>نظام تصويت إلكتروني للملاك على قرارات الصيانة والتطوير وإدارة الجمعية العمومية.</li>
</ul>`,
      DescriptionEn: `<h3>Overview of SayMollak HOA ERP</h3>
<p><strong>SayMollak</strong> resolves administrative and financial challenges in managing residential towers, gated compounds, and commercial centers through total accounting transparency.</p>
<h4>Key Features:</h4>
<ul>
  <li>Registry of units, owners, and tenants with specific common-area maintenance share percentages.</li>
  <li>Automated billing cycles for monthly dues, elevator upkeep, security fees, and emergency repairs.</li>
  <li>Instant payment receipt generation and WhatsApp invoice dispatch directly to homeowners.</li>
  <li>Comprehensive petty cash ledgers, bank reconciliations, electricity, water, and vendor payments.</li>
  <li>Live financial transparency reports illustrating income, expenditures, and overdue balances.</li>
  <li>Online voting module for general assemblies and building improvement ballot decisions.</li>
</ul>`,
      Logo: '/uploads/logos/saysoftlogo.png',
      ViewsCount: 1490,
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/saymollak',
      IsFeatured: true,
      SortOrder: 3,
      MetaTitleAr: 'منظومة ساي ملاك لإدارة اتحادات الملاك والعمارات | سايسوفت',
      MetaTitleEn: 'SayMollak HOA & Building Syndicate Management Software | Saysoft',
      MetaDescAr: 'برنامج إدارة اتحادات الملاك وتحصيل اشتراكات الصيانة وخزينة العمارات والمجمعات السكنية.',
      MetaDescEn: 'Homeowners association and residential compound management software for dues and maintenance.',
      MetaKeywordsAr: 'اتحاد ملاك, اشتراكات عمارة, صيانة كمبوند, سندات قبض, ساي ملاك',
      MetaKeywordsEn: 'hoa software, owners association, property syndicate, saymollak',
      packages: [
        {
          NameAr: 'باقة العمارة أو البرج السكني',
          NameEn: 'Single Residential Tower',
          Price: 25,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 30 وحدة سكنية\nإصدار سندات القبض وإيصالات السداد\nإرسال مطالبات الاشتراك عبر واتساب\nتقرير مصروفات وخزينة شهري',
          FeaturesEn: 'Up to 30 Residential Units\nPayment Receipts & Invoicing\nWhatsApp Dues Reminder Dispatch\nMonthly Cashflow & Expense Ledger',
          IsPopular: false,
          SortOrder: 1
        },
        {
          NameAr: 'باقة المجمعات والأبراج المتعددة',
          NameEn: 'Compound & Multi-Tower Pro',
          Price: 65,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 150 وحدة سكنية وتجارية\nبوابة دخول للملاك لعرض حساباتهم\nنظام تذاكر طلبات الصيانة ومتابعة الفنيين\nنظام التصويت الإلكتروني على القرارات\nكشف تفصيلي بالوحدات المتأخرة عن السداد',
          FeaturesEn: 'Up to 150 Units\nResident Portal for Financial Statements\nMaintenance Work Order Ticketing\nOnline Voting & Assembly Polls\nDetailed Delinquency & Arrears Aging Ledger',
          IsPopular: true,
          SortOrder: 2
        },
        {
          NameAr: 'باقة الكمبوندات والمنتجعات الكبرى',
          NameEn: 'Resort & Gated Community Enterprise',
          Price: 590,
          PeriodAr: 'سنوياً',
          PeriodEn: 'Yearly',
          FeaturesAr: 'وحدات وملاك غير محدودين\nإدارة البوابات وتصاريح الزوار QR\nربط بوابات الدفع الإلكتروني المباشر\nحسابات بنكية متعددة وودائع الصيانة\nسيرفر خاص وتدريب لمجلس الإدارة',
          FeaturesEn: 'Unlimited Units & Residents\nVisitor Gate Access & QR Passes\nDirect Online Payment Gateway Integration\nMulti-Bank Accounts & Sinking Fund Ledgers\nDedicated Server & Board Training',
          IsPopular: false,
          SortOrder: 3
        }
      ],
      faqs: [
        {
          QuestionAr: 'كيف يعرف المالك ما تم صرفه من أموال اتحاد الملاك؟',
          QuestionEn: 'How can owners verify where syndicate funds were spent?',
          AnswerAr: 'يستطيع المالك الدخول عبر حسابه أو استلام تقرير شهري شفاف يوضح كل بند مصروف مرفقاً بصورة الفاتورة ورصيد الخزينة المتبقي.',
          AnswerEn: 'Homeowners can log in to view transparent balance sheets with uploaded vendor invoices and remaining reserve funds.'
        },
        {
          QuestionAr: 'هل يدعم البرنامج إرسال إشعارات السداد عبر تطبيق واتساب؟',
          QuestionEn: 'Does the system send payment reminders via WhatsApp?',
          AnswerAr: 'نعم، بضغطة زر واحدة يتم توليد رابط ورسالة واتساب مخصصة لكل شقة تحتوي على قيمة الاشتراك والمتأخرات وسند السداد.',
          AnswerEn: 'Yes, with a single click, personalized WhatsApp notifications with due amounts and digital receipts are sent to owners.'
        }
      ]
    },

    // 4) منظومة ساي كاشير
    {
      SectorID: createdSectors['retail-pos'],
      NameAr: 'منظومة ساي كاشير السحابية لنقاط البيع وإدارة المخازن',
      NameEn: 'SayCashier Cloud POS & Inventory System',
      Slug: 'say-cashier-pos',
      SummaryAr: 'منظومة كاشير ومخازن ذكية تدعم الفاتورة الإلكترونية والمزامنة الفورية وتعمل حتى مع انقطاع الإنترنت.',
      SummaryEn: 'Smart cloud POS and inventory solution supporting electronic invoicing, offline mode, and instant sync.',
      DescriptionAr: `<h3>نظرة عامة على ساي كاشير</h3>
<p>صُممت منظومة <strong>ساي كاشير (SayCashier)</strong> لتلبية احتياجات المحلات التجارية، السوبرماركت، والمطاعم والشركات، مع إدارة ذكية للمخزون والفواتير الإلكترونية والباركود وحسابات العملاء والموردين.</p>
<h4>أهم المميزات:</h4>
<ul>
  <li>دعم الفاتورة الإلكترونية المتوافقة مع متطلبات الضرائب.</li>
  <li>العمل بدون إنترنت (Offline Mode) مع المزامنة التلقائية فور عودة الاتصال.</li>
  <li>تقارير أرباح وخسائر وجرد مخزون لحظية بدقة متناهية.</li>
  <li>لوحة تحكم للمالك عبر الموبايل لمتابعة الفروع من أي مكان.</li>
</ul>`,
      DescriptionEn: `<h3>Overview of SayCashier</h3>
<p><strong>SayCashier</strong> is engineered for retail stores, supermarkets, restaurants, and trading companies, offering intelligent stock control, e-invoicing, barcodes, and CRM.</p>
<h4>Key Features:</h4>
<ul>
  <li>Full compliant e-invoicing.</li>
  <li>Seamless offline operation with instant background synchronization.</li>
  <li>Real-time financial and inventory auditing reports.</li>
  <li>Executive mobile dashboard for remote multi-branch management.</li>
</ul>`,
      Logo: '/uploads/logos/saysoftlogo.png',
      ViewsCount: 1420,
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/saycashier',
      IsFeatured: true,
      SortOrder: 4,
      MetaTitleAr: 'منظومة ساي كاشير لنقاط البيع والمخازن | سايسوفت',
      MetaTitleEn: 'SayCashier Cloud POS & Inventory | Saysoft',
      MetaDescAr: 'برنامج كاشير ونقاط بيع سحابي لإدارة المحلات التجارية والمخازن والفواتير الإلكترونية.',
      MetaDescEn: 'Cloud POS and inventory management system for retail shops and supermarkets.',
      MetaKeywordsAr: 'كاشير, نقاط بيع, مخازن, فاتورة الكترونية, ساي كاشير',
      MetaKeywordsEn: 'pos, cloud cashier, inventory, e-invoice, saycashier',
      packages: [
        {
          NameAr: 'باقة البداية',
          NameEn: 'Starter Plan',
          Price: 29,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'فرع واحد\nمستخدمان اثنان\nدعم الفاتورة الإلكترونية\nتحديثات مجانية مستمرة',
          FeaturesEn: '1 Branch\n2 Users\nE-Invoicing Support\nContinuous Free Updates',
          IsPopular: false,
          SortOrder: 1
        },
        {
          NameAr: 'باقة الأعمال والنمو',
          NameEn: 'Business Pro',
          Price: 69,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 3 فروع\nعدد مستخدمين غير محدود\nربط المتاجر الإلكترونية\nتقارير أرباح ومخزون متقدمة\nدعم فني على مدار الساعة',
          FeaturesEn: 'Up to 3 Branches\nUnlimited Users\nE-Commerce Integration\nAdvanced Analytics & Stock\n24/7 Priority Support',
          IsPopular: true,
          SortOrder: 2
        }
      ],
      faqs: [
        {
          QuestionAr: 'هل يدعم النظام الربط مع هيئة الضرائب والزكاة؟',
          QuestionEn: 'Does the system integrate with tax authorities?',
          AnswerAr: 'نعم، ساي كاشير متوافق بالكامل مع متطلبات الفاتورة الإلكترونية وتوليد رمز الاستجابة السريع (QR Code).',
          AnswerEn: 'Yes, SayCashier is 100% compliant with e-invoicing regulations and cryptographic QR generation.'
        }
      ]
    },

    // 5) منظومة ساي كلينيك
    {
      SectorID: createdSectors['medical-healthcare'],
      NameAr: 'منظومة ساي كلينيك لإدارة العيادات والمراكز الطبية',
      NameEn: 'SayClinic Healthcare & Clinic Management System',
      Slug: 'say-clinic-medical',
      SummaryAr: 'نظام طبي سحابي شامل لإدارة المواعيد، الملفات الطبية الإلكترونية (EMR)، الفحوصات والروشتات الذكية.',
      SummaryEn: 'Comprehensive medical platform for appointments, electronic health records (EHR), smart prescriptions, and billing.',
      DescriptionAr: `<h3>نظرة عامة على ساي كلينيك</h3>
<p>منظومة طبية ذكية مصممة للأطباء والعيادات التخصصية والمراكز الطبية والمجمعات الاستشارية، تضمن أتمتة كاملة لدورة المريض من الاستقبال وحتى مغادرة العيادة.</p>
<h4>المميزات الرئيسية:</h4>
<ul>
  <li>ملف طبي إلكتروني موحد لكل مريض يشمل التاريخ المرضي والحساسية والتحاليل.</li>
  <li>روشتة إلكترونية ذكية قابلة للطباعة والإرسال عبر واتساب للمريض فوراً.</li>
  <li>تنظيم جدول المواعيد والحجوزات وتنبيهات الرسائل النصية والواتساب.</li>
  <li>إدارة خزينة العيادة والإيرادات والمصروفات ونسب الأطباء والشركاء.</li>
</ul>`,
      DescriptionEn: `<h3>SayClinic Overview</h3>
<p>An intelligent health tech solution for private practices, medical centers, and polyclinics, automating patient workflow seamlessly.</p>
<h4>Core Features:</h4>
<ul>
  <li>Unified EHR containing medical history, lab attachments, and allergies.</li>
  <li>Digital prescriptions with direct WhatsApp dispatch to patients.</li>
  <li>Intelligent appointment calendar with automated reminder alerts.</li>
  <li>Doctor commission splitting, billing, and clinical cashflow accounting.</li>
</ul>`,
      Logo: '/uploads/logos/saysoftlogo.png',
      ViewsCount: 980,
      YoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      DemoUrl: 'https://demo.saysoft.tech/sayclinic',
      IsFeatured: true,
      SortOrder: 5,
      MetaTitleAr: 'منظومة ساي كلينيك لإدارة العيادات الطبية | سايسوفت',
      MetaTitleEn: 'SayClinic EHR & Clinic Management | Saysoft',
      MetaDescAr: 'برنامج إدارة العيادات والمراكز الطبية وملفات المرضى والروشتة الإلكترونية.',
      MetaDescEn: 'Medical clinic management software with patient EHR and digital prescriptions.',
      MetaKeywordsAr: 'عيادات, برنامج طبي, ملفات مرضى, روشتة الكترونية, ساي كلينيك',
      MetaKeywordsEn: 'clinic software, medical ehr, sayclinic, doctor app',
      packages: [
        {
          NameAr: 'باقة العيادة الفردية',
          NameEn: 'Solo Practice',
          Price: 39,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'طبيب واحد\nاستقبال ومساعد واحد\nملفات مرضى غير محدودة\nروشتات الكترونية ذكية',
          FeaturesEn: '1 Doctor\n1 Receptionist\nUnlimited Patients EHR\nDigital Prescriptions',
          IsPopular: false,
          SortOrder: 1
        },
        {
          NameAr: 'باقة المركز الطبي المتعدد',
          NameEn: 'Medical Center Pro',
          Price: 99,
          PeriodAr: 'شهرياً',
          PeriodEn: 'Monthly',
          FeaturesAr: 'حتى 8 عيادات وأطباء\nحسابات المختبر والأشعة\nحساب نسب الأطباء آلياً\nتكامل مع رسائل الواتساب للتذكير بالمواعيد',
          FeaturesEn: 'Up to 8 Clinics & Doctors\nLab & Radiology Module\nAutomated Doctor Commission Calculation\nWhatsApp Appointment Reminder Integration',
          IsPopular: true,
          SortOrder: 2
        }
      ],
      faqs: [
        {
          QuestionAr: 'هل يدعم النظام إرفاق ملفات الأشعة والتحاليل في ملف المريض؟',
          QuestionEn: 'Can lab reports and radiology images be attached to patient records?',
          AnswerAr: 'نعم، يدعم النظام رفع مستندات PDF وصور الأشعة وتصفحها مباشرة من ملف المريض.',
          AnswerEn: 'Yes, PDF documents and medical imaging files can be uploaded and viewed inside the patient dossier.'
        }
      ]
    }
  ];

  for (const sys of systemsData) {
    const { packages, faqs, ...sysCore } = sys;
    const createdSys = await prisma.system.create({
      data: sysCore
    });

    // إضافة باقات المنظومة
    for (const pkg of packages) {
      await prisma.package.create({
        data: {
          SystemID: createdSys.IDSystem,
          ...pkg
        }
      });
    }

    // إضافة أسئلة المنظومة
    for (const f of faqs) {
      await prisma.systemFAQ.create({
        data: {
          SystemID: createdSys.IDSystem,
          ...f
        }
      });
    }

    // إضافة صورة تجريبية في المعرض
    await prisma.systemImage.create({
      data: {
        SystemID: createdSys.IDSystem,
        ImagePath: '/images/saysoftlogo.png',
        CaptionAr: `واجهة لوحة تحكم ${sysCore.NameAr}`,
        CaptionEn: `Dashboard view of ${sysCore.NameEn}`,
        SortOrder: 1
      }
    });
  }
  console.log('✓ تم إنشاء المنظومات الخمس المتكاملة المطلوبة');

  // 5. الأسئلة الشائعة العامة للموقع (General FAQs)
  const generalFaqsData = [
    {
      QuestionAr: 'ما هي منظومات سايسوفت السحابية وكيف تفيد نشاطي التجاري؟',
      QuestionEn: 'What are Saysoft cloud solutions and how can they help my business?',
      AnswerAr: 'سايسوفت تقدم أكثر من 30 منظومة برمجية متخصصة ومصممة بتقنيات سحابية حديثة، تمنحك سرعة فائقة، أماناً عالياً، وسهولة تامة في إدارة نشاطك من أي مكان وجهاز بدون الحاجة لسيرفرات معقدة أو صيانة باهظة.',
      AnswerEn: 'Saysoft delivers 30+ specialized modern cloud SaaS solutions offering speed, top-tier security, and complete mobility to run your business from any device without server maintenance headaches.'
    },
    {
      QuestionAr: 'هل يمكنني تجربة المنظومة ومعاينتها قبل الاشتراك؟',
      QuestionEn: 'Can I test and explore the system before subscribing?',
      AnswerAr: 'بكل تأكيد، نوفر لكل منظومة رابط تجربة حية (Live Demo) كما يمكنك طلب جلسة توضيحية مجانية عبر تطبيق زوم أو محادثة فريق المبيعات عبر الواتساب لتجهيز نسخة تجريبية لبياناتك.',
      AnswerEn: 'Certainly! We provide live interactive demos for our systems, and you can also request a free online walkthrough or contact sales on WhatsApp for a custom sandbox.'
    },
    {
      QuestionAr: 'ما هي طرق الدفع المتاحة للاشتراك؟',
      QuestionEn: 'What payment methods are supported?',
      AnswerAr: 'ندعم كافة وسائل الدفع المحلية والدولية، بما في ذلك البطاقات البنكية (Visa / MasterCard)، التحويلات البنكية المباشرة، والمحافظ الإلكترونية المحلية، بالإضافة لخيارات التقسيط السنوي.',
      AnswerEn: 'We support international and local credit cards, bank wire transfers, local mobile wallets, as well as annual flexible installments.'
    },
    {
      QuestionAr: 'كيف تقدمون الدعم الفني وخدمات ما بعد البيع؟',
      QuestionEn: 'How is customer support and training delivered?',
      AnswerAr: 'فريق الدعم الفني لدينا متاح على مدار الساعة عبر محادثات الواتساب وتذاكر الدعم والاتصال الهاتفي، مع توفير جلسات تدريب وتوثيق كامل بالفيديو لكل منظومة لضمان سهولة استخدام فريقك لها.',
      AnswerEn: 'Our technical support team is available 24/7 via WhatsApp, ticketing, and phone assistance, coupled with in-depth video training sessions to empower your team.'
    }
  ];

  await prisma.generalFAQ.deleteMany({});
  for (const gf of generalFaqsData) {
    await prisma.generalFAQ.create({
      data: gf
    });
  }
  console.log('✓ تم إنشاء الأسئلة الشائعة العامة للموقع');

  // 6. آراء وتقييمات العملاء المحدثة (Testimonials)
  const testimonialsData = [
    {
      ClientNameAr: 'لواء / مصطفى عبد الرحمن',
      ClientNameEn: 'Gen. Mostafa Abdulrahman',
      ClientTitleAr: 'المدير التنفيذي لشركة الصقر للحراسة والأمن',
      ClientTitleEn: 'CEO of Al-Saqr Security & Guarding',
      CompanyAr: 'شركة الصقر للحراسة والخدمات الأمنية',
      CompanyEn: 'Al-Saqr Guarding & Security Co.',
      Rating: 5,
      ContentAr: 'منظومة ساي جارد أحدثت ثورة في متابعة أفراد الأمن وتأكيد دورياتهم بالـ QR ولحظياً على الخريطة، وانتهت تماماً مشاكل التلاعب بمواعيد الورديات.',
      ContentEn: 'SayGuard revolutionized our security guard monitoring and QR patrol checkpoints. Shift disputes and attendance fraud are completely eliminated.',
      Avatar: '/images/saylogo.png',
      SortOrder: 1
    },
    {
      ClientNameAr: 'الأستاذ / عبد الحميد الشاذلي',
      ClientNameEn: 'Adv. Abdelhamid El-Shazly',
      ClientTitleAr: 'المحامي بالنقض ورئيس المجموعة القانونية',
      ClientTitleEn: 'Cassation Attorney & Legal Group Head',
      CompanyAr: 'مجموعة الشاذلي للاستشارات والتحكيم الدولي',
      CompanyEn: 'El-Shazly Legal Practice & Arbitration',
      Rating: 5,
      ContentAr: 'منظومة ساي ليجال وفرت لنا أرشفة ذكية لعشرات الآلاف من وثائق القضايا، وأجندة الجلسات الذكية أراحتنا تماماً من القلق من فوات مواعيد الطعون.',
      ContentEn: 'SayLegal gave us an intelligent repository for tens of thousands of judicial files. Automated calendar reminders relieved us from missing critical appeal dates.',
      Avatar: '/images/saylogo.png',
      SortOrder: 2
    },
    {
      ClientNameAr: 'المهندس / حسام البدري',
      ClientNameEn: 'Eng. Hossam El-Badry',
      ClientTitleAr: 'رئيس مجلس إدارة اتحاد ملاك مجمع الياسمين',
      ClientTitleEn: 'Board Chairman, Al-Yasmin Syndicate',
      CompanyAr: 'اتحاد ملاك مجمع الياسمين السكني',
      CompanyEn: 'Al-Yasmin HOA Residential Complex',
      Rating: 5,
      ContentAr: 'بفضل منظومة ساي ملاك، أصبح كل مالك يستلم إيصال السداد على الواتساب فوراً ويطلع على تقرير المصروفات بكل شفافية، وتضاعفت نسبة التحصيل في شهرين.',
      ContentEn: 'Thanks to SayMollak, homeowners receive instant receipts on WhatsApp and verify expenses with total transparency. Collection rates doubled in two months.',
      Avatar: '/images/saylogo.png',
      SortOrder: 3
    }
  ];

  await prisma.testimonial.deleteMany({});
  for (const t of testimonialsData) {
    await prisma.testimonial.create({
      data: t
    });
  }
  console.log('✓ تم تحديث تقييمات وآراء العملاء المتوافقة مع المنظومات الجديدة');

  // 7. صفحة "من نحن" (Pages)
  await prisma.page.upsert({
    where: { Slug: 'about-us' },
    update: {},
    create: {
      TitleAr: 'من نحن - شركة سايسوفت للحلول الرقمية',
      TitleEn: 'About Us - Saysoft Digital Solutions',
      Slug: 'about-us',
      ShowInHeader: true,
      ShowInFooter: true,
      ContentAr: `<h2>ريادة الحلول السحابية وأتمتة الأعمال</h2>
<p>تعد <strong>سايسوفت للحلول الرقمية (Saysoft)</strong> شركة رائدة في تطوير المنظومات البرمجية السحابية (SaaS) والتطبيقات الإدارية المتخصصة. نحرص على تقديم برمجيات مرنة وعالية الكفاءة تلبي أدق تفاصيل العمليات اليومية للشركات والمنشآت في مختلف القطاعات التجارية، الطبية، التعليمية، العقارية، الأمنية، والقانونية.</p>

<h3>رؤيتنا ورسالتنا</h3>
<p>تمكين المؤسسات والأنشطة التجارية في الشرق الأوسط والعالم من التحول الرقمي السلس عبر منظومات سحابية متكاملة وسهلة الاستخدام تغنيهم عن الأنظمة المعقدة وبأفضل عائد استثماري.</p>

<h3>لماذا يختار عملاؤنا سايسوفت؟</h3>
<ul>
  <li>بنية برمجية فائقة السرعة والأمان مصممة لأداء مستمر بدون توقف (99.9% Uptime).</li>
  <li>تكامل كامل مع متطلبات الفاتورة الإلكترونية والأنظمة الرقابية المعتمدة.</li>
  <li>دعم فني استباقي وتحديثات مستمرة تواكب أحدث تقنيات الحوسبة السحابية.</li>
  <li>أمان متقدم وتشفير لكافة قواعد البيانات مع استقلالية تامة للبيانات.</li>
</ul>

<h3>موقعنا ومقرنا الرئيسي على خرائط جوجل</h3>
<p>يسعدنا دائماً الترحيب بشركائنا وعملائنا الكرام في مقرنا الرئيسي، أو تقديم الاستشارات وعروض المنظومات التفاعلية عن بُعد لكافة الشركات في أي مكان بالعالم:</p>

<div class="google-map-card" style="margin: 28px 0; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.07); background: var(--card-bg, #ffffff);">
  <div style="padding: 16px 20px; background: var(--bg-color, #f8fafc); border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <strong style="display: block; font-size: 15px; color: var(--text-main, #0f172a); font-weight: 700;">مقر شركة سايسوفت للحلول الرقمية</strong>
        <span style="font-size: 13px; color: var(--text-muted, #64748b);">القاهرة، مصر (30°06'54.6"N 31°18'21.3"E)</span>
      </div>
    </div>
    <a href="https://www.google.com/maps/place/30%C2%B006'54.6%22N+31%C2%B018'21.3%22E/@30.1151676,31.3084919,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.115163!4d31.305917" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 13px; padding: 7px 16px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; border: 1px solid var(--primary-color); color: var(--primary-color);">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> فتح في تطبيق خرائط جوجل
    </a>
  </div>

  <div style="position: relative; width: 100%; height: 400px; background: #f1f5f9;">
    <iframe 
      title="موقع شركة سايسوفت للحلول الرقمية التفاعلي على خرائط جوجل"
      src="https://maps.google.com/maps?q=30%C2%B006'54.6%22N+31%C2%B018'21.3%22E&amp;hl=ar&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
      width="100%" 
      height="100%" 
      style="border:0; display:block; width:100%; height:100%;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>

  <div style="padding: 14px 20px; font-size: 13px; color: var(--text-muted, #64748b); background: var(--card-bg, #ffffff); border-top: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <span><i class="fa-regular fa-clock" style="color: var(--primary-color, #0284c7);"></i> <strong>ساعات استقبال العملاء:</strong> الأحد - الخميس (9:00 ص - 5:00 م)</span>
      <span><i class="fa-solid fa-phone" style="color: var(--primary-color, #0284c7);"></i> <strong>الاتصال المباشر:</strong> +20 100 000 0000</span>
    </div>
    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
      <i class="fa-solid fa-map-pin"></i> موقع تفاعلي مباشر
    </span>
  </div>
</div>`,
      ContentEn: `<h2>Pioneering Cloud ERP & SaaS Innovation</h2>
<p><strong>Saysoft Digital Solutions</strong> is a premier software company specialized in developing enterprise cloud platforms (SaaS) and tailor-made business management systems. We empower organizations across commercial, healthcare, legal, security, HOA, and academic industries.</p>

<h3>Our Vision & Mission</h3>
<p>Accelerating seamless digital transformation across the region with reliable, elegant, and ultra-fast cloud architectures that optimize workflow efficiency and maximize return on investment.</p>

<h3>Why Choose Saysoft?</h3>
<ul>
  <li>High-availability, lightning-fast, and secure microservices (99.9% Uptime).</li>
  <li>Full adherence to official regulatory compliance and e-invoicing standards.</li>
  <li>24/7 dedicated engineering support and ongoing cloud updates.</li>
  <li>Enterprise-grade data encryption and absolute customer data ownership.</li>
</ul>

<h3>Our Headquarters & Interactive Location on Google Maps</h3>
<p>We are always delighted to welcome our partners and clients to our headquarters, or provide remote consultations and live interactive system demonstrations worldwide:</p>

<div class="google-map-card" style="margin: 28px 0; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.07); background: var(--card-bg, #ffffff);">
  <div style="padding: 16px 20px; background: var(--bg-color, #f8fafc); border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <strong style="display: block; font-size: 15px; color: var(--text-main, #0f172a); font-weight: 700;">Saysoft Digital Solutions Headquarters</strong>
        <span style="font-size: 13px; color: var(--text-muted, #64748b);">Cairo, Egypt (30°06'54.6"N 31°18'21.3"E)</span>
      </div>
    </div>
    <a href="https://www.google.com/maps/place/30%C2%B006'54.6%22N+31%C2%B018'21.3%22E/@30.1151676,31.3084919,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.115163!4d31.305917" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 13px; padding: 7px 16px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; border: 1px solid var(--primary-color); color: var(--primary-color);">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Google Maps
    </a>
  </div>

  <div style="position: relative; width: 100%; height: 400px; background: #f1f5f9;">
    <iframe 
      title="Saysoft Digital Solutions Interactive Google Map"
      src="https://maps.google.com/maps?q=30%C2%B006'54.6%22N+31%C2%B018'21.3%22E&amp;hl=en&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
      width="100%" 
      height="100%" 
      style="border:0; display:block; width:100%; height:100%;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>

  <div style="padding: 14px 20px; font-size: 13px; color: var(--text-muted, #64748b); background: var(--card-bg, #ffffff); border-top: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <span><i class="fa-regular fa-clock" style="color: var(--primary-color, #0284c7);"></i> <strong>Visiting Hours:</strong> Sunday – Thursday (9:00 AM – 5:00 PM)</span>
      <span><i class="fa-solid fa-phone" style="color: var(--primary-color, #0284c7);"></i> <strong>Direct Phone:</strong> +20 100 000 0000</span>
    </div>
    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
      <i class="fa-solid fa-map-pin"></i> Live Interactive Map
    </span>
  </div>
</div>`,
      MetaTitleAr: 'من نحن | شركة سايسوفت للحلول الرقمية وتطبيقات SaaS',
      MetaTitleEn: 'About Us | Saysoft Digital Solutions & Cloud Systems',
      MetaDescAr: 'تعرف على شركة سايسوفت للحلول الرقمية ورسالتنا في تمكين الشركات بأحدث المنظومات السحابية.',
      MetaDescEn: 'Learn about Saysoft Digital Solutions and our mission in empowering businesses with smart SaaS ERPs.',
      MetaKeywordsAr: 'من نحن, شركة سايسوفت, حلول سحابية, برامج إدارية',
      MetaKeywordsEn: 'about us, saysoft, cloud software, saas company',
      SortOrder: 1,
      IsActive: true
    }
  });
  console.log('✓ تم ضبط صفحة من نحن ثنائية اللغة');

  console.log('--- اكتملت عملية التحديث وإعادة الزرع بنجاح تام! ---');
}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء تنفيذ سكريبت التغذية:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
