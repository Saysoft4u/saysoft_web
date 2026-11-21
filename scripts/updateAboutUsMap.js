const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAboutUs() {
  console.log('--- تحديث صفحة من نحن بالرابط الرسمي وموقع الخريطة المحدد ---');

  const mapsDirectUrl = "https://www.google.com/maps/place/30%C2%B006'54.6%22N+31%C2%B018'21.3%22E/@30.1151676,31.3084919,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.115163!4d31.305917";
  const mapsEmbedSrcAr = "https://maps.google.com/maps?q=30%C2%B006'54.6%22N+31%C2%B018'21.3%22E&amp;hl=ar&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=&amp;output=embed";
  const mapsEmbedSrcEn = "https://maps.google.com/maps?q=30%C2%B006'54.6%22N+31%C2%B018'21.3%22E&amp;hl=en&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=&amp;output=embed";

  const contentAr = `<h2>ريادة الحلول السحابية وأتمتة الأعمال</h2>
<p>تعد <strong>سايسوفت للحلول الرقمية (Saysoft)</strong> شركة رائدة في تطوير المنظومات البرمجية السحابية (SaaS) والتطبيقات الإدارية المتخصصة. نحرص على تقديم برمجيات مرنة وعالية الكفاءة تلبي أدق تفاصيل العمليات اليومية للشركات والمنشآت في مختلف القطاعات التجارية، الطبية، التعليمية، العقارية، الأمنية، والقانونية.</p>

<h3>رؤيتنا ورسالتنا</h3>
<p>تمكين المؤسسات والأنشطة التجارية في الشرق الأوسط والعالم من التحول الرقمي السلس عبر منظومات سحابية متكاملة وسهلة الاستخدام تغنيهم عن الأنظمة المعقدة وبأفضل عائد استثماري.</p>

<h3>لماذا يختار عملاؤنا سايسوفت؟</h3>
<ul>
  <li>بنية برمجية فائقة السرعة والأمان مصممة لأداء مستمر بدون توقف (99.9% Uptime).</li>
  <li>تكامل كامل مع متطلبات الفاتورة الإلكترونية والأنظمة الرقابية المعتمدة.</li>
  <li>دعم فني استباقي وتحديثات مستمرة تواكب أحدث تقنيات الحوسبة السحابية.</li>
  <li>أمان متقدم وتشفير لكافة قواعد البيانات مع استقلالية تامة للبيانات.</li>
</ul>

<h3>موقعنا ومقرنا الرئيسي على خرائط جوجل</h3>
<p>يسعدنا دائماً الترحيب بشركائنا وعملائنا الكرام في مقرنا الرئيسي، أو تقديم الاستشارات وعروض المنظومات التفاعلية عن بُعد لكافة الشركات في أي مكان بالعالم:</p>

<div class="google-map-card" style="margin: 28px 0; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.07); background: var(--card-bg, #ffffff);">
  <div style="padding: 16px 20px; background: var(--bg-color, #f8fafc); border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <strong style="display: block; font-size: 15px; color: var(--text-main, #0f172a); font-weight: 700;">مقر شركة سايسوفت للحلول الرقمية</strong>
        <span style="font-size: 13px; color: var(--text-muted, #64748b);">القاهرة، مصر (30°06'54.6"N 31°18'21.3"E)</span>
      </div>
    </div>
    <a href="${mapsDirectUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 13px; padding: 7px 16px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; border: 1px solid var(--primary-color); color: var(--primary-color);">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> فتح في تطبيق خرائط جوجل
    </a>
  </div>

  <div style="position: relative; width: 100%; height: 400px; background: #f1f5f9;">
    <iframe 
      title="موقع شركة سايسوفت للحلول الرقمية التفاعلي على خرائط جوجل"
      src="${mapsEmbedSrcAr}" 
      width="100%" 
      height="100%" 
      style="border:0; display:block; width:100%; height:100%;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>

  <div style="padding: 14px 20px; font-size: 13px; color: var(--text-muted, #64748b); background: var(--card-bg, #ffffff); border-top: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <span><i class="fa-regular fa-clock" style="color: var(--primary-color, #0284c7);"></i> <strong>ساعات استقبال العملاء:</strong> الأحد - الخميس (9:00 ص - 5:00 م)</span>
      <span><i class="fa-solid fa-phone" style="color: var(--primary-color, #0284c7);"></i> <strong>الاتصال المباشر:</strong> +20 100 000 0000</span>
    </div>
    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
      <i class="fa-solid fa-map-pin"></i> موقع تفاعلي مباشر
    </span>
  </div>
</div>`;

  const contentEn = `<h2>Pioneering Cloud ERP & SaaS Innovation</h2>
<p><strong>Saysoft Digital Solutions</strong> is a premier software company specialized in developing enterprise cloud platforms (SaaS) and tailor-made business management systems. We empower organizations across commercial, healthcare, legal, security, HOA, and academic industries.</p>

<h3>Our Vision & Mission</h3>
<p>Accelerating seamless digital transformation across the region with reliable, elegant, and ultra-fast cloud architectures that optimize workflow efficiency and maximize return on investment.</p>

<h3>Why Choose Saysoft?</h3>
<ul>
  <li>High-availability, lightning-fast, and secure microservices (99.9% Uptime).</li>
  <li>Full adherence to official regulatory compliance and e-invoicing standards.</li>
  <li>24/7 dedicated engineering support and ongoing cloud updates.</li>
  <li>Enterprise-grade data encryption and absolute customer data ownership.</li>
</ul>

<h3>Our Headquarters & Interactive Location on Google Maps</h3>
<p>We are always delighted to welcome our partners and clients to our headquarters, or provide remote consultations and live interactive system demonstrations worldwide:</p>

<div class="google-map-card" style="margin: 28px 0; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.07); background: var(--card-bg, #ffffff);">
  <div style="padding: 16px 20px; background: var(--bg-color, #f8fafc); border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <strong style="display: block; font-size: 15px; color: var(--text-main, #0f172a); font-weight: 700;">Saysoft Digital Solutions Headquarters</strong>
        <span style="font-size: 13px; color: var(--text-muted, #64748b);">Cairo, Egypt (30°06'54.6"N 31°18'21.3"E)</span>
      </div>
    </div>
    <a href="${mapsDirectUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 13px; padding: 7px 16px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; border: 1px solid var(--primary-color); color: var(--primary-color);">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Google Maps
    </a>
  </div>

  <div style="position: relative; width: 100%; height: 400px; background: #f1f5f9;">
    <iframe 
      title="Saysoft Digital Solutions Interactive Google Map"
      src="${mapsEmbedSrcEn}" 
      width="100%" 
      height="100%" 
      style="border:0; display:block; width:100%; height:100%;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>

  <div style="padding: 14px 20px; font-size: 13px; color: var(--text-muted, #64748b); background: var(--card-bg, #ffffff); border-top: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <span><i class="fa-regular fa-clock" style="color: var(--primary-color, #0284c7);"></i> <strong>Visiting Hours:</strong> Sunday – Thursday (9:00 AM – 5:00 PM)</span>
      <span><i class="fa-solid fa-phone" style="color: var(--primary-color, #0284c7);"></i> <strong>Direct Phone:</strong> +20 100 000 0000</span>
    </div>
    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
      <i class="fa-solid fa-map-pin"></i> Live Interactive Map
    </span>
  </div>
</div>`;

  await prisma.page.update({
    where: { Slug: 'about-us' },
    data: {
      ContentAr: contentAr,
      ContentEn: contentEn,
      UpdatedAt: new Date()
    }
  });

  console.log('✓ تم تحديث صفحة "من نحن" برابط وموقع الخريطة المحدد بنجاح.');
  await prisma.$disconnect();
}

updateAboutUs().catch((err) => {
  console.error('خطأ:', err);
  process.exit(1);
});
