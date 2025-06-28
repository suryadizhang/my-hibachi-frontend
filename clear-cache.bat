@echo off
echo Clearing development cache...

REM Stop any running Node processes
taskkill /f /im node.exe 2>nul

REM Clear Vite cache
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Cleared Vite cache
)

REM Clear dist folder
if exist "dist" (
    rmdir /s /q "dist"
    echo Cleared dist folder
)

REM Clear npm cache (optional)
REM npm cache clean --force

echo Cache cleared! Starting fresh development server...
npm run dev:fresh
