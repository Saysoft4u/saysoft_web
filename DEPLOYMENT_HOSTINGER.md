# 🚀 دليل النشر والتشغيل على خوادم هوستنجر (Hostinger VPS Deployment Guide)

هذا الدليل يوضح بالخطوات العملية الشاملة كيفية نشر وتشغيل منصة **سايسوفت للحلول الرقمية (Saysoft Digital Solutions Platform)** على خوادم هوستنجر الافتراضية الخاصة (Hostinger VPS) العاملة بنظام **Ubuntu 22.04 LTS / 24.04 LTS** مع خادم ويب **Nginx** ومدير العمليات **PM2** وشهادة أمان مجانية **SSL (Let's Encrypt)**.

---

## 📌 الفهرس
1. [المتطلبات الأساسية ومواصفات الخادم](#1-المتطلبات-الأساسية-ومواصفات-الخادم)
2. [تحديث النظام وتثبيت البيئة البرمجية](#2-تحديث-النظام-وتثبيت-البيئة-البرمجية)
3. [نقل ملفات المشروع إلى الخادم](#3-نقل-ملفات-المشروع-إلى-الخادم)
4. [تكوين بيئة الإنتاج وقاعدة البيانات](#4-تكوين-بيئة-الإنتاج-وقاعدة-البيانات)
5. [تشغيل وإدارة المشروع باستخدام PM2](#5-تشغيل-وإدارة-المشروع-باستخدام-pm2)
6. [إعداد خادم الويب العكسي Nginx](#6-إعداد-خادم-الويب-العكسي-nginx)
7. [تفعيل شهادة الأمان SSL (HTTPS)](#7-تفعيل-شهادة-الأمان-ssl-https)
8. [إعداد النسخ الاحتياطي التلقائي للبيانات والملفات](#8-إعداد-النسخ-الاحتياطي-التلقائي)
9. [تأمين الخادم وجدار الحماية UFW](#9-تأمين-الخادم-وجدار-الحماية-ufw)
10. [الصيانة وتحديث الكود البرمجي](#10-الصيانة-وتحديث-الكود-البرمجي)

---

## 1. المتطلبات الأساسية ومواصفات الخادم
- **خادم VPS من Hostinger**: يفضل خطة **KVM 1** أو **KVM 2** (معالج 1 Core أو 2 Cores، ذاكرة رام 4GB إلى 8GB، مساحة قرص NVMe سريعة).
- **نظام التشغيل**: Ubuntu 22.04 LTS أو Ubuntu 24.04 LTS (64-bit).
- **اسم نطاق (Domain Name)**: موجه إلى عنوان IP الخادم (مثال: `saysoft.tech` و `www.saysoft.tech` عبر سجلات A Record في DNS).

---

## 2. تحديث النظام وتثبيت البيئة البرمجية

اتصل بالخادم عبر بروتوكول SSH:
```bash
ssh root@YOUR_SERVER_IP
```

### أ) تحديث حزم النظام:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip build-essential ufw software-properties-common
```

### ب) تثبيت Node.js (الإصدار 20+ LTS أو 22 LTS):
```bash
# إضافة مستودع NodeSource الرسمي لـ Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# تثبيت Node.js مع npm
sudo apt install -y nodejs

# التحقق من الإصدار
node -v   # يجب أن يظهر v20.x أو أحدث
npm -v
```

### ج) تثبيت مدير العمليات PM2 عالمياً:
```bash
sudo npm install -g pm2
```

---

## 3. نقل ملفات المشروع إلى الخادم

يفضل وضع المشروع في المسار المعتمد للمواقع: `/var/www/saysoft_web`.

### الخيار الأول: عبر Git (موصى به)
```bash
sudo mkdir -p /var/www/saysoft_web
sudo chown -R $USER:$USER /var/www/saysoft_web
git clone https://github.com/your-username/saysoft_web.git /var/www/saysoft_web
cd /var/www/saysoft_web
```

### الخيار الثاني: نقل الملفات مباشرة من جهاز التطوير المحلي (PowerShell)
```powershell
# من مجلد C:\aassoft\saysoft_web على جهازك المحلي:
scp -r * root@YOUR_SERVER_IP:/var/www/saysoft_web/
```

---

## 4. تكوين بيئة الإنتاج وقاعدة البيانات

انتقل إلى مجلد المشروع على الخادم:
```bash
cd /var/www/saysoft_web
```

### أ) تثبيت التبعيات (Dependencies):
```bash
npm install --omit=dev
```

### ب) إنشاء ملف المتغيرات البيئية للإنتاج (`.env`):
قم بإنشاء ملف `.env` وضبط الإعدادات التالية:
```bash
nano .env
```

محتوى الملف المقترح للإنتاج:
```env
PORT=49141
NODE_ENV=production
APP_NAME="منصة سايسوفت للحلول الرقمية"
APP_URL=https://saysoft.tech

# قاعدة البيانات (SQLite سريعة ومستقلة)
DATABASE_URL="file:./prisma/prod.db"

# مفتاح تشفير الجلسات (استخدم نصاً عشوائياً قوياً وطويلاً)
SESSION_SECRET="saysoft_super_secret_production_key_987654321_secure"

# كلمة المرور الرئيسية للطوارئ (Master Password)
ADMIN_MASTER_PASSWORD="SaysoftMaster2026#Prod"

# بيانات المدير الافتراضية
DEFAULT_ADMIN_EMAIL="admin@saysoft.tech"
DEFAULT_ADMIN_PASSWORD="Admin@Saysoft2026!Prod"

# رقم واتساب المعتمد لتلقي الطلبات
WHATSAPP_NUMBER="966500000000"
```
احفظ الملف واخرج بالضغط على `Ctrl + O` ثم `Enter` ثم `Ctrl + X`.

### ج) توليد وتغذية قاعدة البيانات (Prisma):
```bash
# توليد ملفات Prisma Client
npx prisma generate

# دفع هيكل الجداول إلى قاعدة البيانات
npx prisma db push

# تغذية قاعدة البيانات المبدئية بالمنظومات السبع والباقات
node prisma/seed.js
node scripts/seedEdu.js
```

---

## 5. تشغيل وإدارة المشروع باستخدام PM2

يقوم **PM2** بإبقاء التطبيق قيد التشغيل في الخلفية باستمرار وإعادة تشغيله تلقائياً في حال حدوث أي خطأ أو عند إعادة تشغيل الخادم (Server Reboot).

### أ) تشغيل التطبيق:
```bash
pm2 start src/server.js --name "saysoft-app"
```

### ب) ضبط التشغيل التلقائي عند إقلاع الخادم:
```bash
pm2 startup
# سيظهر أمر في الشاشة يبدأ بـ sudo env PATH=... قم بنسخه وتنفيذه مباشرة
pm2 save
```

### ج) أوامر التحكم السريعة بـ PM2:
- عرض حالة التطبيق: `pm2 status`
- عرض سجلات التطبيق اللحظية (Logs): `pm2 logs saysoft-app`
- إعادة تشغيل التطبيق: `pm2 restart saysoft-app`
- إيقاف التطبيق: `pm2 stop saysoft-app`

---

## 6. إعداد خادم الويب العكسي Nginx

يعمل Nginx كبوابة أمامية سريعة تقوم بتمرير طلبات الويب الخارجية الآمنة (HTTPS:443) إلى خادم Node.js الداخلي (Port: 49141)، بالإضافة إلى إدارة التخزين المؤقت وحماية الرؤوس وتطبيق ضغط Gzip لتسريع التصفح.

### أ) تثبيت Nginx:
```bash
sudo apt install -y nginx
```

### ب) إنشاء ملف تكوين الموقع:
```bash
sudo nano /etc/nginx/sites-available/saysoft
```

أضف التكوين التالي مع استبدال `saysoft.tech` بنطاقك الفعلي:
```nginx
# تكوين خادم سايسوفت
server {
    listen 80;
    listen [::]:80;
    server_name saysoft.tech www.saysoft.tech;

    # أقصى حجم لرفع الصور والمرفقات
    client_max_body_size 50M;

    # ضغط البيانات لتسريع التحميل
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json image/svg+xml;

    # خدمة الملفات الثابتة مباشرة عبر Nginx لتحقيق أقصى سرعة
    location /public/ {
        alias /var/www/saysoft_web/public/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /uploads/ {
        alias /var/www/saysoft_web/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # تمرير جميع الطلبات الأخرى لتطبيق Node.js
    location / {
        proxy_pass http://127.0.0.1:49141;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }
}
```

### ج) تفعيل الموقع وفحص التكوين:
```bash
# تفعيل الموقع بربطه في sites-enabled
sudo ln -s /etc/nginx/sites-available/saysoft /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي لتجنب التعارض
sudo rm -f /etc/nginx/sites-enabled/default

# فحص سلامة تكوين Nginx
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

---

## 7. تفعيل شهادة الأمان SSL (HTTPS)

نستخدم أداة **Certbot** الرسمية من Let's Encrypt للحصول على شهادة SSL مجانية تتجدد تلقائياً مدى الحياة.

### أ) تثبيت Certbot وإضافة Nginx:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### ب) استخراج الشهادة وتطبيقها تلقائياً على Nginx:
```bash
sudo certbot --nginx -d saysoft.tech -d www.saysoft.tech
```
- أدخل بريدك الإلكتروني لتلقي إشعارات التجديد.
- وافق على شروط الخدمة.
- اختر خيار تحويل جميع الطلبات تلقائياً إلى HTTPS (Redirect).

### ج) اختبار التجديد التلقائي للشهادة:
```bash
sudo certbot renew --dry-run
```

---

## 8. إعداد النسخ الاحتياطي التلقائي

لحماية بيانات العملاء والمنظومات والطلبات والمرفقات، نقوم بإعداد مهمة دورية مجدولة (Cron Job) تقوم بأخذ نسخة احتياطية يومية مضغوطة لقاعدة البيانات ومجلد المرفقات.

### أ) إنشاء سكربت النسخ الاحتياطي:
```bash
sudo nano /usr/local/bin/backup_saysoft.sh
```

أضف الأوامر التالية:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/saysoft"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
APP_DIR="/var/www/saysoft_web"

# إنشاء مجلد النسخ الاحتياطية إن لم يكن موجوداً
mkdir -p $BACKUP_DIR

# ضغط قاعدة البيانات ومجلد المرفقات
tar -czf "$BACKUP_DIR/saysoft_backup_$DATE.tar.gz" -C $APP_DIR prisma/prod.db public/uploads .env

# حذف النسخ الاحتياطية الأقدم من 30 يوماً لتوفير المساحة
find $BACKUP_DIR -type f -name "saysoft_backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed successfully at $DATE"
```

### ب) منح صلاحيات التنفيذ:
```bash
sudo chmod +x /usr/local/bin/backup_saysoft.sh
```

### ج) جدولة المهمة يومياً في تمام الساعة 3:00 فجراً عبر Crontab:
```bash
sudo crontab -e
```
أضف السطر التالي في نهاية الملف:
```cron
0 3 * * * /usr/local/bin/backup_saysoft.sh > /var/log/saysoft_backup.log 2>&1
```

---

## 9. تأمين الخادم وجدار الحماية UFW

لحماية الخادم من محاولات الاختراق، نقوم بإغلاق كافة المنافذ باستثناء المنافذ الضرورية فقط:

```bash
# السماح ببروتوكول SSH للدخول الآمن
sudo ufw allow OpenSSH

# السماح بترافيك الويب الآمن والعادي
sudo ufw allow 'Nginx Full'

# تفعيل جدار الحماية
sudo ufw enable

# التحقق من حالة المنافذ
sudo ufw status verbose
```

---

## 10. الصيانة وتحديث الكود البرمجي

عند إجراء أي تعديلات أو إضافة منظومات جديدة من جهاز التطوير المحلي ونقلها للخادم:

```bash
cd /var/www/saysoft_web

# 1. سحب التعديلات الحديثة (إذا كنت تستخدم Git)
git pull origin main

# 2. تحديث التبعيات إن وجدت حزم جديدة
npm install --omit=dev

# 3. تحديث مخطط قاعدة البيانات إن طرأ أي تغيير
npx prisma generate
npx prisma db push

# 4. إعادة تشغيل التطبيق بسلاسة تامة دون انقطاع الخدمة (Zero-Downtime Reload)
pm2 reload saysoft-app
```

---
🎯 **النتيجة:** المنصة الآن تعمل على خادم إنتاج حقيقي بكامل طاقتها، مع شهادة أمان SSL، ونظام نسخ احتياطي يومي، وحماية كاملة، وأداء فائق السرعة!
