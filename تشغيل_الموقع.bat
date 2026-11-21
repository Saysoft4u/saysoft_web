@echo off
chcp 65001 > nul
title منصة سايسوفت للحلول الرقمية - Saysoft Server
echo ====================================================
echo   جاري تشغيل خادم منصة سايسوفت للحلول الرقمية...
echo   الرابط: http://localhost:49141
echo   لوحة التحكم: http://localhost:49141/admin/login
echo ====================================================
cd /d "%~dp0"
node src/server.js
pause
