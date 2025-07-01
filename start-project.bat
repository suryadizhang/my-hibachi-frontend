@echo off
echo Starting My Hibachi Chef Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d C:\Users\surya\my-hibachi-backend && python main.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d C:\Users\surya\my-hibachi-frontend && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin
echo.
echo Press any key to exit this window (servers will keep running)
pause > nul
