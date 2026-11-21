const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- تحديث روابط الديمو والتجربة لجميع البرامج لتشير لصفحة قريباً وقيد التصميم ---');

  const systems = await prisma.system.findMany();
  for (const s of systems) {
    const internalDemoUrl = `/coming-soon?system=${s.Slug}`;
    await prisma.system.update({
      where: { IDSystem: s.IDSystem },
      data: { DemoUrl: internalDemoUrl }
    });
    console.log(`✓ [${s.BrandNameAr || s.NameAr}] DemoUrl تم تحديثه إلى: ${internalDemoUrl}`);
  }

  console.log('--- تم التحديث بنجاح تام ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
