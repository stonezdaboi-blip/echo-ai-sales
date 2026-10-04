@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     ECHO Setup - Installing Everything Automatically      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Checking if Node.js is installed...
node --version
if errorlevel 1 (
    echo.
    echo ❌ Node.js is NOT installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found!
echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
echo ✅ Backend installed!
echo.
cd ..
echo Installing mobile dependencies...
cd mobile
call npm install
if errorlevel 1 (
    echo ❌ Mobile installation failed!
    pause
    exit /b 1
)
echo ✅ Mobile installed!
echo.
cd ..
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           ✅ SETUP COMPLETE! READY TO START ECHO          ║
echo ║                                                            ║
echo ║      Now run: START.bat                                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
