@echo off
chcp 65001 >nul
title مستشفى صالح بابكر الخيري — خادم محلي
cd /d "%~dp0"

echo.
echo   تشغيل الموقع محليًا على المنفذ 8000 ...
echo   لا تغلق هذه النافذة أثناء استخدام الموقع.
echo.

start "" http://localhost:8000

where py >nul 2>nul && ( py -m http.server 8000 & goto :eof )
where python >nul 2>nul && ( python -m http.server 8000 & goto :eof )
where npx >nul 2>nul && ( npx --yes serve -l 8000 . & goto :eof )

echo   لم يتم العثور على Python أو Node.
echo   ثبّت Python من https://www.python.org ثم أعد تشغيل هذا الملف.
pause
