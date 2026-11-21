const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unifyAllSystems() {
  console.log('--- توحيد وتنسيق كافة صفحات المنظومات لتطابق قالب ساي ليجال ---');

  // المنظومات والتفاصيل الشاملة
  const systemsData = [
    {
      slug: 'saylegal-law-practice',
      cover: '/uploads/systems/saylegal-cover.jpg',
      appLogo: '/uploads/systems/ls49139.png',
      images: [
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'لوحة المؤشرات القضائية وإحصائيات القضايا النشطة والجلسات', capEn: 'Judicial Dashboard & Active Cases Analytics' },
        { path: '/uploads/systems/saylegal-screen2.svg', capAr: 'سجل ملفات الدعاوى القضائية وتفاصيل الخصوم والمذكرات المودعة', capEn: 'Case Files & Legal Pleadings Management' },
        { path: '/uploads/systems/saylegal-screen3.svg', capAr: 'إدارة التوكيلات والعقود الشرعية وتتبع السريان عبر ناجز', capEn: 'Powers of Attorney & Contracts Archive' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'محاسبة أتعاب المحاماة والفواتير الضريبية وسندات التحصيل', capEn: 'Legal Fees Accounting & Tax Invoices' }
      ],
      packages: [
        { nameAr: 'باقة المحامي الفردي', nameEn: 'Solo Lawyer Tier', price: 49, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'مستخدم واحد • إدارة حتى 150 قضية • أرشفة توكيلات سحابية • دعم فني', featuresEn: '1 Lawyer • Up to 150 Cases • Cloud Document Archive • Email Support', isPopular: false },
        { nameAr: 'باقة المكاتب الاحترافية', nameEn: 'Professional Practice Tier', price: 399, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: '5 مستخدمين • قضايا غير محدودة • ربط الفاتورة الإلكترونية • تنبيهات مواعيد الجلسات والطعون', featuresEn: '5 Users • Unlimited Cases • E-Invoicing Integration • Court Hearing Reminders', isPopular: true },
        { nameAr: 'باقة الشركات القانونية (ترخيص كامل)', nameEn: 'Enterprise & Law Firms', price: 990, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'مستخدمون غير محدودين • تثبيت محلي أو سحابي مخصص • تخصيص العقود والأختام • دعم مخصص 24/7', featuresEn: 'Unlimited Seats • Private Cloud / On-Premise • Full Customization • 24/7 Support', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل تدعم منظومة ساي ليجال الربط مع بوابات القضاء والمحاكم الإلكترونية؟', qEn: 'Does SayLegal integrate with judicial court portals?', aAr: 'نعم، تدعم المنظومة حفظ ومتابعة أرقام الدوائر، الرول، وتحديثات الجلسات ومطابقة الإجراءات القانونية المعتمدة.', aEn: 'Yes, it provides automated tracking of case sessions, hearing schedules, and court rulings.' },
        { qAr: 'كيف تضمن المنظومة سرية بيانات الموكلين والمستندات؟', qEn: 'How does the system ensure client confidentiality?', aAr: 'تعتمد المنظومة أعلى معايير التشفير (AES-256) مع صلاحيات وصول دقيقة لكل محامٍ ومستشار داخل المكتب.', aEn: 'All files are encrypted with enterprise-grade AES-256 with granular RBAC permissions.' },
        { qAr: 'هل يمكن إصدار الفواتير وسندات القبض لأتعاب القضايا؟', qEn: 'Can we generate legal fee invoices and payment receipts?', aAr: 'نعم، المنظومة مزودة بنظام محاسبي مالي متكامل متوافق مع متطلبات الفاتورة الإلكترونية المعتمدة.', aEn: 'Yes, full tax-compliant invoicing and retainers tracking is built-in.' }
      ]
    },
    {
      slug: 'sayguard-security',
      cover: '/uploads/systems/ls49117.png',
      appLogo: '/uploads/systems/ls49117.png',
      images: [
        { path: '/uploads/systems/ls49117.png', capAr: 'لوحة التحكم المركزية لعمليات الحراسة وتوزيع الورديات', capEn: 'Security Operations & Shift Dispatch Command Center' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'متابعة نقاط الحراسة وتوزيع الأفراد على المواقع والمنشآت', capEn: 'Guard Checkpoints & Site Rosters Tracking' },
        { path: '/uploads/systems/saylegal-screen2.svg', capAr: 'سجل البلاغات والإنذارات وغرفة العمليات الميدانية', capEn: 'Incident Reports & Field Dispatch Log' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'إدارة عقود العملاء وفواتير الحراسة وتكاليف التشغيل', capEn: 'Client Security Contracts & Monthly Billing' }
      ],
      packages: [
        { nameAr: 'باقة الحراسات الخفيفة', nameEn: 'Basic Guard Tier', price: 69, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'حتى 30 حارس أمن • 3 مواقع حراسة • جدول ورديات إلكتروني • تقارير الحضور', featuresEn: 'Up to 30 Guards • 3 Sites • Shift Scheduler • Attendance Logs', isPopular: false },
        { nameAr: 'باقة الشركات الأمنية المتطورة', nameEn: 'Advanced Security Tier', price: 590, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حراس ومواقع غير محدودة • تتبع دوريات GPS • تقارير الحوادث الفورية • فواتير العقود', featuresEn: 'Unlimited Guards & Sites • GPS Patrol Tracking • Incident Alerts • Billing', isPopular: true },
        { nameAr: 'باقة المنشآت الحيوية (ترخيص دائم)', nameEn: 'Enterprise Security Suite', price: 1290, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'غرفة تحكم مركزية متكاملة • ربط أجهزة البصمة واللاسلكي • خادم مخصص • دعم 24/7', featuresEn: 'Full Command Center • Biometric & Radio Integration • Dedicated Host • 24/7 SLA', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل يدعم النظام متابعة وتوزيع ورديات الحراسة آلياً؟', qEn: 'Does the system support automated shift scheduling?', aAr: 'نعم، يوفر النظام جدول ورديات ديناميكي يراعي أوقات الراحة، الغياب، وتوزيع البدلاء فورياً.', aEn: 'Yes, it provides flexible shift schedules with automatic backup guard dispatch.' },
        { qAr: 'هل يمكن للعميل الاطلاع على تقارير حراسة مواقعه؟', qEn: 'Can clients view reports for their secured premises?', aAr: 'نعم، توفر المنظومة بوابة مخصصة لكل عميل للاطلاع على حضور الحراس والبلاغات اليومية المسجلة.', aEn: 'Yes, a dedicated client portal allows reviewing daily logs and guard presence.' }
      ]
    },
    {
      slug: 'saymollak-hoa',
      cover: '/uploads/systems/ls49132.png',
      appLogo: '/uploads/systems/ls49132.png',
      images: [
        { path: '/uploads/systems/ls49132.png', capAr: 'لوحة القيادة المالية لاتحاد الشاغلين وميزانية الصيانة', capEn: 'HOA Financial Dashboard & Maintenance Budget' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'سجل الوحدات العقارية والشاغلين والملفات السكنية', capEn: 'Property Units & Residents Directory' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'أوامر الصيانة الدورية ومتابعة مقاولي المصاعد والخدمات', capEn: 'Preventive Maintenance & Contractor Work Orders' },
        { path: '/uploads/systems/saylegal-screen3.svg', capAr: 'إشعارات سداد الاشتراكات الشهرية وفواتير الخدمات', capEn: 'Subscription Fee Notices & Invoicing' }
      ],
      packages: [
        { nameAr: 'باقة العمارة السكنية', nameEn: 'Residential Building Tier', price: 29, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'حتى 30 وحدة • محاسبة الصيانة ومصروفات الحارس • سندات قبض إلكترونية • تقارير الشفافية', featuresEn: 'Up to 30 Units • Maintenance Accounting • Digital Receipts • Transparency Reports', isPopular: false },
        { nameAr: 'باقة المجمعات والأبراج السكنية', nameEn: 'Residential Compounds Tier', price: 299, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حتى 150 وحدة • بوابة سداد للملاك • إدارة عقود الصيانة • تذكير آلي عبر الواتساب', featuresEn: 'Up to 150 Units • Owners Portal • Maintenance Vendor Contracts • WhatsApp Reminders', isPopular: true },
        { nameAr: 'باقة شركات الإدارة العقارية (ترخيص مفتوح)', nameEn: 'Property Management Firms', price: 890, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'أبراج ومجمعات غير محدودة • تقارير مالية مجمعة • حسابات ملاك منفصلة • دعم فني متواصل', featuresEn: 'Unlimited Compounds • Multi-Property Analytics • White-Labeling • Dedicated Support', isPopular: false }
      ],
      faqs: [
        { qAr: 'كيف يحل النظام مشكلة تخلف بعض الملاك عن سداد مصاريف الصيانة؟', qEn: 'How does SayMollak resolve delayed maintenance fee collection?', aAr: 'يرسل النظام إشعارات سداد دورية ذكية مع روابط دفع آمنة وتقارير شفافية توضح بنود الصرف لتعزيز الثقة.', aEn: 'Automated recurring payment links and detailed expense ledgers boost collection compliance.' },
        { qAr: 'هل يدعم إدارة فواتير الخدمات مثل المصاعد وحراسة العقار؟', qEn: 'Does it manage elevator and janitorial service contracts?', aAr: 'نعم، يشمل جدول متابعة دوري لعقود صيانة المصاعد، النظافة، الحراسة، مع أرشفة فواتير الموردين.', aEn: 'Yes, comprehensive vendor contract tracking and expense accounting is fully included.' }
      ]
    },
    {
      slug: 'say-cashier-pos',
      cover: '/uploads/systems/saycashier-pos.png',
      appLogo: '/uploads/systems/ls49140.png',
      images: [
        { path: '/uploads/systems/saycashier-pos.png', capAr: 'شاشة نقطة البيع السريعة المتوافقة مع أجهزة اللمس والباركود', capEn: 'High-Speed Touch & Barcode POS Interface' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'إدارة حركة المخازن والجرد الفوري وتتبع تواريخ الصلاحية', capEn: 'Inventory Management, Instant Stock Audit & Expiry' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'فواتير المشتريات وحسابات الموردين والأرباح اليومية', capEn: 'Purchases, Vendor Payables & Daily Net Profit' },
        { path: '/uploads/systems/saylegal-screen2.svg', capAr: 'لوحة الأرباح والمبيعات وتقارير حركة الأصناف الأكثر طلباً', capEn: 'Sales Performance Analytics & Top Selling Products' }
      ],
      packages: [
        { nameAr: 'باقة المتجر الفردي (كاشير واحد)', nameEn: 'Single Store Tier', price: 39, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'نقطة بيع واحدة • إدارة المخزون • دعم قارئ الباركود وطابعات الإيصالات • الفاتورة الإلكترونية', featuresEn: '1 POS Terminal • Stock Tracking • Barcode & Receipt Printers • E-Invoicing', isPopular: false },
        { nameAr: 'باقة المتاجر المتعددة والمستودعات', nameEn: 'Multi-Branch & Warehouses', price: 360, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حتى 3 نقاط بيع • مستودعات متعددة • إدارة المشتريات والموردين • تقارير الأرباح التفصيلية', featuresEn: 'Up to 3 Terminals • Multi-Store Warehouses • Supplier Management • P&L Analytics', isPopular: true },
        { nameAr: 'باقة السوبرماركت وسلاسل التوزيع (دائمة)', nameEn: 'Retail Chain Lifetime', price: 850, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'نقاط بيع ومخازن غير محدودة • مزامنة سحابية غير منقطعة للعمل بدون إنترنت • دعم مخصص', featuresEn: 'Unlimited Terminals & Depots • Offline Mode with Auto Cloud Sync • Priority Support', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل تعمل منظومة ساي كاشير في حال انقطاع الإنترنت؟', qEn: 'Does SayCashier operate offline?', aAr: 'نعم، تدعم المنظومة العمل في وضع عدم الاتصال (Offline Mode) مع مزامنة الفواتير تلقائياً عند عودة الاتصال.', aEn: 'Yes, offline sales continue smoothly and synchronize to the cloud once restored.' },
        { qAr: 'هل النظام متوافق مع متطلبات الفاتورة الإلكترونية؟', qEn: 'Is the system compliant with official e-invoicing standards?', aAr: 'نعم، المنظومة متوافقة 100% مع معايير الفاتورة الإلكترونية (QR Code والربط السحابي المعتمد).', aEn: 'Yes, 100% compliant with mandatory tax e-invoicing and QR code standards.' }
      ]
    },
    {
      slug: 'say-clinic-medical',
      cover: '/uploads/systems/sayclinic-medical.jpg',
      appLogo: '/uploads/systems/ls49247.png',
      images: [
        { path: '/uploads/systems/sayclinic-medical.jpg', capAr: 'الملف الطبي الإلكتروني للمريض وسجل الزيارات السابقة', capEn: 'Electronic Health Record (EHR) & Clinical Visit History' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'جدول المواعيد والحجوزات اليومية وإدارة أدوار الانتظار', capEn: 'Clinic Appointment Schedule & Patient Queue System' },
        { path: '/uploads/systems/saylegal-screen3.svg', capAr: 'الروشتة الإلكترونية وطباعة الوصفات الدوائية المعتمدة', capEn: 'E-Prescription & Pharmaceutical Prescription Printing' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'محاسبة العيادة وفواتير الكشف والإجراءات الطبية', capEn: 'Medical Billing, Consultation Fees & Lab Tests' }
      ],
      packages: [
        { nameAr: 'باقة العيادة التخصصية الفردية', nameEn: 'Single Clinic Tier', price: 49, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'طبيب واحد • سجلات مرضى غير محدودة • روشتة إلكترونية • تنظيم قائمة الانتظار', featuresEn: '1 Doctor • Unlimited Patients • Digital Rx • Queue Management', isPopular: false },
        { nameAr: 'باقة المركز الطبي والمجمع الاستشاري', nameEn: 'Medical Center Tier', price: 450, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حتى 5 عيادات • إدارة الاستقبال والمختبر • ملفات أشعة وتحاليل • تذكير المواعيد بالواتساب', featuresEn: 'Up to 5 Clinics • Reception & Lab • Radiology Archive • WhatsApp Appointment Alerts', isPopular: true },
        { nameAr: 'باقة المستشفيات والمراكز الكبرى (ترخيص كامل)', nameEn: 'Hospital Enterprise License', price: 1100, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'أطباء وتخصصات غير محدودة • غرف عمليات وإقامة • صيدلية داخلية • تكامل كامل', featuresEn: 'Unlimited Clinics & Doctors • Inpatient Management • Internal Pharmacy • Full Customization', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل يمكن أرشفة صور الأشعة ونتائج التحاليل داخل ملف المريض؟', qEn: 'Can lab reports and radiology images be attached to patient records?', aAr: 'نعم، يتيح الملف الطبي رفع وأرشفة ملفات PDF وصور الأشعة مع محرك بحث فوري برقم هوية أو هاتف المريض.', aEn: 'Yes, patients profiles support high-res imaging, PDF lab scans, and instant search.' },
        { qAr: 'هل تدعم المنظومة طباعة الروشتة الطبية بتصميم يحمل ترويسة الطبيب؟', qEn: 'Can medical prescriptions be printed with custom doctor letterheads?', aAr: 'نعم، يمكن تخصيص تصميم الروشتة بالكامل مع شعار العيادة وبيانات الاتصال والأدوية المسجلة.', aEn: 'Yes, customized branded prescription printouts are standard.' }
      ]
    },
    {
      slug: 'sayconcrete-plant',
      cover: '/uploads/systems/ls49107.png',
      appLogo: '/uploads/systems/ls49107.png',
      images: [
        { path: '/uploads/systems/ls49107.png', capAr: 'لوحة التحكم بتشغيل المحطة وتتبع أوامر الخلط والتوريد', capEn: 'Plant Dispatch Dashboard & Mix Orders Management' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'إدارة مكونات الخلطات الخرسانية (Mix Design) ونسب الأسمنت والركام', capEn: 'Concrete Mix Design & Raw Materials Proportioning' },
        { path: '/uploads/systems/saylegal-screen2.svg', capAr: 'تتبع حركة شاحنات الخلط (Mixers) ومضخات الخرسانة (Pumps)', capEn: 'Transit Mixers & Concrete Pumps Fleet Dispatch' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'حسابات المقاولين والمشاريع ومطابقات التوريد والموازين', capEn: 'Contractor Accounts, Delivery Notes & Weighbridge Sync' }
      ],
      packages: [
        { nameAr: 'باقة المحطة الواحدة', nameEn: 'Single Plant Tier', price: 99, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'محطة خلط واحدة • حتى 10 خلاطات • بونات توريد إلكترونية • حسابات المقاولين', featuresEn: '1 Batching Plant • Up to 10 Mixers • Digital Delivery Notes • Billing', isPopular: false },
        { nameAr: 'باقة المحطات المركزية والمشاريع الكبرى', nameEn: 'Central Plants Fleet Tier', price: 890, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حتى 3 محطات • أسطول شاحنات غير محدود • ربط ميزان البسكول الآلي • معادلات خلط دقيقة', featuresEn: 'Up to 3 Plants • Unlimited Fleet • Weighbridge Sync • Advanced Mix Formulas', isPopular: true },
        { nameAr: 'باقة شركات الخرسانة والتشييد (ترخيص دائم)', nameEn: 'Concrete Enterprise Suite', price: 1750, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'محطات غير محدودة • مراقبة مباشرة لسيور الخلط ومستودعات الأسمنت • ربط محاسبي وتخصيص كامل', featuresEn: 'Unlimited Plants & Silos • Raw Materials Telemetry • ERP Integration • 24/7 SLA', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل يدعم النظام الربط مع موازين المحطة وحساسات الخلط؟', qEn: 'Does the system integrate with weighbridges and batching scales?', aAr: 'نعم، يوفر النظام قراءة آلية لأوزان الشاحنات وتحديث أرصدة الأسمنت والركام والمياه لحظياً.', aEn: 'Yes, automated weighbridge capture and aggregate telemetry are supported.' },
        { qAr: 'كيف تتم متابعة توقيت خروج الشاحنة وصب الخرسانة لمنع تلف الخلطة؟', qEn: 'How are delivery timestamps tracked to prevent concrete degradation?', aAr: 'يسجل النظام وقت الخروج، زمن الوصول للموقع، وبداية الصب مع إصدار تنبيهات في حال تجاوز الوقت المعياري.', aEn: 'Exact dispatch and pour timestamps ensure freshness and compliance with slump tests.' }
      ]
    },
    {
      slug: 'sayedu-education',
      cover: '/uploads/systems/sayedu-3d.jpg',
      appLogo: '/uploads/systems/ls49102.png',
      images: [
        { path: '/uploads/systems/sayedu-3d.jpg', capAr: 'بوابة الإدارة المدرسية وشؤون الطلاب وقوائم الفصول', capEn: 'School Administration, Student Records & Class Rosters' },
        { path: '/uploads/systems/saylegal-screen1.svg', capAr: 'نظام إدارة الامتحانات والدرجات والشهادات التراكمية', capEn: 'Examinations, Gradebooks & Report Cards Generation' },
        { path: '/uploads/systems/saylegal-screen3.svg', capAr: 'جداول الحصص الأسبوعية وتوزيع المعلمين والمعامل', capEn: 'Weekly Timetables & Teacher Allocations' },
        { path: '/uploads/systems/saylegal-screen4.svg', capAr: 'محاسبة الأقساط المدرسية وسندات القبض ومتابعة المتأخرات', capEn: 'Tuition Fees Accounting & Installment Tracking' }
      ],
      packages: [
        { nameAr: 'باقة الروضات والمدارس الصغيرة', nameEn: 'Kindergarten & Primary Tier', price: 59, period: 'MONTHLY', periodAr: 'شهرياً', periodEn: 'Monthly', featuresAr: 'حتى 200 طالب • إدارة شؤون الطلاب والغياب • رصد الدرجات • إشعارات أولياء الأمور', featuresEn: 'Up to 200 Students • Attendance & Grades • Report Cards • Parent Alerts', isPopular: false },
        { nameAr: 'باقة المدارس المتكاملة والمجمعات', nameEn: 'Comprehensive School Tier', price: 550, period: 'YEARLY', periodAr: 'سنوياً', periodEn: 'Yearly', featuresAr: 'حتى 1000 طالب • حسابات الرسوم والأقساط • جدول الحصص الإلكتروني • بوابة ولي الأمر الذكية', featuresEn: 'Up to 1,000 Students • Tuition Billing • Timetables • Parent Smart Portal', isPopular: true },
        { nameAr: 'باقة سلاسل المدارس والمعاهد (ترخيص دائم)', nameEn: 'Educational Group License', price: 1350, period: 'LIFETIME', periodAr: 'ترخيص دائم', periodEn: 'Lifetime', featuresAr: 'طلاب وفروع غير محدودة • نظام إدارة تعلم (LMS) • تطبيق جوال مخصص • دعم استباقي', featuresEn: 'Unlimited Students & Campuses • LMS Modules • Custom Mobile App • Priority SLA', isPopular: false }
      ],
      faqs: [
        { qAr: 'هل يتضمن النظام بوابة خاصة لأولياء الأمور؟', qEn: 'Does SayEdu include a parent portal?', aAr: 'نعم، يمكن لولي الأمر متابعة درجات أبنائه، غيابهم، جدول الحصص، ورسوم الأقساط بكل سهولة عبر الهاتف.', aEn: 'Yes, parents have dedicated access to track academic progress and tuition payments.' },
        { qAr: 'هل يدعم إصدار الشهادات التراكمية وطباعتها؟', qEn: 'Can report cards and graduation certificates be printed?', aAr: 'نعم، توفر المنظومة محركاً مرناً لتصميم وطباعة شهادات التقدير والدرجات متوافقاً مع اللوائح التعليمية.', aEn: 'Yes, customizable report cards with automated grade calculation are fully supported.' }
      ]
    }
  ];

  for (const s of systemsData) {
    const existing = await prisma.system.findUnique({ where: { Slug: s.slug } });
    if (!existing) continue;

    // تحديث الغلاف واللوجو
    await prisma.system.update({
      where: { IDSystem: existing.IDSystem },
      data: {
        CoverImage: s.cover,
        AppLogo: s.appLogo,
        IsActive: true
      }
    });

    // تحديث الصور
    await prisma.systemImage.deleteMany({ where: { SystemID: existing.IDSystem } });
    for (let i = 0; i < s.images.length; i++) {
      const img = s.images[i];
      await prisma.systemImage.create({
        data: {
          SystemID: existing.IDSystem,
          ImagePath: img.path,
          CaptionAr: img.capAr,
          CaptionEn: img.capEn,
          SortOrder: i + 1
        }
      });
    }

    // تحديث الباقات
    await prisma.package.deleteMany({ where: { SystemID: existing.IDSystem } });
    for (let i = 0; i < s.packages.length; i++) {
      const pkg = s.packages[i];
      await prisma.package.create({
        data: {
          SystemID: existing.IDSystem,
          NameAr: pkg.nameAr,
          NameEn: pkg.nameEn,
          Price: pkg.price,
          PeriodAr: pkg.periodAr,
          PeriodEn: pkg.periodEn,
          FeaturesAr: pkg.featuresAr,
          FeaturesEn: pkg.featuresEn,
          IsPopular: pkg.isPopular,
          SortOrder: i + 1,
          IsActive: true
        }
      });
    }

    // تحديث الأسئلة الشائعة
    await prisma.systemFAQ.deleteMany({ where: { SystemID: existing.IDSystem } });
    for (let i = 0; i < s.faqs.length; i++) {
      const faq = s.faqs[i];
      await prisma.systemFAQ.create({
        data: {
          SystemID: existing.IDSystem,
          QuestionAr: faq.qAr,
          QuestionEn: faq.qEn,
          AnswerAr: faq.aAr,
          AnswerEn: faq.aEn,
          SortOrder: i + 1,
          IsActive: true
        }
      });
    }

    console.log(`✓ تم توحيد مكونات منظومة: ${existing.BrandNameAr || existing.NameAr}`);
  }

  await prisma.$disconnect();
  console.log('--- اكتمل توحيد جميع صفحات المنظومات بنجاح تام! ---');
}

unifyAllSystems().catch((err) => {
  console.error(err);
  process.exit(1);
});
