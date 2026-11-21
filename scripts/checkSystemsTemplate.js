const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const systems = await prisma.system.findMany({
    where: {
      Slug: {
        in: [
          'saylegal-law-practice',
          'sayguard-security',
          'saymollak-hoa',
          'say-cashier-pos',
          'say-clinic-medical',
          'sayconcrete-plant',
          'sayedu-education'
        ]
      }
    },
    include: {
      Images: true,
      Packages: true,
      FAQs: true,
      Sector: true
    }
  });

  for (const s of systems) {
    console.log(s.Slug, '->', {
      cover: s.CoverImage || 'none',
      imagesCount: s.Images.length,
      packagesCount: s.Packages.length,
      faqsCount: s.FAQs.length,
      hasYoutube: !!s.YoutubeUrl,
      demoUrl: s.DemoUrl,
      appType: s.AppType,
      productStatus: s.ProductStatus,
      isActive: s.IsActive
    });
  }
  await prisma.$disconnect();
}

check().catch(console.error);
