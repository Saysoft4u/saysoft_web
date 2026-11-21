const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTranslations() {
  const updates = [
    {
      id: 6,
      nameAr: 'إدارة شركات الأمن والحراسة',
      nameEn: 'Security & Guarding Companies Management System',
      brandAr: 'ساي جارد',
      brandEn: 'SayGuard',
      metaTitleEn: 'Security & Guarding Companies Management System | Saysoft'
    },
    {
      id: 7,
      nameAr: 'إدارة مكاتب المحاماة والاستشارات القانونية',
      nameEn: 'Law Firms & Legal Consultations Management System',
      brandAr: 'ساي ليجال',
      brandEn: 'SayLegal',
      metaTitleEn: 'Law Firms & Legal Consultations Management System | Saysoft'
    },
    {
      id: 8,
      nameAr: 'إدارة اتحاد الملاك والعقارات',
      nameEn: 'Homeowners Association (HOA) & Property Management System',
      brandAr: 'ساي ملاك',
      brandEn: 'SayMollak',
      metaTitleEn: 'Homeowners Association (HOA) & Property Management | Saysoft'
    },
    {
      id: 9,
      nameAr: 'إدارة المبيعات والمشتريات والمخازن',
      nameEn: 'Sales, Purchasing & Warehouse Inventory Management System',
      brandAr: 'ساي كاشير',
      brandEn: 'SayCashier',
      metaTitleEn: 'Sales, Purchasing & Warehouse Inventory Management System | Saysoft'
    },
    {
      id: 10,
      nameAr: 'إدارة المراكز الطبية والعيادات',
      nameEn: 'Medical Centers & Clinics Management System',
      brandAr: 'ساي كلينيك',
      brandEn: 'SayClinic',
      metaTitleEn: 'Medical Centers & Clinics Management System | Saysoft'
    },
    {
      id: 11,
      nameAr: 'نظام إدارة محطات الخرسانة المسلحة',
      nameEn: 'Ready-Mix Concrete Batching Plants Management System',
      brandAr: 'ساي كونكريت',
      brandEn: 'SayConcrete',
      metaTitleEn: 'Ready-Mix Concrete Batching Plants Management System | Saysoft'
    },
    {
      id: 13,
      nameAr: 'إدارة المدارس والمنشآت التعليمية',
      nameEn: 'Schools & Educational Institutions Management System',
      brandAr: 'ساي إديو',
      brandEn: 'SayEdu',
      metaTitleEn: 'Schools & Educational Institutions Management System | Saysoft'
    }
  ];

  for (const u of updates) {
    await prisma.system.update({
      where: { IDSystem: u.id },
      data: {
        NameAr: u.nameAr,
        NameEn: u.nameEn,
        BrandNameAr: u.brandAr,
        BrandNameEn: u.brandEn,
        MetaTitleEn: u.metaTitleEn
      }
    });
    console.log(`[UPDATED] ${u.nameAr} -> ${u.nameEn} (Brand: ${u.brandEn})`);
  }

  await prisma.$disconnect();
}

updateTranslations().catch(e => {
  console.error(e);
  process.exit(1);
});
