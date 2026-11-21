const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faqsData = {
  'sayguard-security': [
    {
      QuestionAr: 'كيف يتم التحقق من التزام الحارس بجدول المرور على نقاط الحراسة؟',
      QuestionEn: 'How does the system verify security guard patrol rounds?',
      AnswerAr: 'من خلال نقاط مسح كود QR وشرائح NFC المثبتة بالموقع ونظام تحديد الموقع الجغرافي GPS مع تسجيل بصمة الوقت والتقاط صورة حية.',
      AnswerEn: 'Via location QR codes, NFC tags, and real-time GPS tracking with instant photo verification.'
    },
    {
      QuestionAr: 'هل يمكن لعميل شركة الأمن الاطلاع على تقارير موقعه إلكترونياً؟',
      QuestionEn: 'Can the security client view their facility reports online?',
      AnswerAr: 'نعم، نوفر بوابة عميل مخصصة وتطبيق هاتف يتيح الاطلاع المباشر على الحضور، جولات الحراسة، وسجل البلاغات.',
      AnswerEn: 'Yes, dedicated client portal and mobile app for viewing patrols and live incident reports.'
    },
    {
      QuestionAr: 'هل تدعم المنظومة تسجيل البلاغات الأمنية الطارئة وإرفاق الصور؟',
      QuestionEn: 'Does the system support incident logging with photos?',
      AnswerAr: 'نعم، يمكن لرجل الأمن تسجيل أي بلاغ طارئ وإرفاق الصور الفوتوغرافية وتحديد درجة الخطورة مع إشعار فوري لغرفة العمليات.',
      AnswerEn: 'Yes, guards can log emergency alerts with photos and severity level, instantly notifying dispatch.'
    },
    {
      QuestionAr: 'كيف يتم احتساب ساعات العمل الإضافية والبدلات لرجال الأمن؟',
      QuestionEn: 'How are overtime and shift allowances calculated?',
      AnswerAr: 'يحتوي النظام على وحدة متكاملة للرواتب تحسب بدلات النوبات وساعات العمل الإضافية والخصومات بناءً على بصمات الحضور والانصراف الفعلية.',
      AnswerEn: 'Automated payroll engine calculates shift allowances and overtime directly from biometric logs.'
    }
  ],
  'saylegal-law-practice': [
    {
      QuestionAr: 'هل يرسل النظام تنبيهات تلقائية قبل مواعيد الجلسات والطعون القضائية؟',
      QuestionEn: 'Does the system send automated court hearing alerts?',
      AnswerAr: 'نعم، يقوم النظام بإرسال إشعارات وتنبيهات عبر البريد والواتساب قبل مواعيد الجلسات بـ 48 و 24 ساعة.',
      AnswerEn: 'Yes, automated email and WhatsApp notifications are dispatched 48h and 24h before hearings.'
    },
    {
      QuestionAr: 'هل مستندات القضايا والتوكيلات مشفرة ومحمية من الاطلاع غير المصرح به؟',
      QuestionEn: 'Are legal case files and powers of attorney encrypted?',
      AnswerAr: 'بالتأكيد، يتم تخزين كافة العقود والتوكيلات بتشفير عسكري AES-256 مع سجل تدقيق يوثق هوية كل من اطلع على الملف.',
      AnswerEn: 'All contracts and documents are protected with AES-256 encryption with complete audit logging.'
    },
    {
      QuestionAr: 'كيف يدعم النظام إدارة العقود والاتفاقيات والتكامل مع منصة ناجز؟',
      QuestionEn: 'How does it handle contract lifecycle and Najiz integration?',
      AnswerAr: 'يوفر مساراً كاملاً لصياغة ومراجعة العقود مع أرشفة التوكيلات الشرعية المعتمدة وتتبع سريانها ومواعيد انتهائها.',
      AnswerEn: 'Full legal contract drafting lifecycle with official PoA validity tracking and expiration alerts.'
    },
    {
      QuestionAr: 'هل يمكن إصدار فواتير أتعاب المحاماة والتحصيل وسندات الصرف بنقرة واحدة؟',
      QuestionEn: 'Can law fee invoices and receipts be generated in one click?',
      AnswerAr: 'نعم، نظام مالي وقضائي متكامل يربط كل دفعة برقم القضية ويصدر فواتير ضريبية إلكترونية متوافقة مع متطلبات هيئة الزكاة والضريبة.',
      AnswerEn: 'Integrated billing engine links fee installments to case files with compliant e-invoicing.'
    }
  ],
  'saymollak-hoa': [
    {
      QuestionAr: 'كيف يعرف المالك أو الساكن ما تم صرفه من اشتراكات الصيانة والخدمات؟',
      QuestionEn: 'How can unit owners track HOA maintenance expenditure?',
      AnswerAr: 'يمكن لكل مالك الدخول عبر حسابه والاطلاع على الفواتير، المصروفات، والتقارير المالية الدورية بكل شفافية.',
      AnswerEn: 'Owners access real-time financial statements, expenses, and invoices through their portal.'
    },
    {
      QuestionAr: 'هل يدعم البرنامج إرسال إشعارات ومطالبات السداد عبر تطبيق واتساب؟',
      QuestionEn: 'Does the system send payment reminders via WhatsApp?',
      AnswerAr: 'نعم، تدعم المنظومة الربط المباشر مع WhatsApp API لإرسال فواتير الاشتراكات الشهرية وروابط الدفع الإلكتروني.',
      AnswerEn: 'Yes, automated WhatsApp API reminders with direct payment links are sent to owners.'
    },
    {
      QuestionAr: 'هل يمكن تسجيل طلبات الصيانة الطارئة وتكليف الفنيين بمتابعتها؟',
      QuestionEn: 'Can emergency maintenance requests be assigned to technicians?',
      AnswerAr: 'نعم، يتيح النظام للملاك تقديم بلاغات الأعطال وإرفاق الصور مع إسنادها فورياً للفني المختص ومتابعة حالة الإنجاز.',
      AnswerEn: 'Owners can log repair tickets with photos, automatically dispatched to maintenance crew.'
    },
    {
      QuestionAr: 'كيف تتم إدارة وحساب اشتراكات الوحدات المختلفة (سكني، تجاري، جراج)؟',
      QuestionEn: 'How are varying unit fee tiers calculated (residential, retail, parking)?',
      AnswerAr: 'تتيح المنظومة تخصيص نسب المشاركة في نفقات العقار بناءً على المساحة أو نوع الاستخدام أو الحصة الشائعة بدقة.',
      AnswerEn: 'Customizable allocation formulas based on area, usage type, or proportional deed shares.'
    }
  ],
  'say-cashier-pos': [
    {
      QuestionAr: 'هل تدعم المنظومة الربط المباشر مع متطلبات هيئة الزكاة والضريبة والجمارك (الفاتورة الإلكترونية)؟',
      QuestionEn: 'Is the system compliant with ZATCA e-invoicing regulations?',
      AnswerAr: 'نعم، المنظومة متوافقة 100% مع المرحلة الأولى والثانية للربط والتكامل مع طباعة رمز الاستجابة السريع التشفيري QR Code.',
      AnswerEn: 'Fully compliant with ZATCA Phase 1 & 2 integration and cryptographic QR code generation.'
    },
    {
      QuestionAr: 'هل يمكن تشغيل الكاشير وإصدار الفواتير في حال انقطاع الإنترنت المؤقت (Offline Mode)؟',
      QuestionEn: 'Can cashier issue receipts during internet outage (offline mode)?',
      AnswerAr: 'نعم، يدعم الكاشير وضع العمل دون اتصال ومزامنة كافة العمليات تلقائياً فور عودة اتصال الإنترنت.',
      AnswerEn: 'Seamless offline mode records all sales and synchronizes automatically upon reconnect.'
    },
    {
      QuestionAr: 'كيف تتم إدارة الجرد ومتابعة تواريخ الصلاحية وتنبيهات نواقص المخزون؟',
      QuestionEn: 'How are inventory levels and expiry dates managed?',
      AnswerAr: 'تنبيهات فورية بالحد الأدنى للأصناف وتقارير دورية بالجرد الفعلي ومتابعة تواريخ الصلاحية لتقليل الهدر.',
      AnswerEn: 'Automated low-stock threshold alerts, batch expiry tracking, and real-time variance reporting.'
    },
    {
      QuestionAr: 'هل يدعم النظام ربط طابعات الباركود، الموازين الإلكترونية، ودرج النقدية؟',
      QuestionEn: 'Does it support barcode printers, electronic scales, and cash drawers?',
      AnswerAr: 'يدعم جميع ملحقات نقاط البيع القياسية (طابعات الإيصالات الحرارية، قارئات الباركود، الموازين، وأجهزة الدفع مدى).',
      AnswerEn: 'Full support for thermal receipt printers, barcode scanners, digital scales, and mada POS terminals.'
    }
  ],
  'say-clinic-medical': [
    {
      QuestionAr: 'هل يدعم النظام إرفاق ملفات الأشعة والتحاليل الطبية والروشتات بملف المريض الإلكتروني؟',
      QuestionEn: 'Can X-rays, lab results, and prescriptions be attached to patient EMR?',
      AnswerAr: 'نعم، يحتوي النظام على ملف طبي إلكتروني موحد (EMR) لحفظ التاريخ المرضي، الأشعة، الفحوصات، والروشتات الرقمية.',
      AnswerEn: 'Comprehensive EMR records patient history, digital diagnostics, radiology files, and e-prescriptions.'
    },
    {
      QuestionAr: 'كيف تتم إدارة حجز المواعيد وتذكير المرضى تلقائياً بمواعيد الكشف عبر واتساب؟',
      QuestionEn: 'How are clinic appointments scheduled and reminded via WhatsApp?',
      AnswerAr: 'أجندة مواعيد ذكية للطبيب مع إرسال تأكيد الموعد والتذكير الآلي للمريض عبر رسائل واتساب لتقليل نسبة التخلف عن الحضور.',
      AnswerEn: 'Interactive doctor schedule with automated appointment confirmations and WhatsApp reminders.'
    },
    {
      QuestionAr: 'هل تتوافق المنظومة مع معايير التأمين الطبي ومطالبات شركات الرعاية الصحية؟',
      QuestionEn: 'Does the system support health insurance claims?',
      AnswerAr: 'نعم، يدعم تسعير الخدمات الطبية وفق بوالص التأمين واحتساب نسبة التحمل وإصدار مطالبات السداد المعتمدة.',
      AnswerEn: 'Automated copay calculation, insurance policy pricing tiers, and healthcare claim generation.'
    },
    {
      QuestionAr: 'هل يمكن للطبيب أو الاستشاري الدخول على ملفات المرضى عن بُعد من الهاتف المحمول؟',
      QuestionEn: 'Can physicians access patient records remotely via mobile?',
      AnswerAr: 'نعم، الواجهة السحابية متوافقة مع الأجهزة الذكية وتتيح للطبيب مراجعة جدول المواعيد وسجلات المرضى بأمان في أي وقت.',
      AnswerEn: 'Secure cloud-enabled access allows physicians to review patient charts and schedules on mobile devices.'
    }
  ],
  'sayconcrete-plant': [
    {
      QuestionAr: 'هل يدعم النظام الربط المباشر مع ميزان البسكول ومحطة الخلط الأوتوماتيكية؟',
      QuestionEn: 'Does it interface directly with weighbridges and batching plants?',
      AnswerAr: 'نعم، يتكامل النظام مع برمجيات محطات الخلط (PLCs) وموازين البسكول لقراءة الأوزان بدقة ومنع التلاعب.',
      AnswerEn: 'Seamless interface with batching plant PLCs and weighbridges for automated tamper-proof weight capture.'
    },
    {
      QuestionAr: 'كيف تضمن المنظومة عدم تجاوز زمن شك الخرسانة أثناء حركة الشاحنات في الطريق؟',
      QuestionEn: 'How does it track concrete slump and travel retention time?',
      AnswerAr: 'نظام تتبع ذكي يربط وقت الخروج من المحطة بزمن الوصول المتوقع مع تنبيهات عند اقتراب وقت الشك الابتدائي للخلطة.',
      AnswerEn: 'Intelligent transit tracking alerts dispatch if travel exceeds maximum allowable concrete setting time.'
    },
    {
      QuestionAr: 'هل تتوافق الفواتير ومستخلصات التوريد الميدانية مع الفاتورة الإلكترونية؟',
      QuestionEn: 'Are site delivery tickets and invoices e-invoice compliant?',
      AnswerAr: 'نعم، تصدر بوالص الشحن وإشعارات التوريد الميدانية وفواتير المستخلصات مع رمز QR المعتمد ضريبياً.',
      AnswerEn: 'Generates compliant delivery tickets and progressive billing invoices with encrypted QR codes.'
    },
    {
      QuestionAr: 'كيف تتم مراقبة استهلاك الإسمنت والركام والمواد الكيميائية وحساب تكلفة المتر المكعب؟',
      QuestionEn: 'How are cement, aggregates, and chemical admixture costs monitored per m³?',
      AnswerAr: 'حساب دقيق لنسب الخلطات المعتمدة (Mix Designs) ومقارنتها بالمخزون الفعلي واحتساب تكلفة المتر المكعب اللحظية.',
      AnswerEn: 'Real-time reconciliation of mix designs against physical inventory, calculating exact cost per cubic meter.'
    }
  ],
  'sayedu-education': [
    {
      QuestionAr: 'هل تدعم منظومة ساي إديو إرسال تنبيهات الغياب والدرجات عبر واتساب؟',
      QuestionEn: 'Does SayEdu support attendance and grade alerts via WhatsApp?',
      AnswerAr: 'نعم، يتم إرسال إشعارات فورية لأولياء الأمور بالحضور، الغياب، السلوك، ونتائج الاختبارات والواجبات.',
      AnswerEn: 'Instant notifications are sent to parents regarding attendance, conduct, and exam results.'
    },
    {
      QuestionAr: 'هل يمكن استيراد وتصدير بيانات الطلاب وسجلات الدرجات من ملفات Excel السابقة؟',
      QuestionEn: 'Can student data and grades be imported/exported from Excel?',
      AnswerAr: 'بكل تأكيد، يدعم النظام استيراد سجلات الطلاب والمعلمين بنقرة واحدة عبر قوالب إكسل قياسية وسريعة.',
      AnswerEn: 'One-click bulk import and export of student and staff records using standardized Excel templates.'
    },
    {
      QuestionAr: 'هل تتوافق المنظومة مع متطلبات الفاتورة الإلكترونية لسداد الأقساط المدرسية؟',
      QuestionEn: 'Is the tuition fee billing compliant with e-invoicing standards?',
      AnswerAr: 'نعم، يصدر النظام فواتير رسوم دراسية إلكترونية متوافقة مع الأنظمة الضريبية مع إمكانية السداد الإلكتروني.',
      AnswerEn: 'Fully compliant educational fee invoices with online payment links and installment scheduling.'
    },
    {
      QuestionAr: 'كيف يتواصل المعلمون وأولياء الأمور من خلال بوابة المتابعة التعليمية؟',
      QuestionEn: 'How do teachers and parents communicate through the portal?',
      AnswerAr: 'نوفر بوابة تعليمية متخصصة وتطبيقاً ذكياً يتيح التواصل المباشر ومتابعة الواجبات، الجداول المدرسية، والملاحظات التربوية.',
      AnswerEn: 'Dedicated interactive portal and app for direct parent-teacher messaging, homework tracking, and school timetables.'
    }
  ]
};

async function main() {
  for (const [slug, faqs] of Object.entries(faqsData)) {
    const sys = await prisma.system.findUnique({ where: { Slug: slug } });
    if (!sys) continue;

    // Delete existing FAQs to avoid duplicates
    await prisma.systemFAQ.deleteMany({ where: { SystemID: sys.IDSystem } });

    // Insert the 4 FAQs
    for (const f of faqs) {
      await prisma.systemFAQ.create({
        data: {
          SystemID: sys.IDSystem,
          QuestionAr: f.QuestionAr,
          QuestionEn: f.QuestionEn,
          AnswerAr: f.AnswerAr,
          AnswerEn: f.AnswerEn
        }
      });
    }
    console.log(`Updated ${faqs.length} FAQs for ${sys.NameAr} (${slug})`);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
