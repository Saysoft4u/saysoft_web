const { PrismaClient } = require('@prisma/client');

// إنشاء نسخة موحدة من عميل بريزما (Singleton)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

module.exports = prisma;
