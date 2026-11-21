const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { 
      slug: 'sayguard-security', 
      brandAr: 'ساي جارد', 
      brandEn: 'SayGuard', 
      appCode: '50010', 
      type: 'HYBRID_SUITE', 
      url: 'http://localhost:50010/admin', 
      user: 'guard_owner', 
      pass: 'GuardOwner@2026' 
    },
    { 
      slug: 'saylegal-law-practice', 
      brandAr: 'ساي ليجال', 
      brandEn: 'SayLegal', 
      appCode: '50020', 
      type: 'SAAS_CLOUD', 
      url: 'http://localhost:50020/admin', 
      user: 'legal_owner', 
      pass: 'LegalOwner@2026' 
    },
    { 
      slug: 'saymollak-hoa', 
      brandAr: 'ساي ملاك', 
      brandEn: 'SayMollak', 
      appCode: '50030', 
      type: 'WEB_APP', 
      url: 'http://localhost:50030/admin', 
      user: 'mollak_owner', 
      pass: 'MollakOwner@2026' 
    },
    { 
      slug: 'say-cashier-pos', 
      brandAr: 'ساي كاشير', 
      brandEn: 'SayCashier', 
      appCode: '50040', 
      type: 'DESKTOP_APP', 
      url: 'http://localhost:50040/admin', 
      user: 'pos_owner', 
      pass: 'PosOwner@2026' 
    },
    { 
      slug: 'say-clinic-medical', 
      brandAr: 'ساي كلينيك', 
      brandEn: 'SayClinic', 
      appCode: '50050', 
      type: 'SAAS_CLOUD', 
      url: 'http://localhost:50050/admin', 
      user: 'clinic_owner', 
      pass: 'ClinicOwner@2026' 
    },
    { 
      slug: 'sayconcrete-plant', 
      brandAr: 'ساي كونكريت', 
      brandEn: 'SayConcrete', 
      appCode: '50060', 
      type: 'DESKTOP_APP', 
      url: 'http://localhost:50060/admin', 
      user: 'concrete_owner', 
      pass: 'ConcreteOwner@2026' 
    },
    { 
      slug: 'sayedu-education', 
      brandAr: 'ساي إديو', 
      brandEn: 'SayEdu', 
      appCode: '50070', 
      type: 'HYBRID_SUITE', 
      url: 'http://localhost:50070/admin', 
      user: 'edu_owner', 
      pass: 'EduOwner@2026' 
    }
  ];

  for (const u of updates) {
    const sys = await prisma.system.findUnique({ where: { Slug: u.slug } });
    if (sys) {
      await prisma.system.update({
        where: { IDSystem: sys.IDSystem },
        data: {
          BrandNameAr: u.brandAr,
          BrandNameEn: u.brandEn,
          AppCode: u.appCode,
          AppType: u.type,
          AppLogo: sys.Logo || '/uploads/logos/saysoftlogo.png',
          OwnerAdminUrl: u.url,
          OwnerUsername: u.user,
          OwnerPassword: u.pass,
          OwnerNotes: 'بيانات اعتماد لوحة إدارة المالك - سرية وخاصة'
        }
      });
      console.log(`[OK] تم تحديث: ${sys.NameAr} | الكود: ${u.appCode} | النوع: ${u.type}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
