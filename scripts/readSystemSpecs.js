const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const systems = await prisma.system.findMany({
    orderBy: { SortOrder: 'asc' }
  });

  for (const s of systems) {
    console.log(`====================================================`);
    console.log(`[ID: ${s.IDSystem}] ${s.BrandNameAr} (${s.BrandNameEn}) - ${s.NameAr}`);
    console.log(`Slug: ${s.Slug} | AppType: ${s.AppType} | Port: ${s.AppCode}`);
    console.log(`CURRENT SummaryAr: ${s.SummaryAr}`);
    console.log(`CURRENT SummaryEn: ${s.SummaryEn}`);
    console.log(`FULL DescriptionAr:\n${s.DescriptionAr}\n`);
    console.log(`FULL DescriptionEn:\n${s.DescriptionEn}\n`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
