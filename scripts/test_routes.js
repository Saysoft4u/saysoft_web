const http = require('http');
process.env.NODE_ENV = 'test';
process.env.PORT = '49199';
const app = require('../src/server');

const server = http.createServer(app);

const endpointsToTest = [
  '/',
  '/systems',
  '/services',
  '/contact',
  '/cart',
  '/sitemap.xml',
  '/robots.txt',
  '/admin/login',
  // المنظومات عبر الروابط المباشرة
  '/system/saylegal-law-practice',
  '/system/sayguard-security',
  '/system/saymollak-hoa',
  '/system/say-cashier-pos',
  '/system/say-clinic-medical',
  '/system/sayconcrete-plant',
  '/system/sayedu-education',
  // المنظومات عبر الروابط الموسعة والبديلة (Aliases)
  '/system/sayguard-security-platform',
  '/system/sayedfa-property-management',
  '/system/saycashier-pos-system',
  '/system/sayclinic-medical-center',
  '/system/sayconcrete-batching-plant',
  '/system/sayedu-schools-and-institutes'
];

server.listen(49199, async () => {
  console.log('--- بدء اختبار مسارات منصة سايسوفت ---');
  let failures = 0;

  for (const path of endpointsToTest) {
    await new Promise((resolve) => {
      http.get(`http://localhost:49199${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log(`[PASS] ${res.statusCode} -> ${path} (الحجم: ${data.length} بايت)`);
          } else {
            console.error(`[FAIL] ${res.statusCode} -> ${path}`);
            failures++;
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`[ERROR] ${path}:`, err.message);
        failures++;
        resolve();
      });
    });
  }

  console.log(`\nنتيجة الاختبار: ${endpointsToTest.length - failures} ناجح / ${failures} فاشل`);
  server.close(() => {
    process.exit(failures > 0 ? 1 : 0);
  });
});
