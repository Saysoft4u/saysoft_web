const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const legalSystem = await prisma.system.findUnique({
    where: { Slug: 'saylegal-law-practice' }
  });

  if (!legalSystem) {
    console.error('System saylegal-law-practice not found!');
    process.exit(1);
  }

  // Clear existing images for this system to avoid duplicate seeding
  await prisma.systemImage.deleteMany({
    where: { SystemID: legalSystem.IDSystem }
  });

  const screenshots = [
    {
      SystemID: legalSystem.IDSystem,
      ImagePath: '/uploads/systems/saylegal-screen1.svg',
      CaptionAr: 'لوحة المؤشرات القضائية وإحصائيات القضايا النشطة والجلسات',
      CaptionEn: 'Judicial Dashboard & Active Cases Analytics',
      SortOrder: 1
    },
    {
      SystemID: legalSystem.IDSystem,
      ImagePath: '/uploads/systems/saylegal-screen2.svg',
      CaptionAr: 'سجل ملفات الدعاوى القضائية وتفاصيل الخصوم والمذكرات المودعة',
      CaptionEn: 'Case Files & Legal Pleadings Management',
      SortOrder: 2
    },
    {
      SystemID: legalSystem.IDSystem,
      ImagePath: '/uploads/systems/saylegal-screen3.svg',
      CaptionAr: 'إدارة التوكيلات والعقود الشرعية وتتبع السريان عبر ناجز',
      CaptionEn: 'Powers of Attorney & Contracts Archive',
      SortOrder: 3
    },
    {
      SystemID: legalSystem.IDSystem,
      ImagePath: '/uploads/systems/saylegal-screen4.svg',
      CaptionAr: 'محاسبة أتعاب المحاماة والفواتير الضريبية وسندات التحصيل',
      CaptionEn: 'Legal Fees Accounting & Tax Invoices',
      SortOrder: 4
    }
  ];

  for (const s of screenshots) {
    await prisma.systemImage.create({ data: s });
  }

  console.log(`Successfully added ${screenshots.length} virtual screenshots to ${legalSystem.NameAr}`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
