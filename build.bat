@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Production Build - WebBlog

echo.
echo ========================================
echo     WebBlog Production Build
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found, installing dependencies...
    call npm install
    echo.
)

echo [INFO] Building frontend for production...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo     Build Successful!
    echo ========================================
    echo.
    echo Output directory: dist/
    echo.
    echo To preview the build:
    echo   npm run preview
    echo.
) else (
    echo.
    echo ========================================
    echo     Build Failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
