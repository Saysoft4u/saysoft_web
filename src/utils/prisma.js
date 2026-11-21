const { PrismaClient } = require('@prisma/client');
const path = require('path');

// التأكد من توفر رابط قاعدة البيانات تلقائياً في البيئات السحابية أو المحلية
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
}

// إنشاء نسخة موحدة من عميل بريزما (Singleton)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

module.exports = prisma;
