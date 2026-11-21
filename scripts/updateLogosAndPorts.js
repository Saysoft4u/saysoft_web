const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLogos() {
  const updates = [
    { slug: 'sayguard-security', logo: '/uploads/logos/logo17-guard.png', appCode: '49117' },
    { slug: 'saylegal-law-practice', logo: '/uploads/logos/logo39-law.png', appCode: '49139' },
    { slug: 'saymollak-hoa', logo: '/uploads/logos/logo32-ethad.png', appCode: '49132' },
    { slug: 'say-cashier-pos', logo: '/uploads/logos/logo40-cashier.png', appCode: '49140' },
    { slug: 'say-clinic-medical', logo: '/uploads/logos/logo77-clinic.svg', appCode: '49247' },
    { slug: 'sayconcrete-plant', logo: '/uploads/logos/logo07-concrete.png', appCode: '49107' },
    { slug: 'sayedu-education', logo: '/uploads/logos/logo02-edu.png', appCode: '49102' }
  ];

  for (const u of updates) {
    const sys = await prisma.system.findUnique({ where: { Slug: u.slug } });
    if (sys) {
      await prisma.system.update({
        where: { IDSystem: sys.IDSystem },
        data: {
          Logo: u.logo,
          AppLogo: u.logo,
          AppCode: u.appCode
        }
      });
      console.log(`[OK] تم تحديث: ${sys.NameAr} -> الشعار: ${u.logo} -> البورت: ${u.appCode}`);
    }
  }
  await prisma.$disconnect();
}

updateLogos().catch(e => {
  console.error(e);
  process.exit(1);
});
