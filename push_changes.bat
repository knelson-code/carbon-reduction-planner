@echo off
REM Navigate to this script's directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Adding files...
git add -A

echo.
echo Committing changes...
git commit -m "Add xlsx library for Excel export functionality"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done! Changes should be deploying to Vercel now.
pause
