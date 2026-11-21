@echo off
chcp 65001 > nul
title Saysoft Server
cd /d "%~dp0"
node src/server.js
pause
