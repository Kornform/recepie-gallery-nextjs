@echo off
REM Quick helper script to push changes to GitHub for this project
REM Repository: https://github.com/Kornform/recepie-gallery-nextjs

REM Change to this repo's directory (adjust the path if you move the project)
cd /d "D:\MAX\07_projects_dev_a\recepie-gallery-nextjs"

echo.
echo ===========================================
echo   Recipe Gallery - GitHub Quick Push
echo ===========================================
echo.

REM Show current status so you can see what will be committed
git status
echo.

REM Ask for a descriptive commit message
set /p COMMIT_MSG=Enter descriptive commit message: 

IF "%COMMIT_MSG%"=="" (
    echo.
    echo A descriptive commit message is required. Aborting.
    echo.
    pause
    exit /b 1
)

echo.
echo Staging all changes...
git add .

echo.
echo Committing changes...
git commit -m "%COMMIT_MSG%"
IF ERRORLEVEL 1 (
    echo.
    echo Commit failed (maybe there was nothing to commit). See message above.
    echo.
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub (origin main)...
git push origin main
IF ERRORLEVEL 1 (
    echo.
    echo Push failed. Check the error message above.
    echo.
    pause
    exit /b 1
)

echo.
echo ===========================================
echo   Done! Changes pushed to GitHub (main)
echo ===========================================
echo.
pause


