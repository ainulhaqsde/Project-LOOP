@echo off
setlocal
cd /d "%~dp0"

echo ======================================
echo       PROJECT LOOP - STARTER
echo ======================================
echo.
echo Make sure MongoDB is running first.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.

start "Project LOOP Backend" cmd /k "cd /d \"%~dp0BackEnd\" && npm install && npm run dev"
start "Project LOOP Frontend" cmd /k "cd /d \"%~dp0FrontEnd\" && npm install && npm run dev"

endlocal
