const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allSystems = await prisma.system.findMany({
    include: { Sector: true },
    orderBy: { SortOrder: 'asc' }
  });

  console.log('=== جميع المنظومات في قاعدة البيانات ===');
  allSystems.forEach((s, idx) => {
    console.log(`${idx + 1}. [ID: ${s.IDSystem}] ${s.BrandNameAr} (${s.BrandNameEn}) - ${s.NameAr}`);
    console.log(`   Slug: ${s.Slug} | AppType: ${s.AppType} | Port: ${s.AppCode} | IsFeatured: ${s.IsFeatured} | SortOrder: ${s.SortOrder}`);
    console.log(`   SummaryAr: ${s.SummaryAr}`);
    console.log(`   SummaryEn: ${s.SummaryEn}`);
    console.log(`   DescriptionAr (first 150 chars): ${(s.DescriptionAr || '').substring(0, 150)}...`);
    console.log('--------------------------------------------------');
  });

  await prisma.$disconnect();
}

main().catch(console.error);
