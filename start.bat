@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Quick Start - WebBlog Development

echo.
echo ========================================
echo     WebBlog Quick Start
echo ========================================
echo.
echo Starting development environment...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found, installing dependencies...
    call npm install
    echo.
)

REM Check if dist directory exists and clean it
if exist "dist\" (
    echo [INFO] Cleaning dist directory...
    rmdir /s /q dist
)

echo [INFO] Starting development server...
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend:  http://localhost:3001
echo.
echo Opening browser...
echo.

REM Open browser
start http://localhost:5173

REM Start development server
call npm run dev

pause
