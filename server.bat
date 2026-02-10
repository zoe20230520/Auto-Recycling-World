@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Backend Server - WebBlog

echo.
echo ========================================
echo     WebBlog Backend Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found, installing dependencies...
    call npm install
    echo.
)

REM Check if uploads directory exists
if not exist "uploads\" (
    echo [INFO] Creating uploads directory...
    mkdir uploads
    echo.
)

echo [INFO] Starting backend server...
echo [INFO] Server will run on: http://localhost:3001
echo [INFO] API endpoint: http://localhost:3001/api
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start backend server
call npm run server

pause
