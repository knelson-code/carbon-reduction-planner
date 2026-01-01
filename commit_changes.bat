@echo off
echo Waiting for git lock to clear...
timeout /t 3 /nobreak >nul
if exist ".git\index.lock" del /F /Q ".git\index.lock" 2>nul
timeout /t 1 /nobreak >nul
git add -A
git commit -m "Add landing page for unauthenticated users on climate risk subdomain"
git push
pause
