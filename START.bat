@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 ECHO - Autonomous AI Sales System 🚀          ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Starting ECHO...
echo.

REM Check if backend is already running
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo Starting Backend...
    start cmd /k "cd backend && npm run dev"
    echo ✅ Backend started (will open in new window)
    echo.
    timeout /t 3 /nobreak
) else (
    echo ⚠️ Backend might already be running on port 3000
    echo.
)

REM Check if mobile is already running
netstat -ano | findstr :19000 >nul
if errorlevel 1 (
    echo Starting Mobile App...
    start cmd /k "cd mobile && npm start"
    echo ✅ Mobile started (will open in new window)
    echo.
) else (
    echo ⚠️ Mobile might already be running
    echo.
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║  📱 INSTRUCTIONS:                                          ║
echo ║                                                            ║
echo ║  1. Wait for two windows to open (Backend & Mobile)       ║
echo ║  2. In the Mobile window, look for QR code                ║
echo ║  3. Download Expo Go from Google Play Store               ║
echo ║  4. Open Expo Go on your Android phone                    ║
echo ║  5. Scan the QR code from the Mobile window               ║
echo ║  6. BOOM! ECHO is running on your phone! 🎉              ║
echo ║                                                            ║
echo ║  Backend: http://localhost:3000                           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Waiting... Keep this window open!
pause
