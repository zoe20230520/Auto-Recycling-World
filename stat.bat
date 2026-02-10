@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title 项目统计工具

echo.
echo ========================================
echo     项目代码统计工具
echo ========================================
echo.

set "totalFiles=0"
set "totalLines=0"
set "totalSize=0"

echo [扩展名]  [文件数]  [代码行数]  [文件大小]
echo ------------------------------------------------

REM 统计常见代码文件
for %%ext in (ts tsx js jsx css scss html json) do (
    set "count=0"
    set "lines=0"
    set "size=0"
    
    for /r %%f in (*.%%ext) do (
        set /a count+=1
        for /f %%l in ('type "%%f" ^| find /c /v ""') do set /a lines+=%%l
        for %%s in ("%%f") do set /a size+=%%~zs
    )
    
    if !count! gtr 0 (
        set /a totalFiles+=count
        set /a totalLines+=lines
        set /a totalSize+=size
        
        set /a sizeKB=size/1024
        echo   .%%ext      !count!      !lines!       !sizeKB! KB
    )
)

echo ------------------------------------------------
echo   总计       %totalFiles%      %totalLines%       %totalSize% 字节
echo.
echo 项目目录: %~dp0
echo.
pause
